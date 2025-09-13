import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'
import presetWebFonts from '@unocss/preset-web-fonts'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: {
          name: 'Montserrat',
          weights: ['400', '500', '700'],
          italic: false,
        },
        cursive: 'Italianno',
      },
    }),
    presetIcons({
      scale: 1.2,   
      warn: true,  
    }),
  ],
  safelist: [
    'grid-cols-15',
    'bg-yellow-400',
    'bg-blue-500',
    'bg-green-600',
    'bg-green-800',
    'bg-orange-500',
    'bg-orange-600',
    'bg-blue-400',
    'bg-red-500'
  ],
  rules: [
    ['grid-cols-15', { 'grid-template-columns': 'repeat(15, minmax(0, 1fr))' }],
  ],
})
