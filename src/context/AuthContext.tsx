import Router from "next/router";
import { parseCookies, setCookie } from "nookies";
import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";
import {
  AuthContextData,
  AuthProviderProps,
  SignInCredentials,
  User,
} from "./types";

export const AuthContext = createContext({} as AuthContextData);
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(null);
  // if there is no user isnt authenticated
  const isAuthenticated = !!user;

  //check if user already has an token and get user's info
  useEffect(() => {
    const { "auth.Token": token } = parseCookies();
    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { email, permissions, roles } = response.data;
          setUser({ email, permissions, roles });
        })
        .catch((e) => console.log(e));
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/sessions", { email, password });
      const { token, refreshToken, permissions, roles } = response.data;

      //creating cookies
      // the first parameter, if its on client side, needs to be undefined
      setCookie(undefined, "auth.Token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/", // global
      });
      
      setCookie(undefined, "auth.RefreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/", // global
      });

      setUser({
        email,
        permissions,
        roles,
      });

      //set new header
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      Router.push("/dashboard");
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};
