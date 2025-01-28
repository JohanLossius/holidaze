import React from "react";
import VenueManagerProfile from "./venueManagerProfile";
import CreateVenue from "./createVenue";
import UpdateVenue from "./updateVenue";
import ViewBookingsByVenue from "./viewBookingsByVenue";

function Hosting() {
  return (
    <main className="flex flex-col mx-auto justify-between my-4">
      <h1 className="font-bold text-3xl text-center">Hosting</h1>
      <VenueManagerProfile />
      <CreateVenue />
      <UpdateVenue />
      <ViewBookingsByVenue />
    </main>
  )
}

export default Hosting;