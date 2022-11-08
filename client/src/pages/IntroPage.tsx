import * as React from "react";
import {
  Box,
  Text,
  VStack,
  Grid,
  Button,
  GridItem,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import adapter from "webrtc-adapter";

export const IntroPage = () => {
  const boxBg = useColorModeValue("blue.50", "blue.900");
  const [name, setName] = useState<string>("");

  console.log(adapter.commonShim.shimConnectionState(window));

  return (
    <VStack spacing={8}>
      <Box bg={boxBg}>
        <Grid
          templateRows="repeat(3, 1fr)"
          templateColumns="repeat(1, 1fr)"
          gap={4}
          padding={30}
        >
          <GridItem colSpan={1}>
            <Text>안녕하세요, 반가워요! 🤗</Text>
          </GridItem>
          <GridItem colSpan={1}>
            <Input
              placeholder="이름을 입력해주세요"
              onChange={(e) => setName(e.target.value)}
            ></Input>
          </GridItem>
          <GridItem colSpan={1}>
            <Button colorScheme={"blue"} width={"100%"} disabled={!name}>
              접속
            </Button>
          </GridItem>
        </Grid>
      </Box>
    </VStack>
  );
};
