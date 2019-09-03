const loadingDiv = document.querySelector(".loading");
const searchButton = document.querySelector(".button");
const page = document.querySelector(".page");
const results = document.querySelector(".results");
const searchInput = document.querySelector(".search");
const fixedNav = document.querySelector(".fixedNav");

loadingDiv.style.display = "none";
results.style.display = "none";
fixedNav.style.display = "none";

searchButton.addEventListener("click", () => {
    loadingDiv.removeAttribute("style");
    setTimeout(() => {
        loadingDiv.style.display = "none";
        /*page.style.transform = "translateY(-20%)";
        page.style.transition = "transform 1s
        ";*/
        results.style.display = "block";
        window.scroll({
            top: 200,
            left: 0,
            behavior: "smooth"
        });
    }, 1000);
});

document.addEventListener("scroll", () => {
    searchInput.style.width = (window.innerWidth * 0.6 - window.scrollY) + "px";

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

function search() {
    const urls = ["https://api.twitch.tv/kraken/streams/?broadcaster_language=cs&limit=100&client_id=u05mtiivnmqdy7ae7ag3fkzheuuiag"/*,
        "https://api.twitch.tv/kraken/streams/?broadcaster_language=sk&limit=100&client_id=u05mtiivnmqdy7ae7ag3fkzheuuiag",
"https://api.twitch.tv/kraken/streams/?broadcaster_language=en&limit=100&client_id=u05mtiivnmqdy7ae7ag3fkzheuuiag"*/];

    Promise.all(urls.map(url => fetch(url)))
        .then(responses => responses.map(response => response.json()
            .then(data => {
                let nicks = [];
                for (stream of data.streams) {
                    nicks.push(stream.channel.name);
                }
                //console.log(data)
                console.log(data._total);
                let pages = Math.ceil(data._total / 100);
                console.log(pages);

                //console.log(data.streams);
                for (let i = 1; i <= pages; i++) {
                    //console.log(i);
                    fetch(`https://api.twitch.tv/kraken/streams/?broadcaster_language=cs&limit=100&offset=${i * 100}&client_id=u05mtiivnmqdy7ae7ag3fkzheuuiag`)
                        .then(response => response.json()
                            .then(data => {
                                for (stream of data.streams) {
                                    nicks.push(stream.channel.name);
                                }
                                //console.log(nicks);
                            }));
                console.log("current i: "+i);
                        }
                return nicks;
            }).then(nicks => {
                console.log(nicks);
                const viewerListUrl = nicks.map(nick => `https://tmi.twitch.tv/group/user/${nick}/chatters`);
                //console.log(viewerListUrl);

                Promise.all(viewerListUrl.map(url => fetch(url)))
                .then(responses => responses.map(response => response.json()
                .then(data => {
                    //console.log(data);
                    for (viewer of data.chatters.viewers) {
                        if (viewer == "majrik") {
                            console.log(viewer);
                        }
                    }
                })));
            })));
}

search();