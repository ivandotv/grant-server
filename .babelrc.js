const pkg = require('./package.json')

const pkgVersion = process.env.PKG_VERSION || pkg.version
const ignoreForTests = ['node_modules', 'src/**/*.d.ts']
const ignoreForProduction = [
  'src/**/__tests__/**/*',
  'src/**/*.spec.ts',
  'src/**/*.test.ts',
  'src/**/*.d.ts'
]

module.exports = {
  presets: ['@babel/typescript', ['@babel/preset-env']],
  plugins: [
    ['@babel/plugin-proposal-nullish-coalescing-operator'], //node v10
    ['@babel/plugin-proposal-optional-chaining'], // node v10
    ['@babel/proposal-class-properties', { loose: true }], // stage-3 proposal
    'dev-expression',
    [
      'transform-define',
      {
        __VERSION__: pkgVersion
      }
    ]
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/env',
          {
            targets: {
              node: 'current'
            }
          }
        ]
      ],
      ignore: ignoreForTests,
      sourceMaps: 'inline'
    },
    cjs: {
      // commonjs for node
      presets: [
        [
          '@babel/env',
          {
            // debug: true,
            modules: 'cjs',
            targets: {
              node: 10 // es2018
            }
          }
        ]
      ],
      ignore: ignoreForProduction
    }
  }
}
