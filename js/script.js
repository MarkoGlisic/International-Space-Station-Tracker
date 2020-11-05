// Making a map and tiles
// Setting a higher initial zoom to make effect more obvious
const mymap = L.map('international-space-station-map').setView([0, 0], 3);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';


const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution, minZoom: 3, maxZoom: 10 });
tiles.addTo(mymap);


// Getting random quotes 

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
    return array[0];
  } else return randomQuote;
}


// Making a marker with a custom icon

const internationalSpaceStationIcon = L.icon({
  iconUrl: '../Icons/international-space-station-marker.png',
  iconSize: [80, 72],
  iconAnchor: [40, 36]
});
let marker = L.marker([0, 0], { icon: internationalSpaceStationIcon }).addTo(mymap);


// specify popup options 

let customOptions =
    {
    'maxWidth': '400',
    'width': '200',
    'className' : 'popupCustom'
    }


let customPopup;

marker.on('mouseover', function (e) {
    this.openPopup();
    customPopup = getRandomQuote(quotes);
    // bind the custom popup 
    marker.bindPopup(customPopup, customOptions);
});
marker.on('mouseout', function (e) {
    this.closePopup();
});


// API 

const api_url = 'https://api.wheretheiss.at/v1/satellites/25544';


async function getDataFromIssApi() {
  const response = await fetch(api_url);
  const data = await response.json();
  const { latitude, longitude, altitude, velocity, visibility } = data;

  
  // Always set the view to current longitude and latitude
  mymap.setView([latitude, longitude], mymap.getZoom());
  marker.setLatLng([latitude, longitude]);
  
  
  document.getElementById('latitude').textContent = latitude.toFixed(2);
  document.getElementById('longitude').textContent = longitude.toFixed(2);
  document.getElementById('velocity').textContent = velocity.toFixed(2);
  document.getElementById('altitude').textContent = altitude.toFixed(2);
  document.getElementById('visibility').textContent = visibility;


  // Chaning Visibility Icon depending on value.
  if (visibility === 'eclipsed') {
    document.getElementById('weather-icon').src = '../Icons/eclipsed-icon-48.png';
  } else {
    document.getElementById('weather-icon').src = '../Icons/daylight-icon-48.png';
  }
}


// Information box description
const informationButton = document.getElementById('information-icon');
const informationButtonPopUpDescription = document.getElementById('information-shown-when-clicked');

informationButton.addEventListener('click', () => {
  if (informationButtonPopUpDescription.style.display === "none") {
    informationButtonPopUpDescription.style.display = "block";
  } else {
    informationButtonPopUpDescription.style.display = "none";
  }
});


getDataFromIssApi();
setInterval(getDataFromIssApi, 1000);