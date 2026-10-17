# Expo SDK 58: `expo-doctor` recommends Jest 29 while `jest-expo@58` depends on Jest 30

## Summary

On Expo SDK 58, `npx expo-doctor` and `npx expo install --check` recommend `jest ~29.7.0` and `@types/jest 29.5.14`. However, `jest-expo@58.0.11` depends on Jest 30 packages (`@jest/globals ^30.0.0`, `jest-environment-jsdom ^30.0.0`).

Following the recommended versions installs two copies of `expect` and `@jest/globals` (29.x and 30.x), and Doctor reports no issues. Aligning `jest` and `@types/jest` with `jest-expo` gives a single consistent set of Jest packages, but then Doctor reports a major-version mismatch.

The recommended versions appear to come from the SDK 58 `relatedPackages` entry in the versions API (`https://api.expo.dev/v2/versions/latest`), which wasn't updated when `jest-expo` moved to Jest 30 in [expo/expo#50427](https://github.com/expo/expo/pull/50427).

## Expected vs. actual

**Expected:** The `jest` and `@types/jest` versions that `expo-doctor` and `expo install --check` recommend for SDK 58 are compatible with the Jest version `jest-expo@58` depends on, so following the recommendations produces a single version of each Jest package.

**Actual:**

| Setup | `expect` / `@jest/globals` installed | `expo-doctor` |
|---|---|---|
| Part A: versions recommended by `expo install` (`jest ~29.7.0`, `@types/jest 29.5.14`) | two versions each (29.x and 30.x) | passes (20/20) |
| Part B: aligned with `jest-expo@58` (`jest ^30.5.2`, `@types/jest ^30.0.0`) | one version each (30.5.2) | fails: major-version mismatch for `jest` and `@types/jest` |

In both setups, the smoke test passes.

## Environment

- OS: Windows 11, WSL 2 (Ubuntu 24.04.5 LTS)
- Node: v26.10.0
- npm: 11.19.1
- Expo SDK: 58 (`expo@58.0.14`)
- `jest-expo`: 58.0.11
- `expo-doctor`: 1.21.5
- Recorded: 2026-10-16

Full `npx expo-env-info` output is in the issue linked at the bottom.

## Steps to reproduce

Create a new blank app

```bash
npx create-expo-app@latest jest-version-repro --template blank
```

