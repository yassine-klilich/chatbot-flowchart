/** @type {import('tailwindcss').Config} */

/** Border radius **/
const borderRadius = {
  "2xs": ".2rem",
  xs: ".4rem",
  s: ".6rem",
  m: ".8rem",
  l: "1rem",
  xl: "1.2rem",
  "2xl": "1.4rem",
  "3xl": "1.6rem",
  "4xl": "1.8rem",
  "5xl": "2rem",
};

/** Font size **/
const fontSize = {
  xs: "1rem",
  s: "1.2rem",
  m: "1.4rem",
  l: "1.6rem",
  xl: "1.8rem",
  "2xl": "2rem",
  "3xl": "2.2rem",
  "4xl": "2.4rem",
  "5xl": "2.6rem",
  "6xl": "2.8rem",
  "8xl": "3rem",
};

/** Spacing **/
const spacing = {
  0: "0rem",
  ".1": ".1rem",
  ".2": ".2rem",
  ".4": ".4rem",
  ".6": ".6rem",
  ".8": ".8rem",
  1: "1rem",
  1.2: "1.2rem",
  1.4: "1.4rem",
  1.6: "1.6rem",
  1.8: "1.8rem",
  2: "2rem",
  2.2: "2.2rem",
  2.4: "2.4rem",
  2.6: "2.6rem",
  2.8: "2.8rem",
  3: "3rem",
  3.2: "3.2rem",
  3.4: "3.4rem",
  3.6: "3.6rem",
  3.8: "3.8rem",
};

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    spacing,
    borderRadius,
    fontSize,
    extend: {},
  },
  plugins: [],
};
