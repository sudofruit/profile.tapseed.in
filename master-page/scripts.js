// Retrieve username from local storage
const username = localStorage.getItem("username");

// Fetching user image
axios
  .get("https://tapseed.cloud/api/images?populate=*")
  .then((response) => {
    const user = response.data.data.find(
      (item) => item.attributes.username === username
    );
    if (user) {
      const imageUrl =
        user.attributes.profile?.data?.attributes?.formats?.medium?.url;
      const coverUrl =
        user.attributes.cover_photo?.data?.attributes?.formats?.medium?.url;
      console.log("Medium Image URL:", imageUrl);

      const imageElement = document.getElementById("profileImg");
      if (imageElement && imageUrl) imageElement.src = imageUrl;
      const coverElement = document.getElementById("coverImg");
      if (coverElement && coverUrl) coverElement.src = coverUrl;
    } else {
      console.log("User image not found");
    }
  })
  .catch((error) => console.error("Error fetching image data:", error));

// Fetching profile data for name and designation
console.log(username);
async function fetchName(username) {
  const url = `https://tapseed.cloud/api/people?filters[username][$eq]=${username}`;

  try {
    const response = await fetch(url);
    const responseData = await response.json();

    if (responseData && responseData.data && responseData.data.length > 0) {
      const userData = responseData.data[0];
      console.log(userData.attributes.name);
      document.querySelector(".headername").textContent =
        userData.attributes.name;
      document.querySelector(".profession").textContent =
        userData.attributes.designation;
    } else {
      console.log("User data not found");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchName(username); // Call fetchName function

// Define a mapping of link names to image URLs
const imageMapping = {
  facebook: "facebook_image_url.jpg",
  instagram: "instagram_image_url.jpg",
  linkedin: "linkedin_image_url.jpg",
  // Add more mappings as needed
};

const apiUrl = `https://tapseed.cloud/api/links?filters[username][$eq]=${username}`;
const socialMain = document.querySelector(".socialMain");

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    data.data.forEach((link) => {
      const linkName = link.attributes.link_name;
      const linkUrl = link.attributes.Link;
      const linkStatus = link.attributes.link_on;
      const linkId = link.id;

      // Create elements for the link
      const socialView = document.createElement("div");
      socialView.classList.add("socialview");

      const socialViewInner = document.createElement("div");
      socialViewInner.classList.add("socialviewinner");

      const image = document.createElement("img");
      image.classList.add("socialimages");
      image.alt = linkName;
      // Set image source based on mapping
      image.src = getImageUrl(linkName);

      const detailsDiv = document.createElement("div");

      const heading = document.createElement("h5");
      heading.classList.add("detailtext");
      heading.textContent = linkName;

      const linkText = document.createElement("p");
      linkText.classList.add("linktext");
      linkText.textContent = linkUrl;

      detailsDiv.appendChild(heading);
      detailsDiv.appendChild(linkText);

      socialViewInner.appendChild(image);
      socialViewInner.appendChild(detailsDiv);

      const switchDiv = document.createElement("div");
      switchDiv.classList.add("form-check", "form-switch");

      const switchInput = document.createElement("input");
      switchInput.classList.add("form-check-input");
      switchInput.type = "checkbox";
      switchInput.role = "switch";
      switchInput.id = `flexSwitchCheck${linkId}`;
      switchInput.checked = linkStatus;

      // Add event listener to toggle switch
      switchInput.addEventListener("change", function (event) {
        const isChecked = event.target.checked;
        updateLinkStatus(linkId, isChecked);
      });

      switchDiv.appendChild(switchInput);

      socialView.appendChild(socialViewInner);
      socialView.appendChild(switchDiv);

      socialMain.appendChild(socialView);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function getImageUrl(linkName) {
  // Define a mapping of link names to image URLs
  const imageMapping = {
    facebook: "facebook_image_url.jpg",
    instagram: "instagram_image_url.jpg",
    linkedin: "linkedin_image_url.jpg",
    // Add more mappings as needed
  };

  return imageMapping[linkName] || "default_image_url.jpg";
}

function updateLinkStatus(linkId, isChecked) {
  // Retrieve token from local storage
  const token = localStorage.getItem("token");

  const updateUrl = `https://tapseed.cloud/api/links/${linkId}`;
  const requestBody = {
    data: {
      link_on: isChecked,
    },
  };

  fetch(updateUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // Include token in the Authorization header
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Link status updated successfully:", data);
    })
    .catch((error) => {
      console.error("Error updating link status:", error);
    });
}
