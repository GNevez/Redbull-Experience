export const HERO_SCRUB_DURATION = 4;
export const BURST_TRIGGER = 0.62;

export const BURST = {
  impact: 0.3,
  swap: 0.5,
  logo: 1.05,
  lettering: 1.35,
  end: 3.2,
} as const;

export const FALL_DURATION = 4;
export const FALL = {
  drop: 0,
  park: 0.3,
  text: 2.6,
} as const;

export const ROLL_DURATION = 4;
export const ROLL = {
  travel: 0.4,
  settle: 3.15,
  reveal: 0.75,
  revealStagger: 0.16,
  revealDuration: 1.3,
} as const;

export const HERO_CLONE_INDEX = 1;

export const RADICAL_DURATION = 5;
export const RADICAL = {
  sweep: 0.2,
  sweepDuration: 1.3,
  content: 2.1,
} as const;

export const LIQUID_DURATION = 5;
export const LIQUID = {
  flood: 0,
  floodDuration: 1.5,
  headline: 1.9,
  cards: 2.3,
} as const;

export const FINALE_DURATION = 5;
export const FINALE = {
  exit: 0.05,
  rise: 0.5,
  headline: 1.7,
  socials: 2.4,
  credits: 3.1,
} as const;

export const LEGENDS_DURATION = 7;
export const LEGENDS = {
  bars: 0.05,
  word: 0.1,
  bgReveal: 0.22,
  flash: 0.52,
  chapters: [0.95, 2.45, 3.95, 5.45],
  chapterDur: 1.5,
} as const;
