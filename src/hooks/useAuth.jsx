import { createContext, useContext, useState, useEffect } from "react";
import pb from "../lib/pb";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    const unsub = pb.authStore.onChange((token, model) => {
      setUser(model);
    });
    return () => unsub();
  }, []);

  async function login(email, password) {
    const auth = await pb.collection("users").authWithPassword(email, password);
    setUser(auth.record);
    return auth.record;
  }

  async function register(email, password, name) {
    const record = await pb.collection("users").create({
      email,
      password,
      passwordConfirm: password,
      name,
    });
    await login(email, password);
    return record;
  }

  function logout() {
    pb.authStore.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
