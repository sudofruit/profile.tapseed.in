document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const formData = new FormData(this);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await fetch(
        "https://tapseed.cloud/api/auth/local",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: username,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      } else console.log("success login");

      const data = await response.json();
      localStorage.setItem("token", data.jwt); // Store the token in local storage
      localStorage.setItem("username", username); // Store the username in local storage

      // Redirect to the editing page
      window.location.href = "master-page/master-page.html";
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle error (e.g., show error message to user)
    }
  });
