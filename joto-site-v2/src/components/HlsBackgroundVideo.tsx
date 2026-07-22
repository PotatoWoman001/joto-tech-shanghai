import { useEffect, useRef } from "react";
import Hls from "hls.js";

export const HERO_VIDEO_URL =
  "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";

interface HlsBackgroundVideoProps {
  className?: string;
  source?: string;
}

export default function HlsBackgroundVideo({
  className = "",
  source = HERO_VIDEO_URL,
}: HlsBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      video.load();

      return () => {
        video.pause();
        video.removeAttribute("src");
        video.load();
      };
    }

    if (!Hls.isSupported()) return;

    const hls = new Hls({ enableWorker: false });
    hls.loadSource(source);
    hls.attachMedia(video);

    return () => {
      hls.destroy();
    };
  }, [source]);

  return (
    <video
      ref={videoRef}
      aria-hidden="true"
      autoPlay
      className={className}
      data-testid="hero-background-video"
      loop
      muted
      playsInline
      preload="metadata"
      tabIndex={-1}
    />
  );
}
