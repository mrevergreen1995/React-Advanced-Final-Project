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
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchEventAndRelatedData = async () => {
      try {
        const [eventResponse, creatorResponse, categoriesResponse] =
          await Promise.all([
            fetch(`http://localhost:3000/events/${eventId}`),
            fetch(`http://localhost:3000/users/${event?.createdBy || ""}`),
            fetch("http://localhost:3000/categories"),
          ]);

        if (
          !eventResponse.ok ||
          !creatorResponse.ok ||
          !categoriesResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const [eventData, creatorData, categoriesData] = await Promise.all([
          eventResponse.json(),
          creatorResponse.json(),
          categoriesResponse.json(),
        ]);

        setEvent(eventData);
        setFormData(eventData);
        setCreator(creatorData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        toast({
          title: "Failed to fetch event data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchEventAndRelatedData();
  }, [eventId, event, toast]);

  const handleEdit = () => setEditMode(true);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (confirmed) {
      try {
        const response = await fetch(
          `http://localhost:3000/events/${eventId}`,
          { method: "DELETE" }
        );

        if (!response.ok) {
          throw new Error("Failed to delete the event");
        }

        toast({
          title: "Event deleted successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        navigate("/");
      } catch (error) {
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

  const handleBackToHome = () => navigate("/");

  const getCategoryNames = () => {
    return event?.categoryIds
      .map((cid) => categories.find((c) => c.id === cid)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <VStack spacing={4} align="stretch" m={4}>
      <Box p={4} borderWidth="1px" borderRadius="lg">
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
