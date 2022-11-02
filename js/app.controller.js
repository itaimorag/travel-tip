import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

export const appController = {
    onGetLocs,
    getPosition,
}


window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
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

    function onAddMarker() {
        console.log('Adding a marker')
        mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
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