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
     * @param {Location} location of the geotag (latitude, longitude
     * @param {string} name The name of the geotag
     * @param {string} hashtag The hashtag of the geotag
     */
    constructor(location, name, hashtag) {
        // location = new LocationHelper(latitude, longitude);
        this.location = location;
        this.name = name;
        this.hashtag = hashtag;
    }


}

module.exports = GeoTag;
