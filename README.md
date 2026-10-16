# Steps to Reproduce:

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

Run `npx expo-doctor` -- the following prints out for me:

```text
20/20 checks passed. No issues detected!
```

