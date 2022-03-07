// expand explore-detail-btn 
/*
var exploreDetailBtns = document.getElementsByClassName('explore-detail-btn');
for (var i = 0; i < exploreDetailBtns.length; i++) {

    let exploreDetailBtn = exploreDetailBtns[i];
    let exploreDetailBtnWrapper = exploreDetailBtns[i].parentElement;

    exploreDetailBtn.addEventListener('click', () => {

        let exploreDetailBtnWrapperDiv = exploreDetailBtnWrapper.children[1];
        if (exploreDetailBtn.className.indexOf('divShown') > -1) {

            exploreDetailBtn.classList.remove('divShown');
            exploreDetailBtnWrapperDiv.style.display = 'none';

        } else {
            exploreDetailBtn.className += ' divShown';
            exploreDetailBtnWrapperDiv.style.display = 'block';

        }
    })
}
 */
// end of expand explore-detail-btn 





var neighborhood = user.neighborhood


// display map of places
let path;
let neighborhoods;
let nyc_nhoods_paths;
let nyc_streets_paths;
let width;
let height;
let example_bounds;





// load neighborhood coordinates data 
let lat;
let lon;
let neighborhood_blurb;

d3.json("/nhoodCoords.json", function (neighborhoodsData) {
    for (var r = 0; r < neighborhoodsData.length; r++) {
        if (neighborhood === neighborhoodsData[r]['Name']) {
            lat = neighborhoodsData[r]['the_geom'][1];
            lon = neighborhoodsData[r]['the_geom'][0];
            neighborhood_blurb = neighborhoodsData[r]['Description'];
        }
    }
})
// end of load neighborhood coordinates data 




