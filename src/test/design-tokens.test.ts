import { describe, it, expect } from 'vitest';
import { MOTION_DURATIONS, EDITORIAL_EASE } from '../lib/motion';

describe('Phase 2 & Phase 4: Design & Motion Tokens Verification', () => {
  it('should strictly define the Phase 4 motion durations', () => {
    expect(MOTION_DURATIONS.buttonFeedback).toBe(0.15); // 150ms
    expect(MOTION_DURATIONS.hoverFocus).toBe(0.25);      // 250ms
    expect(MOTION_DURATIONS.cardTransition).toBe(0.35);  // 350ms
    expect(MOTION_DURATIONS.sectionReveal).toBe(0.65);   // 650ms
    expect(MOTION_DURATIONS.heroEntrance).toBe(0.85);    // 850ms
  });

  it('should adhere to the restrained editorial ease-out curve [0.22, 1, 0.36, 1]', () => {
    expect(EDITORIAL_EASE).toEqual([0.22, 1, 0.36, 1]);
  });
});
