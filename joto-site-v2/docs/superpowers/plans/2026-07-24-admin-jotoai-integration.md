# JOTO Global 统一后台接入实施计划

> **执行要求：** 必须使用 `superpowers:subagent-driven-development`（推荐）
> 或 `superpowers:executing-plans`，按任务逐项实施。使用复选框
> （`- [ ]`）记录进度。

**目标：** 将 `jotoglobal.com` 的留言、访客统计和健康巡检接入现有 `admin.jotoai.com`，同时保持后台仓库完全只读。

**架构：** 浏览器只请求官网同源 `/api/captcha` 与 `/api/contact`；ECS Nginx 和 Sites Worker 把这两个路径代理到现有统一后台，并通过 `X-Forwarded-Host` 保留 `jotoglobal.com` 来源。前端使用后台验证码协议和百度统计公开站点 ID；后台站点与百度属性通过现有运行时管理界面登记，不修改 `xutomi3-art/jotoai-website-final`。

**技术栈：** React 18、TypeScript 5.6、Vite 5、Vitest 2、Cloudflare Worker ESM、Nginx 1.24、百度统计、现有 `admin.jotoai.com` Express API、OpenAI Sites、阿里云 ECS。

## 全局约束

- 不修改、不提交、不部署 `xutomi3-art/jotoai-website-final` 中的任何文件。
- 联系表单只写入 `admin.jotoai.com`，不得双写旧本地联系服务。
- 浏览器只调用同源 `/api/captcha` 和 `/api/contact`。
- ECS 上游请求使用 `Host: admin.jotoai.com` 和 `proxy_ssl_name admin.jotoai.com`；来源识别使用 `X-Forwarded-Host: $host`。
- Sites Worker 上游请求固定设置 `X-Forwarded-Host: jotoglobal.com`。
- 后台管理员令牌、百度访问令牌、邮件凭据和 SSH 凭据不得进入源码、构建产物、测试输出或终端记录。
- 百度跟踪 ID 通过 `VITE_BAIDU_TONGJI_ID` 注入；缺失时统计必须无副作用地停用。
- 现有独立联系服务源码保留，生产 Nginx 不再把 `/api/contact` 路由到它。
- 英文、中文、波斯语表单必须保持可用，波斯语保持 RTL。
- 每次 Nginx 重载前必须通过 `nginx -t`。
- 生产验证码测试必须在用户明确同意后进行，不绕过验证码。
- `.openai/hosting.json` 中现有 `project_id` 必须原样复用，禁止再次创建 Sites 项目。

---

## 文件清单

- 新建：`src/lib/contactApi.ts` — 统一后台验证码、留言载荷、错误映射和请求协议。
- 新建：`src/lib/contactApi.test.ts` — 协议、来源参数、字段兼容和错误映射测试。
- 修改：`src/components/ContactForm.tsx` — 验证码 UI、统一后台提交与三语言反馈。
- 修改：`src/components/ContactForm.test.tsx` — 表单、验证码、刷新、失败和成功测试。
- 修改：`src/i18n/translations.ts` — 验证码与后台错误的中文、波斯语文案。
- 新建：`src/analytics/baidu.ts` — 百度脚本、SPA 页面和表单转化埋点。
- 新建：`src/analytics/baidu.test.ts` — 加载去重、禁用、页面和转化测试。
- 修改：`src/main.tsx` — 渲染前初始化统计队列。
- 修改：`src/App.tsx` — 路由变化时记录标准化页面访问。
- 修改：`src/components/ContactForm.tsx` — 成功后记录表单转化。
- 修改：`worker/index.js` — Sites 环境的统一后台代理和 SPA 回退。
- 新建：`worker/index.test.js` — Worker 代理、来源头、失败和 SPA 回退测试。
- 修改：`vite.config.ts` — 本地开发同源代理。
- 修改：`deploy/aliyun/jotoglobal-locations.conf` — ECS HTTPS 上游代理和健康响应。
- 新建：`deploy/aliyun/jotoglobal-locations.test.mjs` — Nginx 关键约束的静态测试。
- 修改：`package.json` — 增加部署配置测试命令。
- 新建：`.env.example` — 公开构建变量说明。
- 修改：`README.md` — 当前统一后台架构和本地配置。
- 修改：`functions/contact/README.md` — 标记旧本地服务仅用于回滚。
- 新建：`docs/admin-jotoai-integration-runbook.md` — 后台运行时登记、部署、验收和回滚手册。

### 任务 1：建立统一后台联系协议

**文件：**

- 新建：`src/lib/contactApi.ts`
- 新建：`src/lib/contactApi.test.ts`

**接口：**

- 产出：`loadCaptcha(fetchImpl?): Promise<CaptchaChallenge>`
- 产出：`buildContactPayload(fields, challenge, captchaText, context): ContactPayload`
- 产出：`submitContact(payload, fetchImpl?): Promise<ContactSuccess>`
- 产出：`contactErrorKey(error): ContactErrorKey`
- 使用：`src/i18n/routing.ts` 中的 `Locale`

- [ ] **步骤 1：写失败的联系协议测试**

新建 `src/lib/contactApi.test.ts`：

