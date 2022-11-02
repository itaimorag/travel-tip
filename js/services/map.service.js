import { api } from '../../secret.js'
import { storageService } from './storage.service.js'
import { locService } from './loc.service.js'
export const mapService = {
    initMap,
    addMarker,
    panTo,

}

const STORAGE_KEY = 'locsStorage'
// Var that is used throughout this Module (not global)
var gMap

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
            });
            renderMarkers()
        })
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



function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function renderMarkers() {
    locService.getLocs()
        .then(locs => {
            console.log(`locs = `, locs)
            locs.map(location => location = new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: gMap,
                title: location.placeName
            })
            )
        })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()

    var elGoogleApi = document.createElement('script')
    console.log(api.GOOGLE_API_KEY)
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${api.GOOGLE_API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}