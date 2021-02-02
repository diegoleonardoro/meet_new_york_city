
function filterSelection(resValues) {

    var arrayOfLabelsWithFilterWord = resValues[0]; // represents the filterDivs corresponding to the elements that was selected by the user.
    var displayedLabel = resValues[1];


    function moveDisplayedLabels() { // this function will simply move the elements that were being displayed to the right.
        return new Promise((resolve, reject) => {
            for (let r = 0; r < displayedLabel.length; r++) {

                let elementParent = displayedLabel[r].parentElement;//  HERE IS WHERE THE LABELDIV THAT SHOULD DISSAPEAR

                if (elementParent.className.indexOf("likertScale") == -1) {
                    displayedLabel[r].style.transform = "translatex(-300%)";//  LABEL 
                }

                if (r === displayedLabel.length - 1) {
                    resolve("Sucess")
                }



            }
        })

    }



    moveDisplayedLabels().then((resValue) => {


        for (let r = 0; r < displayedLabel.length; r++) { // when we get to the likert scale, this loop will run just once.
            let elementParent = displayedLabel[r].parentElement; // represents the labelDiv of the filterDivs that were being displayed.


            if (elementParent.className.indexOf("likertScale") == -1) {

                elementParent.className = elementParent.className.replace("show", "");





            } else if (elementParent.className.indexOf("likertScale") > -1) {


                const sectionDiv = elementParent.children; // sectionDiv that encompases all the options
                const divLabels = sectionDiv[0].childNodes; // 


                const checkedInputs = []; // this containts all the input elements under the likertScale that were checked. In their class name, they contain the filter word to display the next elements. 
                elementParent.className = elementParent.className.replace("show", "")

                for (var i = 0; i < divLabels.length; i++) {

                    if (divLabels[i].nodeName === "FIELDSET") {
                        const ULs = divLabels[i].children;
                        const LIs = ULs[0].children;


                        for (var c = 0; c < LIs.length; c++) {
                            const inputs = LIs[c].children[0];

                            if (inputs.checked) {
                                //console.log("lolis");
                                const filterWord = inputs.className.split(" ")[1] // We get the filter word of the elements that were checked
                                checkedInputs.push(filterWord);
                            }
                        }
                    }
                }

                console.log(checkedInputs);

                const filterDivs = document.querySelectorAll(".filterDiv");
                // THE ARROW EVENT FUNCTION SHOULD BE CALLED AFTER THE FOLLOWING LOOP FINISHES USING A PROMISE?
                for (var b = 0; b < checkedInputs.length; b++) { // iterate through all checkedInputs. In total there are 4 

                    // console.log(checkedInputs[b]) // prints what it is supposed to print 
                    for (var u = 0; u < filterDivs.length; u++) { // iterate through all filterDivs. In total there are around 80. This iteration will be repeated 4 times. 
                        // console.log(filterDivs[u]); // prints what it is supposed to print.
                        let elementParent = filterDivs[u].parentElement; // elementParent is the element with labelDiv in its class name
                        //console.log(elementParent);
                        if (filterDivs[u].className.indexOf(checkedInputs[b]) > -1) { // we are entering this if statement 4 times, and each time, we print ALL 
                            elementParent.className = elementParent.className + " show";
                        }
                    }
                }

                //arrowEvent(checkedInputs); //<<<<<-----

                arrowEvent().then((resValue) => { // THIS WILL BE TRIGGERED WHEN THE DISPLAYED ELEMENT IS THE LIKER SCALE

                    var labelsWithFilterWord = resValue[0];
                    var displayedLabel = resValue[1];
                    filterSelection([labelsWithFilterWord, displayedLabel]);
                })


            }
        }

        addClass(arrayOfLabelsWithFilterWord, 300);

    })
}




function addClass(elements, labelLength) { // elements ---->>> arrayOfLabelsWithFilterWord
    function addShow() {
        return new Promise((resolve, reject) => {
            for (var i = 0; i < elements.length; i++) {
                var elementParent = elements[i].parentElement
                elementParent.className = elementParent.className + " show"; // The word "show" is being added here to all labels with the filter word. This is being done before we call arrowEvent again.
                //elementParent.style.width = labelLength + 70 + "px"; // ---->> not doing anything. 
                resolve("Sucess"); // should I add an event delay here...
            }
        })
    }

    addShow().then((resValue) => {
        return arrowEvent();
    }).then((resValue) => {

        var labelsWithFilterWord = resValue[0];
        var displayedLabel = resValue[1];

        filterSelection([labelsWithFilterWord, displayedLabel]);

    })
}



