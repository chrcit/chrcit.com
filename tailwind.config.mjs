/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Monterrat", "sans-serif"],
				serif: ["Playfair Display", "serif"],
			},
			typography: (theme) => ({

				DEFAULT: {
					css: {
						fontFamily: theme('fontFamily.sans').join(','),
						color: theme('colors.gray.700'),
						maxWidth: '70ch',
						a: {
							color: theme('colors.gray.900'),
							'&:hover': {
								color: theme('colors.gray.700'),
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
					},
				},

			}),
		},
	},
	plugins: [require('@tailwindcss/typography')],
}