```ts
import { describe, expect, it, vi } from "vitest";
import {
  ContactSubmissionError,
  buildContactPayload,
  contactErrorKey,
  loadCaptcha,
  submitContact,
} from "./contactApi";

const fields = {
  name: "Avery Chen",
  company: "Example Global",
  email: "avery@example.com",
  phoneOrWechat: "wechat-avery",
  message: "A multi-region network rollout.",
  website: "",
};

describe("contactApi", () => {
  it("loads a valid captcha challenge from the same-origin endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ captchaId: "captcha-1", svg: "data:image/svg+xml;base64,PHN2Zy8+" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await expect(loadCaptcha(fetchMock)).resolves.toEqual({
      captchaId: "captcha-1",
      svg: "data:image/svg+xml;base64,PHN2Zy8+",
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/captcha", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  });

  it("rejects malformed captcha responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ captchaId: "captcha-1" }), { status: 200 }),
    );

    await expect(loadCaptcha(fetchMock)).rejects.toThrow("Invalid captcha response");
  });

  it("builds the backend-compatible payload and preserves traffic attribution", () => {
    const payload = buildContactPayload(
      fields,
      { captchaId: "captcha-1", svg: "data:image/svg+xml;base64,PHN2Zy8+" },
      "A7K9",
      {
        locale: "zh-CN",
        pageUrl:
          "https://jotoglobal.com/zh/contact?utm_source=baidu&utm_medium=cpc&utm_campaign=q3&utm_term=sdwan&utm_content=hero",
        referrer: "https://www.baidu.com/",
      },
    );

    expect(payload).toMatchObject({
      name: "Avery Chen",
      company: "Example Global",
      email: "avery@example.com",
      phone: "wechat-avery",
      phoneOrWechat: "wechat-avery",
      message: "A multi-region network rollout.",
      website: "",
      captchaId: "captcha-1",
      captchaText: "A7K9",
      locale: "zh-CN",
      trafficSource: {
        source: "baidu",
        medium: "cpc",
        campaign: "q3",
        keyword: "sdwan",
        utm_content: "hero",
        referrer: "https://www.baidu.com/",
      },
    });
  });

  it("submits to the same-origin contact endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, message: "提交成功" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const payload = buildContactPayload(
      fields,
      { captchaId: "captcha-1", svg: "data:image/svg+xml;base64,PHN2Zy8+" },
      "A7K9",
      { locale: "en", pageUrl: "https://jotoglobal.com/contact", referrer: "" },
    );

    await expect(submitContact(payload, fetchMock)).resolves.toEqual({
      success: true,
      message: "提交成功",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      }),
    );
  });

  it("maps backend captcha failures without exposing unrelated errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: false, error: "验证码已过期" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(
      submitContact(
        buildContactPayload(
          fields,
          { captchaId: "captcha-1", svg: "data:image/svg+xml;base64,PHN2Zy8+" },
          "A7K9",
          { locale: "en", pageUrl: "https://jotoglobal.com/contact", referrer: "" },
        ),
        fetchMock,
      ),
    ).rejects.toEqual(new ContactSubmissionError("验证码已过期", 400));

    expect(contactErrorKey(new ContactSubmissionError("验证码错误", 400))).toBe(
      "The verification code is incorrect.",
    );
    expect(contactErrorKey(new ContactSubmissionError("验证码已过期", 400))).toBe(
      "The verification code has expired. Please use the new code.",
    );
    expect(contactErrorKey(new Error("socket failure"))).toBe(
      "We could not send your enquiry. Please try again or email",
    );
  });
});
```

- [ ] **步骤 2：运行测试并确认失败**

运行：

```bash
npx vitest run src/lib/contactApi.test.ts
```

预期：测试失败，因为 `src/lib/contactApi.ts` 尚不存在。

- [ ] **步骤 3：实现最小联系协议**

新建 `src/lib/contactApi.ts`：

```ts
import type { Locale } from "../i18n/routing";

export interface ContactFields {
  name: string;
  company: string;
  email: string;
  phoneOrWechat: string;
  message: string;
  website: string;
}

export interface CaptchaChallenge {
  captchaId: string;
  svg: string;
}

export interface ContactContext {
  locale: Locale;
  pageUrl: string;
  referrer: string;
}

export interface ContactPayload extends ContactFields {
  phone: string;
  captchaId: string;
  captchaText: string;
  locale: Locale;
  pageUrl: string;
  trafficSource: {
    source: string;
    medium: string;
    campaign: string;
    keyword: string;
    utm_content: string;
    referrer: string;
  };
}

export interface ContactSuccess {
  success: true;
  message?: string;
}

export type ContactErrorKey =
  | "Please enter the verification code."
  | "The verification code is incorrect."
  | "The verification code has expired. Please use the new code."
  | "We could not send your enquiry. Please try again or email";

export class ContactSubmissionError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ContactSubmissionError";
  }
}

type FetchLike = typeof fetch;

export async function loadCaptcha(
  fetchImpl: FetchLike = globalThis.fetch,
): Promise<CaptchaChallenge> {
  const response = await fetchImpl("/api/captcha", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Captcha request failed: ${response.status}`);
  const data = (await response.json()) as Partial<CaptchaChallenge>;
  if (typeof data.captchaId !== "string" || typeof data.svg !== "string") {
    throw new Error("Invalid captcha response");
  }
  return { captchaId: data.captchaId, svg: data.svg };
}

export function buildContactPayload(
  fields: ContactFields,
  challenge: CaptchaChallenge,
  captchaText: string,
  context: ContactContext,
): ContactPayload {
  const url = new URL(context.pageUrl);
  return {
    ...fields,
    phone: fields.phoneOrWechat,
    captchaId: challenge.captchaId,
    captchaText: captchaText.trim(),
    locale: context.locale,
    pageUrl: context.pageUrl,
    trafficSource: {
      source: url.searchParams.get("utm_source") || "",
      medium: url.searchParams.get("utm_medium") || "",
      campaign: url.searchParams.get("utm_campaign") || "",
      keyword: url.searchParams.get("utm_term") || "",
      utm_content: url.searchParams.get("utm_content") || "",
      referrer: context.referrer,
    },
  };
}

export async function submitContact(
  payload: ContactPayload,
  fetchImpl: FetchLike = globalThis.fetch,
): Promise<ContactSuccess> {
  const response = await fetchImpl("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    error?: string;
  };
  if (!response.ok || data.success !== true) {
    throw new ContactSubmissionError(data.error || "delivery_failed", response.status);
  }
  return { success: true, ...(data.message ? { message: data.message } : {}) };
}