function displayMap(callback) {

    height = 300;
    width = 300;
    var projection = d3.geoMercator()

    nyc_nhoods_paths = void 0;
    nyc_streets_paths = void 0;

    let b, s, t;

    path = d3.geoPath().projection(projection);


    d3.json('/NTAreas.json', function (error, nhoods_data) {

        if (error) return;

        // ---------- zoom function

        /*
        var zoomed = function () {

            var neighborhoodsGroup = document.getElementsByClassName('neighborhoodsGroup')[0];
            var streetsGroup = document.getElementsByClassName('streetsGroup')[0];
            var parksGroup = document.getElementsByClassName('parksGroup')[0];

            neighborhoodsGroup.setAttribute("transform", 'translate (' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale (' + d3.event.transform.k + ')');
            streetsGroup.setAttribute("transform", 'translate (' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale (' + d3.event.transform.k + ')');
            parksGroup.setAttribute("transform", 'translate (' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale (' + d3.event.transform.k + ')');
        };
         */
        //var zoom = d3.zoom()
        //.scaleExtent([1, 8])
        //   .on('zoom', zoomed)

        /*
       function clickZoom() {
           [[x0, y0], [x1, y1]] = example_bounds;

           event.stopPropagation();
           d3.select(this).transition().style("fill", "red");
           svg_map.transition().duration(750).call(
               zoom.transform,
               d3.zoomIdentity
                   .translate(width / 2, height / 2)
                   .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                   .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
               //d3.pointer(event, svg_map.node())
           );
       }
     

       setTimeout(() => {
           let x0,
               y0,
               x1,
               y1


           [[x0, y0], [x1, y1]] = example_bounds;

          
           svg_map.transition().duration(750).call(
               zoom.transform,
               d3.zoomIdentity
                   .translate(width / 2, height / 2)
                   .scale(Math.min(25, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                   .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
           );

    
           svg_map.style('margin-left', '7%')
           var nycNeighborhoods_paths = document.getElementsByClassName('nycNeighborhoods_paths');
           for (var t = 0; t < nycNeighborhoods_paths.length; t++) {
               nycNeighborhoods_paths[t].style.strokeWidth = '0.03';
           }

           //svg_map.style.marginLeft = '-7%';
           var scaleX = svg_map.getBoundingClientRect().width / svg_mapd.offsetWidth;

       }, 7000);
      */
        //------------- end of zoom function --- //



        neighborhoods = topojson.feature(nhoods_data, nhoods_data.objects['2010 Neighborhood Tabulation Areas (NTAs) (1)']);

        projection.scale(1).translate([0, 0]);
        b = path.bounds(neighborhoods);
        s = .85 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
        projection.scale(s).translate(t);

        var svg_map = document.getElementById('nhd-places-map-svg') //d3.select("#")
        // .call(zoom)



        n_hoods_group = d3.select("#nhd-places-map-svg")
            .append('g')
            .attr('class', 'neighborhoodsGroup')
            .attr('x', 300)

        nyc_nhoods_paths = n_hoods_group.selectAll('path').data(neighborhoods.features)

        nyc_nhoods_paths.enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'nycNeighborhoods_paths')
            .attr('id', function (d) {
                return d['properties']['ntaname']
            })
            .style("stroke", "black")
            .style('cursor', 'pointer')
            .attr("stroke-width", .09)
            .attr("fill", "#D5DBDB")
            .attr("fill-opacity", "0.2")

        //.on('click', clickZoom)


        nyc_nhoods_paths.attr('fill', '#eee');
        nyc_nhoods_paths.exit().remove();



        // Display circle inside map svg
        var divLeftStyle = projection([lon, lat])[0];
        var divTopStyle = projection([lon, lat])[1];
        d3.select("#nhd-places-map-svg")
            .append("circle")
            .attr("cx", divLeftStyle)
            .attr("cy", divTopStyle)
            .attr("id", "placeCircle")
            .attr("r", 3)
            .attr("fill", "#39b54a")
            .attr("id", "placeCircle");
        // end of display circle inside map svg



        // Display path that connects the circle to the neighborhood explanation box
        let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        newElement.setAttribute("d", "M " + " " + divLeftStyle + " " + divTopStyle + " L" + " " + divLeftStyle + " " + -100);
        newElement.style.stroke = "#000";
        newElement.style.strokeWidth = "1px";
        svg_map.appendChild(newElement);
        // end of display path that connects the circle to the neighborhood explanation box




        // Insert neighborhood description
        const neighborhood_description = document.getElementById('neighborhood_description');
        neighborhood_description.innerText = neighborhood_blurb;
        // end of insert neighborhood description





        /*
        Display streets
        d3.json('/NYCStreetCenterline.json', function (error2, streets_data) {

            if (error2) return;

            var streets = topojson.feature(streets_data, streets_data.objects['NYC Street Centerline (CSCL)']);

            var street_group = d3.select("#nhd-places-map-svg")
                .append('g')
                .attr('class', 'streetsGroup')


            nyc_streets_paths = street_group.selectAll('path').data(streets.features);

            nyc_streets_paths.enter()
                .append('path')
                .attr('d', path)
                .attr('class', 'streets_paths')
                .style("stroke", "black")
                .attr("stroke-width", .005)
                .attr("fill", "none")
        });

        */

        /*
        Display parks

        d3.json('/OpenSpace_Parks.json', function (error3, parks_data) {

            var parks = topojson.feature(parks_data, parks_data.objects['Open Space (Parks)']);

            projection.scale(s).translate(t);

            var parks_group = d3.select("#nhd-places-map-svg")
                .append('g').lower()
                .attr('class', 'parksGroup')

            parks_paths = parks_group.selectAll('path').data(parks.features);

            parks_paths.enter()
                .append('path')
                .attr('d', path)
                .attr('class', 'parks_paths')
                .style("stroke", "none")
                .attr("stroke-width", .02)
                .attr("fill", "#A9DFBF")
        });
        */



    })
}





setTimeout(() => {
    var n_hoods_g = document.getElementsByClassName('neighborhoodsGroup')[0];
    var n_hoods_g_children = n_hoods_g.children;



    for (var i = 0; i < n_hoods_g_children.length; i++) {
        if (n_hoods_g_children[i].id.indexOf(neighborhood) > -1) {

            //console.log(path.bounds(n_hoods_g_children[i]));
            // console.log(n_hoods_g_children[i]);
            //n_hoods_g_children[i].style.fill = 'yellow';
        }
    }




}, 3000);

displayMap();

//end of  display map of places








// display the neighborhood satisfaction chart 

var neighborhoodSatisfaction = user.neighborhoodSatisfaction;
var neighborhoodFactorDescription = user.neighborhoodFactorDescription

delete neighborhoodSatisfaction._id
delete neighborhoodFactorDescription._id
let neighborhood_satisfaction = [];

neighborhoodSatisfaction_entries = Object.entries(neighborhoodSatisfaction);
neighborhoodFactorDescription_entries = Object.entries(neighborhoodFactorDescription);

