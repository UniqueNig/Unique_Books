// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANOwks8fQmgKQGuDntb-uM8UmuQyNABI8",
  authDomain: "uniquebooks-bc7cb.firebaseapp.com",
  projectId: "uniquebooks-bc7cb",
  storageBucket: "uniquebooks-bc7cb.appspot.com",
  messagingSenderId: "577601355209",
  appId: "1:577601355209:web:a0d958b799ff76d936fc18",
  measurementId: "G-DQPKHVJ01L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const db = getDatabase(app);

// ✅ Reusable Toast Function
function showToast(title, message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "position-fixed top-0 end-0 p-3";
  toast.style.zIndex = "9999";

  const icon =
    type === "error"
      ? `<i class="fas fa-exclamation-circle me-2"></i>`
      : `<i class="fas fa-check-circle me-2"></i>`;
  const headerColor =
    type === "error"
      ? "linear-gradient(135deg, #dc3545 0%, #6c757d 100%)"
      : "linear-gradient(135deg, var(--primary) 0%, var(--dark) 100%)";

  toast.innerHTML = `
    <div class="toast show" role="alert">
      <div class="toast-header" style="background: ${headerColor}; color: white;">
        ${icon}
        <strong class="me-auto">${title}</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 6000);
}

// Handle Email Signup
document.getElementById("register").addEventListener("click", () => {
  const registerBtn = document.getElementById("register");
  const lastName = document.getElementById("lastName").value.trim();
  const firstName = document.getElementById("firstName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const file = document.getElementById("file").files[0];

  if (!lastName || !firstName || !email || !password || !confirmPassword || !file) {
    showToast("Error", "Please fill in all fields and upload an image.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Error", "Passwords do not match!", "error");
    return;
  }

  // Spinner on button
  const originalBtnText = registerBtn.innerHTML;
  registerBtn.disabled = true;
  registerBtn.innerHTML = `
    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    Creating account...
  `;

  const createdAt = new Date().toLocaleString();
  const cloudName = "deeqdbuup";
  const presetName = "uniquebooks";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", presetName);

  fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((cloudinaryData) => {
      const imageUrl = cloudinaryData.secure_url;
      const userInfo = {
        lastName,
        firstName,
        email,
        createdAt,
        imageUrl,
      };

      // Firebase signup
      createUserWithEmailAndPassword(auth, email, password)
        .then((response) => {
          const uid = response.user.uid;
          const userRef = ref(db, `users/${uid}`);

          set(userRef, userInfo).then(() => {
            showToast("Success", "Signed Up Successfully!", "success");

            // Clear all fields
            document.getElementById("lastName").value = "";
            document.getElementById("firstName").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("confirmPassword").value = "";
            document.getElementById("file").value = "";

            // Redirect
            setTimeout(() => {
              location.href = "login.html";
            }, 2000);
          });
        })
        .catch((error) => {
          console.error(error);
          showToast("Signup Failed", error.message, "error");
        })
        .finally(() => {
          registerBtn.disabled = false;
          registerBtn.innerHTML = originalBtnText;
        });
    })
    .catch((error) => {
      console.error("Image upload error:", error);
      showToast("Upload Failed", "Failed to upload image. Please try again.", "error");
      registerBtn.disabled = false;
      registerBtn.innerHTML = originalBtnText;
    });
});

// Google Signup
document.getElementById("google").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const userInfo = {
        firstName: user.displayName,
        email: user.email,
        imageUrl: user.photoURL,
        createdAt: new Date().toLocaleString(),
      };

      const uid = user.uid;
      const userRef = ref(db, `users/${uid}`);

      set(userRef, userInfo).then(() => {
        showToast("Success", "Signed Up Successfully!", "success");
        setTimeout(() => (location.href = "account.html"), 2000);
      });
    })
    .catch((error) => {
      console.error(error);
      showToast("Google Signup Failed", error.message, "error");
    });
});
