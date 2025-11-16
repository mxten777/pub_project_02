/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'display': ['Inter Display', 'Pretendard', 'sans-serif'],
      },
      fontSize: {
        // 시니어 친화적 사이즈 (기존 호환성 유지)
        'senior-xs': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
        'senior-sm': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
        'senior-base': ['28px', { lineHeight: '36px', letterSpacing: '-0.01em' }],
        'senior-lg': ['34px', { lineHeight: '42px', letterSpacing: '-0.02em' }],
        'senior-xl': ['42px', { lineHeight: '50px', letterSpacing: '-0.02em' }],
        'senior-2xl': ['52px', { lineHeight: '60px', letterSpacing: '-0.025em' }],
        'senior-3xl': ['64px', { lineHeight: '72px', letterSpacing: '-0.025em' }],
        // 프리미엄 타이포그래피
        'display-sm': ['48px', { lineHeight: '56px', letterSpacing: '-0.025em' }],
        'display-md': ['60px', { lineHeight: '68px', letterSpacing: '-0.03em' }],
        'display-lg': ['72px', { lineHeight: '80px', letterSpacing: '-0.03em' }],
      },
      colors: {
        // 프리미엄 색상 팔레트
        primary: {
          25: '#F8FAFC',
          50: '#EFF6FF',
          100: '#DBEAFE', 
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554'
        },
        secondary: {
          25: '#F7FEF7',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22'
        },
        accent: {
          25: '#FFFCF5',
          50: '#FEF7E0',
          100: '#FEECB3',
          200: '#FED680',
          300: '#FC9F28',
          400: '#F97316',
          500: '#EA580C',
          600: '#DC2626',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12'
        },
        neutral: {
          25: '#FCFCFD',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617'
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D'
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309'
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C'
        }
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem', 
        '30': '7.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
        '144': '36rem'
      },
      borderRadius: {
        'senior': '20px',
        'senior-sm': '16px',
        'senior-lg': '24px',
        'premium': '20px',
        'premium-lg': '32px'
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'premium': '0 4px 12px -2px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'premium-lg': '0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 4px 8px -4px rgba(0, 0, 0, 0.03)',
        'premium-xl': '0 20px 40px -8px rgba(0, 0, 0, 0.12), 0 8px 16px -8px rgba(0, 0, 0, 0.04)',
        'senior': '0 8px 32px -4px rgba(0, 0, 0, 0.12)',
        'senior-lg': '0 16px 48px -8px rgba(0, 0, 0, 0.15)',
        'senior-xl': '0 24px 64px -12px rgba(0, 0, 0, 0.18)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-lg': '0 0 32px rgba(59, 130, 246, 0.2)'
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-gentle': 'bounceGentle 3s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-8px)' },
          '60%': { transform: 'translateY(-4px)' }
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

