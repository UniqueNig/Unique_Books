// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANOwks8fQmgKQGuDntb-uM8UmuQyNABI8",
  authDomain: "uniquebooks-bc7cb.firebaseapp.com",
  databaseURL: "https://uniquebooks-bc7cb-default-rtdb.firebaseio.com",
  projectId: "uniquebooks-bc7cb",
  storageBucket: "uniquebooks-bc7cb.firebasestorage.app",
  messagingSenderId: "577601355209",
  appId: "1:577601355209:web:a0d958b799ff76d936fc18",
  measurementId: "G-DQPKHVJ01L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getDatabase();

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log("User ID:", uid);

    const userRef = ref(db, `users/${uid}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      const firstName = data.firstName;
      const lastName = data.lastName;
      const email = data.email;
      const avatar = data.imageUrl;

      document.getElementById("userAvatar").src = `${avatar}`;
      userAvatar.style.backgroundImage = `url(${avatar})`;

      document.getElementById(
        "userName"
      ).innerHTML = `${firstName} ${lastName}`;
      document.getElementById("email").innerHTML = `${email} `;
      document.getElementById("firstName").innerHTML = `${firstName} `;
    });
  } else {
    // User is signed out
    // ...
  }
});

const signOutBtn = document.getElementById("signOut");

signOutBtn.addEventListener("click", () => {
  // Create custom confirmation toast
  const toast = document.createElement("div");
  toast.className = "position-fixed top-0 end-0 p-3";
  toast.style.zIndex = "9999";
  toast.innerHTML = `
    <div class="toast show" role="alert">
      <div class="toast-header" style="background: linear-gradient(135deg, var(--warning) 0%, var(--dark) 100%); color: white;">
        <i class="fas fa-exclamation-triangle me-2"></i>
        <strong class="me-auto">Confirm Sign Out</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body text-center">
        Are you sure you want to sign out?
        <div class="mt-3 d-flex justify-content-center gap-2">
          <button id="confirmYes" class="btn btn-sm btn-danger px-3">Yes</button>
          <button id="confirmNo" class="btn btn-sm btn-secondary px-3">No</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(toast);

  // ✅ Handle "No"
  document.getElementById("confirmNo").addEventListener("click", () => {
    toast.remove();
    const cancelToast = document.createElement("div");
    cancelToast.className = "position-fixed top-0 end-0 p-3";
    cancelToast.innerHTML = `
      <div class="toast show" role="alert">
        <div class="toast-header" style="background: linear-gradient(135deg, var(--primary) 0%, var(--dark) 100%); color: white;">
          <i class="fas fa-info-circle me-2"></i>
          <strong class="me-auto">Attention!!!</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
          Sign out cancelled!!!
        </div>
      </div>
    `;
    document.body.appendChild(cancelToast);
    setTimeout(() => cancelToast.remove(), 5000);
  });

  // ✅ Handle "Yes"
  document.getElementById("confirmYes").addEventListener("click", () => {
    toast.remove();
    signOut(auth)
      .then(() => {
        const successToast = document.createElement("div");
        successToast.className = "position-fixed top-0 end-0 p-3";
        successToast.innerHTML = `
          <div class="toast show" role="alert">
            <div class="toast-header" style="background: linear-gradient(135deg, var(--success) 0%, var(--dark) 100%); color: white;">
              <i class="fas fa-check-circle me-2"></i>
              <strong class="me-auto">Attention!!!</strong>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
              Sign-out successfully!!!
            </div>
          </div>
        `;
        document.body.appendChild(successToast);
        setTimeout(() => successToast.remove(), 5000);
        location.href = "login.html";
      })
      .catch((error) => {
        const errorToast = document.createElement("div");
        errorToast.className = "position-fixed top-0 end-0 p-3";
        errorToast.innerHTML = `
          <div class="toast show" role="alert">
            <div class="toast-header bg-danger text-white">
              <i class="fas fa-exclamation-circle me-2"></i>
              <strong class="me-auto">Error</strong>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
              ${error.message}
            </div>
          </div>
        `;
        document.body.appendChild(errorToast);
        setTimeout(() => errorToast.remove(), 5000);
      });
  });
});
