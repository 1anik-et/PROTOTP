Here is the complete `README.md` file containing the full overview of the project based on the codebase. You can copy and paste this into your project's root `README.md` file.

***

# PROTOTP - Secure Care. Instant Access.

## 📖 Project Overview
PROTOTP is a full-stack mobile application that provides a secure, passwordless authentication experience using One-Time Passwords (OTPs). The application features role-based access, splitting the user journey into two distinct paths: **Providers** (e.g., parents/guardians) and **Dependents** (e.g., children). It includes robust session persistence, global state management, and a multi-step onboarding process.

## ✨ Features
*   **Passwordless Authentication:** Secure SMS-based login via Twilio or Fyno APIs.
*   **Role-Based Access Control:** Distinct onboarding flows and dashboards for Providers and Dependents.
*   **Persistent Sessions:** Users remain logged in across app restarts using AsyncStorage and Zustand.
*   **Dynamic Theming:** Global light and dark mode support managed by Zustand.
*   **Modern Navigation:** File-based routing using Expo Router for seamless screen transitions and auth guarding.

## 🛠️ Tech Stack
**Frontend (Mobile App)**
*   **Framework:** React Native with Expo
*   **Navigation:** Expo Router (File-based routing)
*   **State Management:** Zustand (with Persist middleware)
*   **Local Storage:** AsyncStorage
*   **Networking:** Axios

**Backend (Server)**
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Authentication:** Custom Base64 URL Encoded Tokens
*   **SMS Providers:** Fyno API & Twilio Verify API

---

## 📋 Requirements & Prerequisites
Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/en/) (v16.x or higher)
*   npm or Yarn package manager
*   Expo CLI (`npm install -g expo-cli`)
*   An active [Twilio](https://www.twilio.com/) or [Fyno](https://fyno.io/) account for sending SMS.
*   An iOS Simulator, Android Emulator, or the Expo Go app on a physical device.

---

## 🚀 Installation & Setup

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the backend folder and add your SMS provider credentials:
   ```env
   # Twilio Config
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_VERIFY_SERVICE_SID=your_verify_sid
   
   # Fyno Config (Optional)
   FYNO_API_KEY=your_fyno_key
   FYNO_WORKSPACE_ID=your_workspace_id
   FYNO_TEMPLATE_ID=your_template_id
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *(The server will run on `http://localhost:5000` or your local IP network).*

### 2. Frontend (Mobile) Setup
1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the API URL:
   Ensure the `API_URL` variable in `mobile/src/api/axiosClient.ts` (and inside the login/otp screens) points to your computer's local IP address (e.g., `http://192.168.1.9:5000/api`).
4. Start the Expo server:
   ```bash
   npx expo start
   ```

---

## 🔄 Project Architecture & Flows

The app utilizes **Expo Router** to manage distinct navigation groups. A global `_layout.tsx` file acts as a "Bouncer", monitoring the Zustand global state and forcing the user into the correct flow:

1. **Auth Flow `(auth)`:** 
   If no security token is found in the device's storage, the user is locked to this flow. They must select a role, enter their phone number, and pass OTP verification.
2. **Onboarding Flow `(onboarding)`:** 
   If a security token exists but the user's `onboardingStatus` is marked as `'incomplete'`, they are routed here. They are presented with a role-specific form (Provider or Dependent) to set up their profile.
3. **Main Dashboard Flow `(main)`:** 
   Once onboarding is `'complete'`, the user is granted access to their specific dashboard and the core features of the app.

---

## 🔐 How the OTP System Works

The OTP (One-Time Password) system is designed to be highly secure by offloading the actual code generation to trusted third-party SMS providers. 

Here is the exact lifecycle of a login:

1. **Request (Frontend):** 
   The user enters their 10-digit phone number on the `LoginScreen` and taps "Send Code". The frontend saves this number to Zustand (`setIdentifier`) and makes a `POST /auth/send-otp` request to the backend.
2. **Dispatch (Backend & Provider):** 
   The `authController` receives the request and contacts Twilio (or Fyno). **The SMS provider generates the random 6-digit code on their secure servers** and sends the text message to the user's physical phone.
3. **Verification (Frontend):** 
   The user navigates to the `OTPScreen` and types in the 6-digit code. The app retrieves their phone number from Zustand and sends both the phone number and the code to `POST /auth/verify-otp`.
4. **Validation (Backend & Provider):** 
   The backend forwards the code to the SMS provider, asking if it is valid. If the provider approves it, the backend generates a secure Base64 session token (containing the user's phone number and a UUID).
5. **Session Persistence (Frontend):** 
   The backend sends the token back to the mobile app. The app saves it to the global Zustand store (`setToken`), which utilizes `AsyncStorage` to permanently save the token to the phone's hard drive.
6. **Authenticated Requests:** 
   For all future actions, `axiosClient.ts` automatically attaches this token to the headers. The backend's `authMiddleware` intercepts incoming requests, validates the token, and allows access to protected data.

---

## 📂 Folder Structure Overview

```text
PROTOTP/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Business logic (authController, userController)
│   │   ├── middlewares/      # Security guards (authMiddleware)
│   │   ├── routes/           # API Endpoint definitions
│   │   └── index.ts          # Express server entry point
│   ├── .env                  # Environment variables
│   └── package.json
└── mobile/
    ├── app/
    │   ├── (auth)/           # Unauthenticated UI screens (login, otp)
    │   ├── (main)/           # Logged-in dashboard screens (provider, dependent)
    │   ├── (onboarding)/     # Profile setup screens
    │   └── _layout.tsx       # Root layout & Navigation Guard
    ├── src/
    │   ├── api/              # Axios configuration (axiosClient)
    │   └── store/            # Zustand global state (authStore, themeStore)
    └── package.json
```

***