/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		spacing: {
  			page: 'var(--app-pad-x)',
  			'header-pt': 'var(--app-header-pt)',
  			'header-pb': 'var(--app-header-pb)',
  			'block-gap': 'var(--app-block-gap)',
  			card: 'var(--app-card-pad)',
  			modal: 'var(--app-modal-pad)',
  			'bottom-scroll': 'var(--app-scroll-bottom)',
  			'nav-y': 'var(--app-nav-pad-y)',
  		},
  		width: {
  			ring: 'var(--app-ring-size)',
  			'buddy-card': 'var(--app-buddy-card)',
  		},
  		height: {
  			ring: 'var(--app-ring-size)',
  			chart: 'var(--app-chart-h)',
  		},
  		minWidth: {
  			'buddy-add': 'min(7.5rem, 28vw)',
  		},
  		maxWidth: {
  			content: 'var(--app-content-max)',
  		},
  		fontSize: {
  			countdown: [
  				'clamp(2.5rem, min(12.5vw, 11vmin), 5rem)',
  				{ lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '900' },
  			],
  			'stat-value': [
  				'clamp(1.15rem, 4.5vw, 1.5rem)',
  				{ lineHeight: '1.2', fontWeight: '700' },
  			],
  			'ring-pct': [
  				'clamp(2rem, min(12vw, 10vmin), 3.5rem)',
  				{ lineHeight: '1.05', fontWeight: '700' },
  			],
  			'score-hero': [
  				'clamp(2rem, 9vw, 3.75rem)',
  				{ lineHeight: '1', fontWeight: '900' },
  			],
  		},
  		fontFamily: {
  			inter: ['var(--font-inter)'],
  			mono: ['var(--font-mono)'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}