function validateForm(displayedElement) {

    var valid = true;


    if (displayedElement.length == 1) {

        // In the following we are saying "if the user has not written anything, then return FALSE"
        var inputValue = displayedElement[0].children[0].value;
        if (inputValue == "") {
            valid = false;
            return [valid, 0];
        } else {
            return [valid, 0];
        }


    } else if (displayedElement[0].parentElement.className.indexOf("seeYrslfOpertingBsnsInFuture") > -1 || displayedElement[0].parentElement.className.indexOf("submitButton") > -1) {

        for (var s = 0; s < displayedElement.length; s++) {

            var inputValue = displayedElement[s].children[0].value;

            if (inputValue == "") {

                valid = false;
                return [valid, 0];
            }

            return [valid, 0];

            // if all elements have an input then, we will return true

        }

    } else if (displayedElement.length > 1) { // displayedElement will be greater than one when the filterDivs that are displayed are checkboxes

        valid = false;

        for (var v = 0; v < displayedElement.length; v++) {

            let displayedElementNextSibling = displayedElement[v].nextElementSibling; // here we are getting the input value, which we will need to know if the input was checked. 

            // the moment we find an input that was checked we will return true
            // if no input was checked we will retunr false 
            if (displayedElementNextSibling.checked) {
                valid = true;
                return [valid, v];
            }
            if (v == displayedElement.length - 1) {
                // console.log("label was NOT checked!")


                return [valid, v];
            }
        }
    }
}






function arrowEvent() { // filterWords = ""

    let imageDiv = document.getElementById("divImage");
    let labelsFilterDiv = document.querySelectorAll(".filterDiv");
    let labelsWithFilterWord = [];
    let labelsShown = [];

    return new Promise((resolve, reject) => {

        function arrowEventHandler() {

            for (var i = 0; i < labelsFilterDiv.length; i++) {

                let displayedLabeldiv = labelsFilterDiv[i].parentElement; //  labelDiv of the corresponding filterDiv element
                let displayedLabelSection = displayedLabeldiv.parentElement;
                let element = labelsFilterDiv[i];



                if (displayedLabeldiv.className.indexOf("show") > -1) { // HERE WE ARE CHECKING IF THE LABELDIV ELEMENT CONTAINS THE WORD "SHOW" 

                    // ***** WHEN WE GET TO THE QUESTIONS AFTER THE LIKERT SCALE, WE WILL ENTER THIS IF STATEMENT 4 TIMES, BECAUSE THERE ARE FOUR LABELS WITH THE WORD "SHOW" 

                    labelsShown.push(element); // push the filterDiv element if its parent contains the word "show".

                    var filterWord = displayedLabeldiv.className.split(" ")[1];  // ***** THE FILTER WORD WILL BE THE SAME FOR 4 TIMES "seeYrslfOpertingBsnsInFuture"

                    //console.log(filterWord); // GOOD

                    let labelsWithFilterWordIndividualArray = [] // here we are storing all the 

                    for (let q = 0; q < labelsFilterDiv.length; q++) {

                        if (labelsFilterDiv[q].className.indexOf(filterWord) > -1) {
                            labelsWithFilterWordIndividualArray.push(labelsFilterDiv[q]); // ***** we will push all filterDivs that contain the filter word
                        }
                        if (q === labelsFilterDiv.length - 1) {
                            labelsWithFilterWord.push(labelsWithFilterWordIndividualArray);

                        }
                    }

                    //console.log(labelsWithFilterWord);

                    // we will enter this if statement for as many elements are displayed 
                    // and every time we enter it, there will be a new filter word
                    // and a new list of filterDics with the filter words will be pushed to labelsWithFilterWord 


                } else if (i === labelsFilterDiv.length - 1) { // when the iteration reaches the end, we will validate whether the user has given an input or not 

                    var formValidation = validateForm(labelsShown); // ***** labelsShown WILL CONTAIN THE SAME FILTER DIV 4 TIMES. 

                    var valid = formValidation[0]; // contains true or false depending on whether the user gave an input or not 
                    var arrayIndex = formValidation[1]; // represents the index of the checked values 

                    if (valid) {

                        // the number of lists inside "labelsWithFilterWord" will be the same as the number of elements inside "labelsShown".

                        imageDiv.removeEventListener("click", arrowEventHandler);
                        resolve([labelsWithFilterWord[arrayIndex], labelsShown]); // we resolve the label that was checked (in the case of the checkboxes)

                    } else {
                        imageDiv.removeEventListener("click", arrowEventHandler)
                        alert("insert input")

                        arrowEvent().then((resValue) => {
                            var labelsWithFilterWord = resValue[0];
                            var displayedLabel = resValue[1];
                            filterSelection([labelsWithFilterWord, displayedLabel]);
                        })

                    }
                }
            }
        }

        for (var i = 0; i < imageDiv.nextElementSibling.length; i++) {
            const inputFilterDiv = imageDiv.nextElementSibling[i].parentElement;
            const inputLabelDiv = inputFilterDiv.parentElement
        }

        imageDiv.addEventListener("click", arrowEventHandler)

    })
}



