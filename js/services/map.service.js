import { api } from '../../secret.js'
import { storageService } from './storage.service.js'
import { locService } from './loc.service.js'
import { appController } from '../app.controller.js'
export const mapService = {
    initMap,
    addMarker,
    panTo,
    renderMarkers,

}

const STORAGE_KEY = 'locsStorage'
// Var that is used throughout this Module (not global)
var gMap
//   `https://maps.googleapis.com/maps/api/geocode/json?place_id=ChIJeRpOeF67j4AR9ydy_PIzPuM&key=${api.GOOGLE_API_KEY}`
//`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&components=country:GB&key=${api.GOOGLE_API_KEY}`
function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
    .then(() => {
        console.log('google available')
        gMap = new google.maps.Map(
            document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 14
            })
            
            gMap.addListener("click", (mapsMouseEvent) => {
                const locationName = 'need to make modal!!!'
                const location = {
                    lat: JSON.parse((JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2))).lat,
                    lng: JSON.parse((JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2))).lng,
                    placeName: locationName,
                }
                locService.addTogLocations(location)
                // addMarker({lat:location.lat,lng:location.lng}, location.placeName)
                appController.onGetLocs()
            });
            // renderMarkers()
            console.log(`gMap = `, gMap)
        })
}

function updateMap(){

}

function addMarker(loc, title) {
    console.log(`foo = `, loc)
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: title || 'Hello World!'
    })
    return marker
}
var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
   map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('pac-input'));
   google.maps.event.addListener(searchBox, 'places_changed', function() {
     searchBox.set('map', null);


     var places = searchBox.getPlaces();

     var bounds = new google.maps.LatLngBounds();
     var i, place;
     for (i = 0; place = places[i]; i++) {
       (function(place) {
         var marker = new google.maps.Marker({

           position: place.geometry.location
         });
         marker.bindTo('map', searchBox, 'map');
         google.maps.event.addListener(marker, 'map_changed', function() {
           if (!this.getMap()) {
             this.unbindAll();
           }
         });
         bounds.extend(place.geometry.location);


       }(place));

     }
     map.fitBounds(bounds);
     searchBox.set('map', map);
     map.setZoom(Math.min(map.getZoom(),12));

   });
 }
 google.maps.event.addDomListener(window, 'load', init);
// function removeMarkers(){
//     appController.getPosition()
//     .then(pos => {
//         gMap = new google.maps.Map(
//             document.querySelector('#map'), {
//                 center: {lat: pos.coords.latitude, lng:pos.coords.longitude },
//                 zoom: 14
//             })

//     })
// }

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function renderMarkers(locs) {
            console.log(`locs = `, locs)
            locs.map(location => location = new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: gMap,
                title: location.placeName

            })
            )
            console.log(`locs = `, locs)
        
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${api.GOOGLE_API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}