export function contactErrorKey(error: unknown): ContactErrorKey {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("请输入验证码")) return "Please enter the verification code.";
  if (message.includes("验证码错误")) return "The verification code is incorrect.";
  if (message.includes("验证码已过期") || message.includes("错误或已过期")) {
    return "The verification code has expired. Please use the new code.";
  }
  return "We could not send your enquiry. Please try again or email";
}
```

- [ ] **步骤 4：运行协议测试**

运行：

```bash
npx vitest run src/lib/contactApi.test.ts
```

预期：5 项测试全部通过。

- [ ] **步骤 5：提交协议层**

```bash
git add src/lib/contactApi.ts src/lib/contactApi.test.ts
git commit -m "feat: add unified contact api client"
```

### 任务 2：为三语言联系表单增加验证码和统一错误反馈

**文件：**

- 修改：`src/components/ContactForm.tsx`
- 修改：`src/components/ContactForm.test.tsx`
- 修改：`src/i18n/translations.ts`

**接口：**

- 使用：`loadCaptcha`、`buildContactPayload`、`submitContact`、`contactErrorKey`
- 产出：可刷新、可访问、三语言的验证码表单

- [ ] **步骤 1：用完整交互测试替换现有表单测试**

替换 `src/components/ContactForm.test.tsx`，使用以下辅助函数和 5 个必需用例：

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ContactForm from "./ContactForm";

const captcha = {
  captchaId: "captcha-1",
  svg: "data:image/svg+xml;base64,PHN2Zy8+",
};

function jsonResponse(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole("textbox", { name: /name/i }), "Avery Chen");
  await user.type(screen.getByRole("textbox", { name: /company/i }), "Example Global");
  await user.type(screen.getByRole("textbox", { name: /work email/i }), "avery@example.com");
  await user.type(
    screen.getByRole("textbox", { name: /what would you like to solve/i }),
    "A multi-region network rollout.",
  );
}

describe("ContactForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("loads and refreshes the captcha", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(captcha))
      .mockResolvedValueOnce(jsonResponse({ ...captcha, captchaId: "captcha-2" }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);

    expect(await screen.findByRole("img", { name: /security verification code/i }))
      .toHaveAttribute("src", captcha.svg);
    await user.click(screen.getByRole("button", { name: /refresh verification code/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it("shows required-field errors after captcha is ready", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(captcha)));
    render(<ContactForm />);

    await screen.findByRole("img", { name: /security verification code/i });
    await user.click(screen.getByRole("button", { name: /send project brief/i }));

    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your company or organization.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your work email.")).toBeInTheDocument();
    expect(screen.getByText("Please tell us what you would like to solve.")).toBeInTheDocument();
  });

  it("requires a verification code", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(captcha)));
    render(<ContactForm />);
    await screen.findByRole("img", { name: /security verification code/i });
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /send project brief/i }));
    expect(await screen.findByText("Please enter the verification code.")).toBeInTheDocument();
  });

  it("submits once to the unified backend and refreshes the captcha", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(captcha))
      .mockResolvedValueOnce(jsonResponse({ success: true, message: "提交成功" }))
      .mockResolvedValueOnce(jsonResponse({ ...captcha, captchaId: "captcha-2" }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);

    await screen.findByRole("img", { name: /security verification code/i });
    await fillRequiredFields(user);
    await user.type(screen.getByRole("textbox", { name: /verification code/i }), "A7K9");
    await user.click(screen.getByRole("button", { name: /send project brief/i }));

    expect(await screen.findByText(/project brief has been sent/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(3);
    const submitBody = JSON.parse(String(fetchMock.mock.calls[1][1]?.body));
    expect(submitBody).toMatchObject({
      phone: "",
      phoneOrWechat: "",
      captchaId: "captcha-1",
      captchaText: "A7K9",
      locale: "en",
    });
  });

  it("keeps business fields and replaces an expired captcha", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(captcha))
      .mockResolvedValueOnce(jsonResponse({ success: false, error: "验证码已过期" }, 400))
      .mockResolvedValueOnce(jsonResponse({ ...captcha, captchaId: "captcha-2" }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);

    await screen.findByRole("img", { name: /security verification code/i });
    await fillRequiredFields(user);
    await user.type(screen.getByRole("textbox", { name: /verification code/i }), "OLD1");
    await user.click(screen.getByRole("button", { name: /send project brief/i }));

    expect(
      await screen.findByText("The verification code has expired. Please use the new code."),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue("Avery Chen");
    expect(screen.getByRole("textbox", { name: /verification code/i })).toHaveValue("");
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
```

- [ ] **步骤 2：运行测试并确认旧组件失败**

运行：

```bash
npx vitest run src/components/ContactForm.test.tsx
```

预期：测试失败，因为旧组件不会加载或渲染验证码。

- [ ] **步骤 3：在组件中接入协议层**

对 `src/components/ContactForm.tsx` 应用以下结构调整：

移除组件本地的 `ContactFields` 接口和旧 `contactEndpoint` 常量；只使用
共享协议类型和同源端点。

```tsx
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowUpRight, LoaderCircle, RefreshCw } from "lucide-react";
import {
  type CaptchaChallenge,
  type ContactErrorKey,
  type ContactFields,
  buildContactPayload,
  contactErrorKey,
  loadCaptcha,
  submitContact,
} from "../lib/contactApi";
```

使用以下组件状态：

```tsx
const { locale, t } = useI18n();
const [fields, setFields] = useState<ContactFields>(initialFields);
const [errors, setErrors] = useState<ContactErrors>({});
const [status, setStatus] = useState<FormStatus>("idle");
const [statusMessage, setStatusMessage] = useState<ContactErrorKey | null>(null);
const [captcha, setCaptcha] = useState<CaptchaChallenge | null>(null);
const [captchaText, setCaptchaText] = useState("");
const [captchaLoading, setCaptchaLoading] = useState(true);
const [captchaError, setCaptchaError] = useState(false);
```

增加刷新生命周期：

```tsx
const refreshCaptcha = useCallback(async () => {
  setCaptchaLoading(true);
  setCaptchaError(false);
  try {
    setCaptcha(await loadCaptcha());
    setCaptchaText("");
  } catch {
    setCaptcha(null);
    setCaptchaError(true);
  } finally {
    setCaptchaLoading(false);
  }
}, []);

useEffect(() => {
  void refreshCaptcha();
}, [refreshCaptcha]);
```

将提交请求替换为：

```tsx
if (!captchaText.trim()) {
  setStatus("error");
  setStatusMessage("Please enter the verification code.");
  document.getElementById("contact-captcha")?.focus();
  return;
}
if (!captcha) {
  setCaptchaError(true);
  return;
}

setStatus("submitting");
setStatusMessage(null);
try {
  await submitContact(
    buildContactPayload(fields, captcha, captchaText, {
      locale,
      pageUrl: window.location.href,
      referrer: document.referrer,
    }),
  );
  setFields(initialFields);
  setStatus("success");
  await refreshCaptcha();
} catch (error) {
  setStatus("error");
  setStatusMessage(contactErrorKey(error));
  await refreshCaptcha();
}
```

在留言字段之后、隐藏蜜罐字段之前插入以下验证码区块：

```tsx
<div className="sm:col-span-2">
  <label className="text-xs text-white/65" htmlFor="contact-captcha">
    {t("Verification code")} <span className="text-joto-green">*</span>
  </label>
  <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-stretch">
    <input
      aria-describedby={statusMessage === "Please enter the verification code."
        ? "contact-captcha-error"
        : undefined}
      aria-invalid={statusMessage === "Please enter the verification code."}
      autoComplete="off"
      className={fieldClassName.replace("mt-2 ", "")}
      id="contact-captcha"
      maxLength={12}
      onChange={(event) => {
        setCaptchaText(event.target.value);
        if (status !== "idle") setStatus("idle");
        setStatusMessage(null);
      }}
      placeholder={t("Enter the characters shown")}
      value={captchaText}
    />
    <div className="flex min-h-12 items-stretch gap-2">
      {captcha ? (
        <button
          className="min-w-32 overflow-hidden border border-white/18 bg-white"
          onClick={() => void refreshCaptcha()}
          type="button"
        >
          <img
            alt={t("Security verification code")}
            className="h-12 w-full object-contain"
            src={captcha.svg}
          />
        </button>
      ) : (
        <div className="flex min-w-32 items-center justify-center border border-white/18 bg-white/[0.04] text-white/45">
          {captchaLoading ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : "—"}
        </div>
      )}
      <button
        aria-label={t("Refresh verification code")}
        className="flex w-12 items-center justify-center border border-white/18 text-white/55 transition-colors hover:border-joto-green hover:text-joto-green"
        disabled={captchaLoading}
        onClick={() => void refreshCaptcha()}
        type="button"
      >
        <RefreshCw aria-hidden="true" className={`h-4 w-4 ${captchaLoading ? "animate-spin" : ""}`} />
      </button>
    </div>
  </div>
  {captchaError && (
    <p className="mt-2 text-xs text-[#ff8f8f]">
      {t("Verification code could not be loaded. Please refresh and try again.")}
    </p>
  )}
</div>
```

