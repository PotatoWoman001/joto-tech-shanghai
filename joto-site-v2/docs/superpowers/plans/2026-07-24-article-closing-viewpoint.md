# Article Closing Viewpoint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the oversized serif article-ending quote with the approved compact, sans-serif JOTO viewpoint treatment across Chinese, English, and Persian blog articles.

**Architecture:** Keep the existing `quote` content block and change only its shared renderer in `BlogArticlePage.tsx`. Add one localized viewpoint label to `blogPageCopy`, pass it into the quote renderer, and use logical border/padding utilities so the green anchor follows LTR/RTL direction without language-specific layout branches.

**Tech Stack:** React 18, TypeScript, Tailwind CSS 3.4, Vitest, Testing Library, Vite

## Global Constraints

- Use the website's existing sans-serif font stack; do not use serif or italic text.
- Remove decorative quotation marks and the full-width top/bottom rules.
- Use a compact localized label, a short green logical-start border, near-white quote text, and a subtle dark-green atmosphere.
- Apply the shared structure to Chinese, English, and Persian.
- Persian must follow the existing RTL document direction.
- Do not modify Solution pages, Cisco, the homepage, article copy, related articles, or the footer.

---

### Task 1: Shared multilingual article closing viewpoint

**Files:**
- Modify: `joto-site-v2/src/content/blog.ts`
- Modify: `joto-site-v2/src/pages/BlogArticlePage.tsx`
- Test: `joto-site-v2/src/pages/BlogArticlePage.test.tsx`

**Interfaces:**
- Consumes: `BlogBodyBlock` with `{ type: "quote"; text: string }` and `blogPageCopy[locale]`.
- Produces: `BlogPageCopy.viewpointLabel: string` and `ArticleBodyBlock({ block, viewpointLabel })`.

- [ ] **Step 1: Write failing tests for the approved structure and all language labels**

Add tests that render `/zh/blog/enterprise-network-growth`, `/blog/enterprise-network-growth`, and `/fa/blog/enterprise-network-growth`. For the Chinese page, query `[data-article-closing-viewpoint]` and assert:

```tsx
expect(screen.getByText("JOTO 观点 · 文章结语")).toBeInTheDocument();
expect(closingQuote).toHaveClass("border-s-2", "font-sans", "not-italic");
expect(closingQuote).not.toHaveClass("border-y", "font-serif", "italic", "text-joto-green");
expect(closingQuote).toHaveTextContent(
  "当企业网络需要扩展时，最稳妥的做法不是不断叠加设备，而是先建立能够长期复用的架构标准。",
);
expect(closingQuote).not.toHaveTextContent("“");
expect(closingQuote).not.toHaveTextContent("”");
```

Also assert the English label `JOTO VIEWPOINT · CLOSING NOTE`, the Persian label `دیدگاه جوتو · جمع‌بندی`, and `document.documentElement.dir === "rtl"` for the Persian route.

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm test -- --run src/pages/BlogArticlePage.test.tsx
```

Expected: FAIL because `viewpointLabel`, `[data-article-closing-viewpoint]`, and the approved classes do not exist.

- [ ] **Step 3: Add the localized viewpoint label**

Extend `BlogPageCopy` in `src/content/blog.ts`:

```ts
export interface BlogPageCopy {
  // existing fields
  viewpointLabel: string;
}
```

Add these values:

```ts
en: { viewpointLabel: "JOTO VIEWPOINT · CLOSING NOTE" }
"zh-CN": { viewpointLabel: "JOTO 观点 · 文章结语" }
"fa-IR": { viewpointLabel: "دیدگاه جوتو · جمع‌بندی" }
```

Keep all existing article body text unchanged.

- [ ] **Step 4: Implement the shared viewpoint renderer**

Change the renderer signature:

```tsx
function ArticleBodyBlock({
  block,
  viewpointLabel,
}: {
  block: BlogBodyBlock;
  viewpointLabel: string;
})
```

Render quote blocks without decorative quote characters:

```tsx
if (block.type === "quote") {
  return (
    <aside
      className="relative my-10 overflow-hidden bg-[radial-gradient(circle_at_85%_10%,rgba(94,210,156,0.09),transparent_38%)] py-7 sm:my-12 sm:py-9"
      data-article-closing-viewpoint
    >
      <p className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-joto-green">
        <span aria-hidden="true" className="h-px w-8 bg-joto-green" />
        {viewpointLabel}
      </p>
      <blockquote className="max-w-3xl border-s-2 border-joto-green ps-5 font-sans text-[clamp(1.55rem,3vw,2.65rem)] font-medium not-italic leading-[1.18] tracking-[-0.035em] text-white/88 sm:ps-7">
        {block.text}
      </blockquote>
    </aside>
  );
}
```

Pass the localized label from the article map:

```tsx
<ArticleBodyBlock
  block={block}
  key={`${block.type}-${index}`}
  viewpointLabel={copy.viewpointLabel}
/>
```

- [ ] **Step 5: Run focused tests**

Run:

```bash
npm test -- --run src/pages/BlogArticlePage.test.tsx
```

Expected: all `BlogArticlePage` tests PASS.

- [ ] **Step 6: Run regression tests and production build**

Run:

```bash
npm test -- --run
npm run build
```

Expected: the complete Vitest suite passes; TypeScript and Vite production build complete successfully.

- [ ] **Step 7: Inspect representative routes in the browser**

Inspect:

```text
/zh/blog/enterprise-network-growth
/blog/enterprise-network-growth
/fa/blog/enterprise-network-growth
```

Check desktop and mobile widths. Expected: compact sans-serif ending, no oversized green text, no quotation marks or full-width double rules, no horizontal overflow, and the Persian border on the logical right.

- [ ] **Step 8: Commit implementation**

```bash
git add joto-site-v2/src/content/blog.ts \
  joto-site-v2/src/pages/BlogArticlePage.tsx \
  joto-site-v2/src/pages/BlogArticlePage.test.tsx
git commit -m "feat: refine article closing viewpoints"
```
