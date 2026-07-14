/* ==========================================
        MEDIMAP SEARCH.JS
========================================== */

const API_URL = "http://localhost:8080/api/medicines";

const medicineContainer = document.getElementById("medicineContainer");

const searchInput = document.getElementById("searchInput");

const category = document.getElementById("category");

const availability = document.getElementById("availability");

const searchBtn = document.getElementById("searchBtn");

/* ===============================
    LOAD ALL MEDICINES
================================ */

window.onload = () => {

    loadMedicines();

};

/* ===============================
    GET ALL MEDICINES
================================ */

async function loadMedicines() {

    try {

        showLoader();

        const response = await fetch(API_URL);

        const medicines = await response.json();

        hideLoader();

        displayMedicines(medicines);

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Unable to load medicines", "danger");

    }

}

/* ===============================
    DISPLAY CARDS
================================ */

function displayMedicines(medicines) {

    medicineContainer.innerHTML = "";

    if (medicines.length === 0) {

        medicineContainer.innerHTML = `

            <div class="col-12">

                <div class="alert alert-warning text-center">

                    No Medicines Found

                </div>

            </div>

        `;

        return;

    }

    medicines.forEach(medicine => {

        medicineContainer.innerHTML += `

        <div class="col-lg-4 col-md-6 mb-4">

            <div class="card medicine-card h-100">

                <img src="${medicine.imageUrl}"

                    class="card-img-top"

                    style="height:220px;object-fit:cover;">

                <div class="card-body">

                    <h5 class="card-title">

                        ${medicine.name}

                    </h5>

                    <p>

                        <strong>Manufacturer :</strong>

                        ${medicine.manufacturer}

                    </p>

                    <p>

                        <strong>Category :</strong>

                        ${medicine.category}

                    </p>

                    <p class="text-success">

                        ₹ ${medicine.price}

                    </p>

                    <p>

                        Stock :

                        <span class="${medicine.stock>0 ? 'text-success':'text-danger'}">

                        ${medicine.stock}

                        </span>

                    </p>

                    <div class="d-grid gap-2">

                        <button

                        onclick="viewMedicine(${medicine.id})"

                        class="btn btn-primary">

                        View Details

                        </button>

                        <button

                        onclick="nearby(${medicine.id})"

                        class="btn btn-success">

                        Nearby Pharmacy

                        </button>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

}

/* ===============================
    SEARCH BUTTON
================================ */

searchBtn.addEventListener("click", () => {

    searchMedicine();

});

/* ===============================
    LIVE SEARCH
================================ */

searchInput.addEventListener("keyup", () => {

    searchMedicine();

});

/* ===============================
    SEARCH API
================================ */

async function searchMedicine() {

    const keyword = searchInput.value.trim();

    if (keyword === "") {

        loadMedicines();

        return;

    }

    try {

        showLoader();

        const response = await fetch(

            API_URL + "/search?name=" + keyword

        );

        const medicines = await response.json();

        hideLoader();

        displayMedicines(medicines);

    }

    catch (error) {

        hideLoader();

        showToast("Search Failed", "danger");

    }

}

/* ===============================
    CATEGORY FILTER
================================ */

category.addEventListener("change", () => {

    const selected = category.value.toLowerCase();

    const cards = document.querySelectorAll(".medicine-card");

    cards.forEach(card => {

        const text = card.innerText.toLowerCase();

        if (selected === "" || text.includes(selected)) {

            card.parentElement.style.display = "";

        }

        else {

            card.parentElement.style.display = "none";

        }

    });

});

/* ===============================
    AVAILABILITY FILTER
================================ */

availability.addEventListener("change", () => {

    const value = availability.value;

    const cards = document.querySelectorAll(".medicine-card");

    cards.forEach(card => {

        const stockText = card.innerText;

        if (value === "") {

            card.parentElement.style.display = "";

        }

        else if (value === "In Stock" &&
            stockText.includes("Stock : 0")) {

            card.parentElement.style.display = "none";

        }

        else if (value === "Out of Stock" &&
            !stockText.includes("Stock : 0")) {

            card.parentElement.style.display = "none";

        }

        else {

            card.parentElement.style.display = "";

        }

    });

});

/* ===============================
    VIEW DETAILS
================================ */

function viewMedicine(id) {

    window.location.href =

        "medicine-details.html?id=" + id;

}

/* ===============================
    NEARBY PHARMACY
================================ */

function nearby(id) {

    window.location.href =

        "nearby.html?medicineId=" + id;

}