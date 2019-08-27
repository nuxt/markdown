module.exports = {
  testEnvironment: 'node',

  expand: true,

  forceExit: true,

  // setupFilesAfterEnv: ['./test/utils/setup'],

  coverageDirectory: './coverage',

  collectCoverageFrom: [
    'src/**/*.js'
  ],

  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  moduleFileExtensions: [
    'js',
    'json'
  ],

  reporters: [
    'default',
    // ['jest-junit', { outputDirectory: 'reports/junit' }]
  ]
}
