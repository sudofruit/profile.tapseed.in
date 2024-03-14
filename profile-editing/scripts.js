// Declare userIds in the outer scope
let token = localStorage.getItem("token") || ""; // Get token from local storage or initialize as empty string if not found
let userIds = null; // Declare userIds variable in the outer scope

async function fetchImageDataByUsernameAndUpdate(username) {
  try {
    // Fetch data from local storage
    const storedUsername = localStorage.getItem("username");

    if (storedUsername === null) {
      console.error("Username not found in local storage");
      return;
    }

    // Make API request
    const response = await axios.get(
      "https://tapseed.cloud/api/images?populate=*"
    );

    // Find image data corresponding to the username
    const imageData = response.data.data.find(
      (image) => image.attributes.username === storedUsername
    );

    if (!imageData) {
      console.error("Image data not found for username:", storedUsername);
      return;
    }

    // Extract medium URLs for profile and cover_photo
    const profileUrl =
      "https://tapseed.cloud" +
      (imageData.attributes.profile?.data?.attributes?.formats?.medium?.url ||
        "/uploads/profile_photo_2877226d51.png"); // Set default profile image URL
    const coverPhotoUrl =
      "https://tapseed.cloud" +
      (imageData.attributes.cover_photo?.data?.attributes?.formats?.medium
        ?.url || "/uploads/6938839_3409297_5965f10c59.jpg");

    userIds = imageData.id; // Assign value to userIds

    console.log("User Ids:", userIds); // Log userIds
    console.log("Image Data:", imageData); // Log fetched image data
    console.log("Profile URL:", profileUrl);
    console.log("Cover Photo URL:", coverPhotoUrl);

    // Update image URLs
    document.getElementById("profileImg").src = profileUrl;
    document.getElementById("coverImg").src = coverPhotoUrl;
  } catch (error) {
    console.error("Error fetching image data:", error);
  }
}

// Call the function with the username retrieved from local storage
const storedUsername = localStorage.getItem("username");
fetchImageDataByUsernameAndUpdate(storedUsername);

// Function to handle image upload
const uploadImage = async (formId, field) => {
  const ref = "api::image.image";

  const form = document.getElementById(formId);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("ref", ref);
    formData.append("refId", userIds); // Use userIds here
    formData.append("field", field);

    try {
      const response = await fetch("https://tapseed.cloud/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("File(s) uploaded successfully");
        // Refresh the page after successful upload
        window.location.reload();
      } else {
        console.error("File upload failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading file(s):", error);
    }
  });
};

// Call the function to handle profile image upload
uploadImage("uploadForm", "profile");

// Call the function to handle cover image upload
uploadImage("uploadCover", "cover_photo");

// update profile data

// Function to fetch user data
async function fetchAndUpdateUserData() {
  const apiUrl = "https://tapseed.cloud/api/people";
  const storedUsername = localStorage.getItem("username");

  try {
    if (!storedUsername) {
      console.error("Username not found in local storage");
      return;
    }

    const response = await axios.get(
      `${apiUrl}?filters[username][$eq]=${storedUsername}`
    );
    console.log("Response:", response.data);

    if (!response.data.data || response.data.data.length === 0) {
      console.error("User data not found in the response.");
      return;
    }

    const userData = response.data.data[0].attributes;
    console.log("User Data:", userData);

    // Update input fields with fetched data
    document.getElementById("name").value = userData.name || "";
    document.getElementById("email").value = userData.email || "";
    document.getElementById("designation").value = userData.designation || "";
    document.getElementById("organization_name").value =
      userData.organization_name || "";
    document.getElementById("bio").value = userData.bio || "";
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Call the fetchAndUpdateUserData function when the page loads
fetchAndUpdateUserData();

// Event listener for the save button
document
  .getElementById("save-button")
  .addEventListener("click", async function () {
    const apiUrl = "https://tapseed.cloud/api/people";
    let jwtToken = localStorage.getItem("token");

    try {
      // Check if JWT token exists
      if (!jwtToken) {
        console.error("JWT token not found in local storage.");
        alert("Please log in to update your profile.");
        return;
      }

      const response = await axios.get(
        `${apiUrl}?filters[username][$eq]=${storedUsername}`
      );

      if (!response.data.data || response.data.data.length === 0) {
        console.error("User data not found in the response.");
        alert("User data not found. Please try again.");
        return;
      }

      const userId = response.data.data[0].id;

      const newData = {
        data: {
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          designation: document.getElementById("designation").value,
          organization_name: document.getElementById("organization_name").value,
          bio: document.getElementById("bio").value,
          // Add more fields as needed
        },
      };

      // PUT request to update data
      const putResponse = await axios.put(`${apiUrl}/${userId}`, newData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      console.log("PUT request successful:", putResponse.data);
      alert("Data Updated Successfully");
    } catch (error) {
      console.error("Error updating data:", error);
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Please check your JWT token.");
        alert("Unauthorized: Please log in again to update your profile.");
      } else {
        alert("Error updating data. Please try again.");
      }
    }
  });
