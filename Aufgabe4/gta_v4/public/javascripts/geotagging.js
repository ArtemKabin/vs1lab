// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console.
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");


const tagForm = document.getElementById("tag-form");
const discoveryFilterForm = document.getElementById("discoveryFilterForm");
var mapManager = new MapManager();

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
 
   
    var taglist_json = document.getElementById('map').getAttribute('data-tags');
    let taglist;
    if(taglist_json){
        taglist = JSON.parse(taglist_json);      
    }
        LocationHelper.findLocation((location) => {
            var mapContainer = document.getElementById('map');
            mapContainer.replaceChildren();
            mapManager = new MapManager();
            mapManager.initMap(location.latitude, location.longitude);
            mapManager.updateMarkers(location.latitude, location.longitude,taglist);

            document.getElementById('latitude').value = location.latitude;
            document.getElementById('longitude').value = location.longitude;
            document.getElementById('latitudediscsearch').value = location.latitude;
            document.getElementById('longitudediscsearch').value = location.longitude;
        });
}

//Event Listeners for the submit forms
tagForm.addEventListener('submit', function(event){
    event.preventDefault(); // Prevent the default form submission

    //Get formula data
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const name = document.getElementById('name').value;
    const hashtag = document.getElementById('hashtag').value;


    //Create a new tag
    const tag = {
        latitude: latitude, 
        longitude: longitude,
        name: name,
        hashtag: hashtag
    }

    //Send the tag to the server
    fetch('/api/geotags', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(tag)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        //Adding the new tag to the map
        var taglist_json = document.getElementById('map').getAttribute('data-tags');
        let taglist;
        taglist = JSON.parse(taglist_json);
        taglist.push(data);
        document.getElementById('map').setAttribute('data-tags', JSON.stringify(taglist));
        mapManager.updateMarkers(latitude, longitude, taglist);

        //Adding the new tag to the discovery results
        var discoveryResults = document.getElementById('discoveryResults');
        var tag = document.createElement('li');
        tag.textContent = `ID: ${data.id} , 
        ${data.name} (${data.location.latitude}, 
        ${data.location.longitude}) ${data.hashtag}`;
        discoveryResults.appendChild(tag);

        // Update pagination items
        var existingPagesInfo = document.getElementById('pages-info');
        var pagesInfo = existingPagesInfo.getAttribute('data-pagesinfo');

        var pagesInfoJSON = pagesInfo.split(',');

        var index2 = parseInt(pagesInfoJSON[2]);
        index2++;
        
        pagesInfoJSON[2] = index2.toString();
        var index1 = parseInt(pagesInfoJSON[2]);
        index1 = (Math. ceil(index2 / 5));
        pagesInfoJSON[1] = index1.toString();

        var newPagesInfo = document.createElement('h3');
        newPagesInfo.id = 'pages-info';
        newPagesInfo.setAttribute('data-pagesinfo', pagesInfoJSON.join(','));
        newPagesInfo.textContent = pagesInfoJSON[0] + "/" + pagesInfoJSON[1] + "(" + index2+")";
        existingPagesInfo.remove();

        var pages = document.getElementById('pagesCounter');
        pages.insertBefore(newPagesInfo, pages.childNodes[2]);
    }
    )
    .catch((error) => {
        console.error('Error:', error);
    });
});



discoveryFilterForm.addEventListener('submit', function(event){
    event.preventDefault(); // Prevent the default form submission

    //Get formula data
    const latitude = document.getElementById('latitudediscsearch').value;
    const longitude = document.getElementById('longitudediscsearch').value;
    const searchterm = document.getElementById('searchterm').value;

    let params = new URLSearchParams({
    searchterm: searchterm,
    longitude: longitude,
    latitude: latitude
    });

    fetch(`/api/geotags?${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        //Update the map with the search results
        mapManager.updateMarkers(latitude, longitude, data);

        //Update the discovery results
        var discoveryResults = document.getElementById('discoveryResults');
        discoveryResults.replaceChildren();
        for (const tag of data) {
            var tagElement = document.createElement('li');
            tagElement.textContent = `ID: ${tag.id} , 
            ${tag.name} (${tag.location.latitude}, 
            ${tag.location.longitude}) ${tag.hashtag}`;
            discoveryResults.appendChild(tagElement);
        }

       
    })
    .catch((error) => {
        console.error('Error:', error);
    });


});

const pageBeforeButton = document.getElementById("page-before");
pageBeforeButton.addEventListener("click", function(event) {
    event.preventDefault();
    const pagesInfo = document.getElementById("pages-info");
    const pagesInfoData = pagesInfo.getAttribute("data-pagesinfo");
    const pagesInfoArray = pagesInfoData.split(",");
    let currentPage = parseInt(pagesInfoArray[0]);
    if (currentPage > 1) {
        currentPage--;
        const latitude = document.getElementById('latitudediscsearch').value;
        const longitude = document.getElementById('longitudediscsearch').value;
        const searchterm = document.getElementById('searchterm').value;
        let params;
        if(searchterm){
         params = new URLSearchParams({
            id: currentPage,
            searchterm: searchterm,
            latitude: latitude,w
            longitude: longitude
            });
        }else{
     params = new URLSearchParams({
        id: currentPage,
        latitude: latitude,
        longitude: longitude
        });
    }
        fetch(`/api/geotags/pages?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(data => {
            console.log('MAGIC Happend:', data);
            //Update the map with the search results
            mapManager.updateMarkers(latitude, longitude, data);
    
            //Update the discovery results
            var discoveryResults = document.getElementById('discoveryResults');
            discoveryResults.replaceChildren();
            for (const tag of data) {
                var tagElement = document.createElement('li');
                tagElement.textContent = `ID: ${tag.id} , 
                ${tag.name} (${tag.location.latitude}, 
                ${tag.location.longitude}) ${tag.hashtag}`;
                discoveryResults.appendChild(tagElement);
            }
    
           
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        pagesInfoArray[0] = currentPage.toString();
        pagesInfo.textContent = pagesInfoArray[0] +" / "+ pagesInfoArray[1] +"("+pagesInfoArray[2]+ ")";
        pagesInfo.setAttribute("data-pagesinfo", pagesInfoArray.join(","));
        
    }
});

const pageNextButton = document.getElementById("page-next");
pageNextButton.addEventListener("click", function(event) {
    event.preventDefault();
    const pagesInfo = document.getElementById("pages-info");
    const pagesInfoData = pagesInfo.getAttribute("data-pagesinfo");
    const pagesInfoArray = pagesInfoData.split(",");
    let currentPage = parseInt(pagesInfoArray[0]);
    const totalPages = parseInt(pagesInfoArray[1]);
    if (currentPage < totalPages) {
        currentPage++;
        pagesInfoArray[0] = currentPage.toString();
        pagesInfo.textContent = pagesInfoArray[0] +" / "+ pagesInfoArray[1] +"("+pagesInfoArray[2]+ ")";
        pagesInfo.setAttribute("data-pagesinfo", pagesInfoArray.join(","));
    }
});

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});