将提交按钮禁用条件设为：

```tsx
disabled={status === "submitting" || status === "success" || captchaLoading || !captcha}
```

在现有错误区域渲染 `statusMessage`。仅当键等于通用投递失败键时，
追加销售邮箱。

- [ ] **步骤 4：添加中文和波斯语翻译**

将以下条目加入 `src/i18n/translations.ts` 现有的
`Object.assign(zh, {})` 和 `Object.assign(fa, {})` 区块：

```ts
Object.assign(zh, {
  "Verification code": "验证码",
  "Enter the characters shown": "请输入图中字符",
  "Security verification code": "安全验证码",
  "Refresh verification code": "刷新验证码",
  "Verification code could not be loaded. Please refresh and try again.": "验证码加载失败，请刷新后重试。",
  "Please enter the verification code.": "请输入验证码。",
  "The verification code is incorrect.": "验证码不正确。",
  "The verification code has expired. Please use the new code.": "验证码已过期，请使用新的验证码。",
});

Object.assign(fa, {
  "Verification code": "کد تأیید",
  "Enter the characters shown": "نویسه‌های تصویر را وارد کنید",
  "Security verification code": "کد تأیید امنیتی",
  "Refresh verification code": "تازه‌سازی کد تأیید",
  "Verification code could not be loaded. Please refresh and try again.": "کد تأیید بارگیری نشد. صفحه را تازه کنید و دوباره تلاش کنید.",
  "Please enter the verification code.": "لطفاً کد تأیید را وارد کنید.",
  "The verification code is incorrect.": "کد تأیید نادرست است.",
  "The verification code has expired. Please use the new code.": "کد تأیید منقضی شده است. از کد جدید استفاده کنید.",
});
```

把这些键合并进现有两个 `Object.assign` 调用，不要创建重复调用。

- [ ] **步骤 5：运行组件和多语言测试**

运行：

```bash
npx vitest run src/components/ContactForm.test.tsx src/i18n/I18nProvider.test.tsx
```

预期：全部通过。

- [ ] **步骤 6：提交表单功能**

```bash
git add src/components/ContactForm.tsx src/components/ContactForm.test.tsx src/i18n/translations.ts
git commit -m "feat: route contact form through admin backend"
```

### 任务 3：接入百度页面统计和表单转化

**文件：**

- 新建：`src/analytics/baidu.ts`
- 新建：`src/analytics/baidu.test.ts`
- 修改：`src/main.tsx`
- 修改：`src/App.tsx`
- 修改：`src/components/ContactForm.tsx`

**接口：**

- 产出：`initBaiduAnalytics(trackingId?, documentRef?): boolean`
- 产出：`trackPageView(path): void`
- 产出：`trackContactConversion(): void`
- 产出：`resetBaiduAnalyticsForTests(): void`

- [ ] **步骤 1：写失败的统计测试**

新建 `src/analytics/baidu.test.ts`：

```ts
import { afterEach, describe, expect, it } from "vitest";
import {
  initBaiduAnalytics,
  resetBaiduAnalyticsForTests,
  trackContactConversion,
  trackPageView,
} from "./baidu";

describe("baidu analytics", () => {
  afterEach(() => {
    document.getElementById("baidu-hm")?.remove();
    delete window._hmt;
    resetBaiduAnalyticsForTests();
  });

  it("does nothing when no tracking id is configured", () => {
    expect(initBaiduAnalytics("", document)).toBe(false);
    expect(document.getElementById("baidu-hm")).toBeNull();
    trackPageView("/contact");
    expect(window._hmt).toBeUndefined();
  });

  it("loads one async script and disables automatic pageviews", () => {
    expect(initBaiduAnalytics("tracking-123", document)).toBe(true);
    expect(initBaiduAnalytics("tracking-123", document)).toBe(true);
    const scripts = document.querySelectorAll("#baidu-hm");
    expect(scripts).toHaveLength(1);
    expect(scripts[0]).toHaveAttribute("src", "https://hm.baidu.com/hm.js?tracking-123");
    expect(window._hmt).toContainEqual(["_setAutoPageview", false]);
  });

  it("deduplicates pageviews and records contact conversion", () => {
    initBaiduAnalytics("tracking-123", document);
    trackPageView("/zh/contact");
    trackPageView("/zh/contact");
    trackContactConversion();

    expect(window._hmt).toContainEqual(["_trackPageview", "/zh/contact"]);
    expect(window._hmt?.filter((entry) => entry[0] === "_trackPageview" && entry[1] === "/zh/contact"))
      .toHaveLength(1);
    expect(window._hmt).toContainEqual(["_trackPageview", "/poc-submitted"]);
    expect(window._hmt).toContainEqual(["_trackEvent", "转化", "表单提交", "jotoglobal"]);
  });
});
```

- [ ] **步骤 2：运行测试并确认失败**

运行：

```bash
npx vitest run src/analytics/baidu.test.ts
```

预期：测试失败，因为 `src/analytics/baidu.ts` 尚不存在。

- [ ] **步骤 3：实现统计模块**

新建 `src/analytics/baidu.ts`：

```ts
declare global {
  interface Window {
    _hmt?: unknown[][];
  }
}

const configuredTrackingId = import.meta.env.VITE_BAIDU_TONGJI_ID?.trim() || "";
let enabled = false;
let lastTrackedPath = "";

export function initBaiduAnalytics(
  trackingId = configuredTrackingId,
  documentRef: Document = document,
): boolean {
  const id = trackingId.trim();
  if (!id) return false;
  enabled = true;
  window._hmt = window._hmt || [];
  if (!window._hmt.some((entry) => entry[0] === "_setAutoPageview")) {
    window._hmt.push(["_setAutoPageview", false]);
  }
  if (!documentRef.getElementById("baidu-hm")) {
    const script = documentRef.createElement("script");
    script.id = "baidu-hm";
    script.async = true;
    script.src = `https://hm.baidu.com/hm.js?${encodeURIComponent(id)}`;
    documentRef.head.appendChild(script);
  }
  return true;
}

