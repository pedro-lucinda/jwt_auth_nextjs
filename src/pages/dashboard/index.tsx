import { Flex, Heading, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useContext, useEffect } from "react";
import { Can } from "../../components/Can";
import { AuthContext } from "../../context/AuthContext";
import { useCan } from "../../hooks/useCan";
import { withSSRAuth } from "../../utils/withSSRAuth";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Flex
      direction="column"
      w="100vw"
      height="100%"
      align="center"
      justify="center"
    >
      <Heading color="purple.500"> Admin Panel </Heading>
      <Text> User: {user?.email} </Text>
      <Flex>card</Flex>
      <Flex>card</Flex>
      <Flex>card</Flex>
      <Can permissions={["metrics.list"]}>
        <Flex> Can see </Flex>
      </Can>
    </Flex>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (context) => {
    return {
      props: {},
    };
  }
);
