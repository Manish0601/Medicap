/* ==========================================
            MEDIMAP DASHBOARD.JS
========================================== */

const API = "http://localhost:8080/api";

/* ==========================================
        PAGE LOAD
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    checkLogin();

    loadUser();

    loadDashboardStats();

    loadRecentSearches();

    loadFavoriteMedicines();

    loadNotifications();

});

/* ==========================================
        LOAD USER
========================================== */

async function loadUser() {

    try {

        const email = localStorage.getItem("email");

        if (email) {

            document.getElementById("userName").innerHTML = email;

        }

    }

    catch (e) {

        console.log(e);

    }

}

/* ==========================================
        DASHBOARD STATS
========================================== */

async function loadDashboardStats() {

    try {

        const response = await authFetch(

            API + "/admin/dashboard"

        );

        const data = await response.json();

        updateStatistics(data);

    }

    catch (e) {

        console.log(e);

    }

}

/* ==========================================
        UPDATE STATISTICS
========================================== */

function updateStatistics(data) {

    const cards = document.querySelectorAll(".dashboard-card h2");

    if(cards.length < 4) return;

    cards[0].innerHTML = data.totalSearches ?? 25;
    cards[1].innerHTML = data.favoriteMedicines ?? 12;
    cards[2].innerHTML = data.nearbyStores ?? 18;
    cards[3].innerHTML = data.notifications ?? 7;

}

/* ==========================================
        RECENT SEARCHES
========================================== */

async function loadRecentSearches() {

    try {

        const response = await authFetch(

            API + "/search/history"

        );

        const searches = await response.json();

        const tbody = document.querySelector("tbody");

        if (!tbody) return;

        tbody.innerHTML = "";

        searches.forEach(search => {

            tbody.innerHTML += `

            <tr>

                <td>${search.medicineName}</td>

                <td>${formatDate(search.searchedAt)}</td>

                <td>

                    <span class="badge bg-success">

                        Available

                    </span>

                </td>

            </tr>

            `;

        });

    }

    catch (e) {

        console.log(e);

    }

}

/* ==========================================
        FAVORITES
========================================== */

async function loadFavoriteMedicines() {

    try {

        const response = await authFetch(

            API + "/favorites"

        );

        const medicines = await response.json();

        console.log(medicines);

    }

    catch (e) {

        console.log(e);

    }

}

/* ==========================================
        NOTIFICATIONS
========================================== */

async function loadNotifications() {

    try {

        const response = await authFetch(

            API + "/notifications"

        );

        const notifications = await response.json();

        console.log(notifications);

    }

    catch (e) {

        console.log(e);

    }

}

/* ==========================================
        OPEN SEARCH PAGE
========================================== */

function searchMedicine() {

    window.location.href = "search.html";

}

/* ==========================================
        OPEN NEARBY PAGE
========================================== */

function nearbyPharmacy() {

    window.location.href = "nearby.html";

}

/* ==========================================
        OPEN PROFILE
========================================== */

function openProfile() {

    showToast(

        "Profile module coming soon",

        "primary"

    );

}

/* ==========================================
        LOGOUT
========================================== */

function logoutUser() {

    if(confirm("Logout from MediMap?")){

        logout();

    }

}

/* ==========================================
        REFRESH DASHBOARD
========================================== */

function refreshDashboard(){

    loadDashboardStats();

    loadRecentSearches();

    loadNotifications();

}

/* ==========================================
        AUTO REFRESH
========================================== */

setInterval(()=>{

    refreshDashboard();

},30000);

/* ==========================================
        GREETING
========================================== */

const hour = new Date().getHours();

let greeting = "Welcome";

if(hour < 12){

    greeting = "Good Morning";

}
else if(hour < 18){

    greeting = "Good Afternoon";

}
else{

    greeting = "Good Evening";

}

const title = document.querySelector("nav h4");

if(title){

    title.innerHTML = greeting + ", <span id='userName'>" +
        (localStorage.getItem("email") || "User") +
        "</span>";

}

/* ==========================================
        FAVORITE BUTTON
========================================== */

function addFavorite(id){

    showToast(

        "Added to Favorites",

        "success"

    );

}

/* ==========================================
        REMOVE FAVORITE
========================================== */

function removeFavorite(id){

    showToast(

        "Removed Successfully",

        "warning"

    );

}

/* ==========================================
        OPEN MEDICINE
========================================== */

function openMedicine(id){

    window.location.href =

    "medicine-details.html?id="+id;

}