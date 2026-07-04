// ─── Shared easing curves ─────────────────────────────────────────────────────
export const ease        = [0.25, 1, 0.5, 1];   // ease-out-quart  — primary
export const easeIn      = [0.4,  0, 1,   1];   // ease-in         — exits
export const easeInOut   = [0.4,  0, 0.2, 1];   // balanced        — balanced transitions

// ─── Duration constants (seconds) ────────────────────────────────────────────
const T_FAST = 0.18;   // 180ms — micro-interactions, tooltips, button press
const T_CARD = 0.25;   // 250ms — cards, sections, dropdowns
const T_PAGE = 0.32;   // 320ms — page content transitions

// ─── Reveal variants ──────────────────────────────────────────────────────────
export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: T_CARD, ease } },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -12 },
  show:   { opacity: 1, y: 0,  transition: { duration: T_CARD, ease } },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -16 },
  show:   { opacity: 1, x: 0,  transition: { duration: T_CARD, ease } },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 16 },
  show:   { opacity: 1, x: 0,  transition: { duration: T_CARD, ease } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show:   { opacity: 1, scale: 1,    transition: { duration: T_FAST, ease } },
  exit:   { opacity: 0, scale: 0.96, transition: { duration: T_FAST, ease: easeIn } },
};

export const skeletonReveal = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: T_CARD, ease } },
};

// ─── Stagger ──────────────────────────────────────────────────────────────────
export const staggerContainer = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0,  transition: { duration: T_CARD, ease } },
};

export const listAnimation = staggerItem;

export const sidebarNavContainer = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.04, delayChildren: 0.06 } },
};

export const sidebarNavItem = {
  hidden: { opacity: 0, x: -10 },
  show:   { opacity: 1, x: 0,   transition: { duration: T_CARD, ease } },
};

// ─── Page & route transitions ─────────────────────────────────────────────────
export const pageTransition = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0,  transition: { duration: T_PAGE, ease } },
  exit:   { opacity: 0,        transition: { duration: 0.12, ease: easeIn } },
};

export const backdropTransition = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: T_FAST } },
  exit:   { opacity: 0, transition: { duration: T_FAST } },
};

// ─── Overlays ─────────────────────────────────────────────────────────────────
export const modalTransition = {
  hidden: { opacity: 0, scale: 0.97, y: 10 },
  show:   { opacity: 1, scale: 1,    y: 0,  transition: { duration: T_FAST, ease } },
  exit:   { opacity: 0, scale: 0.97, y: 6,  transition: { duration: 0.14,   ease: easeIn } },
};

export const drawerTransition = {
  hidden: { opacity: 0, x: -16 },
  show:   { opacity: 1, x: 0,    transition: { duration: T_CARD, ease } },
  exit:   { opacity: 0, x: -12,  transition: { duration: T_FAST, ease: easeIn } },
};

export const dropdownTransition = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  show:   { opacity: 1, y: 0,  scale: 1,    transition: { duration: T_FAST, ease } },
  exit:   { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12,   ease: easeIn } },
};

export const tooltipTransition = {
  hidden: { opacity: 0, scale: 0.93 },
  show:   { opacity: 1, scale: 1,     transition: { duration: 0.13, ease } },
  exit:   { opacity: 0, scale: 0.93,  transition: { duration: 0.1,  ease: easeIn } },
};

export const toastTransition = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1,    transition: { duration: T_FAST, ease } },
  exit:   { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.15,   ease: easeIn } },
};

// ─── Interactive states ───────────────────────────────────────────────────────
export const cardHover    = { y: -4,   transition: { duration: 0.2,  ease } };
export const buttonPress  = { scale: 0.97, transition: { duration: 0.12 } };

export const tabAnimation = {
  hidden: { opacity: 0, x: 8 },
  show:   { opacity: 1, x: 0, transition: { duration: T_FAST, ease } },
};

// ─── Spring modal — physical, natural feel ────────────────────────────────────
export const springModal = {
  hidden: { opacity: 0, scale: 0.95, y: 14 },
  show: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 380, damping: 28, mass: 0.8 },
  },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15, ease: easeIn } },
};

// ─── Table row ────────────────────────────────────────────────────────────────
export const tableRow = {
  hidden: { opacity: 0, x: -8 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.22, ease } },
};

// ─── Section reveal — for landing content blocks ──────────────────────────────
export const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

// ─── Tight stagger — smaller groups, faster cadence ──────────────────────────
export const staggerFast = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
};