arrowEvent().then((resValue) => {


    var labelsWithFilterWord = resValue[0];
    var displayedLabel = resValue[1];
    filterSelection([labelsWithFilterWord, displayedLabel]); // labelsWithFilterWord represents the labels that correspond to the element that selected by the user.


});












// Submittis form values:

var form = document.getElementById("form_");

form.addEventListener("submit", function (e) {

    e.preventDefault()

    var formElementsLength = form.elements.length;

    let formValues = {};
    for (var i = 0; i < formElementsLength; i++) {
        if (form.elements[i].type === "text" && form.elements[i].value != "") {
            formValues[form.elements[i].name] = form.elements[i].value
        } else if (form.elements[i].type === "radio" && form.elements[i].checked) {
            formValues[form.elements[i].name] = form.elements[i].value

        }
    }

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),

    };



    console.log(formValues);

    fetch('/inputs', options);


})



// ==== GEOCODING FUNCTION WITH "HERE" ==== //
var platform = new H.service.Platform({
    'apikey': 'SdaD00BDUGuznS-sRFe7C_zPT3YkMPgcHBlHnbQL85A'
});
var service = platform.getSearchService();

// ---- function --- //
function getPlaceInfo(placeAddress, callback) { // I included the operation inside a function 
    setTimeout(() => {
        service.geocode({
            q: placeAddress
        }, (result) => {
            callback(null, result)
        }, alert);
    }, 1000);
};


// ====================== MAP ====================== //