export function trackPageView(path: string): void {
  if (!enabled || !path || path === lastTrackedPath) return;
  lastTrackedPath = path;
  window._hmt = window._hmt || [];
  window._hmt.push(["_trackPageview", path]);
}

export function trackContactConversion(): void {
  if (!enabled) return;
  window._hmt = window._hmt || [];
  window._hmt.push(["_trackPageview", "/poc-submitted"]);
  window._hmt.push(["_trackEvent", "转化", "表单提交", "jotoglobal"]);
}

export function resetBaiduAnalyticsForTests(): void {
  enabled = false;
  lastTrackedPath = "";
}
```

- [ ] **步骤 4：接入应用生命周期**

在 `src/main.tsx` 中导入初始化函数，并在 `createRoot` 前调用：

```ts
import { initBaiduAnalytics } from "./analytics/baidu";

initBaiduAnalytics();
```

在 `src/App.tsx` 中增加 `useEffect` 和页面跟踪：

```tsx
import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { trackPageView } from "./analytics/baidu";

useEffect(() => {
  trackPageView(`${window.location.pathname}${window.location.search}`);
}, [locale, pathname]);
```

把该 effect 紧接在 `const { locale, pathname } = useI18n();` 之后。

在 `src/components/ContactForm.tsx` 中，只在 `submitContact` 成功后调用：

```tsx
import { trackContactConversion } from "../analytics/baidu";

trackContactConversion();
```

- [ ] **步骤 5：运行统计、表单和应用测试**

运行：

```bash
npx vitest run src/analytics/baidu.test.ts src/components/ContactForm.test.tsx src/App.test.tsx
```

预期：全部通过。

- [ ] **步骤 6：提交统计功能**

```bash
git add src/analytics/baidu.ts src/analytics/baidu.test.ts src/main.tsx src/App.tsx src/components/ContactForm.tsx
git commit -m "feat: add baidu visitor and conversion tracking"
```

### 任务 4：让 Sites、本地开发和 ECS 使用同一后台代理

**文件：**

- 修改：`worker/index.js`
- 新建：`worker/index.test.js`
- 修改：`vite.config.ts`
- 修改：`deploy/aliyun/jotoglobal-locations.conf`
- 新建：`deploy/aliyun/jotoglobal-locations.test.mjs`
- 修改：`package.json`

**接口：**

- 产出：用于确定性 Worker 测试的 `createWorker(fetchImpl)`
- 产出：Sites 和 ECS 中 `/api/captcha` 与 `/api/contact` 的代理行为
- 保留：现有 SPA 回退和静态资源行为

- [ ] **步骤 1：写失败的 Worker 代理测试**

新建 `worker/index.test.js`：

```js
// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createWorker } from "./index.js";

const assets = {
  fetch: vi.fn(async (request) => {
    const pathname = new URL(request.url).pathname;
    if (pathname === "/index.html") return new Response("<main>JOTO</main>", { status: 200 });
    return new Response("missing", { status: 404 });
  }),
};

describe("Sites worker", () => {
  it("proxies captcha with the canonical source host", async () => {
    const upstream = vi.fn(async () =>
      new Response(JSON.stringify({ captchaId: "c1", svg: "data:image/svg+xml;base64,PHN2Zy8+" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const worker = createWorker(upstream);

    const response = await worker.fetch(
      new Request("https://preview.example/api/captcha"),
      { ASSETS: assets },
    );

    expect(response.status).toBe(200);
    const upstreamRequest = upstream.mock.calls[0][0];
    expect(upstreamRequest.url).toBe("https://admin.jotoai.com/api/captcha");
    expect(upstreamRequest.headers.get("X-Forwarded-Host")).toBe("jotoglobal.com");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("proxies the contact body once", async () => {
    const upstream = vi.fn(async (request) => {
      expect(await request.json()).toMatchObject({ name: "Avery", captchaId: "c1" });
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });
    const worker = createWorker(upstream);

    const response = await worker.fetch(
      new Request("https://preview.example/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Avery", captchaId: "c1" }),
      }),
      { ASSETS: assets },
    );

    expect(response.status).toBe(200);
    expect(upstream).toHaveBeenCalledTimes(1);
  });

  it("returns a safe 502 when the admin upstream fails", async () => {
    const worker = createWorker(vi.fn().mockRejectedValue(new Error("secret upstream detail")));
    const response = await worker.fetch(
      new Request("https://preview.example/api/captcha"),
      { ASSETS: assets },
    );
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ success: false, error: "upstream_unavailable" });
  });

  it("preserves the existing SPA fallback", async () => {
    const worker = createWorker(vi.fn());
    const response = await worker.fetch(
      new Request("https://preview.example/zh/contact"),
      { ASSETS: assets },
    );
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("JOTO");
  });
});
```

- [ ] **步骤 2：写失败的 Nginx 约束测试**

新建 `deploy/aliyun/jotoglobal-locations.test.mjs`：

```js
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
```

在 `package.json` 中增加以下脚本：

```json
"test:deploy-config": "node --test deploy/aliyun/*.test.mjs"
```

- [ ] **步骤 3：运行两个测试并确认失败**

运行：

```bash
npx vitest run worker/index.test.js
npm run test:deploy-config
```

预期：Worker 测试失败，因为 API 请求仍被当作静态资源处理；Nginx
测试失败，因为 `/api/contact` 仍指向 `127.0.0.1:9000`，且
`/api/captcha` 尚不存在。

- [ ] **步骤 4：实现 Sites Worker 代理**

将 `worker/index.js` 替换为：

```js
const ADMIN_ORIGIN = "https://admin.jotoai.com";
const CANONICAL_HOST = "jotoglobal.com";
const API_PATHS = new Set(["/api/captcha", "/api/contact"]);

function jsonError(status, error) {
  return new Response(JSON.stringify({ success: false, error }), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function createWorker(fetchImpl = globalThis.fetch) {
  return {
    async fetch(request, env) {
      const url = new URL(request.url);
      if (API_PATHS.has(url.pathname)) {
        try {
          const upstreamUrl = new URL(`${url.pathname}${url.search}`, ADMIN_ORIGIN);
          const headers = new Headers(request.headers);
          headers.set("X-Forwarded-Host", CANONICAL_HOST);
          headers.set("X-Forwarded-Proto", "https");
          headers.delete("Content-Length");
          const hasBody = request.method !== "GET" && request.method !== "HEAD";
          const upstreamRequest = new Request(upstreamUrl, {
            method: request.method,
            headers,
            body: hasBody ? await request.arrayBuffer() : undefined,
            redirect: "manual",
          });
          const response = await fetchImpl(upstreamRequest);
          const responseHeaders = new Headers(response.headers);
          responseHeaders.set("Cache-Control", "no-store");
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
          });
        } catch {
          return jsonError(502, "upstream_unavailable");
        }
      }

      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404 || request.method !== "GET") return response;
      if (url.pathname.includes(".")) return response;
      url.pathname = "/index.html";
      return env.ASSETS.fetch(new Request(url, request));
    },
  };
}

