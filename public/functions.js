
function filterSelection(resValues) {

    // Select SVG, arrow elements and text elements to be re positioned 
    let nextArrow = document.getElementById("nextSecArrow");
    let nextText = document.getElementById("nextText");


    let prevArrow = document.getElementById("prevArrow");
    let prevText = document.getElementById("prevText");


    //let arrowSvg = document.getElementById("arrowSvg");

    let arrowSvgBoundingBox = arrowSvg.getBoundingClientRect();
    let arrowSvgHeight = arrowSvgBoundingBox.height;
    let arrowSvgWidth = arrowSvgBoundingBox.width;

    //console.log(arrowSvgBoundingBox)


    var arrayOfLabelsWithFilterWord = resValues[0]; // empty array 
    var displayedLabel = resValues[1]; // array: class="filterDiv nghbrhdStsfactnScale" (the div that contains the h1 labels and fieldsets)



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
            let elementParent = displayedLabel[r].parentElement;

            console.log(elementParent); // elementParent: div class="labelDiv labelDivCheckBox likertScale " ( contains a div, h3, labels and fieldsets )

            if (elementParent.className.indexOf("likertScale") == -1) {

                elementParent.className = elementParent.className.replace("show", "");

            } else if (elementParent.className.indexOf("likertScale") > -1) {

                console.log("pass likert") // logged when it is supposed to. 

                const sectionDiv = elementParent.children;
                const divLabels = sectionDiv[0].childNodes;


                console.log(divLabels); // contains all the h1, labels and fieldset elements 


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
                                const filterWord = inputs.className.split(" ")[1]
                                checkedInputs.push(filterWord);
                            }
                        }
                    }
                }

                console.log(checkedInputs) // contains filter words 


                // Show elements that contain filter word
                const filterDivs = document.querySelectorAll(".filterDiv");

                const labelsWithFilterWord = []
                for (var b = 0; b < checkedInputs.length; b++) {

                    for (var u = 0; u < filterDivs.length; u++) {
                        let elementParent = filterDivs[u].parentElement;
                        if (filterDivs[u].className.indexOf(checkedInputs[b]) > -1) {
                            // console.log(filterDivs[u]);// Prints all the elements that contain the filter word
                            elementParent.className = elementParent.className + " show";
                            labelsWithFilterWord.push(filterDivs[u]);
                        }
                    }
                }

                const filterDivParent = labelsWithFilterWord[0].parentElement;
                const labelDivSectionParent = filterDivParent.parentElement;

                const viewportwidth = window.innerWidth;

                console.log(labelDivSectionParent);



                let labelDivSectionParentCoords

                labelDivSectionParentCoords = labelDivSectionParent.getBoundingClientRect()


                // Reposition section 
                const viewportwidthHalf = viewportwidth / 2;
                const elementHalf = labelDivSectionParentCoords.width / 2;
                const sectionPosition = viewportwidthHalf - elementHalf;
                labelDivSectionParent.style.left = sectionPosition + "px";


                labelDivSectionParentCoords = labelDivSectionParent.getBoundingClientRect()


                //Re position the arrow svg downwards
                const downwardsMove = 17 * (labelDivSectionParent.children.length); // -2 
                arrowSvg.style.top = downwardsMove + "px";


                //Re size the arrow svg horizontally 
                arrowSvg.style.width = labelDivSectionParentCoords.width + "px";


                // Re position arrow svg on x axis
                arrowSvg.style.left = labelDivSectionParentCoords.x + "px";




                // Set new d values for the arrow

                let nextArrow = document.getElementById("nextSecArrow");
                let nextText = document.getElementById("nextText");

                const d = `M ${labelDivSectionParentCoords.width - 5} 40 L ${labelDivSectionParentCoords.width - 50} 75, ${labelDivSectionParentCoords.width - 50} 5 Z`;
                //  x=-5, x=-50, x=-50

                // Set new x value for the text label 
                const textXCoord = labelDivSectionParentCoords.width - 46;

                // nextArrowDattr.setAttribute('d', d);
                nextArrow.setAttribute('d', d);
                nextText.setAttribute('x', textXCoord);






                // resize arrow svg and 





                arrowEvent().then((resValue) => { // THIS WILL BE TRIGGERED WHEN THE DISPLAYED ELEMENT IS THE LIKER SCALE
                    var labelsWithFilterWord = resValue[0];
                    var displayedLabel = resValue[1];
                    filterSelection([labelsWithFilterWord, displayedLabel]);
                })

            }
        }


        //console.log(displayedLabel);
        if (displayedLabel[0].parentElement.className.indexOf("likertScale") === -1) {
            addClass(arrayOfLabelsWithFilterWord, 300);
        }



    })




}




