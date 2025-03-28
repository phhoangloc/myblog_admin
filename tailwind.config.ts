import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['__Noto_Serif_9736f3', '__Noto_Serif_Fallback_9736f3'],
      },
      backgroundSize: {
        'auto-64': 'auto 16rem',
        'auto-96': 'auto 24rem',
      },
      colors: {
        lv: {
          0: "#ffffff",
          1: "#ecf2f9",
          2: "#d9e6f2",
          4: "#b3cce6",
          8: "#6699cc",
          11: "#4080bf",
          13: "#336699",
          17: "#19334d",
          18: "#132639",
          19: "#0d1a26",
          20: "#070d13",
          21: "#000000",
        },
      },
      width: {
        'full-12': 'calc(100% - 3rem)',
        'full-24': 'calc(100% - 6rem)',
        'full-sx': 'calc(100% - 375px)',
      },
      height: {
        'screen-4': 'calc(100vh - 1rem)',
        'full-12': 'calc(100% - 3rem)',
        'full-16': 'calc(100% - 4rem)',
        'full-20': 'calc(100% - 5rem)',
        'full-64': 'calc(100% - 16rem)',
        'screen-32': 'calc(100vh - 8rem)',
      },
      screens: {
        xs: '375px',
        sm: '575px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        xxl: '1600px',
      },
    },
  },
  plugins: [],
} satisfies Config;
