
module.exports = {
  collectCoverage: true,
  collectCoverageFrom:
    [
      'src/**/*.ts'
    ],
  coveragePathIgnorePatterns:
    [
      '/coverage/',
      '/node_modules/',
      '.config.js'
    ],
  coverageDirectory: './coverage',
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$":
      "ts-jest"
  },
  globals: {
    "ts-jest": {
      "tsConfig": "tsconfig.json"
    }
  },
  testMatch: [
    "**/test/*.+(ts|tsx|js)"
  ]
};
