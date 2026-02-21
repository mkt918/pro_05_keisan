/**
 * IT基礎学習 - Tailwind CSS 共通設定
 * 全ページからこのファイルを読み込むことで設定を一元管理する
 */
tailwind.config = {
    theme: {
        extend: {
            colors: {
                slate: {
                    50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0',
                    300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B',
                    600: '#475569', 800: '#1E293B', 900: '#0F172A', 950: '#020617'
                },
                teal: {
                    50: '#F0FDFA', 100: '#CCFBF1', 200: '#99F6E4',
                    400: '#2DD4BF', 500: '#14B8A6', 600: '#0D9488'
                },
                orange: {
                    50: '#FFF7ED', 200: '#FED7AA',
                    400: '#FB923C', 500: '#F97316', 600: '#EA580C'
                },
                indigo: {
                    50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE',
                    400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA'
                },
                amber: { 50: '#FFFBEB', 100: '#FEF3C7', 600: '#D97706' },
                sky: { 400: '#38BDF8', 600: '#0284C7' },
                green: { 50: '#F0FDF4', 500: '#22C55E', 600: '#16A34A' },
                red: { 50: '#FFF1F2', 100: '#FFE4E6', 400: '#F87171', 500: '#EF4444' },
            },
            fontFamily: {
                sans: ['"Noto Sans JP"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace']
            },
        }
    }
};
