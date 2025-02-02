import React, { useState, useEffect } from "react";

// Product list API state management
function singleVenueStates(url) {
  const [venue, setVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [maxVisitors, setMaxVisitors] = useState(100);

  // Fetches a single venue and handles user messaging, loading, error state and state management for components to use
  useEffect(() => {
    async function fetchVenue() {
      try {
        setIsLoading(true);
        setIsError(false);

        if (!url) return;

        const response = await fetch(url);
        const json = await response.json();

        if (!response) {
          setErrorMessage(json.errors[0]?.message || "An unknown error occurred.");
          throw new Error(json.errors[0]?.message);
        }

        setVenue(json.data);
        setMaxVisitors(json.data.maxGuests);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVenue();
  }, [url]);

  return { venue, isLoading, isError, errorMessage, maxVisitors };
}

export default singleVenueStates;