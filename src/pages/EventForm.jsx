import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Box,
  Checkbox,
  Stack,
} from "@chakra-ui/react";

export const EventForm = ({ onSubmit }) => {
  // State to store event data and categories
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
  });
  const [categories, setCategories] = useState([]);

  // Fetch categories from the server when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  // Handle changes in category selection
  const handleCategoryChange = (e) => {
    const value = parseInt(e.target.value);
    const checked = e.target.checked;

    // Update categoryIds array based on checkbox state
    setEventData((prevState) => ({
      ...prevState,
      categoryIds: checked
        ? [...prevState.categoryIds, value]
        : prevState.categoryIds.filter((id) => id !== value),
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(eventData);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <VStack spacing={4}>
        {/* Title input */}
        <FormControl id="title" isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
          />
        </FormControl>

        {/* Description textarea */}
        <FormControl id="description">
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
          />
        </FormControl>

        {/* Image URL input */}
        <FormControl id="image">
          <FormLabel>Image URL</FormLabel>
          <Input
            type="text"
            name="image"
            value={eventData.image}
            onChange={handleChange}
          />
        </FormControl>

        {/* Start time input */}
        <FormControl id="startTime">
          <FormLabel>Start Time</FormLabel>
          <Input
            type="datetime-local"
            name="startTime"
            value={eventData.startTime}
            onChange={handleChange}
          />
        </FormControl>

        {/* End time input */}
        <FormControl id="endTime">
          <FormLabel>End Time</FormLabel>
          <Input
            type="datetime-local"
            name="endTime"
            value={eventData.endTime}
            onChange={handleChange}
          />
        </FormControl>

        {/* Categories checkboxes */}
        <FormControl id="categories">
          <FormLabel>Categories</FormLabel>
          <Stack spacing={2}>
            {categories.map((category) => (
              <Checkbox
                key={category.id}
                value={category.id}
                onChange={handleCategoryChange}
                isChecked={eventData.categoryIds.includes(category.id)}
              >
                {category.name}
              </Checkbox>
            ))}
          </Stack>
        </FormControl>

        {/* Submit button */}
        <Button type="submit" colorScheme="teal">
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default EventForm;
