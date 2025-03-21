import { AuthClient } from "@dfinity/auth-client";

let authClient;

export async function initAuth() {
  authClient = await AuthClient.create();
}

export async function login() {
  // Return a Promise that resolves when login is complete
  return new Promise((resolve, reject) => {
    authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: async () => {
        const identity = await authClient.getIdentity();
        console.log("User logged in:", identity.getPrincipal().toText());
        resolve(identity);
      },
      onError: (err) => {
        console.error("Login error:", err);
        reject(err);
      }
    });
  });
}

export async function logout() {
  await authClient.logout();
  console.log("User logged out");
}
    