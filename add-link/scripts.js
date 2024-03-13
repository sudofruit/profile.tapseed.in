// Define a global variable to store the h5Text
var h5Text = "";

document.addEventListener("DOMContentLoaded", function () {
  // Define the map of social apps to their associated values
  const socialAppValues = {
    whatsapp: {
      input: "whatsapp number",
      imagePath: "https://tapseed.cloud/uploads/whatsapp_icon_2c1255c072.png",
    },
    website: {
      input: "link",
      imagePath: "https://tapseed.cloud/uploads/browser_icon_aadc966123.png",
    },
    phone: {
      input: "phone number",
      imagePath: "https://tapseed.cloud/uploads/phone_icon_275497ff7c.png",
    },
    facebook: {
      input: "profile name",
      imagePath: "https://tapseed.cloud/uploads/facebook_icon_6b6420ab3b.png",
    },

    instagram: {
      input: "profile name",
      imagePath: "https://tapseed.cloud/uploads/instagram_icon_b9e86a2bd2.png",
    },
    linkedin: {
      input: "link",
      imagePath: "https://tapseed.cloud/uploads/linkedin_deab9b8ad4.png",
    },
    email: {
      input: "email id",
      imagePath: "https://tapseed.cloud/uploads/email_icon_d6d4621dbb.png",
    },
    message: {
      input: "phone number",
      imagePath: "https://tapseed.cloud/uploads/messages_icon_1901bda864.png",
    },

    x: {
      input: "profile",
      imagePath: "https://tapseed.cloud/uploads/twitter_0b0fd46945.png",
    },
    snapchat: {
      input: "profile",
      imagePath: "https://tapseed.cloud/uploads/snapchat_819240ca30.png",
    },
    youtube: {
      input: "channel name",
      imagePath: "https://tapseed.cloud/uploads/youtube_ec54ba8a39.png",
    },
    "make my trip": {
      input: "link",
      imagePath: "https://tapseed.cloud/uploads/make_my_trip_88836c0b68.png",
    },

    "google business": {
      input: "review link",
      imagePath: "https://tapseed.cloud/uploads/gmb_icon_4bbf255130.png",
    },
    bookmyshow: {
      input: "link",
      imagePath: "https://tapseed.cloud/uploads/bookmyshow_a1353e1416.png",
    },
    spotify: {
      input: "link",
      imagePath: "https://tapseed.cloud/uploads/spotify_icon_69ddbf03b3.png",
    },
    Soundcloud: {
      input: "link",
      imagePath: "https://tapseed.cloud/uploads/soundcloud_8760926e60.png",
    },

    skype: {
      input: "link",
      imagePath: "https://tapseed.cloud/uploads/skype_d7fa5741bf.png",
    },
    line: {
      input: "link",
      imagePath: "https://tapseed.cloud/uploads/line_10211a5995.png",
    },

    facetime: {
      input: "link",
      imagePath: "https://tapseed.cloud/uploads/gmb_icon_4bbf255130.png",
    },
    tiktok: {
      input: "link",
      imagePath: "https://tapseed.cloud/uploads/tiktok_f7557eb220.png",
    },
    threads: {
      input: "profile",
      imagePath: "https://tapseed.cloud/uploads/threads_9dbf12e3ae.png",
    },
    likee: {
      input: "link",
      imagePath: "https://tapseed.cloud/uploads/likee_cff7699c95.png",
    },

    tripadvisor: {
      input: "link",
      imagePath:
        "https://tapseed.cloud/uploads/tripadvisor_icon_e9e9ed8ea5.png",
    },

    // Add more mappings as needed
  };

  document
    .getElementById("container px-0 profile")
    .addEventListener("click", function (event) {
      // Check if the clicked element has an ID
      if (event.target.id) {
        // Print the ID of the clicked element
        console.log(event.target.id);
        const idName = event.target.id;

        // Access the value of data-icon attribute
        var dataIconElement = document.querySelector(`[data-icon="${idName}"]`);
        if (!dataIconElement) {
          console.error("Error: data-icon attribute not found.");
          return;
        }

        var dataIconValue = dataIconElement.getAttribute("data-icon");

        // Get the text content of the <h5> element and convert it to lowercase
        h5Text = document
          .querySelector(`[data-icon="${dataIconValue}"] h5`)
          ?.textContent.toLowerCase();

        // Get the associated object for the clicked social app
        var socialApp = socialAppValues[h5Text];

        // If the associated object exists
        if (socialApp) {
          // Update the text content of the element with id "link" to the input value
          var linkElement = document.getElementById("link");
          linkElement.textContent = socialApp.input;

          // Update the src attribute of the image element with id "popupImage"
          var imageElement = document.getElementById("popupImage");
          imageElement.src = socialApp.imagePath; // Use socialApp.imagePath directly

          // Print the input value and imagePath to the console
          console.log("Input:", socialApp.input);
          console.log("Image Path:", socialApp.imagePath);
        } else {
          // If no associated object found, log an error
          console.error("No data found for the clicked social app:", h5Text);
        }
      } else {
        // Print 'No ID' if the clicked element doesn't have an ID
        console.log("No ID");
      }
    });

  document.getElementById("addButton").addEventListener("click", function () {
    // Retrieve data from the DOM
    var username = localStorage.getItem("username");
    var token = localStorage.getItem("token");

    var linkTextValue = document.getElementById("linkText").value;
    var linkValue = document.getElementById("link_value").value;

    var link_on = true;
    var link_name = h5Text; // Use h5Text as link_name

    console.log("username:" + username);
    console.log("link_text : " + linkTextValue);
    console.log("link : " + linkValue);
    console.log("link_on : " + link_on);
    console.log("link_name : " + link_name);

    // Construct the data object
    var postData = {
      data: {
        username: username,
        link: linkValue,
        link_text: linkTextValue,
        link_on: link_on,
        link_name: link_name,
      },
    };

    console.log(postData);

    // Construct the headers with the token
    var headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };

    // Make the Axios POST request with the token in the headers
    axios
      .post("https://tapseed.cloud/api/links", postData, {
        headers: headers,
      })
      .then(function (response) {
        console.log("POST request successful:", response.data);
        // Handle success, if needed
        // Close the modal
        var closeButton = document.querySelector(
          "#exampleModal #modalCloseButton"
        );

        if (closeButton) {
          closeButton.click();
        }
      })
      .catch(function (error) {
        console.error("Error making POST request:", error);
        // Handle error, if needed
      });
  });
});
