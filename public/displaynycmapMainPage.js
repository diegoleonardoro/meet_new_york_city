

var neighborhoodButtons = document.getElementsByClassName('neighborhood');


for (var i = 0; i < neighborhoodButtons.length; i++) {

    neighborhoodButtons[i].addEventListener('click', function (e) {// 1. add an event listner to the neighborhood buttons.

        var neighborhoodClicked = this.innerHTML.trim();// 2. get the name of the neighborhood that was clicked.

        const readNeighborhoodCoords = new Promise((resolve, reject) => {
            d3.csv('NHoodNameCentroids.csv', function (data) {// 3. open the file that contains coordinates for each single neighborhood 

                for (var i = 0; i < data.length; i++) {// 4. Iterate through the data that contains the neighborhoods coordinates and resolve with the information that matche the clicked input. 
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

    var height = 300,
        width = 300,
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
            // .style("padding-top", "4%")
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


                //  .attr('width', '300px')
                //  .attr('height', '300px')
                .attr('x', '50')
                .attr('y', '50')

            nyc = map.selectAll('path').data(districts.features);
            nyc.enter()
                .append('path')
                .attr('d', path)
                .attr("id", GeoID)
                .attr('class', 'nycDistrict')
                .style("stroke", "rgb(223, 240, 241)")
                .style('cursor', 'pointer')
                .attr("stroke-width", '0.7px')
                .attr("fill", "#2D4859")


            //nyc.attr('fill', '#F2D272');
            nyc.exit().remove();


        });



    } else {// we will enter this else statement if the user clicks any of the neighborhoods. 

        let coordinates = flag['the_geom'];
        let neighborhood = flag['Name'];
        coordinates = coordinates.match(/[+-]?\d+(\.\d+)?/g);

        let latitude = parseFloat(coordinates[0]);
        let longitude = parseFloat(coordinates[1]);

        latitude = latitude.toFixed(4);
        longitude = longitude.toFixed(4);


        console.log(neighborhood)

        d3.json('geo-data.json', function (error, data) {

            if (error) return;


            //-----------Selecting the geometry features from the json OBJ------------------//
            var districts = topojson.feature(data, data.objects.districts);
            //-----------------------------------------------------------------------------//






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


            //remove previous circle 
            if (map_.children.length > 71) {
                let line = map_.children[map_.children.length - 1];
                let circle = map_.children[map_.children.length - 2];
                map_.removeChild(line);
                map_.removeChild(circle);
            };
            //end of remove previous circle 





            // append the neighborhood circle to the svg map 
            let circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            circle.setAttribute("cx", divLeftStyle);
            circle.setAttribute("cy", divTopStyle);
            circle.setAttribute("r", '10');
            circle.setAttribute("fill", '#ffe577');
            circle.setAttribute("class", 'selectedNeighborhood');
            circle.setAttribute("id", 'selectedNeighborhood');
            map_.appendChild(circle);
            // end of append the neighborhood circle to the svg map 



            var documentWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;



            let pathLineFlag = 'hola'

            let xValuePathLine;

            if (documentWidth > 1905) {

                xValuePathLine = 700;

            } else if (documentWidth > 1316) {

                xValuePathLine = 600;

            } else if (documentWidth > 1034) {

                xValuePathLine = 500;

            } else if (documentWidth > 740) {

                xValuePathLine = 400;

            } else {

                pathLineFlag = 'jiji'

            }



            let xValuePathLine_1 = xValuePathLine + 30;
            let yCaluePathLine_1 = xValuePathLine - 30;



            // display path that connects the circle to the neighborhood explanation box
            let pathToNhoodDescription = document.createElementNS("http://www.w3.org/2000/svg", 'path');

            if (pathLineFlag === 'hola') {
                pathToNhoodDescription.setAttribute("d", "M " + " " + divLeftStyle + " " + divTopStyle + " L" + " " + xValuePathLine + " " + divTopStyle + " L" + " " + xValuePathLine + " " + 480 + " L" + " " + xValuePathLine_1 + " " + 480 + " L" + " " + xValuePathLine + " " + 520 + " L" + " " + yCaluePathLine_1 + " " + 480 + " L" + " " + xValuePathLine + " " + 480);
            } else {

                let y_1 = divTopStyle + 600;

                let y_2 = divTopStyle + 660;

                let x_1 = divLeftStyle + 41;

                let x_2 = divLeftStyle - 41;

                let x_3 = divLeftStyle - 82;

                pathToNhoodDescription.setAttribute(
                    "d", "M " + " " + divLeftStyle + " " + divTopStyle
                    + " L" + " " + divLeftStyle + " " + y_1
                    + " L" + " " + x_1 + " " + y_1
                    + " L" + " " + divLeftStyle + " " + y_2
                    + " L" + " " + x_2 + " " + y_1
                    + " L" + " " + divLeftStyle + " " + y_1);
            }


            pathToNhoodDescription.style.stroke = "#000";
            pathToNhoodDescription.style.strokeWidth = "1px";
            pathToNhoodDescription.style.fill = "none";
            map_.appendChild(pathToNhoodDescription);
            // end of display path that connects the circle to the neighborhood explanation box


            


            // remove the p element of the previously selected neighborhood
            while (neighborhoodDescription.firstChild) {
                neighborhoodDescription.removeChild(neighborhoodDescription.firstChild);
            }
            // end of remove the p element of the previously selected neighborhood




            neighborhoodDescription.style.border = "0.01rem solid";
            var p1 = document.createElement('p')
            p1.innerHTML = neighborhood;
            p1.setAttribute('class', 'neighborhoodHeaderMain');
            neighborhoodDescription.appendChild(p1);


            // Get neighborhood description data:
            const getNhoodDescrption = new Promise((resolve, reject) => {
                d3.json('nhoodCoords.json', function (error, data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i]['Name'] === neighborhood) {
                            var p2 = document.createElement('p')
                            p2.innerHTML = data[i]['Description'];
                            // p2.style.marginLeft = '5%';
                            p2.setAttribute('class', 'neighborhoodHeader');
                            neighborhoodDescription.appendChild(p2);
                            resolve('continue')
                        }
                    }
                })
            })






            const section_neighborhoodGuides = document.getElementById('section_neighborhoodGuides');
            const section_header = document.createElement('h2');
            section_header.innerHTML = `Here is who can show you ${neighborhood} around: `
            section_neighborhoodGuides.prepend(section_header);







            getNhoodDescrption.then(value => {


                // let neighborhoodDescription = document.getElementById('neighborhoodDescription');

                // var p3 = document.createElement('p');
                // p3.innerHTML = `Here is who can show you ${neighborhood} around:`;
                // p3.style.marginLeft = '5%';
                // p3.setAttribute('class', 'neighborhoodHeader');
                // neighborhoodDescription.appendChild(p3);

                // append the nhoods loading illustration and text
                // var svgNhoodsIllustration = document.getElementsByClassName('svgNhoodsIllustration')[0];

                // var nhoodIllustrationSvg = svgNhoodsIllustration.cloneNode(true);
                // var firstPolygon = nhoodIllustrationSvg.children[0];
                // var lastPolygon = nhoodIllustrationSvg.children[nhoodIllustrationSvg.children.length - 1];
                // nhoodIllustrationSvg.setAttribute('class', 'nhoodIllustrationSvgLoadingInfo');
                // firstPolygon.setAttribute('class', 'baseSilhouetteInfoLoading');
                // lastPolygon.setAttribute('class', 'secondSilhouetteInfoLoading');
                // neighborhoodDescription.appendChild(nhoodIllustrationSvg);

                // var p4 = document.createElement('p');
                // p4.innerHTML = 'LOADING CONTENT';
                // p4.setAttribute('class', 'loadingContentText');
                // neighborhoodDescription.appendChild(p4);

                // const loadingWords = ['hang on', 'almost there', 'it will be worth it', 'breathe']
                // var flag = 0;
                // function changeLoadingWord() {
                //     var word = loadingWords[flag];
                //     p4.innerHTML = 'LOADING CONTENT - ' + word;
                //     flag++;
                //     if (flag === loadingWords.length - 1) {
                //         flag = 0;
                //     }
                //     var p4Style = getComputedStyle(p4);
                //     if (p4Style.display === 'inline') {
                //         setTimeout(() => {
                //             changeLoadingWord();
                //         }, 1000);
                //     }
                // }
                // changeLoadingWord();




            })






            getResponseData.then(resValue => {

                var container_neighborhoodGuides = document.getElementById('container_neighborhoodGuides');

                //hide the loading text and the neighbohood illustration for loading 'who can show' data
                //function stopChangeLoadingWord(){
                //   clearInterval(changeLoadingWordInterval)
                //}

                // document.getElementsByClassName('nhoodIllustrationSvgLoadingInfo')[0].style.display = 'none';
                // document.getElementsByClassName('loadingContentText')[0].style.display = 'none';

                neighborhoodUsers = JSON.parse(neighborhoodUsers);
                neighborhoodUsers = neighborhoodUsers['data'];













                let whoCanShowArray = [];

                for (var i = 0; i < neighborhoodUsers.length; i++) {

                    let whoCanShow = '';
                    let userName = neighborhoodUsers[i]['name'];
                    let neighborhood = neighborhoodUsers[i]['neighborhood'];
                    let lengthLivingInNeighborhood = neighborhoodUsers[i]['lengthLivingInNeighborhood'];
                    let neighborhoodDescription = neighborhoodUsers[i]['neighborhoodDescription'];




                    whoCanShow =
                        `<div class='whoCanShow'>
                            <p class='whoCanShowItem'> <b>Name:</b> ${userName} </p>
                            <p class='whoCanShowItem'> "I have lived in ${neighborhood} ${lengthLivingInNeighborhood}. I would describe ${neighborhood} as ${neighborhoodDescription}."</p>
                            <p class='whoCanShowItem' id='whoCanShowItemLast'> These are some of ${userName}'s favorite places in ${neighborhood}: </p>
                            `

                    let imagesDiv = [];// this array is going to hold the images for each place.
                    for (var x = 0; x < neighborhoodUsers[i]['imageFormatted'].length; x++) {

                        let imagesFormattedInnerArray = neighborhoodUsers[i]['imageFormatted'][x];
                        let imagesImgDom = '';

                        for (var q = 0; q < imagesFormattedInnerArray.length; q++) {

                            imagesImgDom = imagesImgDom +
                                ` <img class='whoCanShowItem placeImage'  src=data:image/png;base64,${imagesFormattedInnerArray[q]}>`

                        }

                        let imagesDivDom = `<div class ='placeImagesDiv'> ${imagesImgDom} </div>`;
                        imagesDiv.push(imagesDivDom);
                    }


                    let placesDivs = '';
                    for (var e = 0; e < neighborhoodUsers[i]['favoritePlaces'].length; e++) {

                        let place = neighborhoodUsers[i]['favoritePlaces'][e];


                        if (neighborhoodUsers[i]['favoritePlaces'].length === 1) {

                            placesDivs = placesDivs +
                                `<div class = 'divPlaceContainer shownPlace'> 
                                <div class='divOfFavPlace' >
                                    <p class='whoCanShowItem'><b>Place: </b>${place['place']} </p>
                                    <p class='whoCanShowItem'> ${place['description']}</p>
                                    <p class ='whoCanShowItem'><b>Images of place:</b></p>
                                    ${imagesDiv[e]}
                                </div>
                            </div>`
                        } else if (e === 0) {

                            placesDivs = placesDivs +
                                `<div class = 'divPlaceContainer shownPlace'> 
                                    <div class='divOfFavPlace' >
                                        <p class='whoCanShowItem'><b>Place: </b>${place['place']} </p>
                                        <p class='whoCanShowItem'> ${place['description']}</p>
                                        <p class ='whoCanShowItem'><b>Images of place:</b></p>
                                        ${imagesDiv[e]}
                                    </div>
                                    <i class="fas fa-arrow-circle-right"></i>
                                </div>`
                        } else if (e === neighborhoodUsers[i]['favoritePlaces'].length - 1) {
                            placesDivs = placesDivs +
                                `<div class='divPlaceContainer hiddenPlace'>
                                    <i class="fas fa-arrow-circle-left"></i>  
                                    <div class='divOfFavPlace '>
                                        <p class='whoCanShowItem'><b>Place: </b>${place['place']} </p>
                                        <p class='whoCanShowItem'> ${place['description']}</p>
                                        <p class ='whoCanShowItem'><b>Images of place:</b></p>
                                        ${imagesDiv[e]}
                                    </div>
                                </div>`

                        } else {
                            placesDivs = placesDivs +
                                `<div class='divPlaceContainer hiddenPlace'>
                                <i class="fas fa-arrow-circle-left"></i>  
                                <div class='divOfFavPlace '>
                                    <p class='whoCanShowItem'><b>Place: </b>${place['place']} </p>
                                    <p class='whoCanShowItem'> ${place['description']}</p>
                                    <p class ='whoCanShowItem'><b>Images of place:</b></p>
                                    ${imagesDiv[e]}
                                </div>
                                <i class="fas fa-arrow-circle-right"></i>
                            </div>`


                        }

                    }

                    whoCanShow = whoCanShow + placesDivs;
                    whoCanShowArray.push(whoCanShow);

                }





                for (var i = 0; i < whoCanShowArray.length; i++) {
                    container_neighborhoodGuides.innerHTML = container_neighborhoodGuides.innerHTML + whoCanShowArray[i];
                }



                // add an event listener to the next div place arrow
                const place_arrow_right = document.getElementsByClassName('fa-arrow-circle-right');
                for (var i = 0; i < place_arrow_right.length; i++) {
                    place_arrow_right[i].addEventListener('click', (e) => {

                        let clickedArrow = e.target;
                        let divPlaceContainers = clickedArrow.parentElement;

                        let mainDiv = divPlaceContainers.parentElement;
                        let mainDivdivPlaceContainer = mainDiv.getElementsByClassName('divPlaceContainer');

                        for (var e = 0; e < mainDivdivPlaceContainer.length; e++) {

                            if (mainDivdivPlaceContainer[e].className.indexOf('shownPlace') > -1) {

                                // if (e != mainDivdivPlaceContainer.length - 1) {

                                mainDivdivPlaceContainer[e].className = 'divPlaceContainer hiddenPlace';
                                mainDivdivPlaceContainer[e + 1].className = 'divPlaceContainer shownPlace';

                                break;

                                // }
                            }

                        }
                    })
                }
                // end of add an event listener to the next div place arrow




                // add an event listener to the previous  div place arrow
                const place_arrow_left = document.getElementsByClassName('fa-arrow-circle-left');
                for (var i = 0; i < place_arrow_left.length; i++) {

                    place_arrow_left[i].addEventListener('click', (e) => {

                        let clickedArrow = e.target;
                        let divPlaceContainers = clickedArrow.parentElement;

                        let mainDiv = divPlaceContainers.parentElement;
                        let mainDivdivPlaceContainer = mainDiv.getElementsByClassName('divPlaceContainer');

                        for (var e = 0; e < mainDivdivPlaceContainer.length; e++) {

                            if (mainDivdivPlaceContainer[e].className.indexOf('shownPlace') > -1) {

                                // if (e != mainDivdivPlaceContainer.length - 1) {

                                mainDivdivPlaceContainer[e].className = 'divPlaceContainer hiddenPlace';
                                mainDivdivPlaceContainer[e - 1].className = 'divPlaceContainer shownPlace';

                                break;

                                // }
                            }

                        }

                    })
                }
                // end of add an event listener to the previous  div place arrow
















                // Add an event listener to the profile button
                // This event listener will query the database using the slug 
                // to get the user profile page.

                // var divmap = document.getElementById('map');
                // setTimeout(() => {
                //     const profileButton = document.getElementById('visitUserProfile');
                //     const loadingUserProfileIllustration = document.getElementsByClassName('loadingUserProfileIllustration')[0];
                //     const loadingUserProfileText = document.getElementById('loadingUserProfileText');
                //     const divSvgNhoodText = document.getElementById('divSvgNhoodText');
                //     const addHrefValueToButton = new Promise((resolve, reject) => {
                //         profileButton.addEventListener('click', function (e) {
                //             e.stopPropagation();
                //             var linkToUserProfile = document.getElementById('linkToUserProfile');
                //             linkToUserProfile.href = `/users/user-profile/${slug}`;
                //             linkToUserProfile.click();
                //             resolve('continue');
                //         })
                //     })
                //     addHrefValueToButton.then((value) => {
                //         divmap.style.display = 'none';
                //         loadingUserProfileIllustration.style.display = 'inline';
                //         loadingUserProfileText.style.display = 'inline';
                //         loadingUserProfileText.innerHTML = `Loading ${userName}'s profile.`;
                //         chageBuildingsWindowsColors();
                //     })
                // }, 100);

                // ------ end of  Add an event listener to the profile button





                // resize the photo of the place and add text 
                // neighborhoodDescription.innerHTML = neighborhoodDescription.innerHTML + whoCanShowArray[0];




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
                // ------ end of  resize the photo of the place and add text 

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
    window.scrollTo({ top: exploreNeighborhoodstextBoundingBox.bottom - 180, behavior: 'smooth' });
});




// add event listener to the about button which will trigger the animation of the nhood illustration
var exploreNeighborhoods = document.getElementsByClassName('exploreNeighborhoods')[0];
var secondSilhouette = document.getElementsByClassName('secondSilhouette')[0];

exploreNeighborhoods.addEventListener('mouseover', () => {
    secondSilhouette.style.display = 'inline';
})

exploreNeighborhoods.addEventListener('mouseout', () => {
    secondSilhouette.style.display = 'none';
})




//funtcion that slects all the windows of the neighborhood illustration and change their color:

var windowColors = ['black', 'white'];

let g = 0;
let c = 1;

function chageBuildingsWindowsColors() {

    var windowParent = document.getElementsByClassName('window');

    let g_flag = g;

    for (g; g < windowParent.length; g = g + 2) {
        let groupOfWindows = windowParent[g];
        let windows = groupOfWindows.children;
        for (var a = 0; a < windows.length; a++) {
            windows[a].style.fill = 'white';
        }
    }

    for (c; c < windowParent.length; c = c + 2) {
        let groupOfWindows = windowParent[c];
        let windows = groupOfWindows.children;
        for (var a = 0; a < windows.length; a++) {
            windows[a].style.fill = 'black';
        }
    }

    if (g_flag === 0) {
        g = 1;
        c = 0;
    } else if (g_flag === 1) {
        g = 0;
        c = 1;
    }

    setTimeout(() => {
        chageBuildingsWindowsColors();
    }, 1000);

}





