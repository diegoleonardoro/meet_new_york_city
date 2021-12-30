
function autocomplete(inp, arr) {

    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();

        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("SPAN");

        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        this.parentNode.appendChild(a);

        if (val.length > 2) {

            for (i = 0; i < arr.length; i++) {

                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {

                    b = document.createElement("SPAN");
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";

                    b.addEventListener("click", function (e) {
                        inp.value = this.getElementsByTagName("input")[0].value;

                        closeAllLists();

                        if (inp.className.indexOf('search-bar-input') > -1) {

                            var chosenNeighborhood = inp.value;

                            var height = 500,
                                width = 600,
                                projection = d3.geoMercator(),
                                nyc = void 0,
                                map

                            var path = d3.geoPath().projection(projection);


                            const readNeighborhoodCoords = new Promise((resolve, reject) => {
                                d3.csv('NHoodNameCentroids.csv', function (data) {
                                    for (var i = 0; i < data.length; i++) {

                                        var neighborhoodFromData = data[i]['Name'];

                                        if (chosenNeighborhood === neighborhoodFromData) {
                                            resolve(data[i]);
                                        }
                                    }
                                })
                            })


                            readNeighborhoodCoords.then(value => {


                                let coordinates = value['the_geom'];
                                let neighborhood = value['Name'];
                                coordinates = coordinates.match(/[+-]?\d+(\.\d+)?/g);

                                let latitude = parseFloat(coordinates[0]);
                                let longitude = parseFloat(coordinates[1]);

                                latitude = latitude.toFixed(4);
                                longitude = longitude.toFixed(4);


                                d3.json('geo-data.json', function (error, data) {

                                    if (error) return;

                                    //-----------Selecting the geometry features from the json OBJ------------------//
                                    var districts = topojson.feature(data, data.objects.districts);
                                    var b, s, t;
                                    projection.scale(1).translate([0, 0]);
                                    var b = path.bounds(districts); // bounds represent a two dimensional array : [[left, bottom], [right, top]],
                                    var s = .85 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
                                    var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
                                    projection.scale(s).translate(t);

                                    let divLeftStyle = projection([latitude, longitude])[0];
                                    let divTopStyle = projection([latitude, longitude])[1];

                                    let map_ = document.getElementsByClassName('boundary')[0];
                                    let neighborhoodDescription = document.getElementById('neighborhoodDescription');



                                    //remove previous circles 
                                    if (map_.children.length > 71) {
                                        let circle = map_.children[map_.children.length - 1];
                                        map_.removeChild(circle);
                                        //let paragraph1 = neighborhoodDescription.children[neighborhoodDescription.children.length - 1];
                                        // neighborhoodDescription.removeChild(paragraph1);
                                    };
                                    // end of remove previous circles




                                    // remove previous neighborhood descriptions:
                                    while (neighborhoodDescription.firstChild) {
                                        neighborhoodDescription.removeChild(neighborhoodDescription.firstChild);
                                    }
                                    // end of remove previous neighborhood descriptions:




                                    // append the neighborhood circle to the map
                                    let circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                                    circle.setAttribute("cx", divLeftStyle);
                                    circle.setAttribute("cy", divTopStyle);
                                    circle.setAttribute("r", '10');
                                    circle.setAttribute("fill", '#ffe577');
                                    circle.setAttribute("class", 'selectedNeighborhood');
                                    map_.appendChild(circle);
                                    // end of append the neighborhood circle to the map



                                    // re position the map and place description containers
                                    neighborhoodDescription.style.display = 'inline';
                                    // end of re position the map and place description containers





                                    // align the view with the neighborhood description container
                                    //var neighborhoodDescription = document.getElementById('neighborhoodDescription');
                                    var neighborhoodDescriptiontBoundingBox = neighborhoodDescription.getBoundingClientRect();
                                    window.scrollTo({ top: neighborhoodDescriptiontBoundingBox.bottom - 740, behavior: 'smooth' });
                                    // end of align the view with the neighborhood description container





                                    // insert the neighborhood name into the place description container
                                    neighborhoodDescription.style.border = "0.01rem solid";
                                    var p1 = document.createElement('p')
                                    p1.innerHTML = neighborhood;
                                    p1.style.marginLeft = '5%';
                                    p1.setAttribute('class', 'neighborhoodHeaderMain');
                                    neighborhoodDescription.appendChild(p1);
                                    // end of insert the neighborhood name into the place description container



                                    // Get neighborhood description data  and insert it to the place description container
                                    const getNhoodDescrption = new Promise((resolve, reject) => {
                                        d3.json('nhoodCoords.json', function (error, data) {
                                            for (var i = 0; i < data.length; i++) {
                                                if (data[i]['Name'] === neighborhood) {
                                                    var p2 = document.createElement('p')
                                                    p2.innerHTML = data[i]['Description'];
                                                    p2.style.marginLeft = '5%';
                                                    p2.setAttribute('class', 'neighborhoodHeader');
                                                    neighborhoodDescription.appendChild(p2);
                                                    resolve('continue')
                                                }
                                            }
                                        })
                                    })
                                    getNhoodDescrption.then(value => {
                                        var p3 = document.createElement('p')
                                        p3.innerHTML = 'Here is who can show you this neighborhood around: '; //;
                                        p3.style.marginLeft = '5%';
                                        p3.setAttribute('class', 'neighborhoodHeader');
                                        neighborhoodDescription.appendChild(p3);

                                    });
                                    // end of Get neighborhood description data  and insert it to the place description container





                                    // make an http request that gets data of who can show the selected neighborhood 
                                    const xhr = new XMLHttpRequest();
                                    let neighborhoodUsers
                                    let getResponseData = new Promise((resolve, reject) => {
                                        xhr.onload = () => {
                                            setTimeout(() => {
                                                neighborhoodUsers = xhr.response;
                                                resolve('Got server response')
                                            }, 100);
                                        }
                                    });

                                    xhr.open('GET', `/users/neighborhood/${neighborhood}`);
                                    xhr.send();
                                    // end of make an http request that gets data of who can show the selected neighborhood 




                                    // use the data from the previous http request and insert it into the place description container

                                    getResponseData.then(resValue => {

                                        neighborhoodUsers = JSON.parse(neighborhoodUsers);
                                        let whoCanShowArray = [];
                                        let whoCanShow = '';

                                        console.log(2)

                                        let userName = neighborhoodUsers['data']['name'];
                                        let lengthLivingInNeighborhood = neighborhoodUsers['data']['lengthLivingInNeighborhood'];
                                        let favAspectsOfNeighborhood = neighborhoodUsers['data']['favAspectsOfNeighborhood'];
                                        let favoritePlaces = neighborhoodUsers['data']['favoritePlaces'];

                                        let slug = neighborhoodUsers['data']['slug'];

                                        let numofPlaces = neighborhoodUsers['data']['numofPlaces'][0];
                                        let imagesFormated = neighborhoodUsers['data']['imagesFormated'];




                                        whoCanShow =
                                            `<div class='whoCanShow'>
                                                <p class='whoCanShowItem'> <b>Name:</b> ${userName} </p>
                                                <p class='whoCanShowItem'> <b>Description:</b> I have lived in this neighborhood for ${lengthLivingInNeighborhood}. ${favAspectsOfNeighborhood}</p>
                                                <p class='whoCanShowItem'> This is one of my favorite places in this neighborhood: </p>
                                                `
                                        // for (var u = 0; u < favoritePlaces.length; u++) {///

                                        let place = favoritePlaces[0]['place'];
                                        let placDescription = favoritePlaces[0]['description'];



                                        whoCanShow = whoCanShow +
                                            `<div class='divOfFavPlace'>
                                                        <p class='whoCanShowItem'><b>Place: </b>${place} </p>
                                                        <p class='whoCanShowItem'> ${placDescription}</p>
                                                        <p class ='whoCanShowItem'><b>Images of place:</b></p>
                                                        <div>`
                                        for (var v = 0; v < numofPlaces; v++) {
                                            whoCanShow = whoCanShow +
                                                `<img class='whoCanShowItem placeImage'  src=data:image/png;base64,${imagesFormated[v]}>`
                                        }
                                        whoCanShow = whoCanShow +
                                            `
                                                    </div>
                                                <div>
                                            </div>
                                            <button type='submit' id ='visitUserProfile'><a id ='linkToUserProfile' href=''></a> Visit ${userName}'s profile </button>`

                                        //}///


                                        whoCanShowArray.push(whoCanShow);


                                        setTimeout(() => {
                                            const profileButton = document.getElementById('visitUserProfile');
                                            profileButton.addEventListener('click', () => {

                                                var profileButton = document.getElementById('linkToUserProfile');
                                                profileButton.href = `/users/user-profile/${slug}`;
                                                profileButton.click()

                                            })
                                        }, 100);



                                        neighborhoodDescription.innerHTML = neighborhoodDescription.innerHTML + whoCanShowArray[0];

                                        function resizePhotoOfPlace() {
                                            var placeImages = document.getElementsByClassName('placeImage');
                                            let maxWidth = 100;
                                            let maxHeight = 100;

                                            for (var i = 0; i < placeImages.length; i++) {
                                                let srcWidth = placeImages[i].width;
                                                let srcHeight = placeImages[i].height;

                                                let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
                                                let newWidth = srcWidth * ratio;
                                                let newHeight = srcHeight * ratio;

                                                placeImages[i].style.widht = newWidth + 'px';
                                                placeImages[i].style.height = newHeight + 'px';
                                                placeImages[i].style.display = 'inline';
                                            }
                                        };

                                        setTimeout(() => {
                                            resizePhotoOfPlace()
                                        }, 100);

                                    });






                                    // end of use the data from the previous http request and insert it into the place description container








                                })
                            })

                        } else {


                            var map = document.getElementById('MapSVG_');

                            if (map.children.length > 1) {
                                map.removeChild(map.lastChild);
                            }

                            d3.json("nhoodCoords.json", function (neighborhoodsData) {
                                for (var r = 0; r < neighborhoodsData.length; r++) {
                                    if (inp.value === neighborhoodsData[r]['Name']) {

                                        var lat = neighborhoodsData[r]['the_geom'][1];
                                        var lon = neighborhoodsData[r]['the_geom'][0];
                                        d3.json('geo-data.json', function (error, data) {

                                            var districts = topojson.feature(data, data.objects.districts);

                                            var height = 500;
                                            var width = 500;
                                            var projection = d3.geoMercator();
                                            var path = d3.geoPath().projection(projection);

                                            var b, s, t;
                                            projection.scale(1).translate([0, 0]);
                                            var b = path.bounds(districts); // bounds represent a two dimensional array : [[left, bottom], [right, top]],
                                            var s = .85 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
                                            var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
                                            projection.scale(s).translate(t);

                                            // LAT AND LNG OF THE NEIGHBORHOOD:
                                            //var neighborhoodCoordinates = response['items'][0]['position'];

                                            var divLeftStyle = projection([lon, lat])[0];
                                            var divTopStyle = projection([lon, lat])[1];

                                            var map = d3.select("#MapSVG_")
                                                .append("circle")
                                                .attr("cx", divLeftStyle)
                                                .attr("cy", divTopStyle)
                                                .attr("id", "placeCircle")
                                                .attr("r", 6)
                                                .attr("fill", "blue")
                                                .attr("id", "placeCircle");
                                        })
                                    }
                                }
                            })


                        }









                    });
                    a.appendChild(b);
                }
            }
        }
    });

    inp.addEventListener("keydown", function (e) {

        var x = document.getElementById(this.id + "autocomplete-list");

        if (x) x = x.getElementsByTagName("span");

        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

}






var neighborhoods = [
    "Wakefield",
    "Co-op City",
    "Eastchester",
    "Fieldston",
    "Riverdale",
    "Kingsbridge",
    "Marble Hill",
    "Woodlawn",
    "Norwood",
    "Williamsbridge",
    "Baychester",
    "Pelham Parkway",
    "City Island",
    "Bedford Park",
    "University Heights",
    "Morris Heights",
    "Fordham",
    "East Tremont",
    "West Farms",
    "High  Bridge",
    "Melrose",
    "Mott Haven",
    "Port Morris",
    "Longwood",
    "Hunts Point",
    "Morrisania",
    "Soundview",
    "Clason Point",
    "Throgs Neck",
    "Country Club",
    "Parkchester",
    "Westchester Square",
    "Van Nest",
    "Morris Park",
    "Belmont",
    "Spuyten Duyvil",
    "North Riverdale",
    "Pelham Bay",
    "Schuylerville",
    "Edgewater Park",
    "Castle Hill",
    "Olinville",
    "Pelham Gardens",
    "Concourse",
    "Unionport",
    "Edenwald",
    "Bay Ridge",
    "Bensonhurst",
    "Sunset Park",
    "Greenpoint",
    "Gravesend",
    "Brighton Beach",
    "Sheepshead Bay",
    "Manhattan Terrace",
    "Flatbush",
    "Crown Heights",
    "East Flatbush",
    "Kensington",
    "Windsor Terrace",
    "Prospect Heights",
    "Brownsville",
    "Williamsburg",
    "Bushwick",
    "Bedford Stuyvesant",
    "Brooklyn Heights",
    "Cobble Hill",
    "Carroll Gardens",
    "Red Hook",
    "Gowanus",
    "Fort Greene",
    "Park Slope",
    "Cypress Hills",
    "East New York",
    "Starrett City",
    "Canarsie",
    "Flatlands",
    "Mill Island",
    "Manhattan Beach",
    "Coney Island",
    "Bath Beach",
    "Borough Park",
    "Dyker Heights",
    "Gerritsen Beach",
    "Marine Park",
    "Clinton Hill",
    "Sea Gate",
    "Downtown",
    "Boerum Hill",
    "Prospect Lefferts Gardens",
    "Ocean Hill",
    "City Line",
    "Bergen Beach",
    "Midwood",
    "Prospect Park South",
    "Georgetown",
    "Spring Creek",
    "East Williamsburg",
    "North Side",
    "South Side",
    "Navy Yard",
    "Ocean Parkway",
    "Fort Hamilton",
    "Chinatown",
    "Washington Heights",
    "Inwood",
    "Hamilton Heights",
    "Manhattanville",
    "Central Harlem",
    "East Harlem",
    "Upper East Side",
    "Yorkville",
    "Lenox Hill",
    "Roosevelt Island",
    "Upper West Side",
    "Lincoln Square",
    "Clinton",
    "Midtown",
    "Murray Hill",
    "Chelsea",
    "Greenwich Village",
    "East Village",
    "Lower East Side",
    "Tribeca",
    "Little Italy",
    "Soho",
    "West Village",
    "Manhattan Valley",
    "Morningside Heights",
    "Gramercy",
    "Battery Park City",
    "Financial District",
    "Astoria",
    "Woodside",
    "Jackson Heights",
    "Elmhurst",
    "Howard Beach",
    "South Corona",
    "Forest Hills",
    "Kew Gardens",
    "Richmond Hill",
    "Downtown Flushing",
    "Long Island City",
    "Sunnyside",
    "East Elmhurst",
    "Maspeth",
    "Ridgewood",
    "Glendale",
    "Rego Park",
    "Woodhaven",
    "Ozone Park",
    "South Ozone Park",
    "College Point",
    "Whitestone",
    "Bayside",
    "Auburndale",
    "Little Neck",
    "Douglaston",
    "Glen Oaks",
    "Bellerose",
    "Kew Gardens Hills",
    "Fresh Meadows",
    "Briarwood",
    "Jamaica Center",
    "Oakland Gardens",
    "Queens Village",
    "Hollis",
    "South Jamaica",
    "St. Albans",
    "Rochdale",
    "Springfield Gardens",
    "Cambria Heights",
    "Rosedale",
    "Far Rockaway",
    "Broad Channel",
    "Breezy Point",
    "Steinway",
    "Beechhurst",
    "Bay Terrace",
    "Edgemere",
    "Arverne",
    "Seaside",
    "Neponsit",
    "Murray Hill",
    "Floral Park",
    "Holliswood",
    "Jamaica Estates",
    "Queensboro Hill",
    "Hillcrest",
    "Ravenswood",
    "Lindenwood",
    "Laurelton",
    "Lefrak City",
    "Belle Harbor",
    "Rockaway Park",
    "Somerville",
    "Brookville",
    "Bellaire",
    "North Corona",
    "Forest Hills Gardens",
    "St. George",
    "New Brighton",
    "Stapleton",
    "Rosebank",
    "West Brighton",
    "Grymes Hill",
    "Todt Hill",
    "South Beach",
    "Port Richmond",
    "Mariner's Harbor",
    "Port Ivory",
    "Castleton Corners",
    "New Springville",
    "Travis",
    "New Dorp",
    "Oakwood",
    "Great Kills",
    "Eltingville",
    "Annadale",
    "Woodrow",
    "Tottenville",
    "Tompkinsville",
    "Silver Lake",
    "Sunnyside",
    "Ditmas Park",
    "Wingate",
    "Rugby",
    "Park Hill",
    "Westerleigh",
    "Graniteville",
    "Arlington",
    "Arrochar",
    "Grasmere",
    "Old Town",
    "Dongan Hills",
    "Midland Beach",
    "Grant City",
    "New Dorp Beach",
    "Bay Terrace",
    "Huguenot",
    "Pleasant Plains",
    "Butler Manor",
    "Charleston",
    "Rossville",
    "Arden Heights",
    "Greenridge",
    "Heartland Village",
    "Chelsea",
    "Bloomfield",
    "Bulls Head",
    "Carnegie Hill",
    "Noho",
    "Civic Center",
    "Midtown South",
    "Richmond Town",
    "Shore Acres",
    "Clifton",
    "Concord",
    "Emerson Hill",
    "Randall Manor",
    "Howland Hook",
    "Elm Park",
    "Remsen Village",
    "New Lots",
    "Paerdegat Basin",
    "Mill Basin",
    "Jamaica Hills",
    "Utopia",
    "Pomonok",
    "Astoria Heights",
    "Claremont Village",
    "Concourse Village",
    "Mount Eden",
    "Mount Hope",
    "Sutton Place",
    "Hunters Point",
    "Turtle Bay",
    "Tudor City",
    "Stuyvesant Town",
    "Flatiron",
    "Sunnyside Gardens",
    "Blissville",
    "Fulton Ferry",
    "Vinegar Hill",
    "Weeksville",
    "Broadway Junction",
    "Dumbo",
    "Manor Heights",
    "Willowbrook",
    "Sandy Ground",
    "Egbertville",
    "Roxbury",
    "Homecrest",
    "Middle Village",
    "Prince's Bay",
    "Lighthouse Hill",
    "Richmond Valley",
    "Malba",
    "Highland Park",
    "Madison"
]
autocomplete(document.getElementById("neighborhoodName"), neighborhoods);








// Create a request link for the About button:
const aboutButton = document.getElementsByClassName('about')[0];
aboutButton.addEventListener('click', () => {

    var aboutLink = document.getElementById('aboutLink');
    aboutLink.href = `/about`;
    aboutLink.click()
});

// Create a request link for the register button:
const registerButton = document.getElementsByClassName('registerButton')[0];
registerButton.addEventListener('click', () => {

    var registerLink = document.getElementById('registerLink');
    registerLink.href = `/register`;
    registerLink.click()
});


// Create a request link for the login button:
const loginButton = document.getElementsByClassName('loginButton')[0];
loginButton.addEventListener('click', () => {

    var loginLink = document.getElementById('loginLink');
    loginLink.href = `/register/login`;
    loginLink.click()
});



