import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import nodeResolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: 'src/renderer/index.js',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'app',
			file: 'build/renderer.js'
		},
		plugins: [

			svelte({
				compilerOptions: {
					dev: !production
				}
			}),
			css({ output: 'renderer.css' }),

			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),

			production && terser()
		],
		watch: {
			clearScreen: false
		}
	}
	
	/*,

	{

		input: 'src/preload/index.js',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'preload',
			file: 'build/preload.js',
			globals: {
				'fs': 'fs',
				'path': 'path',
				'url': 'url',
				'http': 'http',
				'https': 'https'
			}
		},

		plugins: [
			nodeResolve(),
			commonjs(),
			nodePolyfills()
		],
		watch: {
			clearScreen: false
		}
	},*/
	
];