// ==UserScript==
// @name		Greasemonkey Bestfilmz (dropwizard server) v1
// @namespace 	http://www.oreilly.com/catalog/greasemonkeyhacks/
// @description	BF Greasemonkey Client v1
// @include        http://www.imdb.com/title/tt*/*
// @include        https://www.imdb.com/title/tt*/*
// @include        http://imdb.com/title/tt*
// @include        https://imdb.com/title/tt*
// @exclude         http://*.media-imdb.com/*
// @exclude			http://www.imdb.com/rt/*
// @exclude 		http://www.imdb.com/images/*
// @exclude			http://www.imdb.com/widget/*
// @exclude			http://www.imdb.com/title/tt*/_ajax/*
// @exclude 		http://www.imdb.com/title/tt*//event/*
// @grant			GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @connect         pimpelkram.com
// @connect         omdbapi.com
// @connect         themoviedb.org
// @resource        customCSS http://static.pimpelkram.com/imdb.css
// @grant           GM_addStyle
// @grant           GM_getResourceText
// ==/UserScript==

//externes CSS einbinden (Siehe GM_addStyle @resource und GM_getResourceText im header)
var newCSS = GM_getResourceText("customCSS");
GM_addStyle(newCSS);

//config:
let host = "https://filmz.pimpelkram.com";
let themoviedbhost = "https://api.themoviedb.org";

//======================= functions ===========================//

function log(obj) {
    console.log("imdbcode: " + obj.imdbcode);
    console.log("score: " + obj.score);
    console.log("releaseDate: " + obj.releasedate);
    console.log("nameDeutsch: " + obj.namedeutsch);
    console.log("nameOriginal: " + obj.nameoriginal);
}

const clearSocialDiv = () => {
    return document.querySelector("div.Media__ButtonContainer-sc-1x98dcb-5,bEEdEB");
};

function getImdbCode() {
    var imdbcode = window.location.href;
    var slashIndex = imdbcode.lastIndexOf("/");
    var codeStartIndex = imdbcode.indexOf("/tt") + 3;
    var codeEndIndex = codeStartIndex + 7;
    return imdbcode.substring(codeStartIndex, codeEndIndex);
}

function getImdbScore() {
    let score = document.querySelector("span.AggregateRatingButton__RatingScore-sc-1ll29m0-1,iTLWoV").innerHTML;
    if (typeof score != "string") {
        return 0;
    } else {
        score = score.replace(",", ".");
        return parseFloat(score);
    }
}

const getNameDeutsch = () => {
    let nameDeutsch = document.querySelector("h1.TitleHeader__TitleText-sc-1wu6n3d-0,cLNRlG").childNodes[0]
        .nodeValue;
    return nameDeutsch;
};

const processTheMovieDbData = result => {
    console.log("theMovieDb fetching data...");
    result.json().then(response => {
        //Datenvariablen fuer movie daten fuellen:
        if (response.movie_results[0]) {
            console.log("Film!!");
            this.movie = true;
            pageMovie.nameoriginal = response.movie_results[0].original_title;
            pageMovie.releasedate = new Date(
                response.movie_results[0].release_date
            );
            console.log("theMovieDb release_date: " + pageMovie.releasedate);
        } else if (response.tv_results[0]) {
            console.log("Serie!");
            this.movie = false;
            socialDivElement.parentElement.insertBefore(
                socialDivElement,
                document.querySelector("#top-rated-episodes-rhs")
            );
            pageMovie.nameoriginal = response.tv_results[0].original_name;
            pageMovie.releasedate = new Date(
                response.tv_results[0].first_air_date
            );
            console.log("theMovieDb release_date: " + pageMovie.releasedate);
        } else {
            console.log("Unbekannt: keine serie oder film!");
            return;
        }
        console.log("theMovieDb name_original: " + pageMovie.nameoriginal);
        document.querySelector(".themoviedb-name").innerHTML =
            pageMovie.namedeutsch;
        document.querySelector(".themoviedb-nameorig").innerHTML =
            pageMovie.nameoriginal;
        document.querySelector(".page-rating").innerHTML = pageMovie.score;
        document.querySelector(".page-name").innerHTML = pageMovie.namedeutsch;
    });
};

//https://api.themoviedb.org/3/find/tt0306414?api_key=caf9f8363a15942e96e2678c36b80373&language=en-US&external_source=imdb_id
const getTheMovieDbData = imdbcode => {
    fetch(
        themoviedbhost +
            "/3/find/tt" +
            imdbcode +
            "?api_key=caf9f8363a15942e96e2678c36b80373&language=en-US&external_source=imdb_id",
        {
            method: "GET"
        }
    ).then(response => {
        console.log(
            "processing themoviedb response..., status: " + response.status
        );
        processTheMovieDbData(response);
    });
};

