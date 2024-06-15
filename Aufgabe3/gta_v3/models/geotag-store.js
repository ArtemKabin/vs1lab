// File origin: VS1LAB A3



/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

const GeoTagExamples = require('./geotag-examples');
const GeoTag = require('../models/geotag');
const Location = require('../models/location');
/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{
   
    #geotags = [];
    #geotagExamples = GeoTagExamples.tagList;

    constructor(){
        this.fillGeoTagsWithExamples();  
    }

    get getTags(){return this.#geotags;}

    isValidDistance(latitude, longitude,radius){
        return (geotag) => Math.sqrt((geotag.location.latitude - latitude)**2 + (geotag.location.longitude - longitude)**2) <= radius;
    }
  
    fillGeoTagsWithExamples(){
        for (const tag of this.#geotagExamples){
            this.addGeoTag(new GeoTag(new Location(tag[1], tag[2]), tag[0], tag[3]));
        }
    }
    /**
     * Add a geotag to the store.
     * @param {GeoTag} geotag The geotag to add
     */
    addGeoTag(geotag){
        this.#geotags.push(geotag);
    }

    /**
     * Remove geotags from the store by name.
     * @param {string} name The name of the geotag to remove
     */
    removeGeoTag(name){
        this.#geotags = this.#geotags.filter(geotag => geotag.name !== name);
    }

    /**
     * Get all geotags in the proximity of a location.
     * @param {number} latitude The latitude of the location
     * @param {number} longitude The longitude of the location
     * @param {number} radius The radius of the proximity
     * @returns {GeoTag[]} The geotags in the proximity
     */
    getNearbyGeoTags(latitude, longitude, radius){
        // const isValidDistance = (geotag) => Math.sqrt((geotag.location.latitude - latitude)**2 + (geotag.location.longitude - longitude)**2) <= radius;
        const isValid = this.isValidDistance(latitude, longitude,radius);

        return  this.#geotags.filter(
            geotag => isValid(geotag)
        );
        // return nearByGeoTags;
    }

    /**
     * Search geotags in the proximity of a location that match a keyword.
     * @param {number} latitude The latitude of the location
     * @param {number} longitude The longitude of the location
     * @param {number} radius The radius of the proximity
     * @param {string} keyword The keyword to match
     * @returns {GeoTag[]} The geotags in the proximity that match the keyword
     */
    searchNearbyGeoTags(latitude, longitude, radius, keyword){
        // const isValidDistance = (geotag) => Math.sqrt((geotag.latitude - latitude)**2 + (geotag.longitude - longitude)**2) <= radius;
        const isValid = this.isValidDistance(latitude, longitude,radius);

        const matchesKeyword = (geotag) => geotag.name.includes(keyword) || geotag.hashtag.includes(keyword);

        return this.getNearbyGeoTags(latitude, longitude, radius).filter(
            geotag => isValid(geotag) && matchesKeyword(geotag)
        )
        
    } 
    
    
//     let center = {lat: 41.536558, lng: -8.627487};
// let radius = 25

// checkIfInside(spotCoordinates1);
// checkIfInside(spotCoordinates2);

// function checkIfInside(spotCoordinates) {

//     let newRadius = distanceInKmBetweenEarthCoordinates(spotCoordinates[0], spotCoordinates[1], center.lat, center.lng);
//     console.log(newRadius)

//     if( newRadius < radius ) {
//         //point is inside the circle
//         console.log('inside')
//     }
//     else if(newRadius > radius) {
//         //point is outside the circle
//         console.log('outside')
//     }
//     else {
//         //point is on the circle
//         console.log('on the circle')
//     }

// }

// function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
//   var earthRadiusKm = 6371;

//   var dLat = degreesToRadians(lat2-lat1);
//   var dLon = degreesToRadians(lon2-lon1);

//   lat1 = degreesToRadians(lat1);
//   lat2 = degreesToRadians(lat2);

//   var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//           Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//   return earthRadiusKm * c;
// }

// function degreesToRadians(degrees) {
//   return degrees * Math.PI / 180;
// }
    

}

module.exports = InMemoryGeoTagStore
