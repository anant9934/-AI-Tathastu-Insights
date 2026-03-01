import type { Variants } from 'motion/react';

/**
 * Centralized Motion Tokens & Easing Curves for AI Tathastu Insights
 * Based on Phase 4 & Phase 5 specifications:
 * - Restrained ease-out: [0.22, 1, 0.36, 1]
 * - Button feedback: 150ms
 * - Hover & focus: 250ms
 * - Card transitions: 350ms
 * - Section reveal: 650ms
 * - Hero entrance: 850ms
 */

export const MOTION_DURATIONS = {
  buttonFeedback: 0.15, // 150ms
  hoverFocus: 0.25,      // 250ms
  cardTransition: 0.35,  // 350ms
  sectionReveal: 0.65,   // 650ms
  heroEntrance: 0.85,    // 850ms
} as const;

export const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;
export const GENTLE_EASE = [0.16, 1, 0.3, 1] as const;

export const motionTokens = {
  duration: MOTION_DURATIONS,
  ease: EDITORIAL_EASE,
};

// Variants for line-by-line or word reveal
export const heroHeadlineVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.heroEntrance,
      ease: EDITORIAL_EASE,
      delay: i * 0.12,
    },
  }),
};

export const heroImageVariants = {
  hidden: { scale: 1.04, opacity: 0.9 },
  visible: {
    scale: 1.0,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: EDITORIAL_EASE,
    },
  },
};

// Section / Element Reveal Variants
export const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.sectionReveal,
      ease: EDITORIAL_EASE,
    },
  },
};

export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: MOTION_DURATIONS.sectionReveal,
      ease: EDITORIAL_EASE,
    },
  },
};

// Stagger Container Variants
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.cardTransition,
      ease: EDITORIAL_EASE,
    },
  },
};

// Interactive Button variants
export const buttonTapTransition = {
  scale: 0.98,
  transition: {
    duration: MOTION_DURATIONS.buttonFeedback,
    ease: EDITORIAL_EASE,
  },
};

// Modal Variants
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: EDITORIAL_EASE },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: EDITORIAL_EASE },
  },
};

export const modalContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: EDITORIAL_EASE,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    transition: {
      duration: 0.2,
      ease: EDITORIAL_EASE,
    },
  },
};
