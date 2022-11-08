import * as React from "react";
import { ChakraProvider, Box, Grid, theme } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { IntroPage } from "./pages/IntroPage";
import OfficePage from "./pages/OfficePage";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <OfficePage />
          {/* <IntroPage /> */}
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
