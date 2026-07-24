import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";
import { I18nProvider } from "../i18n/I18nProvider";

function renderAboutPage() {
  window.history.replaceState({}, "", "/about");
  return render(
    <I18nProvider>
      <App />
    </I18nProvider>,
  );
}

describe("AboutPage", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("places the reference statistics beside the Who we are copy in compact cards", () => {
    const { container } = renderAboutPage();
    const layout = container.querySelector("[data-about-who-we-are-layout]");
    const stats = container.querySelector("[data-about-page-stats]");
    const cards = container.querySelectorAll("[data-about-page-stat-card]");

    expect(layout).toHaveClass("lg:grid-cols-[1.4fr_1fr]");
    expect(stats).toHaveClass("sm:grid-cols-2", "lg:grid-cols-1");
    expect(cards).toHaveLength(4);

    expect(screen.getByText("2010")).toBeInTheDocument();
    expect(screen.getByText("Founded in Shanghai")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Cities worldwide")).toBeInTheDocument();
    expect(screen.getByText("Fortune 500")).toBeInTheDocument();
    expect(screen.getByText("Clients served for a decade+")).toBeInTheDocument();
    expect(screen.getByText("24×7")).toBeInTheDocument();
    expect(screen.getByText("Support & maintenance")).toBeInTheDocument();

    for (const card of cards) {
      expect(card).toHaveClass(
        "min-h-[8.75rem]",
        "rounded-[1.75rem]",
        "border-white/15",
        "bg-[#090e0c]",
      );
      expect(card.querySelector("[data-about-page-stat-value]")).toHaveClass(
        "text-[#5ed29c]",
      );
    }
  });
});
