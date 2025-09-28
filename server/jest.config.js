export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 10000,
  setupFilesAfterEnv: ["./src/tests/setup.ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
