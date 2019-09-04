const loadingDiv = document.querySelector(".loading");
const searchButton = document.querySelector(".button");
const page = document.querySelector(".page");
const results = document.querySelector(".results");
const searchInput = document.querySelector(".search");
const fixedNav = document.querySelector(".fixedNav");
let searchName;

loadingDiv.style.display = "none";
results.style.display = "none";
fixedNav.style.display = "none";

function myDisplayFunction(myObj) {
    //console.log(a+ " " + b);
    for (viewer of myObj.data.chatters.viewers) {
        if (searchName == viewer) {
            results.innerHTML = viewer + " je u " + myObj.data.chatters.broadcaster[0];
        }
        
    }
    //console.log("done");
    //results.innerHTML = myObj.data.chatters.moderators[0];
}

let streamers = [];
searchButton.addEventListener("click", () => {
    searchName = searchInput.value;
    //console.log(searchName)
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

    const url = "https://api.twitch.tv/kraken/streams/?broadcaster_language=cs&limit=100&client_id=u05mtiivnmqdy7ae7ag3fkzheuuiag";
    

    fetch(url)
        .then(response => response.json())
        .then(streamsObj => {
            for (stream of streamsObj.streams) {
                streamers.push(stream.channel.name);
            }
            const totalStreamers = streamsObj._total;
            const pages = Math.floor(totalStreamers / 100);
            const streamsPromises = [];
            console.log(`Total streamers: ${streamsObj._total}, pages: ${pages}`);
            //console.log(streamsObj);

            if (totalStreamers > 100) {
                for (let i = 0; i < pages; i++) {
                    if (i > 9) {
                        break;
                    }
                    streamsPromises.push(fetch(`https://api.twitch.tv/kraken/streams/?broadcaster_language=cs&limit=100&offset=${(i + 1) * 100}&client_id=u05mtiivnmqdy7ae7ag3fkzheuuiag`));

                    /*fetch()
                        .then(response => response.json())
                        .then(streamsObj => {
                            //console.log(streamsObj);
                            for (stream of streamsObj.streams) {
                                streamers.push(stream.channel.name);
                            }
                            
                            console.log(i);
                        });*/
                }

                Promise.all(streamsPromises)
                    .then(responses => responses.map(response => response.json()))
                    .then(promiseArray => {
                        Promise.all(promiseArray)
                            .then(response => {
                                //console.log(response);
                                for (responseStream of response) {
                                    for (stream of responseStream.streams) {
                                        streamers.push(stream.channel.name);
                                    }
                                }
                                //console.log(streamers);
                                //return streamers;
                                const chattersUrl = streamers.map(nick => `https://tmi.twitch.tv/group/user/${nick}/chatters`);
                                //console.log(chattersUrl);

                                for (let i = 0; i < streamers.length; i++) {
                                    let s = document.createElement("script");
                                    s.src = `https://tmi.twitch.tv/group/user/${streamers[i]}/chatters?callback=myDisplayFunction`;
                                    document.body.appendChild(s);
                                }
                                //console.log("done");

                                


                                /*Promise.all(chattersUrl.map(chatterUrl => fetch(chatterUrl)))
                                    .then(responses => responses.map(response => response.json()))
                                    .then(promiseArray => {
                                        Promise.all(promiseArray)
                                            .then(chatters => {
                                                //console.log(chatters)
                                                for (chatter of chatters) {
                                                    for (viewer of chatter.chatters.viewers) {
                                                        if (viewer == searchName) {
                                                            console.log(viewer);
                                                        }
                                                    }
                                                }
                                                console.log("done");
                                            })
                                    });*/
                            })
                    })
                //.then(aaa => console.log(aaa))
            }

        });


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