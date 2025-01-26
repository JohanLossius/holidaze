import React from "react";
import { venuesApi } from "../constants/api";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useParams } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-calendar/dist/Calendar.css";

const BookingCalendar = ({ selectedDates, setSelectedDates, bookedDates, setBookedDates, errorMessaging, setErrorMessaging }) => {
  // const [individualDatesSelected, setIndividualDatesSelected] = useState([]);

  const { id } = useParams();

  const handleDateChange = (dateRange) => {
    console.log("Selected Dates:", dateRange);

    const startDateSelected = new Date(dateRange[0]);
    const endDateSelected = new Date(dateRange[1]);

    let processedSelectedDate = startDateSelected;

    if (startDateSelected > endDateSelected) {
      setErrorMessaging("Date from must be earlier than Date to!");
      return;
    }
    if (startDateSelected.toDateString() === endDateSelected.toDateString()) {
      setSelectedDates(dateRange);
      setErrorMessaging(null);
      console.log("Single selected date:", startDateSelected);
      return;
    }

    const selectedDatesConst = [];

    while (processedSelectedDate <= endDateSelected) {
      selectedDatesConst.push(new Date(processedSelectedDate));
      processedSelectedDate.setDate(processedSelectedDate.getDate() + 1);
      console.log("while dates processed: ", processedSelectedDate);
    }
  
    console.log("selectedDatesConst: ", selectedDatesConst)

    const bookedDatesStringCont = bookedDates.map((date) => date.toDateString());

    const overlapCheck = selectedDatesConst.some((selectedDate) =>
      bookedDatesStringCont.includes(selectedDate.toDateString())
    );

    if (overlapCheck) {
      setErrorMessaging("Your selected dates cannot overlap already booked dates!");
      return;
    }
    if (!overlapCheck) {
      setErrorMessaging(null);
    }
    console.log("selected dates const: ", selectedDatesConst);
    // setIndividualDatesSelected(selectedDatesConst);
    setSelectedDates(dateRange);
    // console.log("individualDatesSelectedState: ", individualDatesSelected);
  };

  const bookingsByVenueApi = `${venuesApi}/${id}?_bookings=true`;
  console.log("bookingsByVenueApi: ", bookingsByVenueApi);

  useEffect(() => {
  async function fetchBookings() {
    const response = await fetch(bookingsByVenueApi);
    const jsonObject = await response.json();
    const bookingsCont = jsonObject.data.bookings;
    console.log("bookingscont: ", bookingsCont);
    clarifyBookedDates(bookingsCont);
  }

    fetchBookings();
  }, [bookingsByVenueApi]);

  // Function to get all booked dates as individual dates
  const clarifyBookedDates = (bookings) => {
    const bookedDatesCont = [];

    bookings.forEach((booking) => {
      const startDate = new Date(booking.dateFrom);
      const endDate = new Date(booking.dateTo);

      let processedDate = startDate;

      // Logging and skipping invalid bookings where dateFrom is after dateTo. Should not be possible in API.
      if (startDate > endDate) {
        console.log("Skipping invalid booking, booking.id: ", booking.id);
        console.warn(`Invalid date range for booking ID: ${booking.id}`, {
          dateFrom: booking.dateFrom,
          dateTo: booking.dateTo,
        });
        return;
      }

      while (processedDate <= endDate) {
        bookedDatesCont.push(new Date(processedDate));
        processedDate.setDate(processedDate.getDate() + 1);
      }
      // console.log("bookedDates: ", bookedDates)
    })
    setBookedDates(bookedDatesCont);
  }

  // Are one of the booked dates corresponding with the date in question
  const isDateBooked = (date) => {
    // console.log("console log inside isDateBooked for booked Dates: ", bookedDates)
    return bookedDates.some((bookedDate) => bookedDate.toDateString() === date.toDateString());
  };

  // If the view is monthly view and the date is booked, checked by isDateBooked helper function, then tile is disabled
  const disableTileFunction = ({date, view}) => {
    return view === "month" && isDateBooked(date);
  };

  // Booked dates are differently styled
  const tileBookedStyling = ({ date, view }) => {
    if (view === "month" && isDateBooked(date)) {
      return "bg-gray-900 text-gray-200 font-bold";
    }
    return "";
  }

  if (!bookedDates) {
    return <h3 className="text-lg font-bold mx-auto">Calendar is loading...</h3>
  }
  
  return (
    <div>
      <h3 className="mx-auto font-bold text-xl mb-2">Booking Calendar</h3>
      <Calendar
        selectRange
        onChange={handleDateChange}
        tileDisabled={disableTileFunction}
        tileClassName={tileBookedStyling}
      />
      {errorMessaging ? (errorMessaging) : (
        <div>
          {selectedDates[0] ? (
          <div>
            <h4 className="mx-auto font-bold text-lg my-2">Your selected dates:</h4>
            <p className="my-2">
              <span className="underline">Date from:</span>
              <span> {selectedDates[0]?.toDateString()}</span>
            </p>
            <p className="my-2">
              <span className="underline">Date to:</span>
              <span> {selectedDates[1]?.toDateString()}</span>
            </p>
          </div>
          ) : ( null )}
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;