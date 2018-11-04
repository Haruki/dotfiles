//externes CSS einbinden (Siehe GM_addStyle @resource und GM_getResourceText im header)
var newCSS = GM_getResourceText("customCSS");
GM_addStyle(newCSS);

//iframe detection:
if (window.top != window.self) {
  //dont run in iframes.
  return;
}

//config:
let host = "https://filmz.pimpelkram.com";
let themoviedbhost = "https://api.themoviedb.org";

//======================= functions ===========================//

function log() {
  with (this) {
    console.log("imdbcode: " + imdbcode);
    console.log("score: " + score);
    console.log("releaseDate: " + releasedate);
    console.log("nameDeutsch: " + namedeutsch);
    console.log("nameOriginal: " + nameoriginal);
  }
}

function clearSocialDiv() {
  var socialDivResult = document.evaluate(
    "//div[@class='mini-article']",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  var socialDivElement = socialDivResult.snapshotItem(0);
  var children = socialDivElement.childNodes;
  for (var k = children.length - 1; k >= 0; k--) {
    socialDivElement.removeChild(children.item(k));
  }
  var formDiv = document.createElement("div");
  formDiv.setAttribute("id", "movieForm");
  socialDivElement.appendChild(formDiv);
  var messageDiv = document.createElement("div");
  messageDiv.setAttribute("id", "message");
  socialDivElement.appendChild(messageDiv);
  return socialDivElement;
}

function getImdbCode() {
  console.log("getting imdb code");
  var imdbcode = window.location.href;
  var slashIndex = imdbcode.lastIndexOf("/");
  var codeStartIndex = imdbcode.indexOf("/tt") + 3;
  var codeEndIndex = codeStartIndex + 7;
  return imdbcode.substring(codeStartIndex, codeEndIndex);
}

function getImdbScore() {
  let score = document.querySelector(".ratingValue strong span").innerHTML;
  console.log("type of score: " + typeof score);
  if (typeof score != "string") {
    return 0;
  } else {
    score = score.replace(",", ".");
    return parseFloat(score);
  }
}

const getNameDeutsch = () => {
  console.log("getting nameDeutsch");
  let nameDeutsch = document.querySelector(".title_wrapper h1").childNodes[0]
    .nodeValue;
  console.log("nameDeutschTest: " + nameDeutsch);
  return nameDeutsch;
};

//https://api.themoviedb.org/3/find/tt0306414?api_key=caf9f8363a15942e96e2678c36b80373&language=en-US&external_source=imdb_id
function getTheMovieDbData(imdbcode) {
  fetch(
    themoviedbhost +
      "/3/find/tt" +
      imdbcode +
      "?api_key=caf9f8363a15942e96e2678c36b80373&language=en-US&external_source=imdb_id",
    {
      methos: "GET"
    }
  ).then(response => {
    console.log(
      "processing themoviedb response..., status: " + response.status
    );
    processTheMovieDbData(response);
  });
  /*
  GM_xmlhttpRequest({
    method: "GET",
    url:
      themoviedbhost +
      "/3/find/tt" +
      imdbcode +
      "?api_key=caf9f8363a15942e96e2678c36b80373&language=en-US&external_source=imdb_id",
    headers: {
      "User-Agent": "monkeyagent",
      Accept: "application/json"
    },
    onload: processTheMovieDbData
  });
  */
}

function getMovie(imdbcode) {
  console.log("filmz.user" + GM_getValue("filmz.user"));
  if (
    typeof GM_getValue("filmz.user") == "undefined" ||
    typeof GM_getValue("filmz.pass") == "undefined"
  ) {
    console.log("filmz.user und pass nicht gesetzt.");
    filmzUser = prompt("filmz user:");
    filmzPass = prompt("filmz pass:");
    GM_setValue("filmz.user", filmzUser);
    GM_setValue("filmz.pass", filmzPass);
  } else {
    filmzUser = GM_getValue("filmz.user");
    filmzPass = GM_getValue("filmz.pass");
    console.log("filmz user and pass found and set.");
  }
  let headers = new Headers();
  console.log("credentials found: " + filmzUser + ", " + filmzPass);
  headers.append("Authorization", "Basic " + btoa(filmzUser + ":" + filmzPass));
  console.log("new try fetch filmz with basic auth...");
  fetch(host + "/filmz/find?imdbCode=" + pageMovie.imdbcode, {
    method: "GET",
    headers: headers
  }).then(response => {
    console.log("filmz response: " + response.status);
    if (response.ok) {
      console.log("resonse ok..setting filmz data");
      response.json().then(data => {
        document.querySelector(".filmz-name").innerHTML = data.nameDeutsch;
        document.querySelector(".filmz-seen").innerHTML =
          "<input id='filmz-seen' type='checkbox' />";
        if (data.seen) {
          document.querySelector("#filmz-seen").checked = true;
        }
      });
    } else {
      document.querySelector(".filmz-name").innerHTML =
        "Filmz request Failed. Code: " + response.status;
    }
  });
}

//data:"imdbCode=" + imdbcode
//"Content-Type":"application/x-www-form-urlencoded"

/**/

function addMovie() {
  /*
    document.getElementById("addButton").disabled = true;
    console.log(pageMovie.score);
    GM_xmlhttpRequest({
      method: "POST",
      url: host + "/filmz",
      data:
        "imdbCode=" +
        pageMovie.imdbcode +
        "&imdbRating=" +
        pageMovie.score +
        "&releaseDate=" +
        pageMovie.releasedate +
        "&nameDeutsch=" +
        pageMovie.namedeutsch +
        "&nameOriginal=" +
        pageMovie.nameoriginal,
      headers: {
        "User-Agent": "monkeyagent",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: processAddMovieResponse
    });
    */
}

function processTheMovieDbData(result) {
  console.log("theMovieDb fetching data...");
  result.json().then(response => {
    //Datenvariablen fuer movie daten fuellen:
    if (response.movie_results[0]) {
      console.log("Film!!");
      this.movie = true;
      pageMovie.nameoriginal = response.movie_results[0].original_title;
      pageMovie.releasedate = new Date(response.movie_results[0].release_date);
      console.log("theMovieDb release_date: " + pageMovie.releasedate);
    } else if (response.tv_results[0]) {
      console.log("Serie!");
      this.movie = false;
      socialDivElement.parentElement.insertBefore(
        socialDivElement,
        document.querySelector("#top-rated-episodes-rhs")
      );
      pageMovie.nameoriginal = response.tv_results[0].original_name;
      pageMovie.releasedate = new Date(response.tv_results[0].first_air_date);
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
  /*

      */
}

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
        <div class="filmz-seen"><input type="checkbox" /> </div>


        <div class="page-name"></div>
        <div class="page-rating"></div>
        <div class="themoviedb-name">themoviedb name blah la la la </div>
        <div class="themoviedb-nameorig">the movie db fancy orig name</div>

    </div>
  `;
let movieFormDiv = document.getElementById("movieForm");
let messageDiv = document.getElementById("message");

let movieid;

//bestimmt, ob es sich um einen film oder um eine serie handelt.
let movie = true;

//this object collects all relevant data of the current movie.
let pageMovie = new Object();
//collect movie essential infos:
//imdbcode:
pageMovie.imdbcode = getImdbCode();
console.log("got imdbcode");
console.log(pageMovie.imdbcode);

//dummy data
pageMovie.score = getImdbScore();
console.log("score: " + pageMovie.score);
//releaseDate, created from basic year if not present/not released yet:
pageMovie.releasedate = new Date(); //getReleaseDate(getReleaseYear(),"january",1);
console.log(pageMovie.releasedate);
pageMovie.namedeutsch = getNameDeutsch();
console.log(pageMovie.namedeutsch);
pageMovie.nameoriginal = "test";
console.log(pageMovie.nameoriginal);
pageMovie.log = log;
pageMovie.log();

getTheMovieDbData(pageMovie.imdbcode);
getMovie(pageMovie.imdbcode);

console.log("end...");
