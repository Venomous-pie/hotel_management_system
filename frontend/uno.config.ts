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
  theme: {
    extend: {
      width: {
        '61.5px': '61.5px',
        '270px': '270px',
        '1254px': '1254px',
      },
      minWidth: {
        '61.5px': '61.5px',
        '270px': '270px',
        '1254px': '1254px',
      },
      maxWidth: {
        '61.5px': '61.5px',
        '270px': '270px',
      },
      height: {
        '48px': '48px',
      },
    },
  },
  safelist: [
    'grid-cols-15',
    // Gantt chart custom dimensions
    'w-61.5px', 'min-w-61.5px', 'max-w-61.5px',
    'w-270px', 'min-w-270px', 'max-w-270px', 
    'min-w-1254px', 'h-48px',
    // Colors
    'bg-yellow-400',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-600',
    'bg-green-200',
    'bg-green-800',
    'hover:bg-green-800',
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
    // PrimeIcons are loaded via CSS, no need to safelist
  ],
})
