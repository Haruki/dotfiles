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
// ==/UserScript==

(function() {

//iframe detection:
if (window.top != window.self) {
	//dont run in iframes.
	return;
}

//config:
var host = "https://filmz.pimpelkram.com";

console.log("starrrrting...");
var socialDivElement = clearSocialDiv();
var movieFormDiv = document.getElementById('movieForm');
var messageDiv = document.getElementById('message');

var movieid;

//bestimmt, ob es sich um einen film oder um eine serie handelt.
var movie = true;

//this object collects all relevant data of the current movie.
var pageMovie = new Object();
//collect movie essential infos:
//imdbcode:
pageMovie.imdbcode = getImdbCode();
console.log("got imdbcode");
console.log(pageMovie.imdbcode);
pageMovie.score = getScore();
console.log("score: " + pageMovie.score);
//releaseDate, created from basic year if not present/not released yet:
pageMovie.releasedate = getReleaseDate(getReleaseYear(),"january",1);
console.log(pageMovie.releasedate);
pageMovie.namedeutsch = getNameDeutsch();
console.log(pageMovie.namedeutsch);
pageMovie.nameoriginal = getNameOriginal(pageMovie.namedeutsch);
console.log(pageMovie.nameoriginal);
pageMovie.log = log;
pageMovie.log();

getMovie(pageMovie.imdbcode);

console.log('end...');







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

function clearMovieDivs() {
	clearChildren(movieFormDiv);
	clearChildren(messageDiv);
}

function clearChildren(element) {
	var children = element.childNodes;
	for (var k=children.length-1; k>=0; k--) {
	 	element.removeChild(children.item(k));
        }
}


function clearSocialDiv() {
	var socialDivResult = document.evaluate("//div[@class='mini-article']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	var socialDivElement = socialDivResult.snapshotItem(0);
	var children = socialDivElement.childNodes;
	for (var k=children.length-1; k>=0; k--) {
		socialDivElement.removeChild(children.item(k));
	}
        var formDiv = document.createElement('div');
        formDiv.setAttribute('id','movieForm');
        socialDivElement.appendChild(formDiv);
	var messageDiv = document.createElement('div');
        messageDiv.setAttribute('id','message');
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


function getScore() {
	var score = 0;
	//var ratingSpanSearchResult = document.evaluate("//span[@itemprop='ratingValue']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	var ratingSpanSearchResult = document.evaluate("//span[@itemprop='ratingValue']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (ratingSpanSearchResult.snapshotLength > 0) {
		var ratingSpanElement = ratingSpanSearchResult.snapshotItem(0);
		score = ratingSpanElement.childNodes.item(0).nodeValue;
	//	var ratingChildren = ratingSpanElement.childNodes;
  //		for (var k=ratingChildren.length-1; k>=0; k--) {
	//		score = ratingChildren.item(k).nodeValue;
	//	}
	}
	//fuehrende und nachfolgende leerzeichen entfernen:
	score = score.trim();
	//komma durch punkt ersetzen:
	score = score.replace(/,/,".");
	return score;
}

function getReleaseYear() {
	var year;
	var releaseAnchorSearchResult = document.evaluate("//span[@id='titleYear']//a", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (releaseAnchorSearchResult.snapshotLength > 0) {
		console.log("found year anchor...");
		var releaseAnchor = releaseAnchorSearchResult.snapshotItem(0);
		year = releaseAnchor.childNodes.item(0).nodeValue;
	} else {
		console.log("no year anchor..using direct children");
		releaseAnchorSearchResult = document.evaluate("//span[@class='nobr']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var releaseAnchor = releaseAnchorSearchResult.snapshotItem(0);
		year = releaseAnchor.childNodes.item(0).nodeValue.substring(1,5);
	}
	return year;
}

//releaseDate if present:
function getReleaseDate(releaseYear, releaseMonth, releaseDay) {
	var date;
	var dateAnchorSearchResult = document.evaluate("//div[@class='title_wrapper']//meta[@itemprop='datePublished']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (dateAnchorSearchResult.snapshotLength > 0) {
		var dateAnchor = dateAnchorSearchResult.snapshotItem(0);
		var fullString = dateAnchor.getAttribute('content');
		console.log('fullString: ' + fullString);
		var parts = fullString.split(/\W/);
		releaseDay = parts[2];
		console.log(parts[0]);
		releaseMonth = parts[1];
		releaseYear = parts[0];
	}
	date = new Date(releaseMonth + " " + releaseDay + ", " + releaseYear + " 00:00:00");
	console.log(date);
	console.log(">" + releaseDay + "< >" + releaseMonth + "< >" + releaseYear + "<");
	return date.getTime();
}


function getNameDeutsch() {
	console.log("star getNameDeutsch");
	var name;
	var deutschH1SearchResult = document.evaluate("//div[@class='title_wrapper']//h1[@itemprop='name']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	var deutschH1Element = deutschH1SearchResult.snapshotItem(0);
	name = deutschH1Element.childNodes.item(0);
	console.log(name);
	name = name.nodeValue.replace(/^\s+/,"").replace(/\s+$/,"");
	console.log("end getNameDeutsch");
	return name;
}


function getNameOriginal(nameDeutsch) {
	var name;
	var originalSearchResult = document.evaluate("//div[@class='title_wrapper']//div[@class='originalTitle']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (originalSearchResult.snapshotLength > 0) {
		console.log("found original title");
		var originalElement = originalSearchResult.snapshotItem(0);
		name = originalElement.childNodes.item(0).nodeValue;
		name = name.replace(/^\s+/,"").replace(/\s+$/,"");
		if (name.indexOf("\"") == 0 && name.lastIndexOf("\"") == name.length -1) {
		  name = name.substring(1,name.length-1);
		}
	} else {
		name = nameDeutsch;
	}
	return name;
}


function getMovie(imdbcode) {
	GM_xmlhttpRequest({
	  method:"GET",
	  url:host + "/filmz/find?imdbCode=" + imdbcode,
	  headers:{
		"User-Agent":"monkeyagent",
		"Accept":"application/json"
		},
	  onload:processGetMovieResult
	});
}

//data:"imdbCode=" + imdbcode
//"Content-Type":"application/x-www-form-urlencoded"


		/**/


function addMovie() {
	document.getElementById('addButton').disabled=true;
	console.log(pageMovie.score);
	GM_xmlhttpRequest({
	  method:"POST",
	  url:host + "/filmz",
	  data:"imdbCode=" + pageMovie.imdbcode
		+ "&imdbRating=" + pageMovie.score
		+ "&releaseDate=" + pageMovie.releasedate
		+ "&nameDeutsch=" + pageMovie.namedeutsch
		+ "&nameOriginal=" + pageMovie.nameoriginal ,
	  headers:{
		"User-Agent":"monkeyagent",
		"Content-Type":"application/x-www-form-urlencoded"
		},
	  onload:processAddMovieResponse
	});
}

function createJsonResponse(result) {
	var response = JSON.parse(result.responseText);
	console.log(response);
}

function createUpdateForm() {
	var form = document.createElement('form');
	form.setAttribute('id','updateForm');
	form.setAttribute('action','');
	form.appendChild(document.createTextNode('seen'));
	var seenCheckbox = document.createElement('input');
	seenCheckbox.setAttribute('type','checkbox');
	seenCheckbox.setAttribute('checked','true');
	seenCheckbox.setAttribute('id','seen');
	seenCheckbox.setAttribute('value','seen');
	seenCheckbox.addEventListener('click',toggleSubmitButton,false);
	form.appendChild(seenCheckbox);
	var submitButton = document.createElement('input');
	submitButton.setAttribute('type','button');
	submitButton.setAttribute('value','update');
	submitButton.setAttribute('id','submit');
	submitButton.setAttribute('disabled','true');
	submitButton.addEventListener('click',updateMovieSeen,false);
	form.appendChild(submitButton);
	form.appendChild(document.createElement('br'));
	//socialDivElement.appendChild(form);
	movieFormDiv.appendChild(form);

	// socialDivElement.innerHTML =
	// "<form id='updateForm' name='updateForm' action=''>"
	// +	"<input type='text' readonly name='score' value='0.0' /><br/>"
	// +	"seen<input type='checkbox' checked name='seen' value='seen' /><br/>"
	// +	"<input type='submit' value='submit' disabled/>"
	// +"</form>"
	// ;
}

function createAddForm() {
	//createElementWithAttributes(socialDivElement,'form',{'id':'addForm','action':''},false);
	createElementWithAttributes(movieFormDiv,'form',{'id':'addForm','action':''},false);
	var form = document.getElementById('addForm');
	createElementWithAttributes(form,'input',{'type':'button','value':'ADD MOVIE','id':'addButton'},true);
	document.getElementById('addButton').addEventListener('click',addMovie,false);
	// socialDivElement.innerHTML =
	// "<form id='addForm' name='addForm' action=''>"
	// +	"<input type='button' name='addButton' value='ADD MOVIE' onclick='addMovie'/>"
	// +"</form>"
	// ;
}

function processGetMovieResult(result) {
	var response = JSON.parse(result.responseText);
	if (response.code) {
		//if (response.error == "not found") {
			createAddForm();
		//} else {
			showError(response.message);
		//}
	} else {
		createUpdateForm();
		populateUpdateForm(response);
	}
}


function roundFloat(number) {
	return Math.round(number * 10)/10;
}

function asString(floatNumber) {
	if (floatNumber % 1 == 0) {
		return floatNumber + ".0";
	} else {
		return floatNumber;
	}
}

function renderScoreDifference(movie) {
	console.log('rendering score difference...');
	console.log('raw imdbRating: ' + movie.imdbRating);
	var databaseScore = roundFloat(movie.imdbRating);
	console.log('database score: ' + movie.imdbRating);
	var diff = roundFloat(databaseScore - pageMovie.score);
	var diffString = "";
	if (diff > 0) {
		diffString = "  ( - " + diff + " )";
	} else if (diff < 0) {
		diffString = "  " + Math.abs(diff);
	}
	return asString(databaseScore) + diffString;
}

function populateUpdateForm(movie) {
	console.log('populating update form...');
	console.log('raw nameDeutsch: ' + movie.nameDeutsch);
	console.log('raw movieid: ' + movie.movieId);
	movieid = movie.movieId;
	console.log('movieid: ' + movieid);
	var parent = document.getElementById('updateForm');
	addTextLine(parent,"Score: " + renderScoreDifference(movie),true);
	addTextLine(parent,"Title: " + movie.nameDeutsch,true);
	addTextLine(parent,"Original: " + movie.nameOriginal,true);
	addTextLine(parent,"Added: " + formatDate(new Date(movie.createTime)),true);
	addTextLine(parent,"SeenTime: " + formatDate(new Date(movie.seenTime)),true);
	addTextLine(parent,"Released: " + formatDate(new Date(movie.releaseDate)),true);
	var seenBox = document.getElementById('seen');
	if (movie.seen == true) {
		seenBox.checked = true;
		seenBox.value = 'true';
	} else {
		seenBox.checked = false;
		seenBox.value = 'false';
	}
}

function createElementWithAttributes(parent,name,attributes,br) {
	var field = document.createElement(name);
	for (key in attributes) {
		field.setAttribute(key,attributes[key]);
	}
	parent.appendChild(field);
	if (br) {
		var breakElement = document.createElement('br');
		parent.appendChild(breakElement);
	}
}

function addTextLine(parent,text,br) {
	var textField = document.createTextNode(text);
	parent.appendChild(textField);
	if (br) {
		var breakElement = document.createElement('br');
		parent.appendChild(breakElement);
	}
}

function formatDate(date) {
	return date.getFullYear() + "-" +(date.getMonth()+1) + "-" + date.getDate();
}

function toggleSubmitButton() {
	console.log("toggled!!!");
	var button = document.getElementById('submit');
	//var val = (this.value == 'true');
	button.disabled = (!button.disabled);
}

function processUpdateMovieResult(response) {
	var resp = JSON.parse(response.responseText);
	if (resp.error) {
		addTextLine(document.getElementById('updateForm'),' >>> ERROR <<< ',true);
	} else {
		addTextLine(document.getElementById('updateForm'),' >>> CHANGE SUCCESS',true);
	}
}


function updateMovieSeen() {
	//disable submit button because seen status swapped:
	document.getElementById('submit').disabled=true;
	//get status of seen checkbox:
	console.log("updateMovieSeen!");
	var checkBox = document.getElementById('seen');
	var status = checkBox.checked;
	console.log(status);
	GM_xmlhttpRequest({
	  method:"PUT",
	  url:host + "/filmz/" + movieid + "/seen",
	  headers:{
		"User-Agent":"monkeyagent",
		"Accept":"application/json"
		},
	  onload:processUpdateMovieResult
	});
}

function processAddMovieResponse(response) {
	var jsonResponse = JSON.parse(response.responseText);
	clearMovieDivs();
	//clearSocialDiv();
	if (jsonResponse.nameDeutsch) {
		createUpdateForm();
		populateUpdateForm(jsonResponse);
	} else if(jsonResponse.code) {
           showError(jsonResponse.message);
        } else {
           console.log("nothing found to display");
	}
}

function showError(error) {
	//socialDivElement.innerHTML = error;
	messageDiv.innerHTML = error;
	console.log(error);
}

})();
