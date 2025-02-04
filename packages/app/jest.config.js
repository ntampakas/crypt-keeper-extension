module.exports = {
  preset: "../../jest-preset.js",
  displayName: "@cryptkeeperzk/app",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "^.+\\.(css|scss|svg|png)$": "<rootDir>/src/config/mock/resourceMock.js",
    nanoevents: "<rootDir>/src/config/mock/nanoeventsMock.js",
    nanoid: "<rootDir>/src/config/mock/nanoidMock.js",
    "@src/(.*)$": "<rootDir>/src/$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  coveragePathIgnorePatterns: ["/node_modules/", "/test/", "/__tests__/"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
};
