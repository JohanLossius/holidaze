import React, { useState, useEffect } from "react";
import { venuesApi, apiKey } from "../constants/api";
import { profileLoginUsage } from "../constants/context";
import { getToken } from "../constants/localStorage";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

const schema = yup
  .object({
    name: yup
      .string()
      .min(2, "Your name must be 2 characters or more.")
      .max(100, "Your name must be max. 100 characters.")
      .typeError("Your name must be 2-100 characters.")
      .required("Please enter your name"),
    description: yup
      .string()
      .min(2, "Min. 2 characters.")
      .max(1000, "Max. 1000 characters.")
      .typeError("Your description must only contain normal text and numbers.")
      .required("Please enter a description of your venue."),
    image: yup
      .string()
      .url("Must be a valid URL to a live and publicly accessible image.")
      .required("Please enter a URL to a live, publicly accessible image."),
    price: yup
      .number()
      .min(1, "Please enter the price per day of stay for your venue")
      .max(10000, "Max 10 000")
      .typeError("Must be a number")
      .required("Please enter the price per day of stay for your venue"),
    maxGuests: yup
      .number()
      .max(100, "Max. 100 guests")
      .typeError("Must be a number.")
      .required("Please enter the max. amount of guests that you will permit at your venue at a given visit."),
    wifi: yup
      .boolean()
      .nullable()
      .required("Please mark whether wifi is included at your venue."),
    parking: yup
      .boolean()
      .nullable()
      .required("Please mark whether parking is included at your venue."),
    breakfast: yup
      .boolean()
      .nullable()
      .required("Please mark whether guests will be served breakfast."),
    pets: yup
      .boolean()
      .nullable()
      .required("Please mark whether guests can bring pets."),
    address: yup
      .string()
      .min(2, "Min. 2 characters.")
      .max(100, "Max 100 characters.")
      .typeError("Must contain only valid normal letters and numbers in plain text.")
      .required("Please enter the address (first line) of your venue with at least 2 characters"),
    zip: yup
      .string()
      .min(2, "Min. 2 characters.")
      .max(100, "Max 100 characters.")
      .typeError("Must contain only valid numbers.")
      .required("Please enter the zip code of your venue address"),
    city: yup
      .string()
      .min(2, "Min. 2 characters.")
      .max(100, "Max 100 characters.")
      .typeError("Must contain only valid letters in plain text.")
      .required("Please enter the city or location name of your venue with least 2 characters"),
    country: yup
      .string()
      .min(2, "Min. 2 characters.")
      .max(100, "Max 100 characters.")
      .typeError("Must contain only valid letters in plain text.")
      .required("Please enter the country of your venue with least 2 characters"),
  })
  .required();

function UpdateVenue() {

  const { singleVenue, setSingleVenue, venueManagerFeedback, setVenueManagerFeedback, updateCounter, setUpdateCounter, updateManager } = profileLoginUsage();
  console.log("singlevenue state: ", singleVenue);

  const [newVenueState, setNewVenueState] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState:
      { errors },
      trigger,
      getValues,
      reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (singleVenue) {
      reset({
          name: singleVenue.name,
          description: singleVenue.description,
          image: singleVenue.media[0]?.url,
          price: singleVenue.price,
          maxGuests: singleVenue.maxGuests,
          wifi: singleVenue.meta?.wifi || false,
          parking: singleVenue.meta?.parking || false,
          breakfast: singleVenue.meta?.breakfast || false,
          pets: singleVenue.meta?.pets || false,
          address: singleVenue.location?.address,
          zip: singleVenue.location?.zip,
          city: singleVenue.location?.city,
          country: singleVenue.location?.country,
        })
      }
  }, [singleVenue, reset])

  // Handle console logging, validation with yup and react form hook
  const handleBlur = async (field) => {

    // Trigger validation for the specified field when it loses focus
    const result = await trigger(field);

    if (result) {
      // Get the current values of the form fields
      const values = getValues();
      
      if (
        !errors.name && !errors.description && !errors.image && !errors.price && !errors.maxGuests && !errors.wifi && !errors.parking && !errors.breakfast && !errors.pets && !errors.address && !errors.city && !errors.zip && !errors.country 
        && values.name && values.description && values.image && values.price && values.maxGuests && values.wifi && values.parking && values.breakfast && values.pets && values.address && values.city && values.zip && values.country 
      ) {
        console.log("Validation succeeded, data:", values);
      }
    }
  };

  async function onSubmitHandler(data) {
    // console.log("onSubmit data:", data);

    const token = getToken();

    const updateVenueApi = `${venuesApi}/${singleVenue.id}`;

    const optionsUpdateVenue = {
      method: "PUT",
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        media: [
          {
          url: data.image,
          },
        ],
        price: data.price,
        maxGuests: data.maxGuests,
        meta: {
          wifi: data.wifi,
          parking: data.parking,
          breakfast: data.breakfast,
          pets: data.pets,
        },
        location: {
          address: data.address,
          city: data.city,
          zip: data.zip,
          country:data.country
        },
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey
      }
    }

    try {
      const resp = await fetch(updateVenueApi, optionsUpdateVenue)
      const json = await resp.json();

      // console.log("Response venue update: ", json);

      if (!resp.ok) {
        document.getElementById("update-venue-section").scrollIntoView({behavior: "smooth"});
        setFeedback(<div className="text-red-500 font-bold">{json.errors[0].message}</div>);
        throw new Error(json.errors[0].message);
      }

      if (resp.ok) {
        const venueName = json.data.name;
        setSingleVenue(null);
        setVenueManagerFeedback(`${venueName} was updated successfully!`);
        updateManager();
        setTimeout(() => {
          window.scrollTo({top: 0, behavior: "smooth"});
        }, 150)
      }
    } catch (error) {
      console.log("Error venue update: " + error.message);
    }
  };

  if (!singleVenue) {
    return <section id="update-venue-section"></section>
  }

  if (singleVenue) {
    return (
      <section id="update-venue-section" className="text-center border-2 bg-tertiary border-secondary w-4/5 mx-auto rounded-[25px] my-2 p-2 xl:w-[90%] lg:w-[95%]">
        <h2 className="text-center mx-auto font-bold text-2xl s:text-lg xs:text-base">Update {singleVenue.name}</h2>
        {feedback ? <div className="text-center m-auto flex flex-col justify-center">{feedback}</div> : null }
        {/* {feedback ? <div className="text-center m-auto flex flex-col justify-center">{feedback}</div> : (
          <div className="flex flex-col justify-center text-center p-4">
            <span className="text-center m-auto font-bold text-lg">Create a new venue by filling out the relevant data:</span>
          </div>
        )} */}
        <form className="flex flex-col m-auto justify-between text-center gap-2 mt-4 xl:w-full" onSubmit={handleSubmit(onSubmitHandler)}>
          <label htmlFor="name-id" className="font-bold">Title of venue</label>
          <textarea
            {...register("name")}
            onBlur={() => handleBlur("name")}
            id="name-id"
            className="text-center bg-white w-1/2 mx-auto rounded-[25px] xl:w-4/5 s:w-[95%]"
          />
          <span className="text-red-500">{errors.name?.message}</span>
          <label htmlFor="description-id" className="font-bold">Description</label>
          <textarea
            {...register("description")}
            onBlur={() => handleBlur("description")}
            id="description-id"
            className="text-center bg-white w-1/2 rounded-[25px] h-40 resize-y m-auto break-words p-2 xl:w-4/5 s:w-[95%]"
            maxLength={1000}
          />
          <span className="text-red-500">{errors.description?.message}</span>
          <label htmlFor="image-id" className="font-bold">Venue image</label>
          <textarea
            {...register("image")}
            onBlur={() => handleBlur("image")}
            id="image-id"
            className="text-center bg-white w-1/2 rounded-[25px] h-20 resize-y m-auto break-words p-2 xl:w-4/5 s:w-[95%]"
          />
          <span className="text-red-500">{errors.image?.message}</span>
          <label htmlFor="price-id" className="font-bold">Price</label>
          <input
            {...register("price")}
            onBlur={() => handleBlur("price")}
            id="price-id"
            className="text-center bg-white w-1/2 mx-auto rounded-[25px] xl:w-4/5 s:w-[95%]"
          />
          <span className="text-red-500">{errors.price?.message}</span>
          <label htmlFor="max-guests-id" className="font-bold">Max guests</label>
          <input
            {...register("maxGuests")}
            type="number"
            onBlur={() => handleBlur("maxGuests")}
            id="max-guests-id"
            className="text-center bg-white w-1/2 mx-auto rounded-[25px] xl:w-4/5 s:w-[95%]"
          />
          <span className="text-red-500">{errors.maxGuests?.message}</span>
          <div className="flex flex-row justify-between items-center w-4/5 mx-auto gap-2 s:flex-col">
            <label htmlFor="wifi-id" className="font-bold">Wifi</label>
            <input
              type="checkbox"
              {...register("wifi")}
              onBlur={() => handleBlur("wifi")}
              id="wifi-id"
              className="text-center bg-white h-[2.5rem] w-[2.5rem] mx-auto rounded-[25px]"
            />
            <span className="text-red-500">{errors.wifi?.message}</span>
            <label htmlFor="parking-id" className="font-bold">Parking</label>
            <input
              type="checkbox"
              {...register("parking")}
              onBlur={() => handleBlur("parking")}
              id="parking-id"
              className="text-center bg-white h-[2.5rem] w-[2.5rem] mx-auto rounded-[25px]"
            />
            <span className="text-red-500">{errors.parking?.message}</span>
            <label htmlFor="breakfast-id" className="font-bold">Breakfast</label>
            <input
              type="checkbox"
              {...register("breakfast")}
              onBlur={() => handleBlur("breakfast")}
              id="breakfast-id"
              className="text-center bg-white h-[2.5rem] w-[2.5rem] mx-auto rounded-[25px]"
            />
            <span className="text-red-500">{errors.pets?.message}</span>
            <label htmlFor="pets-id" className="font-bold">Pets</label>
            <input
              {...register("pets")}
              type="checkbox"
              onBlur={() => handleBlur("pets")}
              id="pets-id"
              className="text-center bg-white h-[2.5rem] w-[2.5rem] mx-auto rounded-[25px]"
            />
            <span className="text-red-500">{errors.pets?.message}</span>
          </div>
          <label htmlFor="address-id" className="font-bold">Address</label>
          <input
            {...register("address")}
            onBlur={() => handleBlur("address")}
            id="address-id"
            className="text-center bg-white w-1/2 mx-auto rounded-[25px] xl:w-4/5 s:w-[95%]"
          />
          <span className="text-red-500">{errors.address?.message}</span>
          <label htmlFor="zip-id" className="font-bold">Zip</label>
          <input
            {...register("zip")}
            onBlur={() => handleBlur("zip")}
            id="zip-id"
            className="text-center bg-white w-1/2 mx-auto rounded-[25px] xl:w-4/5 s:w-[95%]"
          />
          <span className="text-red-500">{errors.zip?.message}</span>
          <label htmlFor="city-id" className="font-bold">City</label>
          <input
            {...register("city")}
            onBlur={() => handleBlur("city")}
            id="city-id"
            className="text-center bg-white w-1/2 mx-auto rounded-[25px] xl:w-4/5 s:w-[95%]"
          />
          <span className="text-red-500">{errors.city?.message}</span>
          <label htmlFor="country-id" className="font-bold">Country</label>
          <input
            {...register("country")}
            onBlur={() => handleBlur("country")}
            id="country-id"
            className="text-center bg-white w-1/2 mx-auto rounded-[25px] xl:w-4/5 s:w-[95%]"
          />
          <span className="text-red-500">{errors.country?.message}</span>
          <button type="submit" className="bg-primary text-white font-bold p-4 rounded-[25px] w-32 mx-auto">Update venue</button>
        </form>
      </section>
    )
  }
}

export default UpdateVenue;