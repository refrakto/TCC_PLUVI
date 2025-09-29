import { 
    defineConfig,
    presetAttributify,
    presetTagify,
    presetIcons,
    transformerVariantGroup,
    transformerDirectives,
} from 'unocss';
import { presetWind4 } from '@unocss/preset-wind4';
import { createRemToPxProcessor } from '@unocss/preset-wind4/utils';

export default defineConfig({
    presets: [
        presetWind4({
            preflights: {
                theme: {
                    mode: 'on-demand',
                    process: createRemToPxProcessor()
                }
            }
        }),
        presetIcons({
            collections: {
                lu: () => import('@iconify-json/lucide/icons.json').then(i => i.default),
                lulab: () => import('@iconify-json/lucide-lab/icons.json').then(i => i.default),
            }
        }),
        presetAttributify(),
        presetTagify()
    ],
    transformers: [
        transformerVariantGroup(),
        transformerDirectives({ applyVariable: '--a' })
    ],
    shortcuts: [
        {
            'sz-screen': 'w-screen h-screen',
        }
    ],
    postprocess: [createRemToPxProcessor()],
})