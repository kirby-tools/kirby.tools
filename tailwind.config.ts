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
        "neon-carrot": {
          "50": "#fff7ed",
          "100": "#ffeed4",
          "200": "#ffd9a8",
          "300": "#ffbd71",
          "400": "#ff9d45",
          "500": "#fe7711",
          "600": "#ef5c07",
          "700": "#c64308",
          "800": "#9d360f",
          "900": "#7e2f10",
          "950": "#441406",
        },
      },
    },
  },
} satisfies Partial<Config>;
