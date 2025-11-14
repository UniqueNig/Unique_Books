const submitForm = () => {
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let email = document.getElementById("email").value;
  let subject = document.getElementById("subject").value;
  let message = document.getElementById("message").value;

  console.log({ name, email, subject, message });

  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let emailValid = emailRegex.test(email);

  if (firstName === "" || lastName==="" || email === "" || subject === "" || message === "") {
    alert("All fields are required.");
  } else if (!emailValid) {
    //alert("Please enter a valid email address.");
    document.getElementById("emailError").style.color = "red";
    document.getElementById("emailError").innerHTML =
      "Please enter a valid email address.";
  } else {
    form.addEventListener("submit", handleSubmit);
  }
};

let form = document.getElementById("contactForm");

async function handleSubmit(event) {
  event.preventDefault();
  let status = document.getElementById("my-form-status");
  let data = new FormData(event.target);
  fetch(event.target.action, {
    method: form.method,
    body: data,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        status.innerHTML =
          "Thank you for your message! We have received your message and we will get back to you shortly.";
        form.reset();
      } else {
        response.json().then((data) => {
          if (Object.hasOwn(data, "errors")) {
            status.innerHTML = data["errors"]
              .map((error) => error["message"])
              .join(", ");
          } else {
            status.innerHTML = "Oops! There was a problem submitting your form";
          }
        });
      }
    })
    .catch((error) => {
      status.innerHTML = "Oops! There was a problem submitting your form";
    });
}
