import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const config = await readFile(
  new URL("./jotoglobal-locations.conf", import.meta.url),
  "utf8",
);

test("contact and captcha proxy only to the unified admin backend", () => {
  assert.match(config, /location = \/api\/captcha/);
  assert.match(config, /location = \/api\/contact/);
  assert.match(config, /proxy_pass https:\/\/admin\.jotoai\.com\/api\/captcha/);
  assert.match(config, /proxy_pass https:\/\/admin\.jotoai\.com\/api\/contact/);
  assert.doesNotMatch(config, /proxy_pass http:\/\/127\.0\.0\.1:9000/);
});

test("uses admin TLS routing and preserves the original source host", () => {
  assert.match(config, /proxy_ssl_server_name on/);
  assert.match(config, /proxy_ssl_name admin\.jotoai\.com/);
  assert.match(config, /proxy_set_header Host admin\.jotoai\.com/);
  assert.match(config, /proxy_set_header X-Forwarded-Host \$host/);
});

test("keeps rate limiting and no-store behavior", () => {
  assert.match(config, /limit_req zone=jotoglobal_contact burst=5 nodelay/);
  assert.match(config, /Cache-Control "no-store"/);
});

test("does not forward website credentials to the public admin APIs", () => {
  assert.equal(config.match(/proxy_set_header Authorization ""/g)?.length, 2);
  assert.equal(config.match(/proxy_set_header Proxy-Authorization ""/g)?.length, 2);
  assert.equal(config.match(/proxy_set_header Cookie ""/g)?.length, 2);
});
