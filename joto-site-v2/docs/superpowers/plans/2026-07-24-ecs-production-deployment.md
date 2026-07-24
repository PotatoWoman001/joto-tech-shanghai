# JOTO Global ECS Production Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the trilingual JOTO Global website and an isolated, working contact-form service to the existing Alibaba Cloud Shanghai ECS without disrupting any existing virtual host.

**Architecture:** Nginx serves versioned Vite output through an atomic `current` symlink and proxies only `/api/contact` to a localhost-only Node.js service. The service keeps the existing Alibaba DirectMail transport and adds a Resend transport for this ECS, with credentials copied server-side into a root-only environment file.

**Tech Stack:** React 18, Vite 5, Node.js 20+, native `node:http`, Resend HTTP API, Nginx 1.24, systemd, Certbot, Ubuntu 24.04.

## Global Constraints

- Do not modify or restart existing application processes on ports 3001–3010, 8000, or 6081.
- Do not overwrite existing Nginx virtual hosts or certificates.
- The new contact service listens only on `127.0.0.1:9000`.
- Secrets never appear in terminal output, Git, frontend bundles, or deployment archives.
- `jotoglobal.com` is the canonical production host; `www.jotoglobal.com` redirects to it after HTTPS is available.
- Frontend releases live under `/var/www/jotoglobal/releases/` and switch atomically through `/var/www/jotoglobal/current`.
- The contact service runs as a dedicated unprivileged `jotoglobal` system user.
- Nginx configuration must pass `nginx -t` before every reload.
- DNS and certificate actions occur only after the pre-DNS Host-header acceptance suite passes.

---

## File Structure

Create or modify the following focused files:

- `functions/contact/mailer.mjs`: provider selection plus Alibaba DirectMail and Resend transports.
- `functions/contact/server.mjs`: uses provider-agnostic configuration and delivery functions.
- `functions/contact/contact.test.mjs`: provider-selection and Resend request-contract tests.
- `functions/contact/README.md`: documents both Function Compute and ECS/Resend runtime variables.
- `deploy/aliyun/prepare-contact-env.mjs`: copies existing server-side Resend settings into a protected environment file without printing values.
- `deploy/aliyun/jotoglobal-contact.service`: hardened systemd unit for the localhost service.
- `deploy/aliyun/jotoglobal-rate-limit.conf`: Nginx shared-memory rate-limit zone.
- `deploy/aliyun/jotoglobal-security-headers.conf`: reusable security headers.
- `deploy/aliyun/jotoglobal-locations.conf`: shared static-site, SPA, cache, and API locations.
- `deploy/aliyun/jotoglobal.nginx.conf`: HTTP-stage virtual host.
- `deploy/aliyun/jotoglobal-https.nginx.conf`: final HTTPS and canonical redirect virtual hosts.
- `docs/superpowers/plans/2026-07-24-ecs-production-deployment.md`: this implementation plan.

### Task 1: Add the Resend mail transport

**Files:**

- Modify: `functions/contact/mailer.mjs`
- Modify: `functions/contact/server.mjs`
- Test: `functions/contact/contact.test.mjs`

**Interfaces:**

- Produces: `mailProvider(env): "resend" | "aliyun" | null`
- Produces: `sendViaResend(fields, env, fetchImpl): Promise<object>`
- Produces: `sendContactEmail(fields, env, dependencies): Promise<unknown>`
- Consumes: `buildMail(fields)` from `functions/contact/contact.mjs`

- [ ] **Step 1: Add failing provider-selection and Resend request tests**

Append these imports and tests to `functions/contact/contact.test.mjs`:

```js
import {
  createMailClient,
  mailProvider,
  sendContactEmail,
  sendViaResend,
} from "./mailer.mjs";
```

Replace the existing single `createMailClient` import with the block above, then add:

