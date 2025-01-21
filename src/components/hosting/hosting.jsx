import React, { useState, useEffect } from "react";
import { profilesApi, apiKey } from "../constants/api";
import { usernameConst } from "../constants/localStorage.js";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { set, useForm } from "react-hook-form";
import { profileLoginUsage } from "../constants/context.jsx";

const singleProfileApi = `${profilesApi}/${usernameConst}?_venues=true`;

function Hosting() {
  useEffect(() => {
    async function getProfile() {
      try {
        const response = await fetch(singleProfileApi, optionsApiKey);
        const jsonObject = await response.json();
        console.log("jsonObject: ", jsonObject);
        // const venuesCont = JSON.stringify(data);
        const profileCont = jsonObject.data;
        console.log("profileCont ", profileCont);

        if (!response.ok) {
          throw new Error(jsonObject.errors[0]?.message || "An unknown error occured.");
        }
        if (response.ok) {
          setVenueManagerState(profileCont.venueManager);
          setAvatarUrlState(profileCont.avatar.url);
          setBioState(profileCont.bio);
          setProfile(profileCont);
        }
      } catch (error) {
        console.log("Error: " + error.message);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
    }, []);

    if (loading) {
    return (
      <main className="h-auto min-h-[85vh] text-center flex flex-col justify-between items-center w-full">
        <h1 className="m-auto font-bold text-3xl">Profile</h1>
        <section className="m-auto">Your profile is loading...</section>
      </main>
    )}

    if (errorMessage) {
    return (
      <main className="h-auto min-h-[85vh] text-center w-full m-auto flex flex-col">
        <p className="mx-auto mt-auto mb-2">I'm sorry, darling, but an error has occured. Technically speaking:</p>
        <p className="font-bold underline mx-auto mb-auto mt-2">{errorMessage}</p>
      </main>
    )}

    return (
    <main className="h-auto min-h-[80vh] text-center flex flex-col items-center w-full mt-4">
      <h1 className="mx-auto font-bold text-3xl">Profile</h1>
      { feedback ? <section className="mx-auto text-green-500 font-bold text-center">{feedback}</section> : null }
      { profileErrorMessage ? <section className="mx-auto font-red-500 font-bold text-center">There was an error updating your profile: {profileErrorMessage}</section> : null }
        { profile ? (
          <section className="flex flex-col mx-auto justify-center justify-between m-4 gap-4">
            {/* <img className="max-h-[25rem] max-w-[50rem] h-auto w-auto" src={profile.banner.url} alt={profile.banner?.alt || "Profile banner"}></img> */}
            <img className="max-h-[8rem] max-w-[8rem] mx-auto h-auto w-auto" src={avatarUrlState || "/blank-profile-picture.png"} alt="Profile picture"></img>
            <h2 className="text-2xl font-bold mx-auto">{profile.name}</h2>
            <h3>{profile.email}</h3>
            <p>Bookings: {profile._count.bookings}</p>
            <div>
              <span>{venueManagerState === true ? "Venue Manager: Yes" : "Venue Manager: No"}</span>
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
    </main>
  );
}

export default Hosting;