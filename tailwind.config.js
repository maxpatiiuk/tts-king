// ESM is not supported in this type of file
// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  purge: {
    content: ['./pages/**/*.tsx', './components/**/*.tsx'],
    options: {
      keyframes: true,
    },
  },
  corePlugins: {
    float: false,
    clear: false,
    skew: false,
  },
  darkMode: 'media',
  theme: {
    extend: {
      width: {
        'fit-content': 'fit-content',
      },
      minHeight: {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        2.5: `${2 + 0.375}rem`,
      },
      margin: {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        '1/6': `${100 / 6}%`,
      },
      colors: {
        shadow: '#0009',
      },
      screens: {
        print: { raw: 'print' },
      },
    },
  },
  variants: {
    transitionProperty: ['responsive', 'motion-safe', 'motion-reduce'],
    animation: ['responsive', 'motion-safe', 'motion-reduce'],
    borderWidth: ['responsive', 'hover', 'focus', 'last'],
    extend: {},
  },
  plugins: [],
};
