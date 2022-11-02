
import { storageService } from './storage.service.js'

export const locService = {
    getLocs,
    addTogLocations
}
const STORAGE_KEY = 'locsStorage'
var gLocations = storageService.load(STORAGE_KEY)||[
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        // gLocations = storageService.load(STORAGE_KEY)
        // if (!gLocations) gLocations = [
        //     { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
        //     { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
        // ]

        setTimeout(() => {
            resolve(gLocations)
        }, 2000)
    })
}

function addTogLocations(location){
    console.log(`gLocations = `, gLocations)
    gLocations.push(location)
    storageService.save(STORAGE_KEY, gLocations)
}