(function () {

    var height = 600,
        width = 900,
        projection = d3.geoMercator(), // geoMercator() is a way of projecting the map. 
        nyc = void 0,
        map,
        streetMap = void 0,
        nycStreets = void 0;

    // ------------ Zoom ------------ //
    // Create the function that will allow the zoom to happen:
    // d3.event.transform.k: This defines the zoom level in terms of an SVG scale.
    // d3.event.transform.x and .y: These define the positions of the map in relation to the mouse in terms of an SVG translate.
    var zoomed = function () {
        map.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ") scale(" + d3.event.transform.k + ")");
    }

    // set up the zoom behavior
    var zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed)
    // ------------------------------ //


    // ------------ Path & Projection ------------ //

    var path = d3.geoPath().projection(projection); // d3.geoPath() is the D3 Geo Path Data Generator helper class for generating SVG 

    // ------------------------------------------- //


    // ------------ Appending the SVG ------------ //
    var svg = d3.select("#map")
        .append("svg")
        .attr("class", "generalSVG")
        .attr("width", width)
        .attr("height", height)
    //.call(zoom);
    // ------------------------------------------- //


    // --------- Reading NYC's boundaries ----------- //

    d3.json('geo-data.json', function (error, data) {
        if (error) return;

        //-----------Selecting the geometry features from the json OBJ------------------//

        var districts = topojson.feature(data, data.objects.districts); // inside topojson.feature we have to put the element where the "geometries" live. 
        //------------------------------------------------------------------------------//

        // console.log("districts", districts);

        //-----------------------------FUNCTIONS---------------------------//
        var GeoID = function (d) { // Lets us assign a unique value to each element in the "districts" OBJ
            return "c" + d.id
        }
        //-----------------------------------------------------------------//
        var click = function (d) { //sets opacity to 0.3 to all paths in the "districts" OBJ except the one that is clicked 
            d3.selectAll("path").attr("fill-opacity", 0.3)
            d3.select("#" + GeoID(d)).attr("fill-opacity", 1)
            var index = districts.features.indexOf(d)
            var b = path.bounds(districts.features[index])
        }
        //-----------------------------------------------------------------//
        var findIndex = function (d) { // Finds the index of a specific element in the "districts" OBJ
            console.log(districts.features.indexOf(d));
        }
        //-----------------------------------------------------------------//

        var hover = function (d) { // Displays a tooltip when hoover a specific element in the "districts" OBJ
            var div = document.getElementById("tooltip")
            div.style.left = event.pageX + "px";
            div.style.top = event.pageY + "px";
            div.innerHTML = d.id;
        }

        //-----------------------------------------------------------------//

        var color = d3.scaleLinear()
            .domain([0, 73])
            .range(['yellow', 'orange']);

        var color = function (d, i) { // Gives a different color to the element in the "district" OBJ that belongs to CB2 Bronx
            if (d.id === 202) { return "#f49f1c" }
            else { return "#f49f1c" }
        }
        //-----------------------------------------------------------------//

        var fillOpacity = function (d, i) {// Sets opacity of 1 to the element that belongs to CB2 Bronx, and the rest reveice an opacity of 0.2
            if (d.id === 202) { return 1 }
            else { return .2 }
        }

        //-----------------------------SCALE AND TRANSLATE---------------------------//

        var b, s, t;
        projection.scale(1).translate([0, 0]);
        var b = path.bounds(districts); // bounds represent a two dimensional array : [[left, bottom], [right, top]],
        var s = .85 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
        var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
        projection.scale(s).translate(t);



        // ----------------- APPENING G ELEMENT AND INJECTING THE DATA -----------------//

        map = svg.append('g').attr('class', 'boundary'); // In this "g" tag we will include the path for the district boundaries.
        nyc = map.selectAll('path').data(districts.features);
        nyc.enter()
            .append('path')
            .attr('d', path)
            .attr("id", GeoID) // <--- Here we are assigning a unique id to every path in thr OBJ
            .style("stroke", "black")
            .style("fill-opacity", .2)
            .attr("stroke-width", .2)
            .attr("fill", "#A0A0A0")

        nyc.attr('fill', '#eee');
        nyc.exit().remove();

    });



    var showGraph = function (place) {
        d3.csv("numberofVisitors.csv", function (data) {

            const timeConv = d3.timeParse("%d-%b-%Y");
            const width_ = 570;
            const height_ = 300;
            const margin_ = 5;
            const padding_ = 5;
            const adj_ = 30;

            const slices = data.columns.slice(1).map(function (id) {
                return {
                    id: id,
                    values: data.map(function (d) {
                        return {
                            date: timeConv(d.date),
                            measurement: +d[id]
                        };
                    })
                }
            });

            var currentPoint = function () {
                for (var i = 0; i < slices.length; i++) {
                    if (slices[i].id === place) {
                        return slices[i]
                    }
                }
            }

            console.log("slices", slices)
            console.log(currentPoint())

            const xScale = d3.scaleTime().range([0, width_]);
            const yScale = d3.scaleLinear().rangeRound([height_, 0]);


            xScale.domain(d3.extent(data, function (d) {
                return timeConv(d.date)
            }));

            yScale.domain([(0), d3.max(slices, function (c) {
                return d3.max(c.values, function (d) {
                    return d.measurement + 4;
                })
            })
            ]);

            const svg_ = d3.select("#tooltip")
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                //.attr("width", width_ )
                //.attr("height", height_  )
                .attr("viewBox", "-"
                    + adj_ + " -"
                    + adj_ + " "
                    + (width_ + adj_ * 3) + " "
                    + (height_ + adj_ * 3))
                .style("padding", padding_)
                .style("margin", margin_)
                .classed("svg-content", true);



            const yaxis = d3.axisLeft()
                .scale(yScale)
                .ticks((slices[0].values).length); // This part specifies a set number of ticks for the y axis (14, or as many as there are array elements / csv rows).

            const xaxis = d3.axisBottom()
                .ticks(d3.timeDay.every(1)) // The format of displayed dates will show the day and the abbreviated month for each tick.
                .tickFormat(d3.timeFormat('%b %d')) // The x axis a tick will be displayed with a granularity of a "day", every day.
                .scale(xScale);



            svg_.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + height_ + ")")
                .call(xaxis)


            svg_.append("g")
                .attr("class", "axis")
                .call(yaxis)
                //this you append
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("dy", ".75em")
                .attr("y", 6)
                .style("text-anchor", "end")
                .text("Frequency")


            const line = d3.line()
                .x(function (d) { return xScale(d.date); })
                .y(function (d) { return yScale(d.measurement); })


            const lines = svg_.selectAll("lines")
                .data([currentPoint()]) // <=====================---------------------------
                .enter()
                .append("g");


            lines.append("path")
                .attr("d", function (d) { return line(d.values); })
                .style("fill", "none")
                .style("stroke", "white")

        })
    }
})();

