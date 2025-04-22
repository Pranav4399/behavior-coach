export const ANIMATION_DURATION = {
  // Base durations in milliseconds
  FAST: 150,
  DEFAULT: 300,
  SLOW: 500,
  
  // Specific use cases
  PAGE_TRANSITION: 300,
  LOADING_STATE: 300,
  MODAL_ANIMATION: 300,
  TOAST_ANIMATION: 300,
} as const;

export const TRANSITION_CLASSES = {
  FADE: 'transition-opacity duration-300',
  SCALE: 'transition-transform duration-300',
  SLIDE: 'transition-all duration-300',
} as const; 