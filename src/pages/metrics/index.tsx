import { Flex, Heading } from "@chakra-ui/layout";
import { GetServerSideProps } from "next";
import { withSSRAuth } from "../../utils/withSSRAuth";
import decode from "jwt-decode";
import { useEffect } from "react";
import { parseCookies } from "nookies";
import jwtDecode from "jwt-decode";

export default function metrics() {
  useEffect(() => {}, []);

  return (
    <Flex align="center" justify="center" direction="column">
      <Heading color="purple.500">Metrics</Heading>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (context) => {
    return {
      props: {},
    };
  }
);