const addMovie = () => {
    pageMovie.releasedate = pageMovie.releasedate.getTime();
    log(pageMovie);
    let filmzUser, filmzPass;
    filmzUser = GM_getValue("filmz.user");
    filmzPass = GM_getValue("filmz.pass");
    let headers = new Headers();
    headers.append(
        "Authorization",
        "Basic " + btoa(filmzUser + ":" + filmzPass)
    );
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    document.getElementById("addButton").disabled = true;
    fetch(host + "/filmz", {
        method: "POST",
        headers: headers,
        body:
            "imdbCode=" +
            pageMovie.imdbcode +
            "&imdbRating=" +
            pageMovie.score +
            "&releaseDate=" +
            pageMovie.releasedate +
            "&nameDeutsch=" +
            pageMovie.namedeutsch +
            "&nameOriginal=" +
            pageMovie.nameoriginal
    }).then(response => {
        console.log("response.ok " + response.ok);
        console.log("responst.status " + response.status);
        processGetMovieResponse(response);
    });
};

/**
 * Setzt einen Film auf 'gesehen'.
 * @param {*}
 */
const toggleSeen = movieId => {
    let filmzUser, filmzPass;
    filmzUser = GM_getValue("filmz.user");
    filmzPass = GM_getValue("filmz.pass");
    let headers = new Headers();
    headers.append(
        "Authorization",
        "Basic " + btoa(filmzUser + ":" + filmzPass)
    );
    fetch(host + "/filmz/" + movieId + "/seen", {
        method: "PUT",
        headers: headers
    }).then(response => {
        console.log("toggleSeen response.status: " + response.status);
        let cb = document.getElementById("filmz-seen");
        if (response.status === 200) {
            cb.checked = true;
            cb.disabled = true;
        } else {
            cb.checked = false;
        }
    });
};

/**
 *
 * @param {*} response objekt mit status und json (content)
 */
const processGetMovieResponse = response => {
    console.log("filmz response: " + response.status);
    if (response.ok) {
        console.log("resonse ok..setting filmz data");
        response.json().then(data => {
            document.querySelector(".filmz-name").innerHTML = data.nameDeutsch;
            document.querySelector(".filmz-seen").innerHTML =
                "<input id='filmz-seen' type='checkbox' />";
            document
                .getElementById("filmz-seen")
                .addEventListener("click", () => toggleSeen(data.movieId));
            if (data.seen) {
                document.querySelector("#filmz-seen").checked = true;
            }
        });
    } else {
        document.querySelector(".filmz-name").innerHTML = `
      Filmz request Failed. Code: ${response.status}
      <button type=button id=addButton>add Movie</button>
      `;
        document
            .getElementById("addButton")
            .addEventListener("click", () => addMovie());
    }
};

const getMovie = imdbcode => {
    let filmzUser, filmzPass;
    if (
        typeof GM_getValue("filmz.user") == "undefined" ||
        typeof GM_getValue("filmz.pass") == "undefined"
    ) {
        filmzUser = prompt("filmz user:");
        filmzPass = prompt("filmz pass:");
        GM_setValue("filmz.user", filmzUser);
        GM_setValue("filmz.pass", filmzPass);
    } else {
        filmzUser = GM_getValue("filmz.user");
        filmzPass = GM_getValue("filmz.pass");
    }
    let headers = new Headers();
    headers.append(
        "Authorization",
        "Basic " + btoa(filmzUser + ":" + filmzPass)
    );
    fetch(host + "/filmz/find?imdbCode=" + pageMovie.imdbcode, {
        method: "GET",
        headers: headers
    }).then(response => {
        processGetMovieResponse(response);
    });
};

//data:"imdbCode=" + imdbcode
//"Content-Type":"application/x-www-form-urlencoded"

/**/

/*
    GM_xmlhttpRequest({
      method: "PUT",
      url: host + "/filmz/" + movieid + "/seen",
      headers: {
        "User-Agent": "monkeyagent",
        Accept: "application/json"
      },
      onload: processUpdateMovieResult
    });
    */
//})();

//************ Program************ */

console.log("starting...");
let socialDivElement = clearSocialDiv();
socialDivElement.innerHTML = `
      <div class="imdb-container">

        <div class="filmz-name">leer alskdjf lasdkf alskd </div>
        <div class="filmz-seen"> </div>


        <div class="page-name"></div>
        <div class="page-rating"></div>
        <div class="themoviedb-name">themoviedb name blah la la la </div>
        <div class="themoviedb-nameorig">the movie db fancy orig name</div>

    </div>
  `;

//this object collects all relevant data of the current movie.
let pageMovie = new Object();
//collect movie essential infos:
//imdbcode:
pageMovie.imdbcode = getImdbCode();
console.log("imdbcode:" + pageMovie.imdbcode);
//dummy data
pageMovie.score = getImdbScore();
console.log("score: " + pageMovie.score);
//releaseDate, created from basic year if not present/not released yet:
pageMovie.releasedate = new Date(); //getReleaseDate(getReleaseYear(),"january",1);
pageMovie.namedeutsch = getNameDeutsch();
console.log("scraped namedeutsch:" + pageMovie.namedeutsch);
pageMovie.nameoriginal = "";
log(pageMovie);

getTheMovieDbData(pageMovie.imdbcode);
getMovie(pageMovie.imdbcode);

console.log("end...");