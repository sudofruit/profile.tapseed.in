// Declare userIds in the outer scope
let token = localStorage.getItem("token") || ""; // Get token from local storage or initialize as empty string if not found

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
      "https://strapi-deployment-xh5t.onrender.com/api/images?populate=*"
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
      imageData.attributes.profile?.data?.attributes?.formats?.medium?.url ||
      null;
    const coverPhotoUrl =
      imageData.attributes.cover_photo?.data?.attributes?.formats?.medium
        ?.url || null;
    userIds = imageData.id; // Assign value to userIds

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
  const refId = 10; // Change the refId as needed

  const form = document.getElementById(formId);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("ref", ref);
    formData.append("refId", refId);
    formData.append("field", field);

    try {
      const response = await fetch(
        "https://strapi-deployment-xh5t.onrender.com/api/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

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
