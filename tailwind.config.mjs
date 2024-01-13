/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brand: "#8B1717",
      },
      animation: {
        "fade-in-up": "fade-in-up 0.3s ease-in forwards",
        "fade-in": "fade-in 0.3s ease-in forwards",
      },
      screens: {
        notouch: { raw: "(hover: hover)" },
        "2xl": "1440px",
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(5rem)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      fontFamily: {
        sans: ["Schibsted Grotesk", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "--tw-prose-links": theme("colors.brand"),
            fontFamily: theme("fontFamily.sans").join(","),
            color: theme("colors.gray.700"),
            maxWidth: "100%",
            width: "70ch",
            a: {
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              color: theme("colors.brand"),
              "&:hover": {
                textDecoration: "underline",
              },
            },
            "h1,h2,h3,h4": {
              fontFamily: theme("fontFamily.serif").join(","),
              fontWeight: "600",
            },
            h1: {
              fontSize: theme("fontSize.4xl"),
            },
            h2: {
              fontSize: theme("fontSize.4xl"),
              marginTop: theme("spacing.10"),
              marginBottom: theme("spacing.3"),
            },
            h3: {
              fontSize: theme("fontSize.2xl"),
            },
            strong: {
              fontWeight: "800",
            },
          },
        },
        lg: {
          css: {
            h1: {},
            h2: {
              fontSize: theme("fontSize.5xl"),
              marginTop: theme("spacing.10"),
              marginBottom: theme("spacing.3"),
            },
            h3: {
              marginTop: theme("spacing.6"),
              marginBottom: theme("spacing.3"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
