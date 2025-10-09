import {
	defineConfig,
	presetAttributify,
	presetTagify,
	transformerVariantGroup,
	transformerDirectives,
} from 'unocss'
import { presetWind4 } from '@unocss/preset-wind4'
import { createRemToPxProcessor } from '@unocss/preset-wind4/utils'

export default defineConfig({
	presets: [
		presetWind4({
			preflights: {
				reset: true,
				theme: { mode: true, process: createRemToPxProcessor() },
			},
		}),
		presetAttributify(),
		presetTagify(),
	],
	transformers: [
		transformerVariantGroup(),
		transformerDirectives({ applyVariable: '--a' }),
	],
	shortcuts: [
		{
			'sz-screen': 'w-screen h-screen',
			'text-var-big': `[font-feature-settings:'cv12', 'cv13']`,
			'text-var-mono': `[font-feature-settings:'zero', 'tnum']`,
		},
	],
	postprocess: [createRemToPxProcessor()],
})