```js
const resendEnv = {
  RESEND_API_KEY: "re_test_key",
  RESEND_FROM_ADDRESS: "JOTO Website <website@mail.example.com>",
  RESEND_TO_ADDRESS: "sales@example.com",
};

test("selects Resend before Alibaba Direct Mail when Resend is fully configured", () => {
  assert.equal(mailProvider({ ...configuredEnv, ...resendEnv }), "resend");
  assert.equal(mailProvider(configuredEnv), "aliyun");
  assert.equal(mailProvider({}), null);
});

test("sends the normalized contact email through the Resend HTTP API", async () => {
  const calls = [];
  const result = await sendViaResend(
    validPayload,
    resendEnv,
    async (url, init) => {
      calls.push({ url, init });
      return {
        ok: true,
        status: 200,
        async json() {
          return { id: "email_123" };
        },
      };
    },
  );

  assert.deepEqual(result, { id: "email_123" });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  assert.equal(calls[0].init.headers.Authorization, "Bearer re_test_key");
  const body = JSON.parse(calls[0].init.body);
  assert.equal(body.from, resendEnv.RESEND_FROM_ADDRESS);
  assert.deepEqual(body.to, [resendEnv.RESEND_TO_ADDRESS]);
  assert.equal(body.reply_to, validPayload.email);
  assert.match(body.subject, /Example Global/);
  assert.match(body.text, /multi-region network rollout/);
});

test("uses the configured provider without exposing its credentials", async () => {
  const deliveries = [];
  await sendContactEmail(validPayload, resendEnv, {
    resend: async (fields, env) => deliveries.push({ fields, provider: mailProvider(env) }),
  });
  assert.equal(deliveries.length, 1);
  assert.equal(deliveries[0].provider, "resend");
});
```

- [ ] **Step 2: Run the contact tests and verify the new tests fail**

Run:

```bash
cd functions/contact
npm test
```

Expected: FAIL because `mailProvider`, `sendContactEmail`, and
`sendViaResend` are not exported.

- [ ] **Step 3: Implement provider selection and Resend delivery**

Replace `functions/contact/mailer.mjs` with:

```js
import DmPackage, * as DmModels from "@alicloud/dm20151123";
import * as OpenApiModels from "@alicloud/openapi-client";
import { buildMail } from "./contact.mjs";

function required(name, env) {
  const value = env[name];
  if (!value) throw new Error(`Missing required mail configuration: ${name}`);
  return value;
}

function hasAll(env, names) {
  return names.every((name) => Boolean(env[name]));
}

export function mailProvider(env = process.env) {
  if (
    hasAll(env, [
      "RESEND_API_KEY",
      "RESEND_FROM_ADDRESS",
      "RESEND_TO_ADDRESS",
    ])
  ) {
    return "resend";
  }

  if (
    hasAll(env, [
      "ALIBABA_CLOUD_ACCESS_KEY_ID",
      "ALIBABA_CLOUD_ACCESS_KEY_SECRET",
      "ALIYUN_DM_ACCOUNT_NAME",
      "ALIYUN_DM_TO_ADDRESS",
    ])
  ) {
    return "aliyun";
  }

  return null;
}

export function createMailClient(env = process.env) {
  const config = new OpenApiModels.Config({
    accessKeyId: required("ALIBABA_CLOUD_ACCESS_KEY_ID", env),
    accessKeySecret: required("ALIBABA_CLOUD_ACCESS_KEY_SECRET", env),
  });
  config.endpoint = env.ALIYUN_DM_ENDPOINT || "dm.aliyuncs.com";
  const DmClient = DmPackage.default || DmPackage;
  return new DmClient(config);
}

export async function sendViaAliyun(fields, env = process.env) {
  const client = createMailClient(env);
  const mail = buildMail(fields);
  const request = new DmModels.SingleSendMailRequest({
    accountName: required("ALIYUN_DM_ACCOUNT_NAME", env),
    addressType: 1,
    replyToAddress: false,
    toAddress: required("ALIYUN_DM_TO_ADDRESS", env),
    subject: mail.subject,
    textBody: mail.textBody,
    fromAlias: env.ALIYUN_DM_FROM_ALIAS || "JOTO Website",
    clickTrace: "0",
  });

  return client.singleSendMail(request);
}

export async function sendViaResend(
  fields,
  env = process.env,
  fetchImpl = globalThis.fetch,
) {
  if (typeof fetchImpl !== "function") {
    throw new Error("Fetch API is unavailable");
  }

  const mail = buildMail(fields);
  const response = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${required("RESEND_API_KEY", env)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: required("RESEND_FROM_ADDRESS", env),
      to: [required("RESEND_TO_ADDRESS", env)],
      reply_to: fields.email,
      subject: mail.subject,
      text: mail.textBody,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend delivery failed with status ${response.status}`);
  }

  return response.json();
}

export async function sendContactEmail(
  fields,
  env = process.env,
  dependencies = {},
) {
  const provider = mailProvider(env);
  if (provider === "resend") {
    return (dependencies.resend || sendViaResend)(fields, env);
  }
  if (provider === "aliyun") {
    return (dependencies.aliyun || sendViaAliyun)(fields, env);
  }
  throw new Error("Mail service is not configured");
}
```

In `functions/contact/server.mjs`, replace the import and configuration check:

```js
import { mailProvider, sendContactEmail } from "./mailer.mjs";
```

Delete the local `isConfigured()` function, change the handler default to:

```js
export function createRequestHandler({
  sendMail = sendContactEmail,
  env = process.env,
} = {}) {
```

Change:

```js
if (!isConfigured(env)) {
```

to:

```js
if (!mailProvider(env)) {
```

In `startServer()`, replace the fixed listen address with an environment-aware
address that preserves the Function Compute default:

```js
export function startServer(options = {}) {
  const port = Number(process.env.PORT || 9000);
  const host = process.env.HOST || "0.0.0.0";
  const server = http.createServer(createRequestHandler(options));
  server.listen(port, host, () => {
    console.log(`JOTO contact function listening on ${host}:${port}`);
  });
  return server;
}
```

- [ ] **Step 4: Run the contact tests**

Run:

```bash
cd functions/contact
npm test
```

Expected: 10 tests pass with zero failures.

- [ ] **Step 5: Commit the mail transport**

```bash
git add functions/contact/mailer.mjs functions/contact/server.mjs functions/contact/contact.test.mjs
git commit -m "feat: add isolated Resend contact delivery"
```

### Task 2: Document the ECS mail configuration

**Files:**

- Modify: `functions/contact/README.md`

**Interfaces:**

- Consumes: environment names defined by Task 1.
- Produces: operator documentation for both Function Compute and ECS.

- [ ] **Step 1: Add the ECS runtime section**

Append this section to `functions/contact/README.md`:

```markdown
## ECS + Resend 配置

在 ECS 上，服务通过 Nginx 反向代理并仅监听
`127.0.0.1:9000`。配置以下环境变量时，服务优先使用 Resend：

- `RESEND_API_KEY`
- `RESEND_FROM_ADDRESS`
- `RESEND_TO_ADDRESS`
- `ALLOWED_ORIGINS=https://jotoglobal.com,https://www.jotoglobal.com`
- `PORT=9000`
- `HOST=127.0.0.1`

Resend 和阿里云邮件推送均未完整配置时，接口返回 `503`。不要把上述
变量写入前端、Git 或公开目录。
```

- [ ] **Step 2: Verify the environment names match the implementation**

Run:

```bash
rg -n "RESEND_(API_KEY|FROM_ADDRESS|TO_ADDRESS)|ALLOWED_ORIGINS|PORT|HOST" \
  functions/contact/mailer.mjs \
  functions/contact/server.mjs \
  functions/contact/README.md
```

Expected: the same five names appear in code and documentation.

- [ ] **Step 3: Commit the documentation**

```bash
git add functions/contact/README.md
git commit -m "docs: describe ECS contact runtime"
```

### Task 3: Add versioned ECS deployment configuration

**Files:**

- Create: `deploy/aliyun/prepare-contact-env.mjs`
- Create: `deploy/aliyun/jotoglobal-contact.service`
- Create: `deploy/aliyun/jotoglobal-rate-limit.conf`
- Create: `deploy/aliyun/jotoglobal-security-headers.conf`
- Create: `deploy/aliyun/jotoglobal-locations.conf`
- Create: `deploy/aliyun/jotoglobal.nginx.conf`
- Create: `deploy/aliyun/jotoglobal-https.nginx.conf`

**Interfaces:**

- Consumes: Resend environment variables from Task 1.
- Produces: `/etc/jotoglobal-contact.env`, the `jotoglobal-contact` systemd unit, and an isolated Nginx virtual host.

- [ ] **Step 1: Create the secret-copy helper**

Create `deploy/aliyun/prepare-contact-env.mjs`:

```js
import fs from "node:fs";

const sourcePath = "/var/www/audit/backend/data/config.json";
const outputPath = "/etc/jotoglobal-contact.env";
const config = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const email = config.emailConfig || {};

function required(name, value) {
  if (!value) throw new Error(`Existing server mail configuration lacks ${name}`);
  return String(value);
}

function quote(value) {
  return `"${String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("\n", "\\n")}"`;
}

const values = {
  PORT: "9000",
  HOST: "127.0.0.1",
  RESEND_API_KEY: required("emailConfig.resendApiKey", email.resendApiKey),
  RESEND_FROM_ADDRESS: required("emailConfig.from", email.from),
  RESEND_TO_ADDRESS: required(
    "email or emailConfig.adminEmail",
    config.email || email.adminEmail,
  ),
  ALLOWED_ORIGINS:
    "https://jotoglobal.com,https://www.jotoglobal.com",
};

const body = `${Object.entries(values)
  .map(([name, value]) => `${name}=${quote(value)}`)
  .join("\n")}\n`;

fs.writeFileSync(outputPath, body, { mode: 0o600 });
fs.chmodSync(outputPath, 0o600);
console.log(`Created protected environment file: ${outputPath}`);
```

- [ ] **Step 2: Create the hardened systemd unit**

Create `deploy/aliyun/jotoglobal-contact.service`:

```ini
[Unit]
Description=JOTO Global contact form service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=jotoglobal
Group=jotoglobal
WorkingDirectory=/opt/jotoglobal-contact/current
EnvironmentFile=/etc/jotoglobal-contact.env
ExecStart=/usr/bin/node /opt/jotoglobal-contact/current/server.mjs
Restart=on-failure
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true
PrivateDevices=true
ProtectSystem=strict
ProtectHome=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6
LockPersonality=true

[Install]
WantedBy=multi-user.target
```

- [ ] **Step 3: Create Nginx rate limiting and security headers**

Create `deploy/aliyun/jotoglobal-rate-limit.conf`:

```nginx
limit_req_zone $binary_remote_addr zone=jotoglobal_contact:10m rate=5r/m;
```

Create `deploy/aliyun/jotoglobal-security-headers.conf`:

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

- [ ] **Step 4: Create the shared application locations**

Create `deploy/aliyun/jotoglobal-locations.conf`:

```nginx
location = /api/contact {
    limit_req zone=jotoglobal_contact burst=5 nodelay;
    proxy_pass http://127.0.0.1:9000/api/contact;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Request-Id $request_id;
    proxy_connect_timeout 3s;
    proxy_read_timeout 15s;
    proxy_send_timeout 15s;
    proxy_buffering off;
}

location = /healthz {
    allow 127.0.0.1;
    allow ::1;
    deny all;
    proxy_pass http://127.0.0.1:9000/healthz;
    proxy_set_header X-Request-Id $request_id;
}

location /assets/ {
    try_files $uri =404;
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable" always;
    include /etc/nginx/snippets/jotoglobal-security-headers.conf;
    access_log off;
}

location = /index.html {
    try_files $uri =404;
    add_header Cache-Control "no-cache, no-store, must-revalidate" always;
    include /etc/nginx/snippets/jotoglobal-security-headers.conf;
}

location = /robots.txt {
    try_files $uri =404;
    add_header Cache-Control "public, max-age=300" always;
    include /etc/nginx/snippets/jotoglobal-security-headers.conf;
}

location = /sitemap.xml {
    try_files $uri =404;
    add_header Cache-Control "public, max-age=300" always;
    include /etc/nginx/snippets/jotoglobal-security-headers.conf;
}

location / {
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "no-cache" always;
    include /etc/nginx/snippets/jotoglobal-security-headers.conf;
}
```

- [ ] **Step 5: Create the HTTP-stage virtual host**

Create `deploy/aliyun/jotoglobal.nginx.conf`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name jotoglobal.com www.jotoglobal.com;

    root /var/www/jotoglobal/current;
    index index.html;
    client_max_body_size 16k;
    access_log /var/log/nginx/jotoglobal.access.log;
    error_log /var/log/nginx/jotoglobal.error.log;

    include /etc/nginx/snippets/jotoglobal-security-headers.conf;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
        default_type "text/plain";
    }

    include /etc/nginx/snippets/jotoglobal-locations.conf;
}
```

- [ ] **Step 6: Create the final HTTPS virtual hosts**

Create `deploy/aliyun/jotoglobal-https.nginx.conf`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name jotoglobal.com www.jotoglobal.com;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
        default_type "text/plain";
    }

    location / {
        return 301 https://jotoglobal.com$request_uri;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name jotoglobal.com;

    ssl_certificate /etc/letsencrypt/live/jotoglobal.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jotoglobal.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/jotoglobal/current;
    index index.html;
    client_max_body_size 16k;
    access_log /var/log/nginx/jotoglobal.access.log;
    error_log /var/log/nginx/jotoglobal.error.log;

    include /etc/nginx/snippets/jotoglobal-security-headers.conf;
    include /etc/nginx/snippets/jotoglobal-locations.conf;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name www.jotoglobal.com;

    ssl_certificate /etc/letsencrypt/live/jotoglobal.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jotoglobal.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://jotoglobal.com$request_uri;
}
```

- [ ] **Step 7: Validate file contents locally**

Run:

```bash
node --check deploy/aliyun/prepare-contact-env.mjs
rg -n "jotoglobal|127\\.0\\.0\\.1:9000|current|limit_req" deploy/aliyun
```

Expected: Node syntax check succeeds and every Nginx/systemd target is scoped to the new site.

- [ ] **Step 8: Commit deployment configuration**

```bash
git add deploy/aliyun
git commit -m "ops: add isolated ECS deployment config"
```

### Task 4: Run the final local release gate

**Files:**

- Verify: `dist/`
- Verify: `functions/contact/`

**Interfaces:**

- Consumes: all code from Tasks 1–3.
- Produces: a verified `dist/` directory and contact-service application tree.

- [ ] **Step 1: Install clean dependencies and run all frontend checks**

Run:

```bash
npm ci
npm test -- --run
npm run test:seo-files
npm run build
```

Expected: 34 frontend test files and 177 tests pass, two SEO file tests pass,
and Vite writes `dist/`.

- [ ] **Step 2: Run contact tests from a clean install**

Run:

```bash
cd functions/contact
npm ci
npm test
```

Expected: 10 tests pass.

- [ ] **Step 3: Verify production artifacts and secrets boundary**

Run:

```bash
test -f dist/index.html
test -f dist/robots.txt
test -f dist/sitemap.xml
test "$(find dist -type f | wc -l | tr -d ' ')" -gt 0
rg -n "https://jotoglobal.com" dist/robots.txt dist/sitemap.xml
if rg -n "RESEND_API_KEY|re_[A-Za-z0-9]{12,}|ALIBABA_CLOUD_ACCESS_KEY_SECRET" dist; then
  exit 1
fi
```

Expected: artifact checks succeed and the secret scan prints no matches.

### Task 5: Stage the release on the ECS

**Files:**

- Create remotely: `/var/www/jotoglobal/releases/$RELEASE_ID/`
- Create remotely: `/opt/jotoglobal-contact/releases/$RELEASE_ID/`
- Create remotely: `/etc/jotoglobal-contact.env`
- Create remotely: `/etc/systemd/system/jotoglobal-contact.service`

**Interfaces:**

- Consumes: local `dist/`, `functions/contact/`, and `deploy/aliyun/`.
- Produces: a healthy localhost contact service and staged static release.

- [ ] **Step 1: Generate one immutable release ID**

Run locally from `joto-site-v2`:

```bash
RELEASE_ID="$(date -u +%Y%m%dT%H%M%SZ)-$(git rev-parse --short HEAD)"
printf '%s\n' "$RELEASE_ID" > /tmp/jotoglobal-release-id
cat /tmp/jotoglobal-release-id
```

Expected: one value shaped like `20260724T140000Z-abcdef0`.

- [ ] **Step 2: Create isolated remote directories and service user**

Run over the existing SSH session:

```bash
id -u jotoglobal >/dev/null 2>&1 || useradd \
  --system \
  --home /nonexistent \
  --shell /usr/sbin/nologin \
  jotoglobal
install -d -o root -g root -m 0755 /var/www/jotoglobal/releases
install -d -o root -g root -m 0755 /opt/jotoglobal-contact/releases
install -d -o root -g root -m 0755 /etc/nginx/snippets
install -d -o root -g root -m 0755 /root/backups/jotoglobal
```

Expected: existing sites and directories remain untouched.

- [ ] **Step 3: Upload and validate the release identity**

Run locally:

```bash
scp /tmp/jotoglobal-release-id \
  root@139.224.51.172:/root/backups/jotoglobal/release-id
```

Run remotely:

```bash
RELEASE_ID="$(cat /root/backups/jotoglobal/release-id)"
[[ "$RELEASE_ID" =~ ^[0-9]{8}T[0-9]{6}Z-[0-9a-f]{7,40}$ ]]
printf '%s\n' "$RELEASE_ID"
```

Expected: the validation command succeeds and prints the same immutable ID.

- [ ] **Step 4: Create release-specific directories and record rollback state**

Run remotely:

```bash
RELEASE_ID="$(cat /root/backups/jotoglobal/release-id)"
install -d -o root -g root -m 0755 \
  "/var/www/jotoglobal/releases/$RELEASE_ID"
install -d -o root -g root -m 0755 \
  "/opt/jotoglobal-contact/releases/$RELEASE_ID"
readlink -f /var/www/jotoglobal/current \
  > /root/backups/jotoglobal/previous-frontend 2>/dev/null || true
readlink -f /opt/jotoglobal-contact/current \
  > /root/backups/jotoglobal/previous-contact 2>/dev/null || true
```

Expected: both release directories are empty and any existing link targets are
recorded without changing the links.

- [ ] **Step 5: Upload into release-specific staging directories**

Use `scp` over the approved SSH target without placing the password in the
command:

```bash
RELEASE_ID="$(cat /tmp/jotoglobal-release-id)"
scp -r dist/. \
  root@139.224.51.172:/var/www/jotoglobal/releases/$RELEASE_ID/
scp -r functions/contact/. \
  root@139.224.51.172:/opt/jotoglobal-contact/releases/$RELEASE_ID/
scp deploy/aliyun/prepare-contact-env.mjs \
  deploy/aliyun/jotoglobal-contact.service \
  root@139.224.51.172:/root/backups/jotoglobal/
```

Expected: all uploads complete without replacing any existing release.

- [ ] **Step 6: Install contact production dependencies**

Run remotely:

```bash
RELEASE_ID="$(cat /root/backups/jotoglobal/release-id)"
cd "/opt/jotoglobal-contact/releases/$RELEASE_ID"
npm ci --omit=dev
chown -R root:root "/opt/jotoglobal-contact/releases/$RELEASE_ID"
chmod -R o-w "/opt/jotoglobal-contact/releases/$RELEASE_ID"
ln -sfn "/opt/jotoglobal-contact/releases/$RELEASE_ID" \
  /opt/jotoglobal-contact/current
```

Expected: `node_modules` contains only production dependencies and the
`current` link resolves to the new release.

- [ ] **Step 7: Create the protected environment file locally on the server**

Run remotely:

```bash
node /root/backups/jotoglobal/prepare-contact-env.mjs
stat -c '%a %U %G %n' /etc/jotoglobal-contact.env
```

Expected output:

```text
600 root root /etc/jotoglobal-contact.env
```

Do not print the environment file contents.

- [ ] **Step 8: Install and start the systemd unit**

Run remotely:

```bash
install -o root -g root -m 0644 \
  /root/backups/jotoglobal/jotoglobal-contact.service \
  /etc/systemd/system/jotoglobal-contact.service
systemctl daemon-reload
systemctl enable --now jotoglobal-contact.service
systemctl is-active jotoglobal-contact.service
curl -fsS http://127.0.0.1:9000/healthz
```

Expected: service is `active` and health returns `{"ok":true}`.

### Task 6: Install Nginx configuration and perform pre-DNS acceptance

**Files:**

- Create remotely: `/etc/nginx/sites-available/jotoglobal.com`
- Create remotely: `/etc/nginx/sites-enabled/jotoglobal.com`
- Create remotely: `/etc/nginx/conf.d/jotoglobal-rate-limit.conf`
- Create remotely: `/etc/nginx/snippets/jotoglobal-security-headers.conf`
- Create remotely: `/etc/nginx/snippets/jotoglobal-locations.conf`
- Stage remotely: `/root/backups/jotoglobal/jotoglobal-https.nginx.conf`

**Interfaces:**

- Consumes: healthy service and staged static release from Task 5.
- Produces: HTTP site accessible by Host header before DNS changes.

- [ ] **Step 1: Upload the Nginx files to a remote staging directory**

Run locally:

```bash
scp \
  deploy/aliyun/jotoglobal.nginx.conf \
  deploy/aliyun/jotoglobal-https.nginx.conf \
  deploy/aliyun/jotoglobal-rate-limit.conf \
  deploy/aliyun/jotoglobal-security-headers.conf \
  deploy/aliyun/jotoglobal-locations.conf \
  root@139.224.51.172:/root/backups/jotoglobal/
```

- [ ] **Step 2: Capture the pre-change Nginx baseline**

Run remotely:

```bash
nginx -T > /root/backups/jotoglobal/nginx-before.txt 2>&1
nginx -t
```

Expected: baseline file exists and the current configuration passes.

- [ ] **Step 3: Install the new virtual host without touching existing files**

Run remotely:

```bash
install -o root -g root -m 0644 \
  /root/backups/jotoglobal/jotoglobal-rate-limit.conf \
  /etc/nginx/conf.d/jotoglobal-rate-limit.conf
install -o root -g root -m 0644 \
  /root/backups/jotoglobal/jotoglobal-security-headers.conf \
  /etc/nginx/snippets/jotoglobal-security-headers.conf
install -o root -g root -m 0644 \
  /root/backups/jotoglobal/jotoglobal-locations.conf \
  /etc/nginx/snippets/jotoglobal-locations.conf
install -o root -g root -m 0644 \
  /root/backups/jotoglobal/jotoglobal.nginx.conf \
  /etc/nginx/sites-available/jotoglobal.com
ln -sfn /etc/nginx/sites-available/jotoglobal.com \
  /etc/nginx/sites-enabled/jotoglobal.com
RELEASE_ID="$(cat /root/backups/jotoglobal/release-id)"
ln -sfn "/var/www/jotoglobal/releases/$RELEASE_ID" \
  /var/www/jotoglobal/current
nginx -t
systemctl reload nginx
```

Expected: `nginx -t` succeeds before reload.

- [ ] **Step 4: Verify static routes and headers by Host request**

Run remotely:

```bash
curl -fsSI -H 'Host: jotoglobal.com' http://127.0.0.1/
curl -fsSI -H 'Host: jotoglobal.com' http://127.0.0.1/zh/about
curl -fsSI -H 'Host: jotoglobal.com' http://127.0.0.1/fa/contact
curl -fsSI -H 'Host: jotoglobal.com' http://127.0.0.1/robots.txt
curl -fsSI -H 'Host: jotoglobal.com' http://127.0.0.1/sitemap.xml
```

Expected: all return 200, SPA routes return HTML, and security/cache headers
match the location rules.

- [ ] **Step 5: Verify API rejection behavior without sending mail**

Run remotely:

```bash
curl -sS -o /tmp/jotoglobal-origin.json -w '%{http_code}\n' \
  -H 'Host: jotoglobal.com' \
  -H 'Origin: https://attacker.example' \
  -H 'Content-Type: application/json' \
  --data '{}' \
  http://127.0.0.1/api/contact
cat /tmp/jotoglobal-origin.json
```

Expected: status `403` and body contains `origin_not_allowed`.

- [ ] **Step 6: Send one controlled acceptance enquiry**

Run remotely:

```bash
curl -sS -o /tmp/jotoglobal-contact.json -w '%{http_code}\n' \
  -H 'Host: jotoglobal.com' \
  -H 'Origin: https://jotoglobal.com' \
  -H 'Content-Type: application/json' \
  --data '{"name":"JOTO Deployment Check","company":"JOTO TECH","email":"sales@jototech.cn","phoneOrWechat":"","message":"Production deployment acceptance test. No response required.","website":""}' \
  http://127.0.0.1/api/contact
cat /tmp/jotoglobal-contact.json
```

Expected: status `200`, body `{"ok":true}`, and the configured recipient
receives one clearly labelled acceptance email.

- [ ] **Step 7: Verify existing virtual hosts remain healthy**

Run remotely:

```bash
nginx -t
curl -fsSI https://ai.jotoai.com/ >/dev/null
curl -fsSI https://loop.jotoai.com/ >/dev/null
curl -fsSI https://bydata.net/ >/dev/null
systemctl is-active nginx
```

Expected: all commands succeed and Nginx remains active.

### Task 7: DNS, HTTPS, and production acceptance

**Files:**

- Replace remotely: `/etc/nginx/sites-available/jotoglobal.com`
- Create remotely: `/etc/letsencrypt/live/jotoglobal.com/`

**Interfaces:**

- Consumes: the pre-DNS accepted HTTP site from Task 6.
- Produces: public HTTPS service on the canonical domain.

- [ ] **Step 1: Verify authoritative DNS prerequisites**

Run locally:

```bash
dig +short jotoglobal.com A
dig +short www.jotoglobal.com A
```

Expected before certificate issuance:

```text
139.224.51.172
139.224.51.172
```

If either record is absent, stop. The server has no Alibaba Cloud CLI or
instance RAM role, so the domain owner must add these two A records in Alibaba
Cloud DNS without changing the existing MX or SPF records.

- [ ] **Step 2: Verify public HTTP reaches the new virtual host**

Run locally:

```bash
curl -fsSI http://jotoglobal.com/
curl -fsSI http://www.jotoglobal.com/
```

Expected: both requests reach Nginx on the ECS.

- [ ] **Step 3: Issue the certificate using the isolated webroot**

Run remotely:

```bash
install -d -o www-data -g www-data -m 0755 /var/www/certbot
certbot certonly --webroot \
  --webroot-path /var/www/certbot \
  --non-interactive \
  --agree-tos \
  --email sales@jototech.cn \
  -d jotoglobal.com \
  -d www.jotoglobal.com
```

Expected: certificate issuance succeeds without Certbot rewriting any unrelated
Nginx virtual host.

- [ ] **Step 4: Install the reviewed HTTPS configuration**

Run remotely:

```bash
install -o root -g root -m 0644 \
  /root/backups/jotoglobal/jotoglobal-https.nginx.conf \
  /etc/nginx/sites-available/jotoglobal.com
nginx -t
systemctl reload nginx
```

Expected: configuration passes before reload; the apex serves the application
over HTTPS and `www` redirects to the apex.

- [ ] **Step 5: Run the public production acceptance suite**

Run locally:

```bash
curl -fsSI https://jotoglobal.com/
curl -fsSI https://jotoglobal.com/zh/about
curl -fsSI https://jotoglobal.com/fa/contact
curl -fsSI https://jotoglobal.com/robots.txt
curl -fsSI https://jotoglobal.com/sitemap.xml
curl -fsSI https://www.jotoglobal.com/
```

Expected:

- Canonical routes return 200 over HTTPS.
- `www` returns 301 to `https://jotoglobal.com/`.
- Deep routes do not return 404.
- `robots.txt` and `sitemap.xml` are public.

- [ ] **Step 6: Verify certificate renewal**

Run remotely:

```bash
certbot renew --dry-run
systemctl status certbot.timer --no-pager
```

Expected: dry run succeeds and `certbot.timer` is active.

- [ ] **Step 7: Record the deployed release**

Run remotely:

```bash
RELEASE_ID="$(cat /root/backups/jotoglobal/release-id)"
DEPLOYED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
printf 'release_id=%s\ngit_commit=%s\ndeployed_at=%s\n' \
  "$RELEASE_ID" "${RELEASE_ID##*-}" "$DEPLOYED_AT" \
  > /root/backups/jotoglobal/deployed-release.txt
cat /root/backups/jotoglobal/deployed-release.txt
```

Expected: the file contains only the release ID, short Git commit, and UTC
deployment timestamp.

- [ ] **Step 8: Verify the exact rollback procedure**

Run the following only if acceptance fails:

```bash
PREVIOUS_FRONTEND="$(
  cat /root/backups/jotoglobal/previous-frontend 2>/dev/null || true
)"
PREVIOUS_CONTACT="$(
  cat /root/backups/jotoglobal/previous-contact 2>/dev/null || true
)"

if [[ "$PREVIOUS_FRONTEND" == /var/www/jotoglobal/releases/* ]]; then
  ln -sfn "$PREVIOUS_FRONTEND" /var/www/jotoglobal/current
else
  unlink /etc/nginx/sites-enabled/jotoglobal.com
fi

if [[ "$PREVIOUS_CONTACT" == /opt/jotoglobal-contact/releases/* ]]; then
  ln -sfn "$PREVIOUS_CONTACT" /opt/jotoglobal-contact/current
  systemctl restart jotoglobal-contact.service
else
  systemctl disable --now jotoglobal-contact.service
fi

nginx -t
systemctl reload nginx
```

Expected: an earlier release is restored when it exists. On this first
deployment, only this site's enabled Nginx symlink and contact service are
removed; no pre-existing site is modified.

- [ ] **Step 9: Rotate the exposed root credential**

After deployment and acceptance, the domain owner changes the root password
that was shared in chat and preferably replaces password login with an
SSH key plus an unprivileged sudo deployment user.
