import {
  Flex,
  Input,
  Button,
  Heading,
  FormControl,
  FormLabel,
  VStack,
} from "@chakra-ui/react";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    const data = {
      email,
      password,
    };

    await signIn(data);

    alert("signedIn")
  }

  return (
    <Flex
      w="100vw"
      h="100vh"
      direction="column"
      align="center"
      justify="center"
    >
      <Heading color="purple.500">Login</Heading>
      <Flex
        as="form"
        direction="column"
        justify="center"
        p={8}
        m="0 auto"
        onSubmit={handleLogin}
      >
        <VStack spacing="10px">
          <FormControl id="email">
            <FormLabel color="purple.500">Email address</FormLabel>
            <Input
              focusBorderColor="purple.500"
              w="300px"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl id="password">
            <FormLabel color="purple.500">Password</FormLabel>
            <Input
              focusBorderColor="purple.500"
              w="300px"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </VStack>

        <Button colorScheme="purple" mt={8} type="submit">
          Sign in
        </Button>
      </Flex>
    </Flex>
  );
}
