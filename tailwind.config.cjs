
/** @type {import('tailwindcss').Config} */
module.exports = {
	// 1. Apply the dark mode class setting:
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 2. Append the path for the Skeleton NPM package and files:
		require('path').join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	theme: {
		extend: {},
	},
	
	plugins: [
		// 3. Append the Skeleton plugin to the end of this list
		...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()
	],
		"colors": {
			"ivory": {
				50: "#FCFCFC",
				100: "#FCFCFC",
				200: "#F7F7F7",
				300: "#F5F5F5",
				400: "#F2F2F2",
				500: "#EEEEEE",
				600: "#D6D6D6",
				700: "#BDBDBD",
				800: "#9E9E9E",
				900: "#737373",
				950: "#545454"
			}
		}
}
