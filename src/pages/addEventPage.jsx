import React from "react";
import { EventForm } from "./EventForm";
import { useNavigate } from "react-router-dom";

export const AddEventPage = () => {
  const navigate = useNavigate();

  const handleAddEvent = async (newEventData) => {
    // Convert categoryIds from array to string for the server
    newEventData.categoryIds = newEventData.categoryIds.map(String);

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEventData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Redirect to the events list page after successful submission
      navigate("/");
    } catch (error) {
      console.error("Error adding event:", error.message);
    }
  };

  return (
    <div>
      <h1>Add New Event</h1>
      <EventForm onSubmit={handleAddEvent} />
    </div>
  );
};
