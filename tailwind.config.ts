import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
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
        cameo: {
          "50": "#fbf7f1",
          "100": "#f5ebdf",
          "200": "#e9d4bf",
          "300": "#d8b08d",
          "400": "#cc936b",
          "500": "#c1784e",
          "600": "#b36443",
          "700": "#955039",
          "800": "#784234",
          "900": "#62382c",
          "950": "#341b16",
        },
      },
    },
  },
} satisfies Partial<Config>;
