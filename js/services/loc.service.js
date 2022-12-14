
import { storageService } from './storage.service.js'

export const locService = {
    getLocs,
    addTogLocations,
     removeMarker,
    updateQueryStringParams,
}
const STORAGE_KEY = 'locsStorage'
var gLocations =storageService.load(STORAGE_KEY)||[
    { placeName: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { placeName: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    console.log('gLocations',gLocations)
    return Promise.resolve(gLocations)
}

function removeMarker(placeName){
    gLocations.splice(gLocations.findIndex(location=>location.placeName===placeName),1)
    storageService.save(STORAGE_KEY, gLocations)
}

function addTogLocations(location){
    console.log(`gLocations = `, gLocations)
    gLocations.push(location)
    storageService.save(STORAGE_KEY, gLocations)
}

function updateQueryStringParams(lat,lng){
    const queryStringParams = `?lat=${lat}&lng=${lng}`
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
        window.history.pushState({ path: newUrl }, '', newUrl)
}




