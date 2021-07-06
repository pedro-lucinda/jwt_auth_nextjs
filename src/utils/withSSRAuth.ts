import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import decode from "jwt-decode";

// hight order function
export function withSSRAuth(fn: GetServerSideProps) {
  // returns a function
  return async (context: GetServerSidePropsContext) => {
    const cookies = parseCookies(context);
    const user = decode(cookies["auth.Token"]);
    console.log(user);
    // redirect case doesnt havve a token on cookies
    if (!cookies["auth.Token"]) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return await fn(context);
  };
}
