// ESM is not supported in this type of file
// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  plugins:
    // process.env.NODE_ENV === 'production' ?
    [
      'tailwindcss',
      'postcss-flexbugs-fixes',
      [
        'postcss-preset-env',
        {
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 3,
          features: {
            'custom-properties': false,
          },
        },
      ],
    ],
};