for (var i = 0; i < neighborhoodSatisfaction_entries.length; i++) {

    let obj = {}
    let item = neighborhoodSatisfaction_entries[i];
    let key = item[0];

    let key_split = key.split(/(?=[A-Z])/).join(" ").toLowerCase()
    key_split = key_split.charAt(0).toUpperCase() + key_split.slice(1);

    let value = item[1];
    let description = neighborhoodFactorDescription_entries[i];
    obj['satisfaction'] = value;
    obj['factor'] = key_split;
    obj['description'] = description[1];
    neighborhood_satisfaction.push(obj);

}





let toggleClass = (d, i, toggle) => {


    const satisfaction = d.satisfaction;


    /*
    let bar = document.getElementsByClassName('bar')[i - 1];
    var clasNameHighlight = bar.className.baseVal + ' highlightBar';
    var classNameNotHighlight = 'bar';

    if (toggle) {
        bar.setAttribute("class", clasNameHighlight);
    } else {
        bar.setAttribute("class", classNameNotHighlight);
    }
    */

    let fontColor;


    if (toggle) {
        if (satisfaction === 'Recommended') {
            fontColor = '#39b54a';
        } else if (satisfaction === 'Neutral') {
            fontColor = '#fbb03b';
        } else if (satisfaction === 'Not recommended') {
            fontColor = '#e74b50';
        }
        d3.select("#legends li:nth-child(" + i + ")")
            //.style("font-size", "16px")
            //.style('color', fontColor)
            .style("font-weight", 'bold');


        d3.select("#legends li:nth-child(" + i + ") tspan")
            .style('color', fontColor)
            .style("font-weight", 'bold');



    } else {
        d3.select("#legends li:nth-child(" + i + ")")
            // .style("font-size", "92px")
            .style('color', 'black')
            //.style("font-size", "12px")
            .style("font-weight", 'bold');
        d3.select("#legends li:nth-child(" + i + ") tspan")
            .style('color', "black")
            .style("font-weight", 'normal');

        //.style("font-weight", 900)




    }






};

var svg = d3.select(".nhd-satisfact-svg"),
    margin = { top: 22, right: 15, bottom: 30, left: 50 },
    width_bar_chart = 550 - margin.left - margin.right,
    height_bar_chart = 100 - margin.top - margin.bottom;



var x = d3.scaleBand()
    .range([0, width_bar_chart])
    .padding(0.2);

var y = d3.scalePoint()
    .range([height_bar_chart, 0])
    .padding(0.9);


var neighborhoodFactors = ['Use public tansportation', 'Walk around neighborhood', 'Visit parks', 'Explore restaurants', 'Explore night life', 'Visit in the morning'];
var satisfactionLevel = ['Not recommended', 'Neutral', 'Recommended'];

x.domain(neighborhoodFactors);
y.domain(satisfactionLevel);


var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// x axis:
g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height_bar_chart + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "middle")
    .attr("fill", "black")
    .attr("font-weight", 800)
    .style("font-size", "12px")


d3.selectAll(".tick text")
    .attr('y', function (d, i) { return textYvalue(d, i) })
    .call(wrap, x.bandwidth())

d3.selectAll(".tick line")
    .attr('y2', function (d, i) { return tickY2value(d, i) })


//-----------------------//
// Call back functions:
function xAxisTextColor(d, i) {

    const neighborhood_factor = neighborhood_satisfaction[i];
    const neighborhood_factor_satisfact = neighborhood_factor.satisfaction;

    if (neighborhood_factor_satisfact === 'Recommended') {
        return '#39b54a';
    } else if (neighborhood_factor_satisfact === 'Neutral') {
        return '#fbb03b';
    } else if (neighborhood_factor_satisfact === 'Not recommended') {
        return '#e74b50';
    }
}
function textYvalue(d, i) {
    if (i % 2 === 0) {
        return 55;
    } else {
        return 15
    }
}
function tickY2value(d, i) {
    if (i % 2 === 0) {
        return 50;
    } else {
        return 10
    }
}
function yAxisTextColor(d, i) {
    if (d === 'Not recommended') {
        return '#e74b50';
    } else if (d === 'Neutral') {
        return '#fbb03b';
    } else if (d === 'Recommended') {
        return '#39b54a';
    }
}

function barsColors(d) {
    const satisfact = d.satisfaction;
    if (satisfact === 'Recommended') {
        return '#39b54a';
    } else if (satisfact === 'Neutral') {
        return '#fbb03b';
    } else if (satisfact === 'Not recommended') {
        return '#e74b50';
    }
}
//-----------------------//

