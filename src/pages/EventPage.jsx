import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
  Button,
  useToast,
} from "@chakra-ui/react";

export const EventPage = () => {
  // State variables to manage event data, creator data, categories, edit mode, form data, and toast notifications
  const [event, setEvent] = useState(null);
  const [creator, setCreator] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
  });

  // Get eventId from the URL using React Router
  const { eventId } = useParams();
  // Navigate function for page redirection
  const navigate = useNavigate();
  // useToast hook for displaying toast notifications
  const toast = useToast();

  // Fetch event data and related data from the server
  useEffect(() => {
    const fetchEventAndRelatedData = async () => {
      try {
        // Fetch event, creator, and categories data concurrently
        const [eventResponse, creatorResponse, categoriesResponse] =
          await Promise.all([
            fetch(`http://localhost:3000/events/${eventId}`),
            fetch(`http://localhost:3000/users/${event?.createdBy || ""}`),
            fetch("http://localhost:3000/categories"),
          ]);

        // Check if any of the responses is not okay
        if (
          !eventResponse.ok ||
          !creatorResponse.ok ||
          !categoriesResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        // Parse response data
        const [eventData, creatorData, categoriesData] = await Promise.all([
          eventResponse.json(),
          creatorResponse.json(),
          categoriesResponse.json(),
        ]);

        // Set state variables with the fetched data
        setEvent(eventData);
        setFormData(eventData);
        setCreator(creatorData);
        setCategories(categoriesData);
      } catch (error) {
        // Handle errors and display a toast notification
        console.error("Error fetching data:", error.message);
        toast({
          title: "Failed to fetch event data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    // Call the fetchEventAndRelatedData function
    fetchEventAndRelatedData();
  }, [eventId, event, toast]);

  // Set edit mode to true when the edit button is clicked
  const handleEdit = () => setEditMode(true);

  // Handle event deletion
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (confirmed) {
      try {
        // Send a DELETE request to delete the event
        const response = await fetch(
          `http://localhost:3000/events/${eventId}`,
          { method: "DELETE" }
        );

        // Check if the response is not okay
        if (!response.ok) {
          throw new Error("Failed to delete the event");
        }

        // Display a success toast, navigate to the homepage
        toast({
          title: "Event deleted successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        navigate("/");
      } catch (error) {
        // Handle errors and display an error toast
        console.error("Delete error:", error.message);
        toast({
          title: "Failed to delete event",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  // Navigate back to the homepage
  const handleBackToHome = () => navigate("/");

  // Get category names for the current event
  const getCategoryNames = () => {
    return event?.categoryIds
      .map((cid) => categories.find((c) => c.id === cid)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <VStack spacing={4} align="stretch" m={4}>
      <Box p={4} borderWidth="1px" borderRadius="lg">
        {/* Display event details */}
        <Heading mb={2}>{event?.title || "Unknown Title"}</Heading>
        <Text mb={2}>{event?.description || "No description available"}</Text>
        {event?.image && <Image src={event.image} alt={event.title} mb={2} />}
        <Text mb={2}>
          Start Time: {event?.startTime || "Unknown Start Time"}
        </Text>
        <Text mb={2}>End Time: {event?.endTime || "Unknown End Time"}</Text>
        <Text mb={2}>Categories: {getCategoryNames()}</Text>
        <Box mt={4}>
          <Text fontWeight="bold">Created by:</Text>
          <Text>{creator?.name || "Unknown"}</Text>
          {creator?.image ? (
            <Image
              src={creator.image}
              alt={creator.name || "Unknown"}
              boxSize="50px"
            />
          ) : (
            <Text>No image available</Text>
          )}
        </Box>
        {/* Buttons for edit, delete, and back to homepage */}
        <Button onClick={handleEdit} colorScheme="blue" mt={4}>
          Edit
        </Button>
        <Button onClick={handleDelete} colorScheme="red" mt={4} ml={2}>
          Delete
        </Button>
        <Button onClick={handleBackToHome} colorScheme="gray" mt={4} ml={2}>
          Back to Homepage
        </Button>
      </Box>
    </VStack>
  );
};

export default EventPage;
