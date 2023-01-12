import { api } from '../../secret.js'
import { storageService } from './storage.service.js'
import { locService } from './loc.service.js'
import { appController } from '../app.controller.js'
export const mapService = {
    initMap,
    addMarker,
    panTo,
    renderMarkers,
    addLocationNameBool,
    openModal,
    addLocation
}
const STORAGE_KEY = 'locsStorage'
// Var that is used throughout this Module (not global)
var gMap
let gLocationLat
let gLocationLng
// var locationNameBool=false
// var locationName=''
//   `https://maps.googleapis.com/maps/api/geocode/json?place_id=ChIJeRpOeF67j4AR9ydy_PIzPuM&key=${api.GOOGLE_API_KEY}`
// `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&components=country:GB&key=${api.GOOGLE_API_KEY}`
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
                console.log(`mapsMouseEvent = `, mapsMouseEvent)
                //    var elModal= document.querySelector('.modal')
                //    elModal.style.display= 'block';
                //    elModal.style.left=mapsMouseEvent.clientX+'px'
                //    elModal.style.top=mapsMouseEvent.clientY+'px'
                // const elAddMarker = document.querySelector('.add-marker-input')
                // let locationName = elAddMarker.value
                // elAddMarker.value=''
                //    while(!locationNameBool){

                //    }
                //    elModal.style.display= 'none';
                //    locationNameBool=false

                // const location = {
                //     lat: JSON.parse((JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2))).lat,
                //     lng: JSON.parse((JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2))).lng,
                //     placeName: locationName,
                // }
                gLocationLat = JSON.parse((JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2))).lat
                gLocationLng = JSON.parse((JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2))).lng
                openModal( mapsMouseEvent.domEvent.pageX,mapsMouseEvent.domEvent.pageY)
                // locationName=''
                // locService.addTogLocations(location)
                // addMarker({lat:location.lat,lng:location.lng}, location.placeName)
                // appController.onGetLocs()
            });
            // renderMarkers()
            console.log(`gMap = `, gMap)
        })
}
function openModal(pageX,pageY) {
    console.log(`pageX = `, pageX)
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block';
    elModal.style.left =(pageX -160)+ 'px'
    elModal.style.top = (pageY-60)+'px'
}
function addLocation(locationName) {
    const location = {
        lat: gLocationLat,
        lng: gLocationLng,
        placeName: locationName,
    }
    locService.addTogLocations(location)
    gMap.center={ gLocationLat, gLocationLng }
    appController.onGetLocs()
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
function addLocationNameBool(locationTitle) {
    locationNameBool = true
    locationName = locationTitle
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