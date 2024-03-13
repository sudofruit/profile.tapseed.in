// Define a global variable to store the h5Text
var h5Text = "";

document.addEventListener("DOMContentLoaded", function () {
  // Define the map of social apps to their associated values
  const socialAppValues = {
    whatsapp: {
      input: "whatsapp number",
      imagePath: "/add-link/images/whatsapp.png",
    },
    website: {
      input: "link",
      imagePath: "/add-link/images/website.png",
    },
    iphone: {
      input: "phone number",
      imagePath: "/add-link/images/phone.png",
    },
    facebook: {
      input: "profile name",
      imagePath: "/add-link/images/facebook.png",
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
        var dataIconValue = document
          .querySelector(`[data-icon="${idName}"]`)
          .getAttribute("data-icon");

        // Check if the data-icon element exists
        if (!dataIconValue) {
          console.error("Error: data-icon attribute not found.");
          return;
        }

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
});

document.getElementById("addButton").addEventListener("click", function () {
  // Retrieve data from the DOM
  var username = "abhin";
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

  // Define your token
  var token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMDI3NDcyMCwiZXhwIjoxNzEyODY2NzIwfQ.1Fk-fjcu7U0L0JekSWl442pzhkKsEdq8KmsRUx9zyqw";

  // Construct the headers with the token
  var headers = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  };

  // Make the Axios POST request with the token in the headers
  axios
    .post("https://strapi-deployment-xh5t.onrender.com/api/links", postData, {
      headers: headers,
    })
    .then(function (response) {
      console.log("POST request successful:", response.data);
      // Handle success, if needed
    })
    .catch(function (error) {
      console.error("Error making POST request:", error);
      // Handle error, if needed
    });
});