// y axis:
g.append("g")
    .attr("class", "axis axis--y")
    .attr("id", "rect-g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr("font-weight", 700)
    .style("font-size", "9px")
    .attr("fill", function (d, i) { return yAxisTextColor(d, i) })




// Select both x and y axis to add a grid:
d3.selectAll("g.axis--y g.tick")
    .append("line")
    .attr("class", "gridline")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", width_bar_chart)
    .attr("y2", 0);

d3.selectAll("g.axis--x g.tick")
    .append("line")
    .attr("class", "gridline")
    .attr("x1", 0)
    .attr("y1", -height_bar_chart)
    .attr("x2", 0)
    .attr("y2", 0);
// end of select both x and y axis to add a grid:









g.selectAll(".bar")
    .data(neighborhood_satisfaction)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) { return x(d.factor); })
    .attr("y", function (d) { return y(d.satisfaction); })
    .attr("width", x.bandwidth())
    .attr("height", function (d) { return height_bar_chart - y(d.satisfaction); })
    .style("fill", function (d) { return barsColors(d) })
    .style("opacity", '0.7')
    .on('mouseover', (d, i) => {

        toggleClass(d, i + 1, true)
    })
    .on('mouseout', (d, i) => {
        toggleClass(d, i + 1, false)
    })


const recomendIllustration = document.getElementsByClassName('recommendedFace')[0];
const neutralIllustration = document.getElementsByClassName('neutralFace')[0];
const notRecommendedIllustration = document.getElementsByClassName('notRecommendedFace')[0];


d3.selectAll(".bar").each(function () {

    const satisfact = this.__data__.satisfaction;
    const factor = this.__data__.factor;

    let satisfactIllustration;

    if (satisfact === 'Recommended') {
        satisfactIllustration = recomendIllustration.cloneNode(true);
    } else if (satisfact === 'Neutral') {
        satisfactIllustration = neutralIllustration.cloneNode(true);
    } else if (satisfact === 'Not recommended') {
        satisfactIllustration = notRecommendedIllustration.cloneNode(true);
    }

    var xPosition = x(factor)
    var yPosition = y(satisfact)

    satisfactIllustration.setAttribute("x", xPosition);
    satisfactIllustration.setAttribute("y", yPosition - 30);
    satisfactIllustration.setAttribute("width", x.bandwidth());
    satisfactIllustration.setAttribute("height", "20px");
    satisfactIllustration.setAttribute("position", "relative");


    var foreignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
    foreignObject.setAttribute("x", xPosition);
    foreignObject.setAttribute("y", yPosition - 43);
    foreignObject.setAttribute("width", x.bandwidth());
    foreignObject.setAttribute("height", "40px");
    foreignObject.setAttribute("position", "relative");


    var img = document.createElement('img');
    img.src = 'http://www.clker.com/cliparts/P/Z/w/n/R/W/red-smiley-face-hi.png';
    img.setAttribute("height", "100%");
    img.setAttribute("width", "100%");
    foreignObject.appendChild(img)

    this.parentNode.insertBefore(satisfactIllustration, this.nextSibling);

});



var listSelection = d3.select('#legends')
    .selectAll('li')
    .data(neighborhood_satisfaction)
    .enter()
    .append('li')
    .attr('class', 'factorDescription')
    .style('font-size', '12px')
    .style("font-weight", 900)
    .text((d) => {
        return d.factor + ': ';
    })

    .on('mouseover', (d, i) => {
        toggleClass(i + 1, true)
    })
    .on('mouseout', (d, i) => {
        toggleClass(i + 1, false)
    })
    .append("tspan")
    .style("font-weight", 300)
    .text((d) => {
        return d.description;
    })



function wrap(text, width_bar_chart) {
    text.each(function () {

        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")



        while (word = words.pop()) {
            line.push(word)
            tspan.text(line.join(" "))
            if (tspan.node().getComputedTextLength() > width_bar_chart) {
                line.pop()
                tspan.text(line.join(" "))
                line = [word]
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
            }
        }

    })
}
// end of display the neighborhood satisfaction chart 













// add event listener to the prev and next image arrowws

var favPlaces = user.favoritePlaces;

let imagesArray = []

for (let y = 0; y < favPlaces.length; y++) {
    let imagesArray_ = [];
    let placeImage = favPlaces[y].placeImage;
    for (let f = 0; f < placeImage.length; f++) {
        imagesArray_.push(placeImage[f]);
    }
    imagesArray.push(imagesArray_);
}

var nextPhotoArrows = document.getElementsByClassName('fa-arrow-circle-right');
var prevPhotoArrows = document.getElementsByClassName('fa-arrow-circle-left');

let imagesFlag = 0;

