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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileErrorMessage, setProfileErrorMessage] = useState(null);

  /**
   * Users that are not venue managers can register with a click
   * @async 
   * @function registerAsVenueManager
   * @returns {Promise<Object>} Resolves to the updated user profile data
   * @throws {Error} Throws an error if the API call fails, and displays this to the user via the profileErrorMessage state
   * 
   * Example succesful response (only venue manager state included)
   * @example
   * {
        "data": {
          "venueManager": true
        }
      }
  */
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
        // Error messaging when trying to register as venue manager:
        setProfileErrorMessage(json.errors[0].message || "An error ocurred.");

        // setVenueManagerFeedback is only relevant when user is already registered as venue manager
        setVenueManagerFeedback(null);
        throw new Error(json.errors[0].message);
      }

      if (resp.ok) {
        const venueManagerConst = json.data.venueManager;

        // venueManagerState controls whether venue manager functionality is displayed for the user
        setVenueManagerState(venueManagerConst);

        // Success feedback
        setVenueManagerFeedback("You are now a Venue Manager!");
        
        // profileErrorMessage is specifically for registering as venue manager:
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
      setProfileErrorMessage(null);
    }, [location.pathname]
  );

  /**
   * Fetches and displays bookings for a specific venue under management
   * Updates UI in viewBookingsByVenue component based on API response
   * @function showBookings
   * @param {object} venue The venue data as an object.
   * @param {string} venue.id - Gets the unique identifier for the venue
   * 
   * @returns Updates state with data for the specific venue with relevant bookings data; or an error message
   * @throws {Error} Throws an error if the API request fails.
   */

  const showBookings = (venue) => {
    console.log(venue);

    /**
     * @async
     * @function showBookingsFunction
     * @returns {Promise<Object>} Resolves to an object containing the venue with booking data
     * 
     * // Example successful response with one booking (other venue data omitted from example for brevity):
     * @example
       {
         "data": {
           "bookings": [
             {
              "id": "0ae3f319-5438-4333-beab-c7fb2a28b7c0",
              "dateFrom": "2025-02-01T00:00:00.000Z",
              "dateTo": "2025-02-28T00:00:00.000Z",
                "guests": 2,
                "created": "2025-02-02T12:06:29.560Z",
                "updated": "2025-02-02T12:06:29.560Z",
                "customer": {
                  "name": "dr_drew",
                  "email": "dr_drew@stud.noroff.no",
                  "bio": null,
                  "avatar": {
                    "url": "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400",
                    "alt": "A blurry multi-colored rainbow background"
                  },
                  "banner": {
                    "url": "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500",
                    "alt": "A blurry multi-colored rainbow background"
                  }
                }
              }
            ]
          }
        }
     */
    async function showBookingsFunction() {
      try {
        const venueId = venue.id;
        const bookingsByVenueApi = `${venuesApi}/${venueId}?_bookings=true`;
        const response = await fetch(bookingsByVenueApi, bookingsByVenueOptions);
        const json = await response.json();
        console.log(json);
        if (!response.ok) {

          // context error is connected with viewBookingsByVenue.jsx component, for dynamic error messaging there
          setContextError(json.errors[0]?.message || "Unknown error.")
          setBookingsByVenue(null);
          setContextLoading(false);
          throw new Error("An error occured.")
        }
        if (response.ok) {

          // The bookings are set with a state shared with viewBookingsByVenue component, to properly display any bookings for that venue.
          setBookingsByVenue(json.data);

          // context error is connected with viewBookingsByVenue.jsx component, for dynamic error messaging there
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

  // Displays form to update a single venue, and prepopulates it with current data for that venue.
  const handleUpdate = (venue) => {
    setSingleVenue(venue);

    // Timeout before scroll so element is displayed before scrolling
    setTimeout(() => {
      document.getElementById("update-venue-section").scrollIntoView({behavior: "smooth"});
    }, 100);
  }

  // Display the form to create a new venue and scrolls towards its position.
  const handleCreateButton = (boolean) => {
    setCreateVenueState(boolean);

    // Timeout before scroll so element is displayed before scrolling
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
        if (!venueId) {
          console.log("No venue id provided for deletion.");
          return;
        }
        const response = await fetch(deleteVenueApi, deleteOptions);
        if (!response.ok) {
          throw new Error("An unknown error occurred.");
        }
        if (response.ok) {
          setBookingsByVenue(null);

          // Controls feedback messaging based on user action
          setVenueManagerFeedback(<div className="text-red-500 font-bold">{venue.name} successfully deleted!</div>);

          // updateManager() ensures the react component re-renders correctly when a venue is deleted.
          updateManager();

          // Scrolls to top to display success message after a delay
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


  /**
   * Fetches user profile data along with venues managed by that profile
   * Runs inside useEffect and updates profileWithVenues state for further use
   * @async
   * @function getProfile 
   * @returns {Promise<Object>} Resolves to an object containing profile and venue(s) data
   * @throws {Error} Throws error if API call fails
   */
  useEffect(() => {
    async function getProfile() {
      try {
        const response = await fetch(singleProfileApi, optionsApiKey);
        const jsonObject = await response.json();

        if (!response.ok) {
          throw new Error(jsonObject.errors[0]?.message || "An unknown error occured.");
        }
        if (response.ok) {
        
          const profileVenuesCont = jsonObject.data;

          // Stores profile and venues under management data, for further use
          setProfileWithVenues(profileVenuesCont);

          // Venue manager state controls whether user must register as venue manager, or get full access to venue manager functionality
          setVenueManagerState(profileVenuesCont.venueManager);
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
      <section id="venue-manager-section" className="h-auto text-center flex flex-col items-center mt-4 border-2 bg-tertiary border-secondary w-4/5 mx-auto rounded-[25px] xl:w-[90%] lg:w-[95%]">
          { profileWithVenues ? (
            <section className="flex flex-col mx-auto justify-center justify-between my-4 mx-auto gap-4 w-4/5 xl:w-[95%] lg:w-[98%]">
              <img className="max-h-[8rem] max-w-[8rem] mx-auto h-auto w-auto" src={profileWithVenues.avatar.url || "/blank-profile-picture.png"} alt="Profile picture"></img>
              <h2 className="mx-auto font-bold text-2xl">Venue Manager</h2>
              <h3 className="text-xl font-bold mx-auto break-all">{profileWithVenues.name}</h3>
              <h4 className="text-lg underline truncate">{profileWithVenues.email}</h4>
              <div>
                <div id="register-venue-manager-id" className="flex flex-col justify-between gap-2 my-6">
                  <h3 className="font-bold text-lg">Do you want to be a Venue Manager?</h3>
                  {profileErrorMessage ? <p className="font-red-500 font-semibold mx-auto my-2">{profileErrorMessage}</p> : null}
                  <button onClick={registerAsVenueManager} type="submit" className="bg-primary text-white font-bold p-4 rounded-[25px] w-32 mx-auto max-w-[20rem] min-w-[10rem] xs:min-w-[7rem]">Click to register as a Venue Manager!</button>
                </div>
              </div>
            </section>
          ) : (
            <section className="flex flex-wrap justify-center justify-between m-4 gap-4"> 
              <div>No profile data was found. Please ensure you are logged in: <Link className="underline" to="/login">Log in</Link></div>
            </section>
          )}
      </section>
    );
  }

  return (
    <section id="venue-manager-section" className="h-auto text-center flex flex-col items-center mt-4 border-2 bg-tertiary border-secondary w-4/5 mx-auto rounded-[25px] xl:w-[90%] lg:w-[95%]">
      { profileWithVenues ? (
        <section className="flex flex-col mx-auto justify-center justify-between my-4 mx-auto gap-4 w-4/5 xl:w-[95%] lg:w-[98%]">
          <img className="max-h-[8rem] max-w-[8rem] mx-auto h-auto w-auto" title="Profile picture" src={profileWithVenues.avatar.url || "/blank-profile-picture.png"} alt="Profile picture"></img>
          <h2 className="mx-auto font-bold text-2xl">Venue Manager</h2>
          <h3 className="text-xl font-bold mx-auto">{profileWithVenues.name}</h3>
          <a href={`mailto:${profileWithVenues.email}`} className="text-lg underline truncate mx-2" title={`Send email to ${profileWithVenues.name}` || "Send email to user"}>{profileWithVenues.email}</a>
          <div>
            <section className="flex flex-col justify-between mx-auto w-full s:w-4/5 xs:w-[98%]">
              <h2 className="font-bold text-lg">Your venues</h2>
              {venueManagerFeedback ? <div className="feedback-cont mx-auto text-center font-bold text-green-500 text-lg">{venueManagerFeedback}</div> : null }
              {profileWithVenues.venues.length >= 1 ? (
                profileWithVenues.venues.map((venue) => (
                  <article key={venue.id} className="flex flex-row gap-2 justify-between items-center w-full mx-auto my-4 p-4 bg-white rounded-[25px] s:flex-col p-2 xs:py-[2px] px-0">
                    <Link to={`/venue/${venue.id}`} className="text-lg font-bold w-1/3 s:w-4/5">
                      <button className="underline">{venue.name}</button>
                    </Link>
                    <span className="w-1/3 s:w-4/5 xs:w-full">{venue.location.address}, {venue.location.zip} {venue.location.city}, {venue.location.country}</span>
                    <div className="flex flex-row gap-2 items-center w-1/3 lg:flex-col s:w-4/5 pb-2">
                      <button onClick={() => showBookings(venue)} className="rounded-lg bg-primary text-white p-2 font-bold max-w-[6rem] mx-auto xl:font-semibold text-s lg:w-[8rem]">Bookings</button>
                      <button onClick={() => handleUpdate(venue)} className="rounded-lg bg-primary text-white p-2 font-bold max-w-[6rem] mx-auto xl:font-semibold text-s lg:w-[8rem]">Update</button>
                      <button onClick={() => handleDelete(venue)} className="rounded-lg bg-primary text-white p-2 font-bold max-w-[6rem] mx-auto xl:font-semibold text-s lg:w-[8rem]">Delete</button>
                    </div>
                  </article>
                ))) : (
                  <span>You have no venues currently.</span>
                )}
            </section>
          </div>
          <button onClick={() => handleCreateButton(true)} className="rounded-lg bg-primary text-white p-2 font-bold max-w-[10rem] w-[10rem] h-auto max-h-[5rem] mx-auto xs:max-w-[7rem]">Create new +</button>
        </section>
      ) : (
        <section className="flex flex-wrap justify-center justify-between m-4 gap-4"> 
          <div>No profile data was found. Please ensure you are logged in: <Link className="underline" to="/login">Log in</Link></div>
        </section>
      )}
    </section>
  );
}

export default VenueManagerProfile;