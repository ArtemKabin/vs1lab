// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore.
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');
var geoTagInstance = new GeoTag();

/**
 * The module "geotag-store" exports a class GeoTagStore.
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
var geoTagStoreInstance = new GeoTagStore();

const Location = require('../models/location');
const InMemoryGeoTagStore = require('../models/geotag-store');

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: geoTagStoreInstance.getTags, searchTerm: ""});
});


/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags
 * by radius around a given location.
 */


router.post('/tagging', (req, res) => {
  const {  latitude, longitude ,name, hashtag} = req.body;
  geoTagStoreInstance.createGeoTagWithParams(latitude, longitude,name,hashtag);
  res.render('index', { taglist: geoTagStoreInstance.getTags ,searchTerm: ""});
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain
 * the term as a part of their names or hashtags.
 * To this end, "GeoTagStore" provides methods to search geotags
 * by radius and keyword.
 */


router.post('/discovery', (req, res) => {
  const { latitude, longitude, searchterm } = req.body;
  let results = geoTagStoreInstance.getNearbyGeoTags(latitude, longitude,40);

  if(searchterm){
    results = geoTagStoreInstance.searchNearbyGeoTags(latitude, longitude, 10, searchterm);
  }

  res.render('index', { taglist: results, searchTerm: searchterm});
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags', (req, res) => {
  const { searchterm, latitude, longitude } = req.query;
  console.log(req.query);
  console.log(searchterm, latitude, longitude);
  let results;

  if (searchterm) {
    results = geoTagStoreInstance.searchNearbyGeoTags(latitude, longitude,50,searchterm);
  } else {
    results = geoTagStoreInstance.getNearbyGeoTags(latitude, longitude, 50);
  }

  //console.log(results);
  res.status(201).json(results);
});
/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */
router.post('/api/geotags', (req, res) => {
  const { latitude,longitude,name,hashtag } = req.body;
  // Create a new geotag using the provided data
  const newGeoTag = geoTagStoreInstance.createGeoTagWithParams(latitude,longitude,name,hashtag);
  // Set the location header with the URL of the new resource
  res.location('/api/geotags/${newGeoTag.id}');

  // Render the new resource as JSON in the response
  res.status(201).json(newGeoTag);
});





/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */
router.get('/api/geotags/:id', (req, res) => {
  const { id } = req.params;

  // Find the tag with the corresponding ID
  const tag = geoTagStoreInstance.getGeoTagById(id);

  // If the tag is found, render it as JSON in the response
  if (tag) {
    res.status(201).json(tag);
  } else {
    res.status(404).json({ error: 'Tag not found' });
  }
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response.
 */
router.put('/api/geotags/:id', (req, res) => {
  const { id } = req.params;
  const { name, latitude, longitude, hashtag } = req.body;

  // Find the tag with the corresponding ID
  const tag = geoTagStoreInstance.updateGeoTag(id,latitude,longitude,name,hashtag);

  // If the tag is found, update its values
  if (tag) {
    // Render the updated tag as JSON in the response
    res.status(201).json(tag);
  } else {
    // If the tag is not found, return a 404 status code
    res.status(404).json({ error: 'Tag not found' });
  }
});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */
router.delete('/api/geotags/:id', (req, res) => {
  const { id } = req.params;
  const deletedTag = geoTagStoreInstance.removeGeoTagById(id);
  res.status(201).json(deletedTag);
});


module.exports = router;
