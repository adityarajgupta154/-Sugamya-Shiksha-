import { getAuth, Auth } from "firebase/auth";
import { app } from "./app";

let _auth: Auth | null = null;

function getAuthInstance(): Auth | null {
  if (!_auth && app && typeof window !== "undefined") {
    try {
      _auth = getAuth(app);
    } catch (error) {
      console.warn("Firebase Auth initialization fallback:", error);
    }
  }
  return _auth;
}

export const auth: Auth = new Proxy({} as Auth, {
  get(target, prop, receiver) {
    const instance = getAuthInstance();
    if (!instance) return undefined;
    const value = (instance as any)[prop];
    return typeof value === "function" ? value.bind(instance) : value;
  },
  set(target, prop, value) {
    const instance = getAuthInstance();
    if (instance) {
      (instance as any)[prop] = value;
    }
    return true;
  },
});


