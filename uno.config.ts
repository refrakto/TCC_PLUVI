import { 
    defineConfig,
    presetAttributify,
    presetTagify,
    presetIcons,
    presetWind4,
    transformerVariantGroup,
    transformerDirectives,
} from 'unocss';

export default defineConfig({
    presets: [
        presetWind4(),
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
        transformerDirectives({
            applyVariable: '--a',
        }),
    ],
    shortcuts: [
        {
            'sz-full': 'w-full h-full',
            'sz-screen': 'w-screen h-screen',
        }
    ]
})