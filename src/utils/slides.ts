import { ALL_SLIDES } from "@/src/utils/constants";

export function getPrevSlide(currentSlide: string): string {
  if (!ALL_SLIDES.includes(currentSlide)) {
    throw new Error(
      `Attempted to get previous slide of a non-existent slide: ${currentSlide}`
    );
  }
  const nextIdx = Math.max(ALL_SLIDES.indexOf(currentSlide) - 1, 0);

  return ALL_SLIDES[nextIdx];
}

export function getNextSlide(currentSlide: string): string {
  if (!ALL_SLIDES.includes(currentSlide)) {
    throw new Error(
      `Attempted to get previous slide of a non-existent slide: ${currentSlide}`
    );
  }
  const nextIdx = Math.min(
    ALL_SLIDES.indexOf(currentSlide) + 1,
    ALL_SLIDES.length - 1
  );

  return ALL_SLIDES[nextIdx];
}
