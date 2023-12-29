import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";

export const EventPage = () => {
  // States for event data, creator, and form handling
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
  const { eventId } = useParams(); // Getting event ID from URL params
  const navigate = useNavigate(); // Hook for navigation
  const toast = useToast(); // Toast for showing notifications

  // Effect hook to fetch event data and its related data (creator and categories)
  useEffect(() => {
    const fetchEventAndRelatedData = async () => {
      // Fetch event details from the server
      const eventResponse = await fetch(
        `http://localhost:3000/events/${eventId}`
      );
      if (!eventResponse.ok) throw new Error("Failed to fetch event");
      const eventData = await eventResponse.json();

      // Fetch creator details
      const creatorResponse = await fetch(
        `http://localhost:3000/users/${eventData.createdBy}`
      );
      if (creatorResponse.ok) {
        const creatorData = await creatorResponse.json();
        setCreator(creatorData);
      }

      // Fetch categories for displaying category names
      const categoriesResponse = await fetch(
        "http://localhost:3000/categories"
      );
      if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
      const categoriesData = await categoriesResponse.json();

      setEvent(eventData);
      setFormData(eventData); // Initialize form with event data
      setCategories(categoriesData);
    };

    fetchEventAndRelatedData();
  }, [eventId]);

  // Handle changes in form inputs
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Toggle edit mode
  const handleEdit = () => setEditMode(true);

  // Cancel edit mode and reset form data
  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData(event); // Reset to original event data
  };

  // Save edited event data
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update the event");
      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      setEditMode(false);
      toast({
        title: "Event updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Update error:", error.message);
      toast({
        title: "Failed to update event",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Delete event
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
        if (!response.ok) throw new Error("Failed to delete the event");
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

  // Navigate back to the events list page
  const handleBackToHome = () => navigate("/");

  // Utility function to get category names based on category IDs
  const getCategoryNames = () => {
    return event.categoryIds
      .map((cid) => categories.find((c) => c.id === cid)?.name)
      .filter(Boolean)
      .join(", ");
  };

  if (!event || !creator) return <Box>Loading...</Box>; // Display loading state if data is not fetched

  return (
    <VStack spacing={4} align="stretch" m={4}>
      {editMode ? (
        // Edit Mode: Form to edit the event details
        <Box as="form" onSubmit={handleSaveEdit}>
          {/* Form fields for editing event details */}
          <FormControl id="title" isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleFormChange}
            />
          </FormControl>
          <FormControl id="description">
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
            />
          </FormControl>
          <FormControl id="image">
            <FormLabel>Image URL</FormLabel>
            <Input
              name="image"
              value={formData.image}
              onChange={handleFormChange}
            />
          </FormControl>
          <FormControl id="startTime">
            <FormLabel>Start Time</FormLabel>
            <Input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleFormChange}
            />
          </FormControl>
          <FormControl id="endTime">
            <FormLabel>End Time</FormLabel>
            <Input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleFormChange}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" mt={4}>
            Save
          </Button>
          <Button onClick={handleCancelEdit} mt={4} ml={2}>
            Cancel
          </Button>
        </Box>
      ) : (
        // Display Mode: Event details
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <Heading mb={2}>{event.title}</Heading>
          <Text mb={2}>{event.description}</Text>
          <Image src={event.image} alt={event.title} mb={2} />
          <Text mb={2}>Start Time: {event.startTime}</Text>
          <Text mb={2}>End Time: {event.endTime}</Text>
          <Text mb={2}>Categories: {getCategoryNames()}</Text>
          {/* Displaying creator's details */}
          <Box mt={4}>
            <Text fontWeight="bold">Created by:</Text>
            <Text>{creator.name}</Text>
            <Image src={creator.image} alt={creator.name} boxSize="50px" />
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
      )}
    </VStack>
  );
};

export default EventPage;