function addClass(elements, labelLength) { // elements ---->>> arrayOfLabelsWithFilterWord



    function addShow() {
        return new Promise((resolve, reject) => {


            // ===>> Show the elements that contain the filter word

            console.log(elements.length);
            for (var i = 0; i < elements.length; i++) {
                var elementParent = elements[i].parentElement;// this represents labelDivs
                elementParent.className = elementParent.className + " show"; // The word "show" is being added here to all labels with the filter word. This is being done before we call arrowEvent again.

            }

            let labelDivElement = elements[0].parentElement;

            console.log(labelDivElement);

            // just text input: parentElement = label div 
            // text and check points with header: class="labelDiv headingQuestion show"
            // likert scale:  parentElement =  <div class="labelDiv labelDivCheckBox likertScale">



            if (labelDivElement.className.indexOf("headingQuestion") > -1) {// <<< re position header. Will only enter here with questions with header.
                var labelDivElementHeaderInSect = elements[1].parentElement;
                var sectionElementHeaderInSect = labelDivElementHeaderInSect.parentElement; // section element to be re positioned 

                //console.log(elements[1]);

                const elementDimentions = elements[1].getBoundingClientRect();//here we are getting the dimentions of the filetDiv 
                const headerDimensions = labelDivElement.getBoundingClientRect(); // labelDiv dimensions 
                const viewportwidth = window.innerWidth;

                // Reposition section 
                var viewportwidthHalf = viewportwidth / 2;
                var elementHalf = elementDimentions.width / 2;
                var sectionPosition = viewportwidthHalf - elementHalf;
                sectionElementHeaderInSect.style.left = sectionPosition + "px";

                // Reposition the header
                var headerHalf = headerDimensions.width / 2;
                var headerPosition = viewportwidthHalf - headerHalf;
                labelDivElement.style.left = headerPosition + "px";

                //console.log(labelDivElement);

            } else {
                let sectionElement = labelDivElement.parentElement;
                //console.log(sectionElement);
            }





            // ===>> The following two if statements will resize and reposition the arrow svg, the arrow and the text arrows.
            if (elements.length === 1 && elements[0].parentElement.className.indexOf("likertScale") === -1) {

                // we'll only enter here if we are in a text element with no header

                const originalPosition = 220.90625;

                arrowSvg.style.top = originalPosition;


            } else { //<<<<<< PASS LIKERT WE'LL ENTER HERE 



                let nextArrow = document.getElementById("nextSecArrow");
                let nextText = document.getElementById("nextText");


                let elementBoundingBox;

                // Get the correct element bounding client rect depending on whether the shown element is likert scale or not 
                if (elements[0].parentElement.className.indexOf("likertScale") > -1) {


                    // If we are in a liker scale 
                    //console.log(elements[0].parentElement.getBoundingClientRect());
                    //console.log(elements[0]);


                    var r = elements[0].parentElement;


                    var pp = r.parentElement;


                    console.log(elements[0].children[2]);


                    elementBoundingBox = elements[0].getBoundingClientRect(); // In the case of the likert scale, "elements[0]" will represent the div element that contains the h1, labels and fieldsets


                    console.log(elementBoundingBox);


                    // elementBoundingBox is showing different coordinates from the object when I see it on the page.


                    // Re position the entire element to the middle of the page 
                    const viewportwidthHalf = window.innerWidth / 2;
                    const elementWidthHalf = elementBoundingBox.width / 2;
                    const elementXposition = viewportwidthHalf - elementWidthHalf;
                    console.log(viewportwidthHalf);
                    console.log(elementWidthHalf);
                    console.log(elementXposition);
                    const parent = elements[0].parentElement;
                    const parentParent = parent.parentElement;// section element. 
                    //console.log(elementBoundingBox.width);
                    parentParent.style.left =  elementXposition+ "px"; //elementXposition

                    // When I added 100 +"px" the positioned changed satisfyingly


                    //Re position the arrow svg downwards
                    const originalPosition = 220.90625;
                    const downwardsMove = 85 * (elements[0].children.length); // -2 
                    arrowSvg.style.top = downwardsMove + "px";






                    elementBoundingBox = parentParent.getBoundingClientRect();



                } else {//<<<<<<<<<<<<<<<< PASS LIKERT WE'LL ENTER HERE 

                    elementBoundingBox = elements[1].getBoundingClientRect(); // By adding 1 instead of 0 we will be getting the BoundingClientRect of the fist label and not the header. 

                    //console.log(elements[1].parentElement.getBoundingClientRect());


                    //Re position the arrow svg downwards
                    const originalPosition = 220.90625;
                    const downwardsMove = 74 * (elements.length - 1);// Minus one because we want to exclude the header.
                    arrowSvg.style.top = originalPosition + downwardsMove;

                }


                let elelementHeight = elementBoundingBox.height;
                let elementWidth = elementBoundingBox.width;
                let elementXposition = elementBoundingBox.x;



                //Re size the arrow svg horizontally 
                arrowSvg.style.width = elementWidth + "px";

                // Re position arrow svg on x axis
                arrowSvg.style.left = elementXposition + "px";


                // Set new d values for the arrow
                const d = `M ${elementWidth - 5} 40 L ${elementWidth - 50} 75, ${elementWidth - 50} 5 Z`;
                //  x=-5, x=-50, x=-50

                // Set new x value for the text label 
                const textXCoord = elementWidth - 46;

                // nextArrowDattr.setAttribute('d', d);
                nextArrow.setAttribute('d', d);
                nextText.setAttribute('x', textXCoord);


            }

            resolve("Sucess", elements); // should I add an event delay here...

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


    if (displayedElement.length == 1 || displayedElement.length == 2) {

        let inputValue

        if (displayedElement.length == 1) {

            inputValue = displayedElement[0].children[0].value;

            console.log(inputValue); // This prints undefined

            if (inputValue == "") {
                valid = false;
                return [valid, 0];
            } else {
                return [valid, 0];
            }

        } else if (displayedElement.length == 2) {

            inputValue = displayedElement[1].children[0].value;

            if (inputValue == "") {
                valid = false;
                return [valid, 1]; // We return 1 here because if there is a header and a text input, we want the text input to be resolved in the arrowEvent()
            } else {
                return [valid, 1];
            }
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

            //console.log(displayedElement[v].parentElement.className);

            if (displayedElement[v].parentElement.className.indexOf("headingQuestion") > -1) {
                continue;
            }

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






function arrowEvent() {


    let imageDiv = document.getElementById("nextSecArrow");
    let nextText = document.getElementById("nextText");

    let prevArrow = document.getElementById("prevArrow");
    let prevText = document.getElementById("prevText");

    let labelsFilterDiv = document.querySelectorAll(".filterDiv");

    let labelsWithFilterWord = [];
    let labelsShown = [];


    const arrowMouseover = function (textElement, arrowElement) {
        textElement.style.fill = "E48878";
        arrowElement.style.fill = "red";
        arrowElement.style.fillOpacity = "0.1";
    }

    const arrowMouseout = function (textElement, arrowElement) {
        textElement.style.fill = "black";
        arrowElement.style.fill = "white";
        arrowElement.style.fillOpacity = "0.4";
    }


    // Event listeners to next arrow
    imageDiv.addEventListener("mouseover", () => {
        arrowMouseover(nextText, imageDiv);
    });

    imageDiv.addEventListener("mouseout", () => {
        arrowMouseout(nextText, imageDiv);
    });

    // Event listeners to prev arrow
    prevArrow.addEventListener("mouseover", () => {
        arrowMouseover(prevText, prevArrow);
    });

    prevArrow.addEventListener("mouseout", () => {
        arrowMouseout(prevText, prevArrow);
    });




    return new Promise((resolve, reject) => {

        function arrowEventHandler() { // This function will only be triggered when there is a click on the arrow 

            for (var i = 0; i < labelsFilterDiv.length; i++) {


                let displayedLabeldiv = labelsFilterDiv[i].parentElement; //  labelDiv of the corresponding filterDiv element
                let displayedLabelSection = displayedLabeldiv.parentElement;
                let element = labelsFilterDiv[i];



                if (displayedLabeldiv.className.indexOf("show") > -1) {



                    console.log(displayedLabeldiv); // div class="labelDiv labelDivCheckBox likertScale " ( the div that contains the div h1 labels and fieldset )

                    labelsShown.push(element);

                    console.log(element);// class="filterDiv nghbrhdStsfactnScale" (the div that contains the h1 labels and fieldsets)

                    var filterWord = displayedLabeldiv.className.split(" ")[1];

                    let labelsWithFilterWordIndividualArray = [] // here we are storing all the 

                    console.log(filterWord); // labelDivCheckBox



                    for (let q = 0; q < labelsFilterDiv.length; q++) { // all the labels with filter div 

                        if (labelsFilterDiv[q].className.indexOf(filterWord) > -1) { // if the filter div's class name conatins "labelDivCheckBox"

                            labelsWithFilterWordIndividualArray.push(labelsFilterDiv[q]);
                        }
                        if (q === labelsFilterDiv.length - 1) {

                            labelsWithFilterWord.push(labelsWithFilterWordIndividualArray);
                        }

                    }

                    console.log(labelsWithFilterWord)

                } else if (i === labelsFilterDiv.length - 1) { // when the iteration reaches the end, we will validate whether the user has given an input or not 

                    console.log(labelsShown); // labelsShown:  class="filterDiv nghbrhdStsfactnScale" (the div that contains the h1 labels and fieldsets)


                    var formValidation = validateForm(labelsShown);  // In the first click ===>> labelsShown contains just the name label 


                    var valid = formValidation[0]; // contains true or false depending on whether the user gave an input or not 
                    var arrayIndex = formValidation[1]; // represents the index of the checked values 

                    console.log(valid); // true
                    console.log(arrayIndex); // 0 

                    if (valid) {


                        imageDiv.removeEventListener("click", arrowEventHandler);
                        console.log(labelsWithFilterWord[arrayIndex]); // empty array 
                        resolve([labelsWithFilterWord[arrayIndex], labelsShown]);


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

        console.log("==================")
    })


}


arrowEvent().then((resValue) => {


    var labelsWithFilterWord = resValue[0];
    var displayedLabel = resValue[1];

    console.log(labelsWithFilterWord); // empty array
    console.log(displayedLabel); // array: class="filterDiv nghbrhdStsfactnScale" (the div that contains the h1 labels and fieldsets)

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

