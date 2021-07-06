import axios, { AxiosError } from "axios";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestQueue = [];

export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies["auth.Token"]}`,
  },
});

export function signout() {
  destroyCookie(undefined, "auth.Token");
  destroyCookie(undefined, "auth.RefreshToken");

  Router.push("/");
}

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // renew token
    if (error.response.status === 401) {
      if (error.response.data?.code === "token.expired") {
        // get current cookies
        cookies = parseCookies();
        const { "auth.RefreshToken": refreshToken } = cookies;
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          api
            .post("/refresh", {
              refreshToken,
            })
            .then((response) => {
              const { token } = response.data;
              //creating cookies
              setCookie(undefined, "auth.Token", token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: "/", // global
              });

              setCookie(
                undefined,
                "auth.RefreshToken",
                response.data.refreshToken,
                {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: "/", // global
                }
              );

              api.defaults.headers["Authorization"] = `Bearer ${token}`;

              // call the failed request and make then with the right token
              failedRequestQueue.forEach((request) => request.resolve(token));
              failedRequestQueue = [];
            })
            .catch((err) => {
              failedRequestQueue.forEach((request) => request.reject(err));
              failedRequestQueue = [];

              if (process.browser) {
                signout();
              }
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            resolve: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            reject: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      } else {
        if (process.browser) {
          signout();
        }
      }

      return Promise.reject(error);
    }
  }
);