export default createWorker();
```

- [ ] **步骤 5：配置本地 Vite 代理**

将 `vite.config.ts` 替换为：

```ts
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const adminOrigin = (env.ADMIN_API_ORIGIN || "https://admin.jotoai.com").replace(/\/$/, "");
  const apiProxy = {
    target: adminOrigin,
    changeOrigin: true,
    secure: true,
    headers: {
      "X-Forwarded-Host": "jotoglobal.com",
      "X-Forwarded-Proto": "https",
    },
  };

  return {
    base: mode === "github-pages" ? "/joto-tech-shanghai/" : "/",
    plugins: [react()],
    server: {
      proxy: {
        "/api/captcha": apiProxy,
        "/api/contact": apiProxy,
      },
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.ts",
      css: true,
      exclude: ["functions/**", "node_modules/**", "dist/**"],
    },
  };
});
```

- [ ] **步骤 6：替换 ECS Nginx 位置配置**

仅替换 `deploy/aliyun/jotoglobal-locations.conf` 顶部的
`/api/captcha`、`/api/contact` 和 `/healthz` 区块：

```nginx
location = /api/captcha {
    proxy_pass https://admin.jotoai.com/api/captcha;
    proxy_http_version 1.1;
    proxy_ssl_server_name on;
    proxy_ssl_name admin.jotoai.com;
    proxy_ssl_verify on;
    proxy_ssl_trusted_certificate /etc/ssl/certs/ca-certificates.crt;
    proxy_set_header Host admin.jotoai.com;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Request-Id $request_id;
    proxy_connect_timeout 3s;
    proxy_read_timeout 10s;
    proxy_send_timeout 10s;
    proxy_buffering off;
    add_header Cache-Control "no-store" always;
}

location = /api/contact {
    limit_req zone=jotoglobal_contact burst=5 nodelay;
    proxy_pass https://admin.jotoai.com/api/contact;
    proxy_http_version 1.1;
    proxy_ssl_server_name on;
    proxy_ssl_name admin.jotoai.com;
    proxy_ssl_verify on;
    proxy_ssl_trusted_certificate /etc/ssl/certs/ca-certificates.crt;
    proxy_set_header Host admin.jotoai.com;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Request-Id $request_id;
    proxy_connect_timeout 3s;
    proxy_read_timeout 15s;
    proxy_send_timeout 15s;
    proxy_buffering off;
    add_header Cache-Control "no-store" always;
}

location = /healthz {
    allow 127.0.0.1;
    allow ::1;
    deny all;
    default_type application/json;
    add_header Cache-Control "no-store" always;
    return 200 '{"ok":true,"contactBackend":"admin.jotoai.com"}';
}
```

保持现有 `/assets/`、`/index.html`、`/robots.txt`、`/sitemap.xml`
和 `/` 区块不变。

- [ ] **步骤 7：运行代理测试**

运行：

```bash
npx vitest run worker/index.test.js
npm run test:deploy-config
```

预期：全部通过。

- [ ] **步骤 8：提交代理配置**

```bash
git add worker/index.js worker/index.test.js vite.config.ts deploy/aliyun/jotoglobal-locations.conf deploy/aliyun/jotoglobal-locations.test.mjs package.json
git commit -m "feat: proxy site contact through admin backend"
```

### 任务 5：更新运行配置和运维文档

**文件：**

- 新建：`.env.example`
- 修改：`README.md`
- 修改：`functions/contact/README.md`
- 新建：`docs/admin-jotoai-integration-runbook.md`

**接口：**

- 记录：`VITE_BAIDU_TONGJI_ID`
- 记录：`ADMIN_API_ORIGIN`
- 记录：后台站点登记、百度登记、部署、验收、回滚

- [ ] **步骤 1：创建公开环境变量样例**

新建 `.env.example`：

```dotenv
# Public Baidu Tongji property id for jotoglobal.com.
# Leave empty to disable visitor and conversion tracking.
VITE_BAIDU_TONGJI_ID=

# Local Vite proxy target. This is server-side development configuration and
# is not included in the browser bundle.
ADMIN_API_ORIGIN=https://admin.jotoai.com
```

- [ ] **步骤 2：更新 README 的技术说明**

将 `README.md` 现有的联系服务说明替换为：

```markdown
- 统一管理后台：生产环境的 `/api/captcha` 和 `/api/contact` 由 Nginx
  转发到 `admin.jotoai.com`，留言在统一后台落库并触发邮件/飞书通知。
- 百度统计：设置公开构建变量 `VITE_BAIDU_TONGJI_ID` 后记录页面访问和
  表单转化；未设置时统计静默停用。
```

将说明 `VITE_CONTACT_API_URL` 可直接访问函数的段落替换为：

```markdown
Contact 表单固定请求同源 `/api/captcha` 与 `/api/contact`，以保留真实
来源域名并避免浏览器跨域。开发环境可用仅服务端读取的
`ADMIN_API_ORIGIN` 改写代理目标。
```

- [ ] **步骤 3：标记旧联系服务的当前用途**

在 `functions/contact/README.md` 标题后加入以下提示：

```markdown
> 状态：自 `jotoglobal.com` 接入 `admin.jotoai.com` 后，本目录不再承接
> 生产联系表单，仅保留用于紧急回滚和历史部署复现。生产请求不得同时
> 写入本服务与统一后台。
```

- [ ] **步骤 4：创建运行手册**

新建 `docs/admin-jotoai-integration-runbook.md`，写入以下准确的操作记录：

```markdown
# admin.jotoai.com 接入运行手册

## 不可变边界

- 后台仓库 `xutomi3-art/jotoai-website-final` 只读。
- 官网留言只写入统一后台一次。
- 后台密钥、管理员令牌和百度访问令牌不写入本仓库。

## 后台站点登记

在 `admin.jotoai.com` 的“站点管理”中新增：

- ID：`jotoglobal`
- 名称：`JOTO TECH`
- URL：`https://jotoglobal.com`
- 描述：`JOTO TECH 全球企业 IT 解决方案官网`
- 图标：留空
- 强调色：`#5ee594`

保存后在“健康巡检”确认站点存在并返回 2xx。

## 百度统计登记

