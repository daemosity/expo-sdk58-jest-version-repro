## Steps to Reproduce:

_Recorded 10-16-2026_

Create a new blank app

```bash
npx create-expo-app@latest --template blank
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

## Part A

Run `npx expo-doctor` -- the following prints out for me:

```text
20/20 checks passed. No issues detected!
```

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
│ └── expect@29.7.0          <--- copy 1 of expect@29.7.0
├─┬ jest-expo@58.0.11
│ ├─┬ @jest/globals@30.5.2   <--- copy 1 of @jest/globals@30.5.2
│ │ └─┬ @jest/expect@30.5.2
│ │   ├── expect@30.5.2      <--- copy 1 of expect@30.5.2
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

`expo-doctor` still passes though there's two copies of `expect` installed

```bash
npx expo-doctor
```

```text
20/20 checks passed. No issues detected!
```
