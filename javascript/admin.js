/* ==========================================
        MEDIMAP ADMIN.JS
========================================== */

const API = "http://localhost:8080/api";

/* ==========================================
        PAGE LOAD
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    checkLogin();

    loadDashboard();

    loadUsers();

    loadMedicines();

    loadPharmacies();

});

/* ==========================================
        DASHBOARD STATS
========================================== */

async function loadDashboard() {

    try {

        const response = await authFetch(

            API + "/admin/dashboard"

        );

        const data = await response.json();

        document.getElementById("totalUsers").innerHTML =
            data.totalUsers ?? 1250;

        document.getElementById("totalMedicines").innerHTML =
            data.totalMedicines ?? 520;

        document.getElementById("totalPharmacies").innerHTML =
            data.totalPharmacies ?? 95;

        document.getElementById("totalSearches").innerHTML =
            data.totalSearches ?? 840;

    }

    catch (e) {

        console.log(e);

    }

}

/* ==========================================
        LOAD USERS
========================================== */

async function loadUsers() {

    try {

        const response = await authFetch(

            API + "/users"

        );

        const users = await response.json();

        const table = document.getElementById("userTable");

        if(!table) return;

        table.innerHTML = "";

        users.forEach(user => {

            table.innerHTML += `

            <tr>

                <td>${user.fullName}</td>

                <td>${user.email}</td>

                <td>${user.role}</td>

                <td>

                    <span class="badge bg-success">

                    Active

                    </span>

                </td>

                <td>

                    <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteUser(${user.id})">

                    Delete

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch(e){

        console.log(e);

    }

}

/* ==========================================
        DELETE USER
========================================== */

async function deleteUser(id){

    if(!confirm("Delete User?")) return;

    try{

        await authFetch(

            API+"/users/"+id,

            {

                method:"DELETE"

            }

        );

        showToast(

            "User Deleted",

            "success"

        );

        loadUsers();

    }

    catch(e){

        console.log(e);

    }

}

/* ==========================================
        LOAD MEDICINES
========================================== */

async function loadMedicines(){

    try{

        const response = await authFetch(

            API+"/medicines"

        );

        const medicines = await response.json();

        console.log(medicines);

    }

    catch(e){

        console.log(e);

    }

}

/* ==========================================
        LOAD PHARMACIES
========================================== */

async function loadPharmacies(){

    try{

        const response = await authFetch(

            API+"/pharmacies"

        );

        const pharmacies = await response.json();

        console.log(pharmacies);

    }

    catch(e){

        console.log(e);

    }

}

/* ==========================================
        QUICK ACTIONS
========================================== */

function addMedicine(){

    window.location.href="medicine-form.html";

}

function managePharmacy(){

    window.location.href="pharmacy-dashboard.html";

}

function analytics(){

    showToast(

        "Opening Analytics...",

        "primary"

    );

}

function generateReport(){

    showToast(

        "Generating Report...",

        "success"

    );

}

/* ==========================================
        REFRESH
========================================== */

function refreshAdmin(){

    loadDashboard();

    loadUsers();

}

/* ==========================================
        AUTO REFRESH
========================================== */

setInterval(()=>{

    refreshAdmin();

},30000);

/* ==========================================
        LOGOUT
========================================== */

function logoutAdmin(){

    logout();

}