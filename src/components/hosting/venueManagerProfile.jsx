import React, { useState, useEffect } from "react";
import { profilesApi, apiKey, venuesApi } from "../constants/api.js";
import { getUsername, getToken } from "../constants/localStorage.js";
import { profileLoginUsage } from "../constants/context.jsx";
import { useLocation, Link } from "react-router-dom";

function VenueManagerProfile() {

  const username = getUsername();
  const token = getToken();

  const optionsApiKey = {
    headers: {
      "Authorization": `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey
    }
  };

  const deleteOptions = {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey
    }
  }

  const bookingsByVenueOptions = {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey
    }
  }

  const singleProfileApi = `${profilesApi}/${username}?_venues=true`;

  const { singleVenue, setSingleVenue, venueManagerFeedback, setVenueManagerFeedback, updateCounter, setUpdateCounter, updateManager, createVenueState, setCreateVenueState, bookingsByVenue, setBookingsByVenue, contextLoading, setContextLoading, contextError, setContextError, venueManagerState, setVenueManagerState } = profileLoginUsage();

  const [profileWithVenues, setProfileWithVenues] = useState([]);
  const [profileVenuesId, setProfileVenuesId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Allow users to register as Venue Manager on hosting page
  const registerAsVenueManager = async () => {
    const requestVenueManagerUpdate = {
      method: "PUT",
      body: JSON.stringify({
        venueManager: true,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey
      },
    };
        
    try {
      const resp = await fetch(singleProfileApi, requestVenueManagerUpdate);
      const json = await resp.json();

      if (!resp.ok) {
        setProfileErrorMessage(json.errors[0].message);
        setFeedback(null);
        throw new Error(json.errors[0].message);
      }

      if (resp.ok) {
        const venueManagerConst = json.data.venueManager;
        setVenueManagerState(venueManagerConst);
        setFeedback("You are now a Venue Manager!")
        setProfileErrorMessage(null);
      }

    } catch (error) {
      console.log("Error: " + error.message);
    }
  }

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
        if (!response.ok) {
          setContextError(json.errors[0]?.message || "Unknown error.")
          setBookingsByVenue(null);
          setContextLoading(false);
          throw new Error("An error occured.")
        }
        if (response.ok) {
          setBookingsByVenue(json.data);
          setContextError(null);
          setContextLoading(false);
          
          // Let Bookings By Venue section be displayed before scroll into view
          setTimeout(() => {
            document.getElementById("view-bookings-section").scrollIntoView({behavior: "smooth"});
          }, 100);
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
    setTimeout(() => {
      document.getElementById("update-venue-section").scrollIntoView({behavior: "smooth"});
    }, 100);
  }

  // Display the form to create a new venue and scrolls towards it position.
  const handleCreateButton = (boolean) => {
    setCreateVenueState(boolean);
    setTimeout(() => {
      document.getElementById("create-venue-section").scrollIntoView({behavior: "smooth"});
    }, 100);
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
          throw new Error("An unknown error occurred.");
        }
        if (response.ok) {
          setBookingsByVenue(null);
          setVenueManagerFeedback(<div className="text-red-500 font-bold">{venue.name} successfully deleted!</div>)
          updateManager();
          setTimeout(() => {
            window.scrollTo({top: 0, behavior: "smooth"});
          }, 150)
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
        const profileVenuesCont = jsonObject.data;

        if (!response.ok) {
          throw new Error(jsonObject.errors[0]?.message || "An unknown error occured.");
        }
        if (response.ok) {
          setProfileWithVenues(profileVenuesCont);
          setVenueManagerState(profileVenuesCont.venueManager);
          if (profileVenuesCont.venues.id >= 1) {
            setProfileVenuesId(profileVenuesCont.venues.id);
          }
        }
      } catch (error) {
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

    if (!venueManagerState) {
      return (
        <section id="venue-manager-section" className="h-auto text-center flex flex-col items-center mt-4 border-2 bg-tertiary border-secondary w-4/5 mx-auto rounded-[25px]">
            { profileWithVenues ? (
              <section className="flex flex-col mx-auto justify-center justify-between my-4 mx-auto gap-4 w-4/5">
                <img className="max-h-[8rem] max-w-[8rem] mx-auto h-auto w-auto" src={profileWithVenues.avatar.url || "/blank-profile-picture.png"} alt="Profile picture"></img>
                <h2 className="mx-auto font-bold text-2xl">Venue Manager</h2>
                <h3 className="text-xl font-bold mx-auto">{profileWithVenues.name}</h3>
                <h4 className="text-lg underline">{profileWithVenues.email}</h4>
                <div>
                  <div id="register-venue-manager-id" className="flex flex-col justify-between gap-2 my-6">
                    <h3 className="font-bold text-lg">Do you want to be a Venue Manager?</h3>
                    <button onClick={registerAsVenueManager} type="submit" className="bg-primary text-white font-bold p-4 rounded-[25px] w-32 mx-auto w-[20rem]">Click to register as a Venue Manager!</button>
                  </div>
                </div>
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

    return (
      <section id="venue-manager-section" className="h-auto text-center flex flex-col items-center mt-4 border-2 bg-tertiary border-secondary w-4/5 mx-auto rounded-[25px]">
          { profileWithVenues ? (
            <section className="flex flex-col mx-auto justify-center justify-between my-4 mx-auto gap-4 w-4/5">
              <img className="max-h-[8rem] max-w-[8rem] mx-auto h-auto w-auto" title="Profile picture" src={profileWithVenues.avatar.url || "/blank-profile-picture.png"} alt="Profile picture"></img>
              <h2 className="mx-auto font-bold text-2xl">Venue Manager</h2>
              <h3 className="text-xl font-bold mx-auto">{profileWithVenues.name}</h3>
              <h4 className="text-lg underline">{profileWithVenues.email}</h4>
              <div>
                <section className="flex flex-col justify-between mx-auto w-full">
                  <h2 className="font-bold text-lg">Your venues</h2>
                  {venueManagerFeedback ? <div className="feedback-cont mx-auto text-center font-bold text-green-500 text-lg">{venueManagerFeedback}</div> : null }
                  {profileWithVenues.venues.length >= 1 ? (
                    profileWithVenues.venues.map((venue) => (
                      <article key={venue.id} className="flex flex-row gap-2 justify-between items-center w-full mx-auto my-4 p-4 bg-white rounded-[25px]">
                        <Link to={`/venue/${venue.id}`} className="text-lg font-bold w-1/3">
                          <span className="">{venue.name}</span>
                        </Link>
                        <span className="w-1/3">{venue.location.address}, {venue.location.zip} {venue.location.city}, {venue.location.country}</span>
                        <div className="flex flex-row gap-2 items-center w-1/3">
                          <button onClick={() => showBookings(venue)} className="rounded-lg bg-primary text-white p-2 font-bold max-w-[6rem] mx-auto">Bookings</button>
                          <button onClick={() => handleUpdate(venue)} className="rounded-lg bg-primary text-white p-2 font-bold max-w-[6rem] mx-auto">Update</button>
                          <button onClick={() => handleDelete(venue)} className="rounded-lg bg-primary text-white p-2 font-bold max-w-[6rem] mx-auto">Delete</button>
                        </div>
                      </article>
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