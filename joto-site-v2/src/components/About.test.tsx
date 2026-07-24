import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { I18nProvider } from "../i18n/I18nProvider";
import About from "./About";

function renderAbout(pathname: string) {
  window.history.replaceState({}, "", pathname);

  return render(
    <I18nProvider>
      <About />
    </I18nProvider>,
  );
}

describe("About homepage section", () => {
  afterEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, "", "/");
  });

  it("uses smaller metric values on the Chinese homepage", () => {
    const { container } = renderAbout("/zh/");
    const values = container.querySelectorAll("[data-about-stat-value]");

    expect(values).toHaveLength(4);
    values.forEach((value) => {
      expect(value).toHaveClass("text-[clamp(2.1rem,3.25vw,3.25rem)]");
    });
  });

  it("keeps the existing English metric scale", () => {
    renderAbout("/");

    expect(screen.getByText("2010")).toHaveClass(
      "text-[clamp(2.8rem,4.8vw,4.5rem)]",
    );
    expect(screen.getByText("MULTI-VENDOR")).toHaveClass(
      "text-[clamp(1.6rem,3vw,3.15rem)]",
    );
  });
});
