import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Flex,
  Box,
  Link,
  useColorModeValue,
  useMediaQuery,
  IconButton,
  Collapse,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

export const Navigation = () => {
  // State to handle mobile view and toggle menu visibility
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [showMenu, setShowMenu] = React.useState(false);

  // Function to toggle the menu in mobile view
  const toggleMenu = () => setShowMenu(!showMenu);

  // Theme colors for different color modes
  const bg = useColorModeValue("gray.100", "gray.700");
  const color = useColorModeValue("teal.600", "white");

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg={bg}
      color={color}
    >
      {/* Logo or Brand Name */}
      <Flex align="center" mr={5}>
        <Box as="h1" fontSize="xl" fontWeight="bold" letterSpacing="tight">
          EventApp
        </Box>
      </Flex>

      {/* Mobile menu toggle button */}
      {isMobile && (
        <IconButton
          icon={showMenu ? <CloseIcon /> : <HamburgerIcon />}
          onClick={toggleMenu}
          variant="outline"
          aria-label="Toggle Menu"
        />
      )}

      {/* Collapsible menu for mobile view */}
      <Collapse in={showMenu} animateOpacity>
        <Box
          display={{ base: showMenu ? "block" : "none", md: "flex" }}
          width={{ base: "full", md: "auto" }}
          alignItems="center"
          flexGrow={1}
        >
          {/* Navigation Links */}
          <Link
            as={RouterLink}
            to="/"
            px={2}
            py={1}
            rounded={"md"}
            _hover={{ bg: "teal.700" }}
          >
            Events
          </Link>
          <Link
            as={RouterLink}
            to="/add-event"
            px={2}
            py={1}
            rounded={"md"}
            _hover={{ bg: "teal.700" }}
          >
            Add Event
          </Link>
          {/* Additional navigation links can be added here */}
        </Box>
      </Collapse>
    </Flex>
  );
};
