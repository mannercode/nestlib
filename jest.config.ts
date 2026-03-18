import { createJsWithTsPreset } from 'ts-jest'

const tsJestPreset = createJsWithTsPreset({ tsconfig: 'tsconfig.json' })

export default {
    ...tsJestPreset,
    globalSetup: '<rootDir>/jest.global.ts',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: '(__tests__/.*\\.spec\\.(ts|js))$',
    testEnvironment: 'node',
    resetModules: true,
    resetMocks: true,
    restoreMocks: true,
    rootDir: '.',
    roots: ['<rootDir>/packages'],
    moduleNameMapper: {
        '^@mannercode/nestlib-common$': '<rootDir>/packages/common/src/index',
        '^@mannercode/nestlib-microservice$': '<rootDir>/packages/microservice/src/index',
        '^@mannercode/nestlib-testing$': '<rootDir>/packages/testing/src/index'
    },
    collectCoverageFrom: ['<rootDir>/packages/*/src/**/*.ts'],
    coveragePathIgnorePatterns: ['__tests__', '/index\\.ts$', '/packages/testing/'],
    coverageDirectory: '<rootDir>/_output/coverage',
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    },
    testTimeout: 60 * 1000
}
