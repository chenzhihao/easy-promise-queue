// Rollup plugins
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/PromiseQueue.js',
  dest: 'dist/PromiseQueue.js',
  format: 'umd',
  moduleName: 'PromiseQueue',
  sourceMap: true,
  plugins: [
    babel({
      babelrc: false, // stops babel from using .babelrc files
      plugins: ['external-helpers'],
      presets: [
        ['env', {
          'modules': false, // stop module conversion
        }],
      ],
      exclude: [
        'node_modules/**'
      ]
    }),
    uglify()
  ],
};
