import React from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Root } from "./components/Root";
import { EventsPage } from "./pages/EventsPage";
import { EventPage } from "./pages/EventPage";
import { AddEventPage } from "./pages/AddEventPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <EventsPage />,
      },
      {
        path: "/event/:eventId",
        element: <EventPage />,
      },
      {
        path: "/add-event",
        element: <AddEventPage />,
      },
    ],
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
