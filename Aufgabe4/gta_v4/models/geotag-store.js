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
class InMemoryGeoTagStore {

    #geotags = [];
    #geotagExamples = GeoTagExamples.tagList;
    #idCounter = 0;

    constructor() {
        this.fillGeoTagsWithExamples();
    }

    get getTags() { return this.#geotags; }

    fillGeoTagsWithExamples() {
        for (const tag of this.#geotagExamples) {
            this.createGeoTagWithParams(tag[1], tag[2],tag[0], tag[3]);
        }
    }


    /**
     * Create a new geotag with latitude, longitude, name, and hashtag parameters and add it to the store.
     * @param {number} latitude - The latitude of the geotag location.
     * @param {number} longitude - The longitude of the geotag location.
     * @param {string} name - The name of the geotag.
     * @param {string} hashtag - The hashtag of the geotag.
     * @returns {void}
     */
    createGeoTagWithParams(latitude, longitude, name, hashtag) {
        var location = new Location(latitude, longitude);
        const geotag = new GeoTag(this.#idCounter,location, name, hashtag);
        console.log(geotag);
        this.#idCounter++;
        this.#geotags.push(geotag);
        return geotag;
    }


    /**
     * Remove geotags from the store by id.
     * @param {number} id The id of the geotag to remove
     * @returns {GeoTag|null} The removed geotag, or null if not found
     */
    removeGeoTagById(id) {
        const tagToDelete = this.getGeoTagById(id);
        console.log(tagToDelete);
        if (tagToDelete !== null)
            this.#geotags = this.#geotags.filter(geotag => geotag.id.toString() !== id.toString());
        return tagToDelete || null;
    }

    /**
     * Checks if the distance between a geotag and a given latitude and longitude falls within a specified radius.
     * @param {Object} geotag - The geotag object containing location information.
     * @param {number} latitude - The latitude of the reference point.
     * @param {number} longitude - The longitude of the reference point.
     * @param {number} radiusInKm - The radius in kilometers.
     * @returns {boolean} - Returns true if the distance is within the specified radius, otherwise false.
     */
    isValidDistance(geotag, latitude, longitude, radiusInKm) {
        // Approximate conversion: 1 degree = 111.12 km
        const radiusInDegrees = radiusInKm / 111.12;
        const latDiff = geotag.location.latitude - latitude;
        const lngDiff = geotag.location.longitude - longitude;
        const distanceInDegrees = Math.sqrt(latDiff ** 2 + lngDiff ** 2);
        return distanceInDegrees <= radiusInDegrees;
    }

    /**
     * Get a geotag from the store by id.
     * @param {number} id The id of the geotag
     * @returns {GeoTag|null} The geotag with the specified id, or null if not found
     */
    getGeoTagById(id) {
        return this.#geotags.find(geotag => 
            geotag.id.toString() === id.toString());   
    }

    /**
     * Update a geotag in the store by id.
     * @param {number} id The id of the geotag to update
     * @param {number} latitude The new latitude of the geotag location
     * @param {number} longitude The new longitude of the geotag location
     * @param {string} name The new name of the geotag
     * @param {string} hashtag The new hashtag of the geotag
     * @returns {GeoTag|null} Returns the updated geotag if it was updated successfully, otherwise null
     */
    updateGeoTag(id, latitude, longitude, name, hashtag) {
        const geotagToUpdate = this.getGeoTagById(id);
        if (geotagToUpdate) {
            geotagToUpdate.location.latitude = latitude;
            geotagToUpdate.location.longitude = longitude;
            geotagToUpdate.name = name;
            geotagToUpdate.hashtag = hashtag;
            return geotagToUpdate;
        }
        return null;
    }


    /**
     * Returns all geotags that are within a given radius from a given latitude and longitude.
     * @param {number} latitude The latitude of the location
     * @param {number} longitude The longitude of the location
     * @param {number} radiusInKm The radius in kilometers
     * @returns {GeoTag[]} The geotags within the given radius
     */
    getNearbyGeoTags(latitude, longitude, radiusInKm) {
        return this.#geotags.filter(geotag => this.isValidDistance(geotag, latitude, longitude, radiusInKm));
    }



    /**
     * Search geotags in the proximity of a location that match a keyword.
     * if radius is greater than 0, search within the radius, otherwise search all geotags
     * @param {number} latitude The latitude of the location
     * @param {number} longitude The longitude of the location
     * @param {number} radius The radius of the proximity
     * @param {string} keyword The keyword to match
     * @returns {GeoTag[]} The geotags in the proximity that match the keyword
     */
    searchNearbyGeoTags(latitude, longitude, radius, keyword) {

        var geotagstoSearchFrom = this.#geotags;
        const matchesKeyword = (geotag) => geotag.name.includes(keyword) || geotag.hashtag.includes(keyword);
        if (radius > 0) {
            // search within radius
            geotagstoSearchFrom = this.getNearbyGeoTags(latitude, longitude, radius);
        }
        return geotagstoSearchFrom.filter(geotag => matchesKeyword(geotag));
    }



}

module.exports = InMemoryGeoTagStore
