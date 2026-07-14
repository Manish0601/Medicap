/* ==========================================
        MEDIMAP MAP.JS
========================================== */

const API_BASE = "http://localhost:8080/api";

let map;
let userMarker;
let pharmacyMarkers = [];
let userLatitude;
let userLongitude;

/* ==========================================
        INITIALIZE MAP
========================================== */

function initMap() {

    navigator.geolocation.getCurrentPosition(

        successLocation,

        errorLocation

    );

}

/* ==========================================
        USER LOCATION SUCCESS
========================================== */

function successLocation(position) {

    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;

    map = new google.maps.Map(

        document.getElementById("map"),

        {

            center: {

                lat: userLatitude,

                lng: userLongitude

            },

            zoom: 14,

            mapTypeControl: false,

            streetViewControl: false,

            fullscreenControl: true

        }

    );

    userMarker = new google.maps.Marker({

        position: {

            lat: userLatitude,

            lng: userLongitude

        },

        map: map,

        animation: google.maps.Animation.DROP,

        icon: {

            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"

        },

        title: "You are here"

    });

    loadNearbyPharmacies();

}

/* ==========================================
        LOCATION ERROR
========================================== */

function errorLocation() {

    showToast(

        "Unable to fetch your location",

        "danger"

    );

}

/* ==========================================
        LOAD PHARMACIES
========================================== */

async function loadNearbyPharmacies() {

    try {

        showLoader();

        const medicineId = new URLSearchParams(

            window.location.search

        ).get("medicineId");

        const response = await fetch(

            `${API_BASE}/search/nearby?medicine=${medicineId}&lat=${userLatitude}&lng=${userLongitude}`

        );

        const pharmacies = await response.json();

        hideLoader();

        renderPharmacies(pharmacies);

    }

    catch (e) {

        hideLoader();

        console.error(e);

        showToast(

            "Unable to load nearby pharmacies",

            "danger"

        );

    }

}

/* ==========================================
        RENDER CARDS
========================================== */

function renderPharmacies(pharmacies) {

    const container = document.getElementById(

        "pharmacyContainer"

    );

    container.innerHTML = "";

    pharmacyMarkers.forEach(marker => marker.setMap(null));

    pharmacyMarkers = [];

    pharmacies.forEach(pharmacy => {

        container.innerHTML += `

        <div class="col-lg-4 mb-4">

            <div class="card h-100 shadow">

                <div class="card-body">

                    <h4>

                        ${pharmacy.pharmacyName}

                    </h4>

                    <p>

                        📍 ${pharmacy.address}

                    </p>

                    <p>

                        📏 ${pharmacy.distance.toFixed(2)} KM

                    </p>

                    <p>

                        💊 Stock :

                        ${pharmacy.stock}

                    </p>

                    <p>

                        📞 ${pharmacy.phone}

                    </p>

                    <button

                    onclick="navigateTo(

                    ${pharmacy.latitude},

                    ${pharmacy.longitude}

                    )"

                    class="btn btn-primary">

                    Navigate

                    </button>

                </div>

            </div>

        </div>

        `;

        createMarker(pharmacy);

    });

}

/* ==========================================
        CREATE MARKERS
========================================== */

function createMarker(pharmacy) {

    const marker = new google.maps.Marker({

        position: {

            lat: pharmacy.latitude,

            lng: pharmacy.longitude

        },

        map: map,

        animation: google.maps.Animation.DROP,

        title: pharmacy.pharmacyName

    });

    const info = new google.maps.InfoWindow({

        content: `

            <h5>${pharmacy.pharmacyName}</h5>

            <p>${pharmacy.address}</p>

            <p>Stock : ${pharmacy.stock}</p>

        `

    });

    marker.addListener("click", () => {

        info.open(map, marker);

    });

    pharmacyMarkers.push(marker);

}

/* ==========================================
        NAVIGATE
========================================== */

function navigateTo(lat, lng) {

    window.open(

        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,

        "_blank"

    );

}

/* ==========================================
        DISTANCE FILTER
========================================== */

document.getElementById("distanceFilter")
?.addEventListener("change", filterCards);

document.getElementById("statusFilter")
?.addEventListener("change", filterCards);

document.getElementById("stockFilter")
?.addEventListener("change", filterCards);

function filterCards() {

    const distance = document.getElementById("distanceFilter").value;

    const cards = document.querySelectorAll("#pharmacyContainer .col-lg-4");

    cards.forEach(card => {

        if(distance===""){

            card.style.display="";

            return;

        }

        const text = card.innerText;

        const match = text.match(/([\d.]+)\sKM/i);

        if(match){

            const value = parseFloat(match[1]);

            card.style.display = value <= distance ? "" : "none";

        }

    });

}