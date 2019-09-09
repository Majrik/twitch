const loadingDiv = document.querySelector(".loading");
const loadingDivP = document.querySelector(".loading p");
const searchButton = document.querySelector(".button");
const page = document.querySelector(".page");
const results = document.querySelector(".results");
const searchInput = document.querySelector(".search");
const fixedNav = document.querySelector(".fixedNav");
const summary = document.querySelector(".border");
const barFilled = document.querySelector(".barFilled");
const languages = ["cs", "en"];
let numberOfStreamers = [];
let searchName;

loadingDiv.style.display = "none";
results.style.display = "none";
fixedNav.style.display = "none";

const url = `https://api.twitch.tv/kraken/streams/?limit=100&client_id=u05mtiivnmqdy7ae7ag3fkzheuuiag&broadcaster_language=`;

Promise.all(languages.map(language => fetch(`${url}${language}`)))
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
        numberOfStreamers = data.map(total => total._total);
        summary.innerHTML = `<p>${numberOfStreamers[0]} CZ streamers<br />${100 * 4} EN streamers</p>`;
    })


let streamers = [];
let streamers2 = [];
let resultsArray = [];
let progress;
let width;
searchInput.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
        search();
    }
});
searchButton.addEventListener("click", () => search());

function search() {
    width = 0;
    barFilled.style.width = width + "%";
    progress = 0;
    loadingDivP.innerHTML = ``;
    resultsArray = [];
    jsonpCallbacks.cntr = 0;
    streamers = [];
    resultsArray = [];
    promiseArray = [];
    const jsonpCbs = document.querySelectorAll(".jsonpCb");
    for (jsonpCb of jsonpCbs) {
        jsonpCb.parentNode.removeChild(jsonpCb);
    }

    searchName = searchInput.value.toLowerCase();
    loadingDiv.removeAttribute("style");

    const streamsPromises = [];
    let languageCounter = 0;

    Promise.all(languages.map(language => fetch(`${url}${language}`)), { headers: { "Accept": "application/vnd.twitchtv.v5+json" } })
        .then(response => Promise.all(response.map(resp => resp.json())))
        .then(data => {
            for (streams of data) {
                const totalStreamers = streams._total;
                const pages = Math.ceil(totalStreamers / 100);
                console.log(`Total ${languages[languageCounter]} streamers: ${streams._total}, pages: ${pages}`);

                for (stream of streams.streams) {
                    streamers.push(stream.channel.name);
                }

                if (totalStreamers > 100) {
                    for (let i = 0; i < pages; i++) {
                        if (i > 5) {
                            break;
                        }
                        streamsPromises.push(fetch(`${url}${languages[languageCounter]}&offset=${(i + 1) * 100}`));
                    }
                }

                languageCounter++;
            }
            return Promise.all(streamsPromises);
        })
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(responses => {
            for (response of responses) {
                for (stream of response.streams) {
                    streamers.push(stream.channel.name);
                }
            }

            //const chattersUrl = streamers.map(nick => `https://tmi.twitch.tv/group/user/${nick}/chatters`);

            for (let i = 0; i < streamers.length; i++) {
                createJsonpFunctions(streamers[i], searchName, (resultsArray, progress) => {
                    if (progress == streamers.length) {
                        for (resultArray of resultsArray) {
                            results.innerHTML += resultArray;

                        }
                        loadingDiv.style.display = "none";
                        results.style.display = "block";
                        window.scroll({
                            top: 200,
                            left: 0,
                            behavior: "smooth"
                        });
                    }
                });
            }
        })
    .catch(error => {
        console.log(error);
        progress++;
    });

}

const jsonpCallbacks = { cntr: 0 };
let loadBar = 0;

function createJsonpFunctions(streamer, searchName, callback) {
    const name = "fn" + jsonpCallbacks.cntr++;

    jsonpCallbacks[name] = function () {
        progress++;
        /*loadingDivP.innerHTML = `${progress++} z ${streamers.length}<br />
            ${arguments[0].data.chatters.broadcaster[0]}`;*/

        loadBar = Math.round(streamers.length / 100);
        if (progress % loadBar == 0) {
            barFilled.style.width = width++ + "%";
        }

        for (viewer of arguments[0].data.chatters.viewers) {
            if (searchName == viewer) {
                resultsArray.push(`<p>${searchName} je u ${streamer}</p>`);
            }
        }
        delete jsonpCallbacks[name];
        const args = Array.prototype.slice.call(arguments);
        args.unshift(resultsArray, progress);

        callback.apply(this, args);
    }

    const script = document.createElement("script");
    script.src = `https://tmi.twitch.tv/group/user/${streamer}/chatters?callback=jsonpCallbacks.${name}`;
    script.className = "jsonpCb";
    document.body.appendChild(script);

}

document.addEventListener("scroll", () => {
    searchInput.style.width = (window.innerWidth * 0.6 - window.scrollY) + "px";

    if (window.scrollY > 400) {
        fixedNav.style.display = "flex";
    }
    else {
        fixedNav.style.display = "none";
    }
});