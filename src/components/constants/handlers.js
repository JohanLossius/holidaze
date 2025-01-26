// Handle max 2 decimals functionality
export function maxTwoDecimals(price) {
  if (price % 1 === 0) {
    return price.toFixed(0);
  } else {
    return price.toFixed(2);
  }
}

// // Handle max 50 characters functionality
// export function maxFiftyCharacters(description) {
//   if (description % 1 === 0) {
//     return price.toFixed(0);
//   } else {
//     return price.toFixed(2);
//   }
// }

// const updateProfileAvatar = submitButton.addEventListener("click", async (data) => {
//   data.preventDefault();

//   const profileUrlInput = document.querySelector(".input-avatar-url");
//   const profileUrlConst = profileUrlInput.value;

//   const optionsProfilePut = {
//     method: 'PUT',
//     body: JSON.stringify({
//       avatar: `${profileUrlConst}`,
//     }),
//     headers: {
//       'Content-type': 'application/json; charset=UTF-8',
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   try {
//     const resp = await fetch(profilePicUpdateUrl, optionsProfilePut);
//     const json = await resp.json();

//     const profilePictureUrl2 = json.avatar;
//     if (!resp.ok) {
//       throw new Error(json.errors[0].message);
//     }
//     if (resp.ok) {
//       localStorage.setItem("profilePictureUrl", profilePictureUrl2);
//       location.reload();
//     }
//   }
//   catch (error) {
//     console.log(error);
//     profileFeedbackCont.innerHTML = `<span class="error-message">${error}</span>`
//   }
// });
