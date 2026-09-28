/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 视觉表达卡 v1：清爽白 + 极淡层次 + 一种柔和强调蓝（参考 Apple 系统蓝）
        surface: '#FFFFFF',
        'surface-soft': '#FAFAFA',
        'surface-muted': '#F5F5F7',
        line: '#E5E5EA',
        'line-strong': '#D1D1D6',
        ink: '#1D1D1F',
        'ink-muted': '#6E6E73',
        'ink-faint': '#A1A1A6',
        brand: {
          DEFAULT: '#0071E3',
          hover: '#0077ED',
          pressed: '#006ADB',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'SF Pro Display',
          'Inter',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif',
        ],
        mono: [
          'SF Mono',
          'JetBrains Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.04)',
        'card-hover':
          '0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 113, 227, 0.06)',
        focus: '0 0 0 4px rgba(0, 113, 227, 0.15)',
      },
      borderRadius: {
        card: '12px',
        chip: '9999px',
      },
      fontVariantNumeric: {
        tabular: 'tabular-nums',
      },
    },
  },
  plugins: [],
};
