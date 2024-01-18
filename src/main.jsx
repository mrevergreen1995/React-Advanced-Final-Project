import React from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Root } from "./components/Root";
import { EventsPage } from "./pages/EventsPage";
import { EventPage } from "./pages/EventPage";
import { AddEventPage } from "./pages/addEventPage";

// Create a browser router with route configuration
const router = createBrowserRouter([
  {
    path: "/",
    // Root component is rendered at the root path "/"
    element: <Root />,
    children: [
      {
        path: "/",
        // EventsPage component is rendered at the nested path "/",
        // within the Root component
        element: <EventsPage />,
      },
      {
        path: "/event/:eventId",
        // EventPage component is rendered at the nested path "/event/:eventId",
        // within the Root component
        element: <EventPage />,
      },
      {
        path: "/add-event",
        // AddEventPage component is rendered at the nested path "/add-event",
        // within the Root component
        element: <AddEventPage />,
      },
    ],
  },
]);

// Render the application using ChakraProvider for UI theming
ReactDOM.render(
  <React.StrictMode>
    {/* ChakraProvider wraps the entire application for Chakra UI theming */}
    <ChakraProvider>
      {/* RouterProvider provides the router context to the application */}
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
  // Render the application into the root HTML element with id "root"
  document.getElementById("root")
);
