/*
  MAKING A MAP AND ADDING TILES TO IT
*/

const mymap = L.map('international-space-station-map').setView([0, 0], 3);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';


const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution, minZoom: 3, maxZoom: 10 });
tiles.addTo(mymap);


/*
  GETTING A RANDOM QUOTE THAT WILL BE DISPLAYED IN LEAFLET POPUP 
*/

const quotes = [
  "241 individuals from 19 countries have visited the International Space Station",
  "The space station has been continuously occupied since November 2000",
  "Peggy Whitson set the record for spending the most total time living and working in space at 665 days on Sept. 2, 2017",
  "The solar array wingspan (240 feet) is about the same length as the world’s largest passenger aircraft, the Airbus A380.",
  "Eight spaceships can be connected to the space station at once.",
  "A spacecraft can arrive at the space station as soon as four hours after launching from Earth.",
  "On-orbit software monitors approximately 350,000 sensors, ensuring station and crew health and safety.", 
  "The space station has an internal pressurized volume equal that of a Boeing 747.",
  "More than 50 computers control the systems on the space station.",
  "More than 3 million lines of software code on the ground support more than 1.5 million lines of flight software code."
]

function getRandomQuote(array) {
  let minimum = 0;
  let maximum = array.length;
  let randomQuote = array[Math.floor(Math.random() * (maximum - minimum + 1)) + minimum];

  if (randomQuote === 'undefined') {
    return array[0]; // In case of value being undefined, set default value to be index 0 of quotes array
  } else return randomQuote;
}


/*
  MAKING A MARKER WITH CUSTOM ICON THAT WILL BE DISPLAYED ON MAP
*/

const internationalSpaceStationIcon = L.icon({
  iconUrl: '../Icons/international-space-station-marker.png',
  iconSize: [80, 72],
  iconAnchor: [40, 36]
});
let marker = L.marker([0, 0], { icon: internationalSpaceStationIcon }).addTo(mymap);


/*
 SPECIFYING CUSTOM OPTIONS FOR LEAFLET POPUP
*/

let customOptions =
    {
    'maxWidth': '400',
    'width': '200',
    'className' : 'popupCustom'
    }


let customPopup;

/*
  ENABLING POPUP ONCE MOUSE POINTER HOVERS OVER THE MARKER ON MAP
*/

marker.on('mouseover', function (e) {
    this.openPopup();
    customPopup = getRandomQuote(quotes);
    // Binding the custom popup to map marker 
    marker.bindPopup(customPopup, customOptions);
});
marker.on('mouseout', function (e) {
    this.closePopup();
});

/*
  CONNECTING TO API AND GETTING DATA FROM IT
*/

const API_URL = 'https://api.wheretheiss.at/v1/satellites/25544';


async function getDataFromIssApi() {
  const response = await fetch(API_URL);
  const data = await response.json();
  const { latitude, longitude, altitude, velocity, visibility } = data;

  
  document.getElementById('latitude').textContent = latitude.toFixed(2);
  document.getElementById('longitude').textContent = longitude.toFixed(2);
  document.getElementById('velocity').textContent = velocity.toFixed(2);
  document.getElementById('altitude').textContent = altitude.toFixed(2);
  document.getElementById('visibility').textContent = visibility;

  /*
    MAKING SURE THAT VIEW IS SET TO CURRENT VALUES OF LOGITUDE AND LATITUDE
  */
  
  mymap.setView([latitude, longitude], mymap.getZoom());
  marker.setLatLng([latitude, longitude]);

  /*
    CHANGING VISIBILITY ICON DEPENDING ON THE VALUE PASSED
  */

  if (visibility === 'eclipsed') {
    document.getElementById('weather-icon').src = '../Icons/eclipsed-icon-48.png';
  } else {
    document.getElementById('weather-icon').src = '../Icons/daylight-icon-48.png';
  }
}

/*
  INFORMATION BOX POPOP WHEN INFO BUTTON IS PRESSED 
  *LOCATED IN SECOND CARD WHERE ALTITUDE AND VELOCITY VALUES ARE
*/

const informationButton = document.getElementById('information-icon');
const informationButtonPopUpDescription = document.getElementById('information-shown-when-clicked');

informationButton.addEventListener('click', () => {
  if (informationButtonPopUpDescription.style.display === "none") {
    informationButtonPopUpDescription.style.display = "block";
  } else {
    informationButtonPopUpDescription.style.display = "none";
  }
});

/*
  API REQUEST RATE IS SET TO 1 SECOND, HENCE THE SETINTERVAL OF 1000
*/

getDataFromIssApi();
setInterval(getDataFromIssApi, 1000);