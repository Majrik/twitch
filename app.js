const loadingDiv = document.querySelector(".loading");
const searchButton = document.querySelector(".button");
const page = document.querySelector(".page");
const results = document.querySelector(".results");
const search = document.querySelector(".search");
const fixedNav = document.querySelector(".fixedNav");

loadingDiv.style.display = "none";
results.style.display = "none";
fixedNav.style.display = "none";

searchButton.addEventListener("click", () => {
    loadingDiv.removeAttribute("style");
    setTimeout(() => {
        loadingDiv.style.display = "none";
        /*page.style.transform = "translateY(-20%)";
        page.style.transition = "transform 1s";*/
        results.style.display = "block";
        window.scroll({
            top: 200,
            left: 0,
            behavior: "smooth"
        });
    }, 1000);
});

document.addEventListener("scroll", () => {
    search.style.width = (window.innerWidth*0.6-window.scrollY)+"px";

    if (window.scrollY > 400) {
        fixedNav.style.display = "flex";
    }
    else {
        fixedNav.style.display = "none";
    }
    //alert(((window.screenX*0.6)-window.scrollY)+"px");
    //console.log(window.innerWidth);
    //console.log(e);
});