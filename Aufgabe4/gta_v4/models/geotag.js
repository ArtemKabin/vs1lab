// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

// const LocationHelper = require('./../public/javascripts/location-helper');
const Location = require('./location');
// var location;
/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
    /**
    /**
     * Create a new GeoTag object.
     * @param {number} id The ID of the geotag
     * @param {Location} location of the geotag (latitude, longitude
     * @param {string} name The name of the geotag
     * @param {string} hashtag The hashtag of the geotag
     */
    constructor(id, location, name, hashtag) {
        this.id = id;
        this.location = location;
        this.name = name;
        this.hashtag = hashtag;
    }


}

module.exports = GeoTag;
