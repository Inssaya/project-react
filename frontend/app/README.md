# MySchools Mobile Test App

This is a minimal Expo React Native app to test the backend from a phone.

Quick start:

1. Install dependencies (in `frontend/app`):

```bash
cd frontend/app
npm install
```

2. Edit `config.js` and set `BASE_URL` to your PC LAN IP, e.g. `http://192.168.1.42:3001/api`.

3. Start Expo:

```bash
npm run start
```

4. Open the Expo QR code with Expo Go on your phone.

Notes:
- No styling — purpose is to test API flows: register, login, create schools/classes/students/teachers, record attendance.
- Uses AsyncStorage to persist token and user info.

Dependencies:
- expo
- react-native
- @react-navigation/native
- @react-navigation/native-stack
- @react-native-async-storage/async-storage

If you prefer I can instead create a small mobile web app (PWA) that can be opened in the phone browser; tell me which you prefer.
