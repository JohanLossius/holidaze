const apiBase = "https://v2.api.noroff.dev/wp-json/wp/v2/";
const holidazeApiEndpoint = "holidaze/";

// This is the API key created for the Holidaze application
export const apiKey = "50496220-e16e-46a0-a4c6-2152a2d567b2";

// Example of usage for the API key:
// const options = {
//   headers: {
//     "Authorization": `Bearer ${accessToken}`,
//     "X-Noroff-API-Key": "50496220-e16e-46a0-a4c6-2152a2d567b2"
//   }
// };

export const holidazeApi = `${apiBase}${holidazeApiEndpoint}`;

export const profilesApi = `${holidazeApi}profiles`;
export const bookingsApi = `${holidazeApi}bookings`;
export const venuesApi = `${holidazeApi}venues`;

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