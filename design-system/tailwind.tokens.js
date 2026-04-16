/**
 * Portal Realfact — Tailwind CSS Token Config
 * ============================================
 * Source: REALFACT CI Guideline v1.0
 * Usage: Import into tailwind.config.js → theme.extend
 *
 * Example:
 *   const rfTokens = require('./design-system/tailwind.tokens');
 *   module.exports = { theme: { extend: rfTokens } };
 */

module.exports = {
  colors: {
    // Brand
    primary: {
      DEFAULT: '#F05A28',
      light: '#FF7A4D',
      dark: '#D14A1E',
      hover: '#E04E1F',
      active: '#C44419',
      subtle: '#FFF0EB',
      muted: '#FDDDD2',
    },
    secondary: {
      DEFAULT: '#231F20',
      light: '#3A3536',
      hover: '#1A1718',
    },

    // Semantic
    success: {
      DEFAULT: '#28C76F',
      light: '#DFF7E9',
      dark: '#1F9D57',
      subtle: '#E8F8EE',
    },
    danger: {
      DEFAULT: '#EA5455',
      light: '#FDE4E4',
      dark: '#D63031',
      subtle: '#FDECEC',
    },
    warning: {
      DEFAULT: '#FF9F43',
      light: '#FFF0E1',
      dark: '#E08A30',
      subtle: '#FFF4E6',
    },
    info: {
      DEFAULT: '#00CFE8',
      light: '#D6F5FA',
      dark: '#00A8C5',
      subtle: '#E0F7FA',
    },

    // Neutral (override Tailwind defaults)
    gray: {
      50: '#FAFAFA',
      100: '#F8F9FA',
      200: '#E9ECEF',
      300: '#DEE2E6',
      400: '#CED4DA',
      500: '#ADB5BD',
      600: '#6C757D',
      700: '#495057',
      800: '#343A40',
      900: '#212529',
    },

    // Approval Status
    status: {
      pending: '#FF9F43',
      approved: '#28C76F',
      rejected: '#EA5455',
      draft: '#ADB5BD',
      review: '#00CFE8',
      escalated: '#7367F0',
      cancelled: '#82868B',
    },

    // Approval Roles
    role: {
      m3: '#6366F1',
      e1: '#8B5CF6',
      e2: '#A855F7',
      e3: '#D946EF',
      ceo: '#F05A28',
      accounting: '#0EA5E9',
      cfo: '#14B8A6',
      procurement: '#F59E0B',
    },

    // Departments
    dept: {
      hr: '#EC4899',
      procurement: '#F59E0B',
      operation: '#10B981',
      accounting: '#0EA5E9',
      it: '#6366F1',
      legal: '#8B5CF6',
      marketing: '#F43F5E',
      finance: '#14B8A6',
    },
  },

  fontFamily: {
    en: ["'IBM Plex Sans Thai'", 'sans-serif'],
    th: ["'IBM Plex Sans Thai'", 'sans-serif'],
    mono: ["'JetBrains Mono'", "'Fira Code'", "'SF Mono'", 'monospace'],
  },

  fontSize: {
    'display': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
    'h1': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
    'h2': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
    'h3': ['22px', { lineHeight: '1.3', fontWeight: '600' }],
    'h4': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
    'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
    'body-sm': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
    'caption': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
    'xs': ['11px', { lineHeight: '1.4', fontWeight: '500' }],
  },

  borderRadius: {
    'sm': '4px',
    'md': '8px',
    'lg': '12px',
    'xl': '16px',
    '2xl': '20px',
  },

  boxShadow: {
    'xs': '0 1px 2px rgba(35,31,32,0.05)',
    'sm': '0 1px 3px rgba(35,31,32,0.08), 0 1px 2px rgba(35,31,32,0.04)',
    'md': '0 4px 6px rgba(35,31,32,0.07), 0 2px 4px rgba(35,31,32,0.04)',
    'lg': '0 10px 15px rgba(35,31,32,0.07), 0 4px 6px rgba(35,31,32,0.04)',
    'xl': '0 20px 25px rgba(35,31,32,0.08), 0 8px 10px rgba(35,31,32,0.03)',
    'focus': '0 0 0 3px rgba(240,90,40,0.3)',
    'focus-danger': '0 0 0 3px rgba(234,84,85,0.3)',
  },

  transitionDuration: {
    'fast': '100ms',
    'normal': '200ms',
    'slow': '300ms',
  },

  transitionTimingFunction: {
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  zIndex: {
    'dropdown': '100',
    'sticky': '200',
    'sidebar': '300',
    'overlay': '400',
    'modal': '500',
    'popover': '600',
    'tooltip': '700',
    'toast': '800',
    'max': '999',
  },

  screens: {
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  },
};
