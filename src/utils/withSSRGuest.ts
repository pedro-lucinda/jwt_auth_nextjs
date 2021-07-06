import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";

// hight order function
export function withSSRGuest(fn: GetServerSideProps) {
  // returns a function
  return async (context: GetServerSidePropsContext) => {
    const cookies = parseCookies(context);
    // redirect case has a token on cookies
    if (cookies["auth.Token"]) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }
    return await fn(context);
  };
}
