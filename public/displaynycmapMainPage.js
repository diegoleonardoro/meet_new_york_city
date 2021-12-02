

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
        var svg = d3.select("#MapSVG")
            //.attr("width", '30%')//   --   '30%' 
            //.attr("height", '49%')// --  '30%'

            .style("padding-top", "4%")
            //.style("left", "35%")
            .style("background", '#D4CDF5')
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
                .style("stroke", "white")
                .style('cursor', 'pointer')
                .attr("stroke-width", .4)
                .attr("fill", "#633DA6")


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

            if (map_.children.length > 71) {
                let circle = map_.children[map_.children.length - 1];
                map_.removeChild(circle);
                let paragraph1 = neighborhoodDescription.children[neighborhoodDescription.children.length - 1];
                neighborhoodDescription.removeChild(paragraph1);

            };

            let circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            circle.setAttribute("cx", divLeftStyle);
            circle.setAttribute("cy", divTopStyle);
            circle.setAttribute("r", '10');
            circle.setAttribute("fill", '#F2D272');
            circle.setAttribute("opacity", '0.8');
            circle.setAttribute("class", 'selectedNeighborhood');
            map_.appendChild(circle);

            var mapDiv = document.getElementById('map');

            var MapSVG = document.getElementById('MapSVG');

            const mediaQuery = window.matchMedia('(max-width:950px)');
            if (mediaQuery.matches) {

                MapSVG.style.marginLeft = '35%';
                neighborhoodDescription.style.marginTop = '45%';


            } else {
                MapSVG.style.marginLeft = '20%';
                MapSVG.style.position = 'absolute';

            }


            let nextPersonArrow = document.getElementsByClassName('nextPerson')[0];
            let prevPersonArrow = document.getElementsByClassName('prevPerson')[0];


            neighborhoodDescription.style.border = "0.01rem solid #633DA6";
            var p1 = document.createElement('p')
            p1.innerHTML = neighborhood;
            p1.style.marginLeft = '5%';
            p1.setAttribute('class', 'neighborhoodHeader')

            //neighborhoodDescription.appendChild(p1);


            neighborhoodDescription.insertBefore(p1, prevPersonArrow);

            var p2 = document.createElement('p')
            p2.innerHTML = 'Here is who can show you this neighborhood around: ';
            p2.style.marginLeft = '5%';
            p2.setAttribute('class', 'neighborhoodHeader');

            //neighborhoodDescription.appendChild(p2);

            neighborhoodDescription.insertBefore(p2, prevPersonArrow);

            getResponseData.then(resValue => {

                neighborhoodUsers = JSON.parse(neighborhoodUsers);

                let whoCanShowArray = [];
                let whoCanShow = '';


                for (var i = 0; i < neighborhoodUsers['data'].length; i++) {

                    let userName = neighborhoodUsers['data'][i]['name']

                    let lengthLivingInNeighborhood = neighborhoodUsers['data'][i]['lengthLivingInNeighborhood'];

                    let favAspectsOfNeighborhood = neighborhoodUsers['data'][i]['favAspectsOfNeighborhood'];

                    let favoritePlaces = neighborhoodUsers['data'][i]['favoritePlaces'];

                    if (favoritePlaces.length > 1) {

                        //console.log(1);

                        whoCanShow =
                            `<div class='whoCanShow'>
                            <p class='whoCanShowItem' > ${userName} </p>
                            <p class='whoCanShowItem'>I have lived in this neighborhood for ${lengthLivingInNeighborhood}. ${favAspectsOfNeighborhood}</p>
                            <p class='whoCanShowItem'> Here are some of my favorite places in this neighborhood: </p>
                            `
                        for (var u = 0; u < favoritePlaces.length; u++) {

                            let place = favoritePlaces[u]['placeDescrption']['place'];
                            let placDescription = favoritePlaces[u]['placeDescrption']['description'];
                            let placeImage = favoritePlaces[u]['placeImageBuffer'];


                            whoCanShow = whoCanShow +
                                `<p class='whoCanShowItem'> ${place} </p>
                                <p class='whoCanShowItem'> ${placDescription}</p>
                                <img class='whoCanShowItem placeImage'  src=data:image/png;base64,${placeImage}>
                            </div>
                            `
                        }

                        whoCanShowArray.push(whoCanShow);

                    } else {

                        whoCanShow =
                            `<div class='whoCanShow'>
                            <p class='whoCanShowItem'> ${userName} </p>
                            <p class='whoCanShowItem'>I have lived in this neighborhood for ${lengthLivingInNeighborhood}. ${favAspectsOfNeighborhood}</p>
                            <p class='whoCanShowItem'> This is one of my favorite places in this neighborhood: </p>
                            `
                        for (var u = 0; u < favoritePlaces.length; u++) {

                            let place = favoritePlaces[u]['placeDescrption']['place'];
                            let placDescription = favoritePlaces[u]['placeDescrption']['description'];
                            let placeImage = favoritePlaces[u]['placeImageBuffer'];


                            whoCanShow = whoCanShow +
                                `<p class='whoCanShowItem'> ${place} </p>
                                <p class='whoCanShowItem'> ${placDescription}</p>
                                <img class='whoCanShowItem placeImage'  src=data:image/png;base64,${placeImage}>
                            </div>
                  `
                        }
                        whoCanShowArray.push(whoCanShow);
                    }
                }


                var neighborhoodHeaders = document.getElementsByClassName('neighborhoodHeader');
                neighborhoodHeaders[1].insertAdjacentHTML('afterend', whoCanShowArray[0]);

                let personIndex = 0;
                function changeDivs(n) {

                    let displayedPerson = document.getElementsByClassName('whoCanShow')[0];

                    displayedPerson.remove();

                    if (personIndex >= 0 && personIndex < whoCanShowArray.length - 1 && n == 1) {
                        personIndex += n
                    } else if (n == -1 && personIndex >0) {
                        personIndex += n
                    } else {
                        personIndex = 0;
                    }
                    if (whoCanShowArray.length == 1) {
                        personIndex = 0;
                    }
                    let whoCanShowSelected = whoCanShowArray[personIndex];

                    neighborhoodHeaders[1].insertAdjacentHTML('afterend', whoCanShowSelected);
                    setTimeout(() => {
                        resizePhotoOfPlace()
                    }, 100);

        

                }

                nextPersonArrow.addEventListener('click', () => {
                    changeDivs(1);
                });


                prevPersonArrow.addEventListener('click', () => {
                    changeDivs(-1);
                });








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

            })
        })
    }
};

displayMap()

