import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          100: "#08b1f8",
          200: "#acd8e6",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          100: "#080572",
          200: "#08057250",
          300: "#c6bcfd",
        },
        lemon: { 100: "#d6f205", 200: "#d6f20560" },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(8, 177, 248, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(8, 177, 248, 0.6)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "text-shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        "wobble": {
          "0%": { transform: "rotate(0deg)" },
          "15%": { transform: "rotate(-5deg)" },
          "30%": { transform: "rotate(3deg)" },
          "45%": { transform: "rotate(-3deg)" },
          "60%": { transform: "rotate(2deg)" },
          "75%": { transform: "rotate(-1deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "liquid-float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "25%": { transform: "translateY(-5px) rotate(1deg)" },
          "50%": { transform: "translateY(-10px) rotate(0deg)" },
          "75%": { transform: "translateY(-5px) rotate(-1deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-in-left": "slide-in-left 0.6s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "text-shimmer": "text-shimmer 2s ease-in-out infinite",
        "wobble": "wobble 1s ease-in-out",
        "liquid-float": "liquid-float 4s ease-in-out infinite",
      },
      spacing: {
        "72": "18rem",
        "84": "21rem",
        "96": "24rem",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 4px 12px rgba(0, 0, 0, 0.1)",
        "3d": "0 10px 30px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)",
        "3d-hover": "0 20px 60px rgba(0, 0, 0, 0.2), 0 8px 12px rgba(0, 0, 0, 0.15)",
        "glass": "0 8px 32px rgba(8, 177, 248, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        "glass-dark": "0 8px 32px rgba(8, 5, 114, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        "neon-primary": "0 0 20px rgba(8, 177, 248, 0.5), 0 0 40px rgba(8, 177, 248, 0.3), 0 0 60px rgba(8, 177, 248, 0.1)",
        "neon-secondary": "0 0 20px rgba(8, 5, 114, 0.5), 0 0 40px rgba(8, 5, 114, 0.3), 0 0 60px rgba(8, 5, 114, 0.1)",
        "neon-lemon": "0 0 20px rgba(214, 242, 5, 0.5), 0 0 40px rgba(214, 242, 5, 0.3), 0 0 60px rgba(214, 242, 5, 0.1)",
        "liquid": "0 20px 40px rgba(8, 177, 248, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "liquid-gradient": "linear-gradient(135deg, rgba(8, 177, 248, 0.1) 0%, rgba(8, 5, 114, 0.05) 50%, rgba(214, 242, 5, 0.1) 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
        "shimmer-gradient": "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
        "text-shimmer": "linear-gradient(90deg, #08b1f8, #d6f205, #080572, #08b1f8)",
      },
      backdropBlur: {
        xs: "2px",
        "4xl": "72px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
