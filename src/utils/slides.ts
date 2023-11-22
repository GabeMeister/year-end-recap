import { ALL_SLIDES, SLIDE_PARTS } from "@/src/utils/constants";
import { SlidePart } from "@/src/types/slides";

function getAllSlideParts() {
  const final: SlidePart[] = [];

  ALL_SLIDES.forEach((slide) => {
    if (!!SLIDE_PARTS[slide]) {
      const parts = SLIDE_PARTS[slide];

      parts.forEach((part, i) => {
        final.push({
          id: `${slide}_${part}`,
          slide,
          part,
        });
      });
    } else {
      final.push({
        id: `${slide}_main`,
        slide,
        part: "main",
      });
    }
  });

  return final;
}

export const ALL_SLIDE_PARTS = getAllSlideParts();

export function getSlideAtIdx(idx: number): SlidePart | null {
  return ALL_SLIDE_PARTS[idx] ? ALL_SLIDE_PARTS[idx] : null;
}

export function getSlide(slide: string, part: string): SlidePart | undefined {
  return ALL_SLIDE_PARTS.find((slidePart) => {
    return slidePart.slide === slide && slidePart.part === part;
  });
}

export function getSlideIdx(slide: string, part: string): number {
  return ALL_SLIDE_PARTS.findIndex((slidePart) => {
    return slidePart.slide === slide && slidePart.part === part;
  });
}

export function getPrevSlide(
  currentSlide: string,
  currentPart: string
): SlidePart | null {
  const slideIdx = getSlideIdx(currentSlide, currentPart);
  if (slideIdx === -1) {
    throw new Error(
      `Attempted to get previous slide of a non-existent slide and part: ${currentSlide}, ${currentPart}`
    );
  }
  const prevIdx = Math.max(slideIdx - 1, 0);

  return getSlideAtIdx(prevIdx);
}

export function getNextSlide(
  currentSlide: string,
  currentPart: string
): SlidePart | null {
  const slideIdx = getSlideIdx(currentSlide, currentPart);
  if (slideIdx === -1) {
    throw new Error(
      `Attempted to get next slide of a non-existent slide and part: ${currentSlide}, ${currentPart}`
    );
  }

  const nextIdx = Math.min(slideIdx + 1, ALL_SLIDE_PARTS.length - 1);

  return getSlideAtIdx(nextIdx);
}

export function isFirstSlide(
  currentSlide: string,
  currentPart: string
): boolean {
  const slideIdx = getSlideIdx(currentSlide, currentPart);
  if (slideIdx === -1) {
    throw new Error(
      `Unable to find slide idx for: ${currentSlide}, ${currentPart}`
    );
  }

  return slideIdx === 0;
}

export function isLastSlide(
  currentSlide: string,
  currentPart: string
): boolean {
  const slideIdx = getSlideIdx(currentSlide, currentPart);
  if (slideIdx === -1) {
    throw new Error(
      `Unable to find slide idx for: ${currentSlide}, ${currentPart}`
    );
  }

  return ALL_SLIDE_PARTS.length - 1 === slideIdx;
}