let clickedDivIndex = 0;

function changePhotos(e, r) {

    var neihborhoodImage = document.getElementsByClassName('neihborhood-image')[0];

    var clickedElement = e.target;
    var divParentElement = clickedElement.parentElement;
    var divParentElement2 = divParentElement.parentElement;
    var divParentElement3 = divParentElement2.parentElement;
    var divParentElement4 = divParentElement3.parentElement;
    var divIndex = Array.prototype.indexOf.call(divParentElement4.children, divParentElement3);

    let divOfImages = divParentElement.children[1];

    if (divIndex != clickedDivIndex) {

        clickedDivIndex = divIndex;

        if (divOfImages.className.indexOf('clicked') > -1) {
            let lastClickedIndex = parseInt(divOfImages.className.substring(divOfImages.className.length - 1, divOfImages.className.length));

            if (lastClickedIndex === divOfImages.children.length - 1) {

                imagesFlag = 0;
            } else if (lastClickedIndex < divOfImages.children.length - 1) {

                imagesFlag = lastClickedIndex + 1;
            }

        } else if (divOfImages.className.indexOf('clicked') === -1) {
            imagesFlag = 1;
        }

    } else if (clickedElement.className.indexOf('fa-arrow-circle-right') > -1 && imagesFlag < divOfImages.children.length - 1) {
        // when the user clicks the next arrow and imagesFlag is lower than the amount of img elements under divParentElement, then -> imagesFlag + 1 
        imagesFlag = imagesFlag + 1;

    } else if (clickedElement.className.indexOf('fa-arrow-circle-left') > -1 && imagesFlag > 0) {
        // when the user clicks the prev arrow and imagesFlag is greater than 0, then -> imagesFlag - 1 
        imagesFlag = imagesFlag - 1;

    } else if (clickedElement.className.indexOf('fa-arrow-circle-right') > -1 && imagesFlag === divOfImages.children.length - 1) {
        // when the user clicks the next arrow  and imagesFlag is equal to the amount of img elements under divParentElement, then -> imagesFlag = 0;
        imagesFlag = 0;

    } else if (clickedElement.className.indexOf('fa-arrow-circle-left') > -1 && imagesFlag === 0) {
        // when the user clicks the previous arrow and imagesFlag is equal to 0, then ->  divParentElement.children.length - 2
        imagesFlag = divOfImages.children.length - 1;
    }



    for (var r = 0; r < divOfImages.children.length; r++) {
        divOfImages.children[r].style.display = 'none';
    }



    divOfImages.className = 'divOfImages clicked';


    divOfImages.children[imagesFlag].style.display = 'inline';
    //divOfImages.children[imagesFlag].style.height = '100%';
    // divOfImages.children[imagesFlag].style.width = '100%';

    divOfImages.className = divOfImages.className + ' ' + imagesFlag;

    //console.log(divOfImages);
    //console.log(divOfImages.children[imagesFlag]);
    //console.log(imagesFlag);

}





for (let f = 0; f < nextPhotoArrows.length; f++) {
    nextPhotoArrows[f].addEventListener('click', changePhotos);
}

for (let f = 0; f < prevPhotoArrows.length; f++) {
    prevPhotoArrows[f].addEventListener('click', changePhotos);
}

//nextPhotoArrow.addEventListener('click', changePhotos);
//prevPhotoArrow.addEventListener('click', changePhotos);
//end of  add event listener to the prev and next image arrowws


/*

                <% for(var e = 0; e < user.favoritePlaces.length; e++){ %>

                    <% let numOfPhotos = user.favoritePlaces[e].numberOfPhotos  %>

                    <div class='neighborhood-description'>
                        <div class='neighborhood-content'>
                            <h4> <%- user.favoritePlaces[e].place%> </h4>
                            <div class='neihborhood-image'>
                                <i class="fas fa-arrow-circle-left"></i>       
                                <div class ='divOfImages'>
    
                                    <% for(let q = 0; q < numOfPhotos ; q ++){ %>

                                        <img src="data:image/png;base64,<%= user.imagesFormated[q]%>" />   
                                        
                                        <% user.imagesFormated.splice(q,1) %>
                                        <% q-- %>

                                    <% } %>

                                </div>
                                <i class="fas fa-arrow-circle-right"></i>
                            </div>
                            <p class='neihborhood-text'>
                                <%- user.favoritePlaces[e].description %>
                            </p> 
                        </div>
                    </div>

                <% } %>

*/

//grid-column:<%= startColumn %> / <%= endColumn %>