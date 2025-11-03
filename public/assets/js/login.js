// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
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
const auth = getAuth(app);

const loginBtn = document.getElementById("login");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

if (loginBtn) {
  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const originalHTML = loginBtn.innerHTML;
    loginBtn.disabled = true;
    loginBtn.setAttribute("aria-busy", "true");
    loginBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing in...`;

    const email = emailInput?.value || "";
    const password = passwordInput?.value || "";

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // success toast
      const toast = document.createElement("div");
      toast.className = "position-fixed top-0 end-0 p-3";
      toast.innerHTML = `
  <div class="toast show" role="alert">
    <div class="toast-header" style="background: linear-gradient(135deg, var(--primary) 0%, var(--dark) 100%); color: white;">
      <i class="fas fa-check-circle me-2"></i>
      <strong class="me-auto">Success</strong>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
    </div>
    <div class="toast-body">Signed In Successfully!</div>
  </div>
  `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 5000);

      // navigate away (no need to restore button)
      location.href = "account.html";
    } catch (error) {
      const msg = error.message || "Sign in failed";
      const toast = document.createElement("div");
      toast.className = "position-fixed top-0 end-0 p-3";
      toast.innerHTML = `
  <div class="toast show" role="alert">
    <div class="toast-header bg-danger text-white">
      <i class="fas fa-exclamation-triangle me-2"></i>
      <strong class="me-auto">Error</strong>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
    </div>
    <div class="toast-body">${msg}</div>
  </div>
  `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 7000);

      // restore button state
      loginBtn.disabled = false;
      loginBtn.removeAttribute("aria-busy");
      loginBtn.innerHTML = originalHTML;
    }
  });
}
