import type { Config } from "tailwindcss";
// import defaultTheme from "tailwindcss/defaultTheme";

export default {
  theme: {
    extend: {
      colors: {
        tumbleweed: {
          "50": "#faf5f2",
          "100": "#f4e8e0",
          "200": "#e7cfc1",
          "300": "#d3a68c",
          "400": "#c78a70",
          "500": "#bc6f53",
          "600": "#ae5c48",
          "700": "#914a3d",
          "800": "#753d37",
          "900": "#5f342f",
          "950": "#331917",
        },
        rhino: {
          "50": "#f3f7fb",
          "100": "#e3edf6",
          "200": "#cee1f0",
          "300": "#abcde5",
          "400": "#83b3d7",
          "500": "#6697cb",
          "600": "#5380bd",
          "700": "#486dad",
          "800": "#3f5b8e",
          "900": "#304363",
          "950": "#253146",
        },
      },
      fontFamily: {
        // display: ["Rubik Doodle Shadow", ...defaultTheme.fontFamily.serif],
      },
    },
  },
} satisfies Partial<Config>;
