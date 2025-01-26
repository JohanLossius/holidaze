import React, { useState, useEffect } from "react";
import { profilesApi, apiKey, optionsApiKey, venuesApi, deleteOptions, bookingsByVenueOptions } from "../constants/api.js";
import { usernameConst } from "../constants/localStorage.js";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { set, useForm } from "react-hook-form";
import { profileLoginUsage } from "../constants/context.jsx";
import { useLocation } from "react-router-dom";

const singleProfileApi = `${profilesApi}/${usernameConst}?_venues=true`;

function VenueManagerProfile() {

  const { singleVenue, setSingleVenue, venueManagerFeedback, setVenueManagerFeedback, updateCounter, setUpdateCounter, updateManager, createVenueState, setCreateVenueState, bookingsByVenue, setBookingsByVenue, contextLoading, setContextLoading, contextError, setContextError } = profileLoginUsage();

  const [profileWithVenues, setProfileWithVenues] = useState([]);
  const [profileVenuesId, setProfileVenuesId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Make sure feedbacks don't linger after navigating between pages
  const location = useLocation();
  useEffect(() => {
      setVenueManagerFeedback(null);
      setBookingsByVenue(null);
      setCreateVenueState(false);
      setSingleVenue(null);
    }, [location.pathname]
  );

  // Shows booking for a single venue

  // const showBookings = (venue) => {
  //   setSingleVenueBookings(venue);
  //   document.getElementById("view-bookings-section").scrollIntoView({behavior: "smooth"});
  // }

  const showBookings = (venue) => {
    async function showBookingsFunction() {
      try {
        const venueId = venue.id;
        const bookingsByVenueApi = `${venuesApi}/${venueId}?_bookings=true`;
        const response = await fetch(bookingsByVenueApi, bookingsByVenueOptions);
        const json = await response.json();
        console.log("bookings by venoe call json: ", json)
        if (!response.ok) {
          console.log("bookings by venue error:", json.errors[0]?.message)
          setContextError(json.errors[0]?.message || "Unknown error.")
          setBookingsByVenue(null);
          setContextLoading(false);
          throw new Error("An error occured.")
        }
        if (response.ok) {
          console.log("bookings by venue success: ", json.data)
          setBookingsByVenue(json.data);
          setContextError(null);
          setContextLoading(false);
          document.getElementById("view-bookings-section").scrollIntoView({behavior: "smooth"});
        }
      } catch (error) {
        console.log("bookings by venue error: ", error.message);
      }
    }
    showBookingsFunction();
  }

  // Displays form to update a single venue, and prepopulates it with current data.
  const handleUpdate = (venue) => {
    setSingleVenue(venue);
    // setVenueManagerFeedback(null);
    document.getElementById("update-venue-section").scrollIntoView({behavior: "smooth"});
  }

  // Display the form to create a new venue and scrolls towards it position.
  const handleCreateButton = (boolean) => {
    setCreateVenueState(boolean);
    document.getElementById("create-venue-section").scrollIntoView({behavior: "smooth"});
  }

  // Functionality to delete a venue
  const handleDelete = (venue) => {
    async function deleteVenue() {
      const venueId = venue.id;
      const deleteVenueApi = `${venuesApi}/${venueId}`;
      try {
        if (!deleteVenueApi) {
          console.log("No URL provided for deletion.");
          return;
        }
        const response = await fetch(deleteVenueApi, deleteOptions);
        if (!response.ok) {
          // setErrorMessage(json.errors[0].message);
          throw new Error("An unknown error occurred.");
        }
        if (response.ok) {
          console.log("deletion successful")
          setBookingsByVenue(null);
          setVenueManagerFeedback(<div className="text-red-500 font-bold">{venue.name} successfully deleted!</div>)
          updateManager();
        }
      } catch (error) {
        console.log("error delete venue: ", error.message)
      }
    }
    deleteVenue();
  }
  
  useEffect(() => {
    async function getProfile() {
      try {
        const response = await fetch(singleProfileApi, optionsApiKey);
        const jsonObject = await response.json();
        console.log("jsonObject: ", jsonObject);
        // const venuesCont = JSON.stringify(data);
        const profileVenuesCont = jsonObject.data;
        console.log("profileCont ", profileVenuesCont);

        if (!response.ok) {
          throw new Error(jsonObject.errors[0]?.message || "An unknown error occured.");
        }
        if (response.ok) {
          // setVenueManagerState(profileCont.venueManager);
          // setAvatarUrlState(profileCont.avatar.url);
          // setBioState(profileCont.bio);
          setProfileWithVenues(profileVenuesCont);
          if (profileVenuesCont.venues.id >= 1) {
            console.log("profilewithvenues cont venues id: ", profileVenuesCont.venues.id)
            setProfileVenuesId(profileVenuesCont.venues.id);
          }
        }
      } catch (error) {
        console.log("Error: " + error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
    }, [updateCounter]);

    if (loading) {
    return (
      <section className="h-auto text-center flex flex-col justify-between items-center w-full">
        <h1 className="m-auto font-bold text-3xl">Profile</h1>
        <section className="m-auto">Your profile is loading...</section>
      </section>
    )}

    if (error) {
    return (
      <section className="h-auto text-center w-full m-auto flex flex-col">
        <p className="mx-auto mt-auto mb-2">An error has manifested. Technically speaking:</p>
        <p className="font-bold underline mx-auto mb-auto mt-2">{error}</p>
      </section>
    )}

    return (
      <section id="venue-manager-section" className="h-auto text-center flex flex-col items-center mt-4 border-2 bg-tertiary border-secondary w-4/5 mx-auto rounded-[25px]">
        {/* { feedback ? <section className="mx-auto text-green-500 font-bold text-center">{feedback}</section> : null }
        { profileErrorMessage ? <section className="mx-auto font-red-500 font-bold text-center">There was an error updating your profile: {profileErrorMessage}</section> : null } */}
          { profileWithVenues ? (
            <section className="flex flex-col mx-auto justify-center justify-between my-4 mx-auto gap-4 w-4/5">
              <img className="max-h-[8rem] max-w-[8rem] mx-auto h-auto w-auto" src={profileWithVenues.avatar.url || "/blank-profile-picture.png"} alt="Profile picture"></img>
              <h2 className="mx-auto font-bold text-2xl">Venue Manager</h2>
              <h3 className="text-xl font-bold mx-auto">{profileWithVenues.name}</h3>
              <h4 className="text-lg underline">{profileWithVenues.email}</h4>
              <div>
                <span>{profileWithVenues.venueManager === true ? "Venue Manager: Yes" : "Venue Manager: No"}</span>
              </div>
              <div>
                <section className="flex flex-col justify-between mx-auto w-full">
                  <h2 className="font-bold text-lg">Your venues</h2>
                  {venueManagerFeedback ? <div className="feedback-cont mx-auto text-center font-bold text-green-500 text-lg">{venueManagerFeedback}</div> : null }
                  {profileWithVenues.venues.length >= 1 ? (
                    profileWithVenues.venues.map((venue) => (
                      <div key={venue.id} className="flex flex-row justify-between items-center w-3/5 mx-auto my-4">
                        <span>{venue.name}</span>
                        <span>{venue.location.address}, {venue.location.zip} {venue.location.city}, {venue.location.country}</span>
                        <div className="flex flex-row gap-2 items-center">
                          <button onClick={() => showBookings(venue)} className="rounded-lg bg-primary text-white p-2 font-bold max-w-[6rem] mx-auto">Bookings</button>
                          <button onClick={() => handleUpdate(venue)} className="rounded-lg bg-primary text-white p-2 font-bold max-w-[6rem] mx-auto">Update</button>
                          <button onClick={() => handleDelete(venue)} className="rounded-lg bg-primary text-white p-2 font-bold max-w-[6rem] mx-auto">Delete</button>
                        </div>
                      </div>
                    ))) : (
                      <span>You have no venues currently.</span>
                    )}
                </section>
              </div>
              <button onClick={() => handleCreateButton(true)} className="rounded-lg bg-primary text-white p-2 font-bold max-w-[10rem] w-[10rem] h-auto max-h-[5rem] mx-auto">Create new +</button>
            </section>
          ) : (
            <section className="flex flex-wrap justify-center justify-between m-4 gap-4"> 
              <div>No profile data was found. Please ensure you are logged in: <Link className="underline" to="/login">Log in</Link></div>
            </section>
          )}
          <div>
            <img src=""></img>
          </div>
      </section>
    );
}

export default VenueManagerProfile;