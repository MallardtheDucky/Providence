        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        mono: ['Space Grotesk', 'monospace'],
                    },
                    colors: {
                        providence: {
                            50: '#f8fafc',
                            100: '#f1f5f9',
                            200: '#e2e8f0',
                            300: '#cbd5e1',
                            400: '#94a3b8',
                            500: '#64748b',
                            600: '#475569',
                            700: '#334155',
                            800: '#1e293b',
                            900: '#0f172a',
                            950: '#020617',
                            accent: '#ffffff',
                            subtle: '#888888'
                        }
                    },
                    backgroundImage: {
                        'grid-pattern': "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                        'desert-spire': "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,1)), url('https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2076&auto=format&fit=crop')",
                        'lab-clean': "linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.4)), url('https://commons.wikimedia.org/wiki/Special:FilePath/Researchers%20in%20laboratory.jpg?width=2400')",
                        'continuity-spire': "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.35)), url('https://images.unsplash.com/photo-1685233503234-0c56fd142ac7?fm=jpg&q=80&w=2400&auto=format&fit=crop')",
                        'community-hero': "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.35)), url('https://commons.wikimedia.org/wiki/Special:FilePath/Brooklyn%20View%20from%20Prospect%20Park.JPG?width=2400')",
                    },
                    animation: {
                        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'float': 'float 6s ease-in-out infinite',
                        'marquee': 'marquee 25s linear infinite',
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-10px)' },
                        },
                        marquee: {
                            '0%': { transform: 'translateX(0%)' },
                            '100%': { transform: 'translateX(-100%)' },
                        }
                    }
                }
            }
        }
