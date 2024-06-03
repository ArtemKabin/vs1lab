// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
    /**
     * Create a new GeoTag object.
     * @param {number} latitude The latitude of the geotag
     * @param {number} longitude The longitude of the geotag
     * @param {string} name The name of the geotag
     * @param {string} hashtag The hashtag of the geotag
     */
    constructor(latitude, longitude, name, hashtag) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.hashtag = hashtag;
    }
}

module.exports = GeoTag;
