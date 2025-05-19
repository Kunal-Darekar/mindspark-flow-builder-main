import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        'neon': '0 0 10px rgba(155, 135, 245, 0.6), 0 0 20px rgba(155, 135, 245, 0.3)',
        'neon-lg': '0 0 15px rgba(155, 135, 245, 0.8), 0 0 30px rgba(155, 135, 245, 0.5)',
        'neon-blue': '0 0 10px rgba(99, 102, 241, 0.6), 0 0 20px rgba(99, 102, 241, 0.3)',
        'neon-pink': '0 0 10px rgba(244, 114, 182, 0.6), 0 0 20px rgba(244, 114, 182, 0.3)',
        'neon-hover': '0 0 30px rgba(124, 58, 237, 0.8)',
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 1px, transparent 1px)',
        'grid-light': 'linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px)',
        'grid-dark': 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fadeIn": "fadeIn 0.3s ease-out",
        "nodeExpand": "nodeExpand 0.3s ease-out",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-slow": "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-down": "slide-down 0.4s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "zoom-in": "zoom-in 0.3s ease-out",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "grid-flow": "grid-flow 20s linear infinite",
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'appear': 'appear 0.5s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'circle-draw': 'circle-draw 3s ease-in-out infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
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
        "fadeIn": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "nodeExpand": {
          "0%": { transform: "scaleY(0)", opacity: "0" },
          "100%": { transform: "scaleY(1)", opacity: "1" }
        },
        "pulse": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" }
        },
        "slide-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "zoom-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "float": {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0px)" }
        },
        "glow": {
          "0%": { boxShadow: "0 0 5px rgba(155, 135, 245, 0.4), 0 0 10px rgba(155, 135, 245, 0.2)" },
          "100%": { boxShadow: "0 0 15px rgba(155, 135, 245, 0.7), 0 0 30px rgba(155, 135, 245, 0.4)" }
        },
        "grid-flow": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(40px)" }
        },
        "float-animation": {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        appear: {
          from: { 
            opacity: '0',
            transform: 'scale(0.9) translateY(10px)'
          },
          to: { 
            opacity: '1',
            transform: 'scale(1) translateY(0)'
          },
        },
        'pulse-glow': { 
          '0%': { 
            transform: 'scale(1)',
            boxShadow: '0 0 10px rgba(155, 135, 245, 0.5), 0 0 20px rgba(155, 135, 245, 0.3)'
          },
          '50%': { 
            transform: 'scale(1.03)',
            boxShadow: '0 0 15px rgba(155, 135, 245, 0.8), 0 0 30px rgba(155, 135, 245, 0.5)'
          },
          '100%': { 
            transform: 'scale(1)',
            boxShadow: '0 0 10px rgba(155, 135, 245, 0.5), 0 0 20px rgba(155, 135, 245, 0.3)'
          }
        },
        'circle-draw': {
          '0%': { 
            strokeDashoffset: '283'
          },
          '50%': { 
            strokeDashoffset: '0'
          },
          '100%': { 
            strokeDashoffset: '283'
          }
        },
      },
      transitionTimingFunction: {
        'bounce-in-out': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
