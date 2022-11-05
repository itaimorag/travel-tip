import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { api } from '../../secret.js'
export const appController = {
    onGetLocs,
    getPosition,
}
let addressToLONlNG=""
const YOUR_ACCESS_KEY = "4550d726c167af335e15984e137db586"
const ADDRESS_TO_LNLON = `http://api.positionstack.com/v1/forward
? access_key = ${YOUR_ACCESS_KEY}`

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onSearch= onSearch
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
// window.renderTable = renderTable
window.onDeleteMarker = onDeleteMarker
window.onGetMarker = onGetMarker
window.onCopyLocation=onCopyLocation
function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            onGetLocs()
        })
        .catch(() => console.log('Error: cannot init map'))
}
// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}
function renderTable(locs) {
      const strHtml=   locs.map((location) => {
            return `
            <article>
                <div >${location.placeName}</div>
                <div><button onclick="onDeleteMarker('${location.placeName}',${location.lat}, ${location.lng})">X</button></div>
                <div><button onclick="onGetMarker(${location.lat}, ${location.lng})">🌍</button></div>
            </article>
                `
        }).join('')
     document.querySelector('.locs-list').innerHTML = strHtml
    }
function onCopyLocation(){
    var copyText = window.location.href
   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText);
}
    function onDeleteMarker(placeName,lat,lng) {
        locService.removeMarker(placeName)
        console.log(`foo = `)
        mapService.initMap(lat,lng)
        onGetLocs()
    }
    function onGetMarker(lat, lng) {
        mapService.panTo(lat, lng)
        locService.updateQueryStringParams(lat, lng)
    }
function onAddMarker( location,title ) {
       
        mapService.addMarker(location,title)
    }
    function onGetLocs() {
        // mapService.initMap()
        locService.getLocs()
            .then(locs => {
                console.log('locs',locs)
                renderTable(locs)
                mapService.renderMarkers(locs)
                // document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
            })
    }
    function onGetUserPos() {
        getPosition()
            .then(pos => {
                mapService.panTo(pos.coords.latitude, pos.coords.longitude)
                mapService.addMarker(({ lat: pos.coords.latitude, lng: pos.coords.longitude }), 'My Location')

            })
    }
    function onPanTo() {
        console.log('Panning the Map')
        mapService.panTo(35.6895, 139.6917)
}
function onSearch() {
        const searchTxt = document.querySelector('.search-input')
        let locationName = searchTxt.value
        let apiKey = 'AIzaSyC8ufaTUEGfVhZBl5eTGO2OnBZixfmrcMU'
        const prm1 = fetch(`https://maps.googleapis.com/maps/api/geocode/json?address='${locationName}'&key=${apiKey}`)
        prm1.then(res => {
        const prm2 = res.json()
        prm2.then(ans => {
            let lat = ans.results[0].geometry.location.lat
            let lng = ans.results[0].geometry.location.lng
            onGetMarker(lat, lng)
            onAddMarker(ans.results[0].geometry.location,locationName[0].toUpperCase()+locationName.substring(1))
        })
         })
    searchTxt.value = ''
}



// var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
//    map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('pac-input'));
//    google.maps.event.addListener(searchBox, 'places_changed', function() {
//        searchBox.set('map', null);
//      var places = searchBox.getPlaces();
//      var bounds = new google.maps.LatLngBounds();
//      var i, place;
//      for (i = 0; place = places[i]; i++) {
//        (function(place) {
//          var marker = new google.maps.Marker({

//            position: place.geometry.location
//          });
//          marker.bindTo('map', searchBox, 'map');
//          google.maps.event.addListener(marker, 'map_changed', function() {
//            if (!this.getMap()) {
//              this.unbindAll();
//            }
//          });
//          bounds.extend(place.geometry.location);


//        }(place));

//      }
//      map.fitBounds(bounds);
//      searchBox.set('map', map);
//      map.setZoom(Math.min(map.getZoom(),12));

//    });
 
// google.maps.event.addDomListener(window, 'load', init);
//  src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places"