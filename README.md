# Ecko Wallet Mobile

Ecko Wallet Mobile is an app for managing Kadena wallets, available on Android and iOS devices. It allows users to view wallet balances, sign transactions, and use WalletConnect to interact with decentralized applications.

## Instructions to Run the App

1. **Prepare the `.env` file:**

   - Copy the `.env.example` file to `.env`.
   - Fill in the required values in the `.env` file.

2. **Run the app on Android:**

   ```bash
   yarn
   yarn start
   yarn android
   ```

3. **Run the app on iOS:**
   ```bash
   cd ios
   pod install
   cd ..
   yarn ios
   ```
