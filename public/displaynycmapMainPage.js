

var neighborhoodButtons = document.getElementsByClassName('neighborhood');


for (var i = 0; i < neighborhoodButtons.length; i++) {

    neighborhoodButtons[i].addEventListener('click', function (e) {

        var neighborhoodClicked = this.innerHTML.trim();


        const readNeighborhoodCoords = new Promise((resolve, reject) => {
            d3.csv('NHoodNameCentroids.csv', function (data) {
                for (var i = 0; i < data.length; i++) {
                    var neighborhoodFromData = data[i]['Name'];
                    if (neighborhoodClicked === neighborhoodFromData) {
                        resolve(data[i]);
                    }
                }
            })
        })

        readNeighborhoodCoords.then(value => {
            displayMap(value)
        })

    });
}


function displayMap(flag) {

    flag = flag || 'hola';

    var height = 500,
        width = 600,
        projection = d3.geoMercator(), // geoMercator() is a way of projecting the map. 
        nyc = void 0,
        map,
        streetMap = void 0,
        nycStreets = void 0;


    // ------------ Path & Projection ------------ //

    var path = d3.geoPath().projection(projection); // d3.geoPath() is the D3 Geo Path Data Generator helper class for generating SVG 

    // ------------------------------------------- //
    if (flag === 'hola') {


        // ------------ Appending the SVG ------------ //
        var svg = d3.select("#MapSVG_")
            .style("padding-top", "4%")
            .style("background", '#392033')
            .style("opacity", "1")
            .style("overflow", 'visible');


        // --------- Reading NYC's boundaries ----------- //

        d3.json('geo-data.json', function (error, data) {
            if (error) return;

            //-----------Selecting the geometry features from the json OBJ------------------//
            var districts = topojson.feature(data, data.objects.districts); // inside topojson.feature we have to put the element where the "geometries" live. 

            // ------ Assign a unique value to each element in the "districts" OBJ --------//
            var GeoID = function (d) {

                return "c" + d.id;

            }


            //-----------------------------SCALE AND TRANSLATE---------------------------//
            var b, s, t;
            projection.scale(1).translate([0, 0]);
            var b = path.bounds(districts); // bounds represent a two dimensional array : [[left, bottom], [right, top]],
            var s = .9 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
            var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
            projection.scale(s).translate(t);



            // ----------------- APPENING G ELEMENT AND INJECTING THE DATA -----------------//

            map = svg.append('g')
                .attr('class', 'boundary')
                .attr('x', '50%')
                .attr('y', '50%')

            nyc = map.selectAll('path').data(districts.features);
            nyc.enter()
                .append('path')
                .attr('d', path)
                .attr("id", GeoID)
                .attr('class', 'nycDistrict')
                .style("stroke", "black")
                .style('cursor', 'pointer')
                .attr("stroke-width", .5)
                .attr("fill", "#fd6051")


            nyc.attr('fill', '#F2D272');
            nyc.exit().remove();


        });



    } else {

        let coordinates = flag['the_geom'];
        let neighborhood = flag['Name'];
        coordinates = coordinates.match(/[+-]?\d+(\.\d+)?/g);

        let latitude = parseFloat(coordinates[0]);
        let longitude = parseFloat(coordinates[1]);

        latitude = latitude.toFixed(4);
        longitude = longitude.toFixed(4);

        d3.json('geo-data.json', function (error, data) {

            if (error) return;

            //-----------Selecting the geometry features from the json OBJ------------------//
            var districts = topojson.feature(data, data.objects.districts);



            // query the database to see all the people from that neighborhood:
            const xhr = new XMLHttpRequest();
            let neighborhoodUsers
            let getResponseData = new Promise((resolve, reject) => {
                xhr.onload = () => {
                    setTimeout(() => {
                        neighborhoodUsers = xhr.response;
                        resolve('Got server response')
                    }, 100);
                }
            })

            // create and send the reqeust
            xhr.open('GET', `/users/neighborhood/${neighborhood}`);
            xhr.send();

            //---------------------------------------------------------------//



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
                let paragraph1 = neighborhoodDescription.children[neighborhoodDescription.children.length - 1];
                neighborhoodDescription.removeChild(paragraph1);
            };

            // remove previous neighborhood descriptions:
            while (neighborhoodDescription.firstChild) {
                neighborhoodDescription.removeChild(neighborhoodDescription.firstChild);
            }

            let circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            circle.setAttribute("cx", divLeftStyle);
            circle.setAttribute("cy", divTopStyle);
            circle.setAttribute("r", '10');
            circle.setAttribute("fill", '#ffe577');

            circle.setAttribute("class", 'selectedNeighborhood');
            map_.appendChild(circle);



            // re position the map and place description containers
            neighborhoodDescription.style.display = 'inline';
            // end of re position the map and place description containers



            neighborhoodDescription.style.border = "0.01rem solid";
            var p1 = document.createElement('p')
            p1.innerHTML = neighborhood;
            p1.style.marginLeft = '5%';
            p1.setAttribute('class', 'neighborhoodHeaderMain');
            neighborhoodDescription.appendChild(p1);


            // Get neighborhood description data:
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

            })






            getResponseData.then(resValue => {

                neighborhoodUsers = JSON.parse(neighborhoodUsers);
                let whoCanShowArray = [];
                let whoCanShow = '';


                console.log(neighborhoodUsers)
                let userName = neighborhoodUsers['data']['name'];
                let lengthLivingInNeighborhood = neighborhoodUsers['data']['lengthLivingInNeighborhood'];
                let favAspectsOfNeighborhood = neighborhoodUsers['data']['favAspectsOfNeighborhood'];
                let favoritePlaces = neighborhoodUsers['data']['favoritePlaces'];

                let slug = neighborhoodUsers['data']['slug'];

                let numofPlaces = neighborhoodUsers['data']['numofPlaces'][0];
                let imagesFormated = neighborhoodUsers['data']['imagesFormated'];




                console.log(imagesFormated);


        



                whoCanShow =
                    `<div class='whoCanShow'>
                            <p class='whoCanShowItem'> <b>Name:</b> ${userName} </p>
                            <p class='whoCanShowItem'> <b>Description:</b> I have lived in this neighborhood for ${lengthLivingInNeighborhood}. ${favAspectsOfNeighborhood}</p>
                            <p class='whoCanShowItem'> This is one of my favorite places in this neighborhood: </p>
                            `
                // for (var u = 0; u < favoritePlaces.length; u++) {///

                let place = favoritePlaces[0]['place'];
                let placDescription = favoritePlaces[0]['description'];

                //let placeImage = favoritePlaces[0]['placeImageBuffer'][0];

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


                // Add an event listener to the profile button
                // This event listener will query the database using the slug 
                // to get the user profile page.

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






        })
    }
};

displayMap();


// add scroll down event to the explore neighborhoods button.
var exploreNeighborhoodsButton = document.getElementsByClassName('exploreNeighborhoods')[0];
exploreNeighborhoodsButton.addEventListener('click', () => {
    var exploreNeighborhoodstext = document.getElementById('exploreNeighborhoodstext');
    var exploreNeighborhoodstextBoundingBox = exploreNeighborhoodstext.getBoundingClientRect();
    console.log(exploreNeighborhoodstextBoundingBox);
    window.scrollTo({ top: exploreNeighborhoodstextBoundingBox.bottom - 180, behavior: 'smooth' });
});

// add event listener to the search neighborhood button:


