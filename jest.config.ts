import { createJsWithTsPreset, pathsToModuleNameMapper } from 'ts-jest'
import tsconfig from './tsconfig.json' with { type: 'json' }

const tsJestPreset = createJsWithTsPreset({ tsconfig: 'tsconfig.json' })
const { compilerOptions } = tsconfig

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
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    modulePaths: [compilerOptions.baseUrl],
    collectCoverageFrom: ['<rootDir>/packages/*/src/**/*.ts'],
    coveragePathIgnorePatterns: ['__tests__', '/index\\.ts$', '/packages/testing/'],
    coverageDirectory: '<rootDir>/_output/coverage',
    coverageThreshold: { global: { branches: 100, functions: 100, lines: 100, statements: 100 } },
    testTimeout: 60_000
}
