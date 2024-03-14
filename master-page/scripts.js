// Mapping data provided
const mappingData = {
  whatsapp: "https://tapseed.cloud/uploads/whatsapp_icon_2c1255c072.png",
  website: "https://tapseed.cloud/uploads/browser_icon_aadc966123.png",
  phone: "https://tapseed.cloud/uploads/phone_icon_275497ff7c.png",
  facebook: "https://tapseed.cloud/uploads/facebook_icon_6b6420ab3b.png",
  instagram: "https://tapseed.cloud/uploads/instagram_icon_b9e86a2bd2.png",
  linkedin: "https://tapseed.cloud/uploads/linkedin_deab9b8ad4.png",
  email: "https://tapseed.cloud/uploads/email_icon_d6d4621dbb.png",
  message: "https://tapseed.cloud/uploads/messages_icon_1901bda864.png",
  x: "https://tapseed.cloud/uploads/twitter_0b0fd46945.png",
  snapchat: "https://tapseed.cloud/uploads/snapchat_819240ca30.png",
  youtube: "https://tapseed.cloud/uploads/youtube_ec54ba8a39.png",
  "make my trip": "https://tapseed.cloud/uploads/make_my_trip_88836c0b68.png",
  "google business": "https://tapseed.cloud/uploads/gmb_icon_4bbf255130.png",
  bookmyshow: "https://tapseed.cloud/uploads/bookmyshow_a1353e1416.png",
  spotify: "https://tapseed.cloud/uploads/spotify_icon_69ddbf03b3.png",
  Soundcloud: "https://tapseed.cloud/uploads/soundcloud_8760926e60.png",
  skype: "https://tapseed.cloud/uploads/skype_d7fa5741bf.png",
  line: "https://tapseed.cloud/uploads/line_10211a5995.png",
  facetime: "https://tapseed.cloud/uploads/gmb_icon_4bbf255130.png",
  tiktok: "https://tapseed.cloud/uploads/tiktok_f7557eb220.png",
  threads: "https://tapseed.cloud/uploads/threads_9dbf12e3ae.png",
  likee: "https://tapseed.cloud/uploads/likee_cff7699c95.png",
  tripadvisor: "https://tapseed.cloud/uploads/tripadvisor_icon_e9e9ed8ea5.png",
};

// Define a mapping of link names to image URLs
let imageMapping = { ...mappingData };

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
      if (imageElement && imageUrl) {
        const fullUrl = `https://tapseed.cloud${imageUrl}`;
        imageElement.src = fullUrl;
      }

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

const apiUrl = `https://tapseed.cloud/api/links?filters[username][$eq]=${username}`;
const socialMain = document.querySelector(".socialMain");

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    data.data.forEach((link) => {
      const linkName = link.attributes.link_name;
      const linkTex = link.attributes.link_text;
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
      linkText.textContent = linkTex;

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
  // Check if the linkName exists in the imageMapping object
  if (imageMapping.hasOwnProperty(linkName)) {
    return imageMapping[linkName];
  } else {
    // If the linkName doesn't exist in the mapping, return a default image URL
    return "default_image_url.jpg";
  }
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
