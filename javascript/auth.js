/* ==========================================
            MEDIMAP AUTH.JS
========================================== */

const BASE_URL = "http://localhost:8080/api/users";

/* ==========================================
        PASSWORD SHOW/HIDE
========================================== */

const togglePassword = document.getElementById("togglePassword");

if (togglePassword) {

    togglePassword.addEventListener("click", () => {

        const password = document.getElementById("password");

        if (password.type === "password") {
            password.type = "text";
            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';
        } else {
            password.type = "password";
            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye"></i>';
        }

    });

}

/* ==========================================
              LOGIN
========================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (email === "" || password === "") {

            showToast("Please fill all fields", "danger");
            return;

        }

        try {

            showLoader();

            const response = await fetch(BASE_URL + "/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            hideLoader();

            if (!response.ok) {

                showToast("Invalid Email or Password", "danger");
                return;

            }

            const data = await response.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("email", email);

            showToast("Login Successful", "success");

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1200);

        } catch (error) {

            hideLoader();

            console.error(error);

            showToast("Server Error", "danger");

        }

    });

}

/* ==========================================
              REGISTER
========================================== */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();

        const phone = document.getElementById("phone").value.trim();

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {

            showToast("Passwords do not match", "danger");

            return;

        }

        try {

            showLoader();

            const response = await fetch(BASE_URL + "/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    fullName,

                    email,

                    phone,

                    password

                })

            });

            hideLoader();

            if (!response.ok) {

                showToast("Registration Failed", "danger");

                return;

            }

            showToast("Registration Successful", "success");

            setTimeout(() => {

                window.location.href = "login.html";

            }, 1500);

        } catch (error) {

            hideLoader();

            console.error(error);

            showToast("Server Error", "danger");

        }

    });

}

/* ==========================================
             LOGOUT
========================================== */

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("email");

    window.location.href = "login.html";

}

/* ==========================================
         CHECK LOGIN
========================================== */

function checkLogin() {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "login.html";

    }

}

/* ==========================================
          GET JWT TOKEN
========================================== */

function getToken() {

    return localStorage.getItem("token");

}

/* ==========================================
     AUTHENTICATED REQUEST
========================================== */

async function authFetch(url, options = {}) {

    const token = getToken();

    options.headers = {

        ...options.headers,

        Authorization: `Bearer ${token}`,

        "Content-Type": "application/json"

    };

    return fetch(url, options);

}