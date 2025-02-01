import React, { useState, useEffect } from "react";
import { profilesApi, apiKey } from "../constants/api";
import { Link } from "react-router-dom";
import { getUsername, getToken } from "../constants/localStorage";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { profileLoginUsage } from "../constants/context.jsx";

const schemaAvatar = yup
  .object({
    avatar: yup
      .string()
      .url("Must be a valid URL to a live and publicly accessible image.")
      .required("Please enter a URL to a live, publicly accessible image."),
  })
  .required();

const schemaBio = yup
.object({
  bio: yup
    .string()
    .min(0, "Your bio must be text based and max 250 characters.")
    .max(250, "Your bio can maxiumum be 250 characters.")
    .typeError("Please enter your bio in regular text format.")
    .required("Please enter your bio of max 250 characters."),
})
.required();

// const schemaVenueManager = yup
// .object({
//   venueManager: yup
//     .boolean()
//     .required("Please mark whether you would like to be a Venue Manager."),
// })
// .required();

function Profile() {

  const { avatarUrlState, setAvatarUrlState, bioState, setBioState, venueManagerState, setVenueManagerState } = profileLoginUsage();

  // const [submittedData, setSubmittedData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [profileErrorMessage, setProfileErrorMessage] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const username = getUsername();
  const token = getToken();
  const singleProfileApi = `${profilesApi}/${username}`;

  // const optionsApiKey = {
  //   headers: {
  //     "Authorization": `Bearer ${token}`,
  //     "X-Noroff-API-Key": apiKey
  //   }
  // };

  const {
    register: registerAvatar,
    handleSubmit: handleSubmitAvatar,
    formState: { errors: avatarErrors },
    trigger: triggerAvatar,
    getValues: getValuesAvatar,
    reset: resetAvatar,
    } = useForm({
      resolver: yupResolver(schemaAvatar),
  });

  const {
    register: registerBio,
    handleSubmit: handleSubmitBio,
    formState: { errors: bioErrors },
    trigger: triggerBio,
    getValues: getValuesBio,
    reset: resetBio,
    } = useForm({
      resolver: yupResolver(schemaBio),
  });

  // Handle console logging, validation with yup and react form hook
  const handleBlurAvatar = async (field) => {
    // Trigger validation for the specified field when it loses focus
    const result = await triggerAvatar(field);
    // console.log("result avatar: ", result);
    if (result) {
      // Get the current values of the form fields
      const values = getValuesAvatar();
      if (
        !avatarErrors.avatar && values.avatar
        // !errors.avatar && !errors.bio && !errors.venueManager && values.avatar && values.bio && values.venueManager
      ) {
        console.log("Avatar validation succeeded, data:", values);
      }
    }
  };

  // Handle console logging, validation with yup and react form hook
  const handleBlurBio = async (field) => {
    // Trigger validation for the specified field when it loses focus
    const result = await triggerBio(field);
    // console.log("result bio: ", result);
    if (result) {
      // Get the current values of the form fields
      const values = getValuesBio();
      if (
        !bioErrors.bio && values.bio
        // !errors.avatar && !errors.bio && !errors.venueManager && values.avatar && values.bio && values.venueManager
      ) {
        console.log("Bio validation succeeded, data:", values);
      }
    }
  };

  // avatarhandler form

  async function onSubmitHandlerAvatar(data) {
    const avatarUrlInput = data.avatar;

    const requestAvatarUpdate = {
      method: "PUT",
      body: JSON.stringify({
        avatar: {
          url: avatarUrlInput,
        },
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey
      },
    };
        
    try {
      const resp = await fetch(singleProfileApi, requestAvatarUpdate);
      const json = await resp.json();

      if (!resp.ok) {
        setProfileErrorMessage(json.errors[0].message);
        setFeedback(null);
        throw new Error(json.errors[0].message);
      }

      if (resp.ok) {
        const avatarUrl = json.data.avatar.url;

        setAvatarUrlState(avatarUrl);
        setFeedback("Your avatar was successfully updated!")
        setProfileErrorMessage(null);

        resetAvatar();
      }

    } catch (error) {
      console.log("Error: " + error.message);
    }
  }

  // onsubmithandlerbio form

  async function onSubmitHandlerBio(data) {
    const bioInput = data.bio;

    const requestBioUpdate = {
      method: "PUT",
      body: JSON.stringify({
        bio: bioInput,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey
      },
    };
        
    try {
      const resp = await fetch(singleProfileApi, requestBioUpdate);
      const json = await resp.json();

      if (!resp.ok) {
        document.getElementById("profile-main-id").scrollIntoView({behavior: "smooth"});
        setProfileErrorMessage(json.errors[0].message);
        setFeedback(null);
        throw new Error(json.errors[0].message);
      }

      if (resp.ok) {
        document.getElementById("profile-main-id").scrollIntoView({behavior: "smooth"});
        const bioConst = json.data.bio;
        setBioState(bioConst);

        setFeedback("Your bio was successfully updated!")
        setProfileErrorMessage(null);

        resetBio();
      }

    } catch (error) {
      console.log("Error: " + error.message);
    }
  }

  // venuemanager handler form

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

        setFeedback("Venue Manager state updated!")
        setProfileErrorMessage(null);
      }

    } catch (error) {
      console.log("Error: " + error.message);
    }
  }

  useEffect(() => {
    async function getProfile() {
      try {
        // Headers
        const optionsProfile = {
          headers: {
            "Authorization": `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey
          }
        };

        const response = await fetch(singleProfileApi, optionsProfile);
        const jsonObject = await response.json();
        const profileCont = jsonObject.data;

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
    )
  }

  if (errorMessage) {
    return (
      <main className="h-auto min-h-[85vh] text-center w-full m-auto flex flex-col">
        <p className="mx-auto mt-auto mb-2">An error has occured. Technically speaking:</p>
        <p className="font-bold underline mx-auto mb-auto mt-2">{errorMessage}</p>
      </main>
    )
  }

  return (
    <main id="profile-main-id" className="h-auto min-h-[80vh] text-center flex flex-col items-center mx-auto my-4 rounded-[25px] border-2 bg-tertiary border-secondary w-4/5 lg:w-[95%]">
      <h1 className="mx-auto font-bold text-3xl">Profile</h1>
      { feedback ? <section className="mx-auto text-green-500 font-bold text-center ">{feedback}</section> : null }
      { profileErrorMessage ? <section className="mx-auto font-red-500 font-bold text-center">There was an error updating your profile: {profileErrorMessage}</section> : null }
        { profile ? (
          <section className="flex flex-col mx-auto justify-center justify-between m-4 gap-4 w-4/5 md:w-[95%]">
            <img className="max-h-[8rem] max-w-[8rem] mx-auto h-auto w-auto" src={avatarUrlState || "/blank-profile-picture.png"} alt="Profile picture"></img>
            <h2 className="text-2xl font-bold mx-auto">{profile.name}</h2>
            <a href={`mailto:${profile.email}`} className="text-lg underline truncate mx-2">{profile.email}</a>
            {/* <a href={`mailto:${profile.email}`} className="text-lg underline mx-auto truncate break-words overflow-hidden text-ellipsis whitespace-nowrap block">{profile.email}</a>
             */}
            <div>
              <p className="underline">Bio:</p>
              <span className=""> {bioState}</span>
            </div>
            <div>
              <p className="underline">Bookings:</p>
              <span className="">{profile._count.bookings}</span>
            </div>
            <div>
              <p className="underline">Venues under management:</p>
              <span className="">{profile._count.venues}</span>
            </div>
            <div className="flex flex-col w-full text-center">
              <form className="flex flex-col gap-4 items-center m-auto justify-between text-center w-full mx-auto h-full text-center my-2" onSubmit={handleSubmitAvatar(onSubmitHandlerAvatar)}>
                <label htmlFor="avatar-id" className="font-bold text-lg">Update profile picture</label>
                <span className="text-red-500">{avatarErrors.avatar?.message}</span>
                <textarea
                  {...registerAvatar("avatar")}
                  onBlur={() => handleBlurAvatar("avatar")}
                  id="avatar-id"
                  className="text-center bg-white w-full mx-auto rounded-[25px] h-20 text-lg py-4"
                  placeholder="Must be live URL and publicly acessible image"
                />
                <button type="submit" className="bg-primary w-[8rem] h-[5rem] text-white font-bold p-4 rounded-[25px] mx-auto">Update Avatar</button>
              </form>
              <form className="flex flex-col gap-4 items-center m-auto justify-between text-center w-full mx-auto h-full text-center my-2" onSubmit={handleSubmitBio(onSubmitHandlerBio)}>
                <label htmlFor="bio-id" className="font-bold text-lg">Update bio of max. 250 characters</label>
                <span className="text-red-500">{bioErrors.bio?.message}</span>
                <textarea
                  {...registerBio("bio")}
                  onBlur={() => handleBlurBio("bio")}
                  id="bio-id"
                  className="text-center bg-white w-full mx-auto rounded-[25px] h-40 overflow-hidden text-lg m-auto break-words p-4"
                  maxLength={250}
                  defaultValue={bioState}
                />
                <button type="submit" className="bg-primary w-[8rem] h-[5rem] resize-y text-white font-bold p-4 m-4 rounded-[25px] mx-auto">Update Bio</button>
              </form>
                {!venueManagerState ? (
                  <div id="register-venue-manager-id" className="flex flex-col justify-between gap-2 my-6">
                    <h3 className="font-bold text-lg">Do you want to be a Venue Manager?</h3>
                    <button onClick={registerAsVenueManager} type="submit" className="bg-primary text-white font-bold p-4 rounded-[25px] w-32 mx-auto w-[20rem]">Click to register as a Venue Manager!</button>
                  </div>
                  ) : ( 
                    <div id="register-venue-manager-id" className="my-4 flex flex-col gap-4 mx-2 text-center w-full">
                      <h3 className="text-lg font-bold mx-auto">You are a Venue Manager!</h3>
                      <Link className="font-bold mx-auto" to="/hosting">
                        <button type="submit" className="bg-primary text-white font-bold p-4 rounded-[25px] w-32 mx-auto w-[8rem]">Go to Hosting</button>
                      </Link>
                    </div>
                  )
                }
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

export default Profile;