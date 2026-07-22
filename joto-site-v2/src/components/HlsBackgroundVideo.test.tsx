import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HlsBackgroundVideo, { HERO_VIDEO_URL } from "./HlsBackgroundVideo";

const hlsMock = vi.hoisted(() => ({
  attachMedia: vi.fn(),
  constructor: vi.fn(),
  destroy: vi.fn(),
  isSupported: vi.fn(),
  loadSource: vi.fn(),
}));

vi.mock("hls.js", () => ({
  default: class HlsMock {
    static isSupported = hlsMock.isSupported;

    constructor(config: unknown) {
      hlsMock.constructor(config);
    }

    attachMedia(media: HTMLMediaElement) {
      hlsMock.attachMedia(media);
    }

    destroy() {
      hlsMock.destroy();
    }

    loadSource(source: string) {
      hlsMock.loadSource(source);
    }
  },
}));

describe("HlsBackgroundVideo", () => {
  beforeEach(() => {
    hlsMock.isSupported.mockReturnValue(true);
    vi.spyOn(HTMLMediaElement.prototype, "canPlayType").mockReturnValue("");
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("uses hls.js with workers disabled and destroys the instance on cleanup", () => {
    const { getByTestId, unmount } = render(<HlsBackgroundVideo />);
    const video = getByTestId("hero-background-video");

    expect(hlsMock.constructor).toHaveBeenCalledWith({ enableWorker: false });
    expect(hlsMock.loadSource).toHaveBeenCalledWith(HERO_VIDEO_URL);
    expect(hlsMock.attachMedia).toHaveBeenCalledWith(video);

    unmount();
    expect(hlsMock.destroy).toHaveBeenCalledOnce();
  });

  it("uses native HLS playback when the browser supports it", () => {
    vi.mocked(HTMLMediaElement.prototype.canPlayType).mockReturnValue("maybe");
    const { getByTestId, unmount } = render(<HlsBackgroundVideo />);
    const video = getByTestId("hero-background-video") as HTMLVideoElement;

    expect(video.src).toContain(HERO_VIDEO_URL);
    expect(hlsMock.constructor).not.toHaveBeenCalled();

    unmount();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it("keeps the static background when reduced motion is requested", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    render(<HlsBackgroundVideo />);

    expect(hlsMock.constructor).not.toHaveBeenCalled();
    expect(hlsMock.loadSource).not.toHaveBeenCalled();
  });
});
