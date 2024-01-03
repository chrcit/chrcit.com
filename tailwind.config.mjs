/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				brand: "#8B1717"
			},
			animation: {
				'fade-in-up': 'fade-in-up 0.3s ease-in forwards',
				'fade-in': 'fade-in 0.3s ease-in forwards',
			},
			keyframes: {
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(5rem)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
				},
				'fade-in': {
					'0%': {
						opacity: '0',
					},
					'100%': {
						opacity: '1',
					},
				},
			},
			fontFamily: {
				sans: ["Monterrat", "sans-serif"],
				serif: ["Playfair Display", "serif"],
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						'--tw-prose-links': theme('colors.brand'),
						fontFamily: theme('fontFamily.sans').join(','),
						color: theme('colors.gray.700'),
						maxWidth: '100%',
						width: '70ch',
						"a": {
							color: theme('colors.brand'),
							'&:hover': {
								textDecoration: 'underline',
							},

						},
						"h1,h2,h3,h4": {
							fontFamily: theme('fontFamily.serif').join(','),
							fontWeight: '600',
						},
						"h1": {
							fontSize: theme('fontSize.4xl'),
						},
						"h2": {
							fontSize: theme('fontSize.3xl'),
						},
						"h3": {
							fontSize: theme('fontSize.2xl'),
						},
						"strong": {
							color: theme('colors.brand'),
							fontWeight: '600',
						}
					},
				},

			}),
		},
	},
	plugins: [require('@tailwindcss/typography')],
}
