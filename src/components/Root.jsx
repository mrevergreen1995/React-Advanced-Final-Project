import React from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Box, ChakraProvider } from "@chakra-ui/react";

export const Root = () => {
  return (
    <ChakraProvider>
      <Box>
        <Navigation />
        <Outlet />
      </Box>
    </ChakraProvider>
  );
};
