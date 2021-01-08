module.exports = {
  transform: {
    '^.+\\.js?$': 'babel-jest',
    '^.+\\.ts?$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'ts'],
  collectCoverageFrom: [
    "!**/node_modules/**",
    "./src/**"
],
  bail: false,
  verbose: true
}
