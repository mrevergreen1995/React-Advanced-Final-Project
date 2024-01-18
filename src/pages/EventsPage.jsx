import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  SimpleGrid,
  Text,
  Image,
  Heading,
  Input,
  Select,
  LinkBox,
  LinkOverlay,
  VStack,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import EventForm from "./EventForm"; // Import EventForm

export const EventsPage = () => {
  // States for handling events, search term, category, and categories list
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // Modal control for adding events
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch events and categories from the server
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchEvents();
    fetchCategories();
  }, []);

  // Add new event and handle response
  const handleAddEvent = async (newEventData) => {
    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEventData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      onClose();
      toast({
        title: "Event added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Error adding event",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Filter events based on the search term and selected category
  const filteredEvents = events.filter((event) => {
    const matchesSearchTerm = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? event.categoryIds.includes(parseInt(selectedCategory, 10))
      : true;
    return matchesSearchTerm && matchesCategory;
  });

  return (
    <Box padding="4" maxWidth="1200px" margin="auto">
      {/* Search and category filter section */}
      <VStack spacing={4} marginBottom={8}>
        <Heading as="h1">Awesome Events 🥳</Heading>
        <HStack width="100%">
          <Input
            placeholder="Search events"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            placeholder="All Categories"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Button
            colorScheme="teal"
            onClick={onOpen}
            size="mg"
            px={4}
            py={2}
            fontSize="md"
          >
            Add Event
          </Button>
        </HStack>
      </VStack>

      {/* Modal for adding new event */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <EventForm onSubmit={handleAddEvent} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Displaying events in a grid layout */}
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={5}>
        {filteredEvents.map((event) => (
          <LinkBox
            as={RouterLink}
            to={`/event/${event.id}`}
            key={event.id}
            p="5"
            boxShadow="md"
            borderWidth="1px"
          >
            <Heading size="md" my="2">
              <LinkOverlay href={`/event/${event.id}`}>
                {event.title}
              </LinkOverlay>
            </Heading>
            <Text mb="3">{event.description}</Text>
            <Image src={event.image} alt={event.title} borderRadius="md" />
          </LinkBox>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default EventsPage;