在后台当前使用的同一百度统计账户中新增 `jotoglobal.com`，复制该属性
的公开跟踪 ID。构建时设置：

    VITE_BAIDU_TONGJI_ID="$JOTO_BAIDU_TONGJI_ID" npm run build

跟踪 ID 可出现在前端；账户访问令牌不可进入终端记录或 Git。

## ECS 发布

1. 运行全部测试和生产构建。
2. 上传新的静态发布目录和 `jotoglobal-locations.conf` 候选文件。
3. 备份当前 Nginx 片段和 `current` 软链接目标。
4. 运行 `nginx -t`。
5. 原子切换 `current`，安装新片段，再次运行 `nginx -t`。
6. 平滑重载 Nginx。

## 验收

- `/api/captcha` 返回 200、`Cache-Control: no-store` 和有效图片。
- 用户允许后提交 `JOTO Deployment Check` 测试留言。
- 后台留言列表只出现一条，来源为 `jotoglobal.com`。
- 统一邮件只收到一封，旧服务无第二封通知。
- 百度统计站点列表出现 `jotoglobal.com`。
- 健康巡检出现 `jotoglobal` 且页面内容检查正常。

## 回滚

恢复上一版静态 `current` 软链接和上一版 Nginx 片段，运行 `nginx -t`
后平滑重载。后台已存留言、站点登记和百度属性不删除；删除运行时配置
必须另行确认。
```

- [ ] **步骤 5：运行文档和配置检查**

运行：

```bash
rg -n "VITE_CONTACT_API_URL|127\\.0\\.0\\.1:9000" README.md functions/contact/README.md .env.example docs/admin-jotoai-integration-runbook.md
npm run test:deploy-config
```

预期：当前 README 中不存在 `VITE_CONTACT_API_URL`；仅
`functions/contact/README.md` 的历史或回滚说明包含
`127.0.0.1:9000`；部署配置测试通过。

- [ ] **步骤 6：提交文档**

```bash
git add .env.example README.md functions/contact/README.md docs/admin-jotoai-integration-runbook.md
git commit -m "docs: add admin integration runbook"
```

### 任务 6：登记现有后台和百度运行时配置

**文件：**

- 不修改仓库文件
- 运行时状态：现有后台站点配置
- 运行时状态：现有百度统计账户

**接口：**

- 产出：`jotoglobal` 巡检条目
- 产出：`jotoglobal.com` 百度属性和公开跟踪 ID
- 不修改：后台 Git 仓库

- [ ] **步骤 1：再次确认后台仓库零改动**

以只读方式查看已登录的 GitHub 仓库页面，确认本任务没有执行提交、
分支、文件、拉取请求或部署操作。

预期：后台仓库保持不变。

- [ ] **步骤 2：在百度统计创建官网属性**

打开后台访客统计当前使用的百度统计账户。在最终提交创建属性的表单前，
向用户取得操作时确认。只创建一个以下属性：

```text
jotoglobal.com
```

只把公开跟踪 ID 保存到本任务的 shell 变量
`JOTO_BAIDU_TONGJI_ID`。不得读取或复制账户令牌、Cookie、密码或其他
站点 ID。

预期：账户中出现 `jotoglobal.com`，并提供一个跟踪 ID。

- [ ] **步骤 3：在 admin.jotoai.com 登记巡检站点**

打开现有“站点管理”界面。在最终新增操作前向用户取得操作时确认，准确
提交：

```text
ID: jotoglobal
名称: JOTO TECH
URL: https://jotoglobal.com
描述: JOTO TECH 全球企业 IT 解决方案官网
图标: 留空
强调色: #5ee594
```

如果已经存在同一 URL 的 `jotoglobal`，不要重复创建，只验证现有条目。

预期：仅存在一个 `jotoglobal` 条目。

- [ ] **步骤 4：验证访客统计与巡检读取运行时配置**

在后台中：

1. 打开“访客统计”，确认站点选择器包含 `jotoglobal.com`。
2. 打开“健康巡检”，确认出现 `jotoglobal`。
3. 如果存在手动巡检操作，执行一次。

预期：访客属性可选择；健康结果包含 HTTP 状态和延迟，且没有内容错误。

### 任务 7：完成本地发布门槛并发布 Sites 版本

**文件：**

- 验证：任务 1–5 的所有源文件和测试文件
- 构建：`dist/`
- 打包：仓库外的临时 Sites 归档

**接口：**

- 使用：任务 6 创建的公开跟踪 ID
- 产出：一个已验证的 Git 提交 SHA
- 产出：从该 SHA 保存并部署的一个 Sites 版本
- 保留：`.openai/hosting.json` 项目 ID

- [ ] **步骤 1：运行完整测试**

运行：

```bash
npm test -- --run
npm run test:seo-files
npm run test:deploy-config
cd functions/contact && npm test
```

预期：全部测试套件通过。旧联系服务虽已退出生产请求路径，其测试仍保持
通过。

- [ ] **步骤 2：使用实际百度 ID 运行生产构建**

只使用任务 6 创建的公开跟踪 ID，并以 `JOTO_BAIDU_TONGJI_ID` 提供给
构建过程：

```bash
VITE_BAIDU_TONGJI_ID="$JOTO_BAIDU_TONGJI_ID" npm run build
```

预期：`dist/index.html`、资源文件、`robots.txt` 和 `sitemap.xml`
均存在。

- [ ] **步骤 3：运行 Sites 构建**

```bash
VITE_BAIDU_TONGJI_ID="$JOTO_BAIDU_TONGJI_ID" npm run build:sites
test -f dist/server/index.js
test -f dist/.openai/hosting.json
```

预期：Worker 入口和托管元数据均存在。

- [ ] **步骤 4：确认最终源状态与提交 SHA**

```bash
git status --short
git rev-parse HEAD
```

预期：任务 1–5 的源文件提交均已存在，仅保留已知的用户自有未跟踪输出
目录；记录准确的 HEAD SHA，不进行额外的兜底暂存或空提交。

- [ ] **步骤 5：推送并保存 Sites 版本**

使用 Sites 连接器，并复用 `.openai/hosting.json` 中的现有项目 ID：

1. 请求短期源仓库写入凭据。
2. 使用逐命令 HTTP 授权推送当前分支的准确 HEAD。
3. 对本项目运行 Sites `package-site.sh` 辅助脚本，并把归档放入
   `mktemp -d` 创建的目录。
4. 使用准确 HEAD SHA 和该归档保存一个版本。
5. 在支持时以私有方式部署已保存版本。
6. 轮询部署状态，直到 `succeeded` 或 `failed`。
7. 成功后在 Codex 中打开返回的部署 URL。

预期：Sites 部署 URL 能返回站点，Worker 能处理 `/api/captcha`。

### 任务 8：部署 ECS 并完成生产验收

**文件：**

- 部署：`dist/`
- 部署：`deploy/aliyun/jotoglobal-locations.conf`
- 保留：当前 Nginx 片段备份和当前发布目标

**接口：**

- 使用：任务 7 验证过的源码和构建
- 产出：可用的 `https://jotoglobal.com`
- 保留：所有其他虚拟主机和闲置的旧联系服务

