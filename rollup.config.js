import { babel } from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/toxin-slider.ts',
  output: {
    file: './dist/toxin-slider.js',
    format: 'iife',
    globals: {
      jquery: 'jQuery',
    },
  },
  external: [
    'jquery',
  ],
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    typescript(),
    terser(),
  ],
};