Add Jest as described in [Unit testing with Jest](https://docs.expo.dev/develop/unit-testing/)

```bash
npx expo install jest-expo jest @types/jest --dev
```

Your `package.json` should now look like:

```json
{
  "name": "jest-version-repro",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "expo": "~58.0.14",
    "expo-status-bar": "~58.0.3",
    "react": "19.3.0",
    "react-native": "0.88.0"
  },
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest"
  },
  "private": true,
  "devDependencies": {
    "@types/jest": "29.5.14",
    "jest": "~29.7.0",
    "jest-expo": "~58.0.11"
  },
  "jest": {
    "preset": "jest-expo"
  }
}
```

### Part A: versions recommended by `expo install`

Add a minimal test (./__tests__/smoke.test.ts) to the repo:

```typescript
// Minimal smoke test for the repro. Uses Jest globals, as in the Expo unit-testing guide.
const sum = (a: number, b: number): number => a + b;

describe('jest-expo preset smoke test', () => {
  it('runs a plain assertion', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('runs a mock-function matcher', () => {
    const callback = jest.fn();
    callback('tip');
    expect(callback).toHaveBeenCalledWith('tip');
  });
});
```

Run the test:

```bash
npm test
```

It should pass:

```text
> jest-version-repro@1.0.0 test
> jest

 PASS  __tests__/smoke.test.ts
  jest-expo preset smoke test
    ✓ runs a plain assertion (2 ms)
    ✓ runs a mock-function matcher (1 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.087 s
Ran all test suites.
```

Show the versions of `expect` and `@jest/globals` installed:

```bash
npm ls expect @jest/globals
```

```text
jest-version-repro@1.0.0 
├─┬ @types/jest@29.5.14
│ └── expect@29.7.0          <--- copy of expect@29.7.0
├─┬ jest-expo@58.0.11
│ ├─┬ @jest/globals@30.5.2   <--- copy of @jest/globals@30.5.2
│ │ └─┬ @jest/expect@30.5.2
│ │   ├── expect@30.5.2      <--- copy of expect@30.5.2
│ │   └─┬ jest-snapshot@30.5.2
│ │     └── expect@30.5.2 deduped
│ └─┬ jest-snapshot@30.5.2
│   └── expect@30.5.2
└─┬ jest@29.7.0
  └─┬ @jest/core@29.7.0
    ├─┬ jest-config@29.7.0
    │ └─┬ jest-circus@29.7.0
    │   └─┬ @jest/expect@29.7.0
    │     └── expect@29.7.0 deduped
    ├─┬ jest-runtime@29.7.0
    │ └── @jest/globals@29.7.0 <--- copy of @jest/globals@29.7.0
    └─┬ jest-snapshot@29.7.0
      └── expect@29.7.0 deduped
```

`expo-doctor` still passes even though two different versions of `expect` and `@jest/globals` are installed

```bash
npx expo-doctor
```

```text
20/20 checks passed. No issues detected!
```

### Part B: aligned with `jest-expo@58`

Update `jest` and `@types/jest` to `^30.x`

```bash
npm i -D jest@^30.5.2 @types/jest@^30.0.0
```

Your `package.json` should now look like:

```json
{
  "name": "jest-version-repro",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "expo": "~58.0.14",
    "expo-status-bar": "~58.0.3",
    "react": "19.3.0",
    "react-native": "0.88.0"
  },
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest"
  },
  "private": true,
  "devDependencies": {
    "@types/jest": "^30.0.0",
    "jest": "^30.5.2",
    "jest-expo": "~58.0.11"
  },
  "jest": {
    "preset": "jest-expo"
  }
}
```

Show the versions of `expect` and `@jest/globals` installed:

```bash
npm ls expect @jest/globals
```

```text
jest-version-repro@1.0.0 
├─┬ @types/jest@30.0.0
│ └── expect@30.5.2             <-- one version of expect
├─┬ jest-expo@58.0.11
│ ├─┬ @jest/globals@30.5.2      <-- one version of @jest/globals
│ │ └─┬ @jest/expect@30.5.2
│ │   └── expect@30.5.2 deduped
│ └─┬ jest-snapshot@30.5.2
│   └── expect@30.5.2 deduped
└─┬ jest@30.5.2
  └─┬ @jest/core@30.5.2
    └─┬ jest-runtime@30.5.2
      └── @jest/globals@30.5.2 deduped
```

Run the tests, which should pass:

```bash
npm test
```

```text
> jest-version-repro@1.0.0 test
> jest

 PASS  __tests__/smoke.test.ts
  jest-expo preset smoke test
    ✓ runs a plain assertion (3 ms)
    ✓ runs a mock-function matcher (2 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        2.461 s
Ran all test suites.
```

`expo-doctor` flags `jest` and `@types/jest` as major-version mismatches, even though the installed tree is now consistent:

```bash
npx expo-doctor
```

```text
19/20 checks passed. 1 checks failed. Possible issues detected:
Use the --verbose flag to see more details about passed checks.

✖ Check that packages match versions required by installed Expo SDK

❗ Major version mismatches
package      expected  found   
@types/jest  29.5.14   30.0.0  
jest         ~29.7.0   30.5.2  



2 packages out of date.
Advice:
Use 'npx expo install --check' to review and upgrade your dependencies.
To ignore specific packages, add them to "expo.install.exclude" in package.json. Learn more.

1 check failed, indicating possible issues with the project.
```

As does `npx expo install --check`:

```text
$ npx expo install --check
The following packages should be updated for best compatibility with the installed expo version:
  @types/jest@30.0.0 - expected version: 29.5.14
  jest@30.5.2 - expected version: ~29.7.0
Your project may not work correctly until you install the expected versions of the packages.
✔ Fix dependencies? … no
Found outdated dependencies
```