- [ ] **步骤 1：生成不可变发布 ID**

```bash
JOTO_RELEASE_ID="$(date -u +%Y%m%dT%H%M%SZ)-$(git rev-parse --short HEAD)"
JOTO_GIT_SHA="$(git rev-parse HEAD)"
printf '%s\n' "$JOTO_RELEASE_ID" > /tmp/jotoglobal-release-id
printf '%s\n' "$JOTO_GIT_SHA" > /tmp/jotoglobal-git-sha
```

预期：两个临时文件分别包含发布 ID 和准确源码 SHA，均不含凭据。

- [ ] **步骤 2：在 ECS 创建候选目录并记录回滚状态**

先创建受保护的备份目录并复制两个非敏感部署标识，再在
`root@139.224.51.172` 上执行余下命令：

```bash
ssh root@139.224.51.172 'install -d -o root -g root -m 0700 /root/backups/jotoglobal'
scp /tmp/jotoglobal-release-id /tmp/jotoglobal-git-sha \
  root@139.224.51.172:/root/backups/jotoglobal/

JOTO_RELEASE_ID="$(cat /root/backups/jotoglobal/jotoglobal-release-id)"
install -d -o root -g root -m 0755 \
  "/var/www/jotoglobal/releases/$JOTO_RELEASE_ID"
install -d -o root -g root -m 0700 /root/backups/jotoglobal
readlink -f /var/www/jotoglobal/current > /root/backups/jotoglobal/previous-frontend.txt
cp -a /etc/nginx/snippets/jotoglobal-locations.conf \
  "/root/backups/jotoglobal/jotoglobal-locations.before-$JOTO_RELEASE_ID.conf"
```

预期：候选目录存在，两项回滚记录齐全。

- [ ] **步骤 3：上传静态构建和候选 Nginx 片段**

```bash
JOTO_RELEASE_ID="$(cat /tmp/jotoglobal-release-id)"
scp -r dist/. \
  "root@139.224.51.172:/var/www/jotoglobal/releases/$JOTO_RELEASE_ID/"
scp deploy/aliyun/jotoglobal-locations.conf \
  "root@139.224.51.172:/root/backups/jotoglobal/jotoglobal-locations.$JOTO_RELEASE_ID.conf"
```

预期：上传完成，未改变 `current` 或生效中的 Nginx 配置。

- [ ] **步骤 4：验证候选配置后原子切换**

在 ECS 上运行：

```bash
JOTO_RELEASE_ID="$(cat /root/backups/jotoglobal/jotoglobal-release-id)"
install -o root -g root -m 0644 \
  "/root/backups/jotoglobal/jotoglobal-locations.$JOTO_RELEASE_ID.conf" \
  /etc/nginx/snippets/jotoglobal-locations.conf
nginx -t
ln -sfn "/var/www/jotoglobal/releases/$JOTO_RELEASE_ID" /var/www/jotoglobal/current
nginx -t
systemctl reload nginx
```

预期：重载前两次 Nginx 检查均通过。

- [ ] **步骤 5：验证公开接口和站点**

```bash
curl -fsS -D /tmp/joto-captcha.headers \
  https://jotoglobal.com/api/captcha \
  -o /tmp/joto-captcha.json
curl -fsS https://jotoglobal.com/ > /dev/null
curl -fsS https://jotoglobal.com/zh/contact > /dev/null
curl -fsS https://jotoglobal.com/fa/contact > /dev/null
```

预期：全部请求返回 2xx；验证码响应头包含 `Cache-Control: no-store`；
验证码 JSON 包含 `captchaId` 和 `svg`。不要打印验证码载荷。

- [ ] **步骤 6：浏览器验证三语言表单**

使用真实生产 URL 验证：

- 英文 `/contact`
- 中文 `/zh/contact`
- 波斯语 `/fa/contact`
- 移动端宽度布局
- 键盘焦点顺序
- 验证码刷新
- RTL 下没有横向溢出
- 控制台没有错误

此步骤不要提交表单。

- [ ] **步骤 7：经确认提交一条生产验收留言**

在识别验证码并提交前，向用户取得操作时确认：

```text
Name: JOTO Deployment Check
Company: JOTO TECH
Email: sales@jototech.cn
Phone / WeChat: 留空
Message: Production admin integration acceptance test. No response required.
```

预期：

- 浏览器显示成功。
- 后台统一留言列表只新增一条记录。
- 来源为 `jotoglobal.com`。
- 联系数据和时间戳正确。
- 只收到一封统一邮件通知。
- 旧 localhost 联系服务没有产生第二封通知。

- [ ] **步骤 8：验证统计事件和健康巡检**

在后台中：

- 确认访客统计中仍可选择 `jotoglobal.com`。
- 等待服务商数据延迟窗口后，确认至少一个页面访问或
  `/poc-submitted` 转化。
- 确认 `jotoglobal` 健康巡检为绿色，并显示状态和延迟。

预期：三项统一管理能力均已运行。

- [ ] **步骤 9：记录发布并保留可回滚状态**

在 ECS 上运行：

```bash
JOTO_RELEASE_ID="$(cat /root/backups/jotoglobal/jotoglobal-release-id)"
JOTO_GIT_SHA="$(cat /root/backups/jotoglobal/jotoglobal-git-sha)"
printf 'release_id=%s\ngit_commit=%s\ndeployed_at=%s\n' \
  "$JOTO_RELEASE_ID" \
  "$JOTO_GIT_SHA" \
  "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  > /root/backups/jotoglobal/deployed-release.txt
```

预期：记录只包含发布 ID、准确 Git SHA 和 UTC 时间戳。

- [ ] **步骤 10：失败时回滚**

仅在验收失败时于 ECS 上运行：

```bash
JOTO_RELEASE_ID="$(cat /root/backups/jotoglobal/jotoglobal-release-id)"
PREVIOUS_FRONTEND="$(cat /root/backups/jotoglobal/previous-frontend.txt)"
ln -sfn "$PREVIOUS_FRONTEND" /var/www/jotoglobal/current
cp -a \
  "/root/backups/jotoglobal/jotoglobal-locations.before-$JOTO_RELEASE_ID.conf" \
  /etc/nginx/snippets/jotoglobal-locations.conf
nginx -t
systemctl reload nginx
```

预期：恢复之前的前端和代理行为。未经单独批准，不删除后台留言、站点配置
或百度属性。
