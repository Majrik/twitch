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
let streamers2 = [];
let resultsArray = [];
searchButton.addEventListener("click", () => {
    resultsArray = [];
    jsonpCallbacks.cntr = 0;
    streamers = [];
    resultsArray = [];
    promiseArray = [];
    const jsonpCbs = document.querySelectorAll(".jsonpCb");
    for (jsonpCb of jsonpCbs) {
        //console.log(jsonpCb);
        jsonpCb.parentNode.removeChild(jsonpCb);
    }
    //console.log(jsonpCbs);


    searchName = searchInput.value;
    //console.log(searchName)
    loadingDiv.removeAttribute("style");

    const languages = ["cs", "en"];
    let total = 0;

    for(let j = 0; j < languages.length; j++) {
        //console.log(languages[i])
        //streamers = [];
        //console.log(streamers);
        //resultsArray = [];
        
    
    const url = `https://api.twitch.tv/kraken/streams/?broadcaster_language=${languages[j]}&limit=100&client_id=u05mtiivnmqdy7ae7ag3fkzheuuiag`;


    fetch(url)
    .then(response => response.json())
    .then(streamsObj => {
        
        
        
        //console.log(url)
        for (stream of streamsObj.streams) {
            streamers.push(stream.channel.name);
        }
        //console.log(streamers);
        const totalStreamers = streamsObj._total;
        const pages = Math.floor(totalStreamers / 100);
        const streamsPromises = [];
        console.log(`Total streamers: ${streamsObj._total}, pages: ${pages}`);
        //console.log(streamsObj);
        //total += streamsObj._total;
        //console.log(total)
        if (j+1 == languages.length) {
            //total = streamers.length
            //console.log(streamers.length);
        }

        if (totalStreamers > 100) {
            for (let i = 0; i < pages; i++) {
                if (i > 9) {
                    //console.log(streamers.length);
                    break;
                }

                

                //console.log(i*100);
                streamsPromises.push(fetch(`https://api.twitch.tv/kraken/streams/?broadcaster_language=${languages[j]}&limit=100&offset=${(i + 1) * 100}&client_id=u05mtiivnmqdy7ae7ag3fkzheuuiag`));
                
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
                    //streamers = [];
                    Promise.all(promiseArray)
                        .then(response => {
                            
                            //console.log(total);
                            for (responseStream of response) {
                                for (stream of responseStream.streams) {
                                    streamers.push(stream.channel.name);
                                }
                            }
                            //console.log(streamers);
                            //return streamers;
                            const chattersUrl = streamers.map(nick => `https://tmi.twitch.tv/group/user/${nick}/chatters`);
                            /*console.log(chattersUrl[77]);
                            console.log(streamers[77])*/
                            //console.log(streamers2);
                            //resultsArray = [];

                            if (j+1 == languages.length) {
                                console.log(streamers);
                                for (let i = 0; i < streamers.length; i++) {
                                
                                
                                    /*let s = document.createElement("script");
                                    s.src = `https://tmi.twitch.tv/group/user/${streamers[i]}/chatters?callback=myDisplayFunction`;
                                    document.body.appendChild(s);*/
    
                                    getDataForId(chattersUrl[i], streamers[i], searchName, function (id, id2, resultsArray) {
                                        //console.log(i)
                                        if (i == streamers.length - 1) {
                                            //console.log(i+" "+(streamers.length-1));
                                            for (resultArray of resultsArray) {
                                                results.innerHTML += resultArray;
                                                
                                            }
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
                                        }
                                    });
    
                                    
    
                                }
                            }
                            
                            




                        })
                })
        }
        
    })
    .catch(error => console.log(error));
}
    


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


const jsonpCallbacks = { cntr: 0 };


function getDataForId(url, streamer, searchName, fn) {
    var name = "fn" + jsonpCallbacks.cntr++;

    jsonpCallbacks[name] = function () {
        for (viewer of arguments[0].data.chatters.viewers) {
            if (searchName == viewer) {
                console.log(`${searchName} je u ${streamer}`);
                resultsArray.push(`<p>${searchName} je u ${streamer}</p>`);
                //console.log(resultsArray);


            }
        }
        //console.log(id + " " + id2 + " " + url);
        delete jsonpCallbacks[name];
        var args = Array.prototype.slice.call(arguments);
        //console.log(args);
        args.unshift(url, streamer, resultsArray);
        //console.log(jsonpCallbacks);

        fn.apply(this, args);
    }

    var fullURL = url + "?callback=jsonpCallbacks." + name;
    //console.log(fullURL);
    var s = document.createElement("script");
    s.src = fullURL;
    s.className = "jsonpCb";
    document.body.appendChild(s);
}