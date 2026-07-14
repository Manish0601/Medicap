/* ==========================================
        MEDIMAP PHARMACY.JS
========================================== */

const API = "http://localhost:8080/api";

/* ==========================================
        PAGE LOAD
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    checkLogin();

    loadDashboard();

    loadInventory();

    loadReservations();

});

/* ==========================================
        DASHBOARD
========================================== */

async function loadDashboard() {

    try {

        const response = await authFetch(

            API + "/pharmacy/dashboard"

        );

        const data = await response.json();

        document.getElementById("medicineCount").innerHTML =
            data.totalMedicines ?? 540;

        document.getElementById("inventoryCount").innerHTML =
            data.totalInventory ?? 1260;

        document.getElementById("reservationCount").innerHTML =
            data.totalReservations ?? 38;

    }

    catch (e) {

        console.log(e);

    }

}

/* ==========================================
        LOAD INVENTORY
========================================== */

async function loadInventory() {

    try {

        const response = await authFetch(

            API + "/inventory"

        );

        const inventory = await response.json();

        const table = document.getElementById("inventoryTable");

        if (!table) return;

        table.innerHTML = "";

        inventory.forEach(item => {

            table.innerHTML += `

            <tr>

                <td>${item.medicine.name}</td>

                <td>${item.quantity}</td>

                <td>${item.expiryDate}</td>

                <td>

                    <span class="badge ${item.quantity < 10 ? 'bg-warning':'bg-success'}">

                        ${item.quantity < 10 ? 'Low Stock':'Available'}

                    </span>

                </td>

                <td>

                    <button
                    class="btn btn-sm btn-primary"
                    onclick="editMedicine(${item.id})">

                    Edit

                    </button>

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
        LOAD RESERVATIONS
========================================== */

async function loadReservations() {

    try {

        const response = await authFetch(

            API + "/reservations"

        );

        const reservations = await response.json();

        console.log(reservations);

    }

    catch (e) {

        console.log(e);

    }

}

/* ==========================================
        ADD MEDICINE
========================================== */

function addMedicine() {

    window.location.href =

    "medicine-form.html";

}

/* ==========================================
        EDIT MEDICINE
========================================== */

function editMedicine(id) {

    window.location.href =

    "medicine-form.html?id=" + id;

}

/* ==========================================
        DELETE MEDICINE
========================================== */

async function deleteMedicine(id) {

    if (!confirm("Delete this medicine?")) return;

    try {

        await authFetch(

            API + "/medicines/" + id,

            {

                method: "DELETE"

            }

        );

        showToast(

            "Medicine Deleted",

            "success"

        );

        loadInventory();

    }

    catch (e) {

        console.log(e);

    }

}

/* ==========================================
        UPDATE INVENTORY
========================================== */

function updateInventory() {

    window.location.href =

    "inventory.html";

}

/* ==========================================
        VIEW RESERVATIONS
========================================== */

function viewReservations() {

    showToast(

        "Loading Reservations...",

        "primary"

    );

}

/* ==========================================
        LOW STOCK
========================================== */

function lowStock() {

    const rows = document.querySelectorAll("#inventoryTable tr");

    rows.forEach(row => {

        const qty = parseInt(row.children[1].innerText);

        if (qty < 10) {

            row.style.background = "#fff3cd";

        }

    });

}

/* ==========================================
        SEARCH INVENTORY
========================================== */

function searchInventory(keyword) {

    const rows = document.querySelectorAll("#inventoryTable tr");

    rows.forEach(row => {

        if (

            row.innerText.toLowerCase().includes(

                keyword.toLowerCase()

            )

        ) {

            row.style.display = "";

        }

        else {

            row.style.display = "none";

        }

    });

}

/* ==========================================
        REFRESH
========================================== */

function refreshDashboard() {

    loadDashboard();

    loadInventory();

}

/* ==========================================
        AUTO REFRESH
========================================== */

setInterval(() => {

    refreshDashboard();

}, 30000);

/* ==========================================
        LOGOUT
========================================== */

function logoutPharmacy() {

    logout();

}