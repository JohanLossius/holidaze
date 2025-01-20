import { usernameConst, token, avatarUrlConst } from "./localStorage.js";

// This is the API key created for the Holidaze application
export const apiKey = "50496220-e16e-46a0-a4c6-2152a2d567b2";

// Headers
export const optionsApiKey = {
  headers: {
    "Authorization": `Bearer ${token}`,
    "X-Noroff-API-Key": apiKey
  }
};

// API base urls
const apiBase = "https://v2.api.noroff.dev";
const holidazeApiEndpoint = "/holidaze";

export const holidazeApi = `${apiBase}${holidazeApiEndpoint}`;

// Signup and login endpoints

const signupEndpoint = "/auth/register";
const loginEndpoint = "/auth/login";

export const signupApi = `${apiBase}${signupEndpoint}`;
export const loginApi = `${apiBase}${loginEndpoint}`;

// Profile, bookings and venues endpoints etc.

export const profilesApi = `${holidazeApi}/profiles`;
export const bookingsApi = `${holidazeApi}/bookings`;
export const venuesApi = `${holidazeApi}/venues`;
export const singleVenueApiBase = `${holidazeApi}/venues`

export const searchQueryVenuesBase = `${venuesApi}/search?q=`;

/* Full search query example:
`${venuesApi}/search?q=Granca`; 
"Granca" is the search query, and changed dynamically.
*/

export const searchQueryProfilesBase = `${profilesApi}/search?q=`;

/* Full search query example:
`${profilesApi}/search?q=Bardur`; 
"Bardur" is the search query, and changed dynamically.
*/