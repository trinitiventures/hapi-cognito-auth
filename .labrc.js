module.exports = {
    assert: '@hapi/code',
    coverage: true,
    threshold: 100,
    lint: true,
    timeout: 5000,
    verbose: process.env.CI ? false : true,
    globals: '__core-js_shared__,core',
    reporter: ['console', 'html', 'lcov', 'json'],
    output: [
        'stdout',
        'test/coverage/coverage.html',
        'test/coverage/coverage.lcov',
        'test/coverage/coverage.json'
    ],
    'coverage-exclude': ['lib/auth/helpers/extract.js']
};
