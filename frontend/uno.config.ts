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
      collections: {
        lucide: () => import('@iconify-json/lucide/icons.json').then(i => i.default),
      }
    }),
  ],
  safelist: [
    'grid-cols-15',
    'bg-yellow-400',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-600',
    'bg-green-200',
    'bg-green-800',
    'bg-orange-500',
    'bg-orange-600',
    'bg-blue-400',
    'bg-red-500',
    // Reservation type colors
    'bg-blue-100',
    'text-blue-800',
    'border-l-4',
    'border-blue-400',
    'bg-yellow-100',
    'text-yellow-800',
    'border-yellow-400',
    'bg-orange-100',
    'text-orange-800',
    'border-orange-400',
    'bg-green-100',
    'text-green-800',
    'border-green-400',
    // Status colors for cancelled and checkedOut
    'bg-red-100',
    'text-red-800',
    'bg-orange-100',
    'text-orange-800',
    // Icons
    'i-lucide-x',
    'i-lucide-chevron-down',
    'i-lucide-chevron-right',
    'i-lucide-more-horizontal'
  ],
  rules: [
    ['grid-cols-15', { 'grid-template-columns': 'repeat(15, minmax(0, 1fr))' }],
  ],
})
