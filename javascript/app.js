/* ==========================================
   MediMap - Global JavaScript
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeAnimations();
    initializeNavbar();
    initializeSearch();
    initializeCounter();
    initializeDarkMode();

});

/* ==========================================
   Navbar Shadow on Scroll
========================================== */

function initializeNavbar() {

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if(window.scrollY > 50){

            navbar.classList.add("shadow-lg");

        }else{

            navbar.classList.remove("shadow-lg");

        }

    });

}

/* ==========================================
   Smooth Scroll
========================================== */

document.querySelectorAll("a[href^='#']").forEach(anchor=>{

    anchor.addEventListener("click",function(e){

        e.preventDefault();

        const target=document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});

/* ==========================================
   Hero Search
========================================== */

function initializeSearch(){

    const btn=document.querySelector(".search-box button");

    if(!btn) return;

    btn.addEventListener("click",()=>{

        const input=document.querySelector(".search-box input");

        const medicine=input.value.trim();

        if(medicine===""){

            showToast("Please enter medicine name","danger");

            return;

        }

        window.location.href=`search.html?medicine=${medicine}`;

    });

}

/* ==========================================
   Fade Up Animation
========================================== */

function initializeAnimations(){

    const observer=new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("fade-up");

            }

        });

    });

    document.querySelectorAll(".card,.feature-box,.step-box")
    .forEach(el=>observer.observe(el));

}

/* ==========================================
   Animated Counter
========================================== */

function initializeCounter(){

    document.querySelectorAll(".counter").forEach(counter=>{

        const target=+counter.dataset.target;

        let count=0;

        const speed=target/120;

        function update(){

            if(count<target){

                count+=speed;

                counter.innerText=Math.ceil(count);

                requestAnimationFrame(update);

            }else{

                counter.innerText=target;

            }

        }

        update();

    });

}

/* ==========================================
   Toast Notification
========================================== */

function showToast(message,type="primary"){

    const toast=document.createElement("div");

    toast.className=`toast align-items-center text-bg-${type} border-0 show position-fixed`;

    toast.style.top="20px";
    toast.style.right="20px";
    toast.style.zIndex="9999";

    toast.innerHTML=`
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button class="btn-close btn-close-white me-2 m-auto"></button>
        </div>
    `;

    document.body.appendChild(toast);

    toast.querySelector("button").onclick=()=>toast.remove();

    setTimeout(()=>{

        toast.remove();

    },3000);

}

/* ==========================================
   Loading Spinner
========================================== */

function showLoader(){

    const loader=document.createElement("div");

    loader.id="loader";

    loader.innerHTML=`
    <div class="spinner-border text-primary"
         style="width:4rem;height:4rem"
         role="status">
    </div>`;

    loader.style.position="fixed";
    loader.style.top="0";
    loader.style.left="0";
    loader.style.width="100%";
    loader.style.height="100%";
    loader.style.display="flex";
    loader.style.alignItems="center";
    loader.style.justifyContent="center";
    loader.style.background="rgba(255,255,255,.8)";
    loader.style.zIndex="99999";

    document.body.appendChild(loader);

}

function hideLoader(){

    const loader=document.getElementById("loader");

    if(loader){

        loader.remove();

    }

}

/* ==========================================
   Dark Mode
========================================== */

function initializeDarkMode(){

    const toggle=document.getElementById("darkMode");

    if(!toggle) return;

    toggle.onclick=()=>{

        document.body.classList.toggle("dark");

        localStorage.setItem(

            "theme",

            document.body.classList.contains("dark")

            ? "dark"

            : "light"

        );

    };

    if(localStorage.getItem("theme")==="dark"){

        document.body.classList.add("dark");

    }

}

/* ==========================================
   API URL
========================================== */

const API_BASE="http://localhost:8080/api";

/* ==========================================
   GET Request
========================================== */

async function getRequest(endpoint){

    showLoader();

    try{

        const response=await fetch(API_BASE+endpoint);

        return await response.json();

    }catch(error){

        console.error(error);

        showToast("Server Error","danger");

    }finally{

        hideLoader();

    }

}

/* ==========================================
   POST Request
========================================== */

async function postRequest(endpoint,data){

    showLoader();

    try{

        const response=await fetch(API_BASE+endpoint,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(data)

        });

        return await response.json();

    }catch(error){

        console.error(error);

        showToast("Server Error","danger");

    }finally{

        hideLoader();

    }

}

/* ==========================================
   Utility Functions
========================================== */

function formatPrice(price){

    return "₹"+Number(price).toFixed(2);

}

function formatDate(date){

    return new Date(date).toLocaleDateString();

}
