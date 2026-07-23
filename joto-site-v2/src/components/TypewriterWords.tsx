import { useEffect, useMemo, useState } from "react";

type TypewriterPhase = "typing" | "holding" | "deleting";

interface TypewriterWordsProps {
  words: string[];
  typingDelay?: number;
  deletingDelay?: number;
  holdDelay?: number;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

export default function TypewriterWords({
  words,
  typingDelay = 85,
  deletingDelay = 55,
  holdDelay = 1700,
}: TypewriterWordsProps) {
  const safeWords = useMemo(() => words.filter(Boolean), [words]);
  const longestWord = useMemo(
    () => safeWords.reduce((longest, word) => (word.length > longest.length ? word : longest), ""),
    [safeWords],
  );
  const prefersReducedMotion = usePrefersReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [phase, setPhase] = useState<TypewriterPhase>("typing");

  useEffect(() => {
    if (safeWords.length === 0) {
      setVisibleText("");
      return undefined;
    }

    if (prefersReducedMotion) {
      setWordIndex(0);
      setVisibleText(safeWords[0]);
      setPhase("holding");
      return undefined;
    }

    const currentWord = safeWords[wordIndex % safeWords.length];
    let delay = typingDelay;

    if (phase === "typing" && visibleText === currentWord) {
      delay = holdDelay;
    } else if (phase === "deleting") {
      delay = deletingDelay;
    }

    const timeout = window.setTimeout(() => {
      if (phase === "typing") {
        if (visibleText === currentWord) {
          setPhase("deleting");
        } else {
          setVisibleText(currentWord.slice(0, visibleText.length + 1));
        }
        return;
      }

      if (phase === "deleting") {
        if (visibleText.length > 0) {
          setVisibleText(visibleText.slice(0, -1));
        } else {
          setWordIndex((index) => (index + 1) % safeWords.length);
          setPhase("typing");
        }
      }
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [
    deletingDelay,
    holdDelay,
    phase,
    prefersReducedMotion,
    safeWords,
    typingDelay,
    visibleText,
    wordIndex,
  ]);

  if (safeWords.length === 0) {
    return null;
  }

  return (
    <span aria-hidden="true" className="inline-grid align-baseline">
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {longestWord}
      </span>
      <span className="col-start-1 row-start-1 whitespace-nowrap">
        {visibleText}
        {!prefersReducedMotion && <span className="hero-type-cursor" />}
      </span>
    </span>
  );
}
