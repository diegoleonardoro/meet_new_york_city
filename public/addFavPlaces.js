import { changeImage } from '/addPicOfPlace.js';





//---------------------------------------//

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
//---------------------------------------//




const addPlace = document.getElementById('addPlaceButton');
let flag = 0;
addPlace.addEventListener('click', () => {

    var nhood = document.getElementById('neighborhoodName').value;
    var zcode = document.getElementById('zipcodeInput').value;
    var boro = document.getElementsByClassName('selectBoro')[0].value;

    flag += 1;

    var mapSvg = document.getElementById('MapSVG_');
    var placePoint = document.getElementById('placeCircle');


    var cx = placePoint.getAttribute('cx');
    var cy = placePoint.getAttribute('cy');

    let cxL,
        cyL,
        rectX,
        rectY,
        textX,
        textY,
        imageX,
        imageY;

    if (flag == 1) {

        cxL = parseFloat(cx) + 39.9443;
        cyL = parseFloat(cy) - 88.8956;
        let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        newElement.setAttribute("d", "M " + " " + cx + " " + cy + " L" + " " + cxL.toString() + " " + cyL.toString());
        newElement.style.stroke = "#000";
        newElement.style.strokeWidth = "5px";
        mapSvg.appendChild(newElement);


        //--------------------------------------//

        rectX = cxL - 3.8173;
        rectY = cyL - 43.9738;
        let newRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        newRect.setAttribute('width', 280)
        newRect.setAttribute('height', 150)
        newRect.setAttribute('fill', 'white')
        newRect.setAttribute('stroke', 'black')
        newRect.setAttribute('stroke-width', 1)
        newRect.setAttribute('x', rectX)
        newRect.setAttribute('y', rectY)
        mapSvg.appendChild(newRect);

        //--------------------------------------//

        var inputAddFavoritePlacesAddress = document.getElementsByClassName('nameOfPlace')[0];
        var inputAddFavoritePlacesDescription = document.getElementsByClassName('textareaFavPlaceDescription')[0];


        var inputAddFavoritePlacesAddressValue = inputAddFavoritePlacesAddress.value;
        var inputAddFavoritePlacesDescriptionValue = inputAddFavoritePlacesDescription.value;


        inputAddFavoritePlacesAddress.value = ' ';
        inputAddFavoritePlacesDescription.value = ' ';


        // place address:
        textX = rectX + 10;
        textY = rectY + 20;
        let textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        textElement.setAttribute('x', textX);
        textElement.setAttribute('y', textY);
        textElement.setAttribute('width', 50);
        textElement.setAttribute('class', 'favoritePlace' + flag);
        textElement.setAttribute('name', 'place');
        textElement.style.fill = 'black';
        textElement.style.fontFamily = 'Calibri';
        textElement.style.fontSize = '15';
        textElement.style.fontWeight = 50;
        textElement.innerHTML = inputAddFavoritePlacesAddressValue;
        mapSvg.appendChild(textElement);


        // place description:
        textY = rectY + 40;
        textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        textElement.setAttribute('x', textX);
        textElement.setAttribute('y', textY);
        textElement.setAttribute('width', 50);
        textElement.setAttribute('class', 'favoritePlace' + flag);
        textElement.setAttribute('name', 'description');
        textElement.style.fill = 'black';
        textElement.style.fontFamily = 'Calibri';
        textElement.style.fontSize = '15';
        textElement.style.fontWeight = 50;
        textElement.innerHTML = inputAddFavoritePlacesDescriptionValue;
        mapSvg.appendChild(textElement);


        // -------------------------------- place coordinates --------------------------------
        let fullAddress = `${inputAddFavoritePlacesAddressValue}, ${nhood}, ${boro}, New York, NY, ${zcode}`;
        getPlaceInfo(fullAddress, (error, response) => {
            let coords = response['items'][0]['position'];
            textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            textElement.setAttribute('class', 'favoritePlace' + flag);
            textElement.setAttribute('name', 'coordinates');
            textElement.style.display = 'none';
            textElement.innerHTML = JSON.stringify(coords);
            mapSvg.appendChild(textElement);

        })
        //---------------------------------------------------------------------------------





        //--------------------------------------//
        var imageInput = document.getElementById('preview');

        var imagesInput = document.getElementsByClassName('previewImage');

        for (var i = 0; i < imagesInput.length; i++) {

            if (imagesInput[i].className.indexOf(flag) > -1) {


                imageX = textX;
                imageY = textY + 15;
                let foreignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
                foreignObject.setAttribute("x", imageX);
                foreignObject.setAttribute("y", imageY);
                foreignObject.setAttribute("width", "180");
                foreignObject.setAttribute("height", "80");
                var newImg = document.createElement('img');
                newImg.src = imagesInput[i].src;
                newImg.setAttribute("width", imagesInput[i].width);
                newImg.setAttribute("height", imagesInput[i].height);
                newImg.setAttribute('name', 'image');
                foreignObject.appendChild(newImg);
                mapSvg.appendChild(foreignObject);

                imagesInput[i].src = '';
                imagesInput[i].setAttribute("width", 'auto');
                imagesInput[i].setAttribute("width", 'auto');


            }
        }


        inputAddFavoritePlacesAddress.value = ' ';
        inputAddFavoritePlacesDescription.value = ' ';








        var imageInputElement = document.getElementsByClassName('favoritePlace' + flag)[0];
        var imageInputElements = document.getElementsByClassName('labelPhoto favoritePlace' + flag);
        for (var x = 0; x < imageInputElements.length; x++) {
            if (imageInputElements[x].value != '') {
                //console.log(imageInputElements[x]);
                //console.log(imageInputElements[x].files);
            }
        }






        // imageInputElement represents the file input element that upload the place files 
        var imageInputElementClone = imageInputElement.cloneNode(true);
        imageInputElementClone.value = '';
        // imageInputElementClone 

        var a = flag + 1
        imageInputElementClone.setAttribute('class', 'labelPhoto ' + 'favoritePlace' + a);

        imageInputElementClone.addEventListener("change", function () {
            changeImage(this);
            // attach changeImage as an event listener to the file input that was cloned
        });


        var imageLabel = document.getElementById('imageLabel');
        imageLabel.insertBefore(imageInputElementClone, imageInputElement);
        imageInputElement.style.display = 'none';
        // attach the file input element inside the label element and after the previous file input element. 




    } else if (flag == 2) {
        cxL = parseFloat(cx) + 50.3407;
        cyL = parseFloat(cy) + 47.6287;

        let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        newElement.setAttribute("d", "M " + " " + cx + " " + cy + " L" + " " + cxL.toString() + " " + cyL.toString());
        newElement.style.stroke = "#000";
        newElement.style.strokeWidth = "5px";
        mapSvg.appendChild(newElement);


        //--------------------------------------//

        rectX = cxL - 1.21377;
        rectY = cyL - 7.498199;
        let newRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        newRect.setAttribute('width', 280)
        newRect.setAttribute('height', 150)
        newRect.setAttribute('fill', 'white')
        newRect.setAttribute('stroke', 'black')
        newRect.setAttribute('stroke-width', 1)
        newRect.setAttribute('x', rectX)
        newRect.setAttribute('y', rectY)
        mapSvg.appendChild(newRect);


        //--------------------------------------//

        var inputAddFavoritePlacesAddress = document.getElementsByClassName('nameOfPlace')[0];
        var inputAddFavoritePlacesDescription = document.getElementsByClassName('textareaFavPlaceDescription')[0];

        var inputAddFavoritePlacesAddressValue = inputAddFavoritePlacesAddress.value;
        var inputAddFavoritePlacesDescriptionValue = inputAddFavoritePlacesDescription.value;

        inputAddFavoritePlacesAddress.value = ' ';
        inputAddFavoritePlacesDescription.value = ' ';

        textX = rectX + 10;
        textY = rectY + 20;
        let textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        textElement.setAttribute('x', textX);
        textElement.setAttribute('y', textY);
        textElement.setAttribute('width', 50);
        textElement.setAttribute('class', 'favoritePlace' + flag);
        textElement.setAttribute('name', 'place');
        textElement.style.fill = 'black';
        textElement.style.fontFamily = 'Calibri';
        textElement.style.fontSize = '15';
        textElement.style.fontWeight = 50;
        textElement.innerHTML = inputAddFavoritePlacesAddressValue;
        mapSvg.appendChild(textElement);



        textY = rectY + 40;
        textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        textElement.setAttribute('x', textX);
        textElement.setAttribute('y', textY);
        textElement.setAttribute('width', 50);
        textElement.setAttribute('class', 'favoritePlace' + flag);
        textElement.setAttribute('name', 'description');
        textElement.style.fill = 'black';
        textElement.style.fontFamily = 'Calibri';
        textElement.style.fontSize = '15';
        textElement.style.fontWeight = 50;
        textElement.innerHTML = inputAddFavoritePlacesDescriptionValue;
        mapSvg.appendChild(textElement);


        // -------------------------------- place coordinates --------------------------------
        let fullAddress = `${inputAddFavoritePlacesAddressValue}, ${nhood}, ${boro}, New York, NY, ${zcode}`;
        getPlaceInfo(fullAddress, (error, response) => {
            let coords = response['items'][0]['position'];
            textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            textElement.setAttribute('class', 'favoritePlace' + flag);
            textElement.setAttribute('name', 'coordinates');
            textElement.style.display = 'none';
            textElement.innerHTML = JSON.stringify(coords);
            mapSvg.appendChild(textElement);

        })
        //---------------------------------------------------------------------------------


        //--------------------------------------//

        var imageInput = document.getElementById('preview');

        var imagesInput = document.getElementsByClassName('previewImage');



        for (var i = 0; i < imagesInput.length; i++) {


            if (imagesInput[i].className.indexOf(flag) > -1) {



                imageX = textX;
                imageY = textY + 15;

                let foreignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
                foreignObject.setAttribute("x", imageX);
                foreignObject.setAttribute("y", imageY);
                foreignObject.setAttribute("width", "180");
                foreignObject.setAttribute("height", "80");
                var newImg = document.createElement('img');
                newImg.src = imagesInput[i].src;
                newImg.setAttribute("width", imagesInput[i].width);
                newImg.setAttribute("height", imagesInput[i].height);
                newImg.setAttribute('name', 'image');
                foreignObject.appendChild(newImg);
                mapSvg.appendChild(foreignObject);

                imagesInput[i].src = '';
                imagesInput[i].setAttribute("width", 'auto');
                imagesInput[i].setAttribute("width", 'auto');


            }
        }

        inputAddFavoritePlacesAddress.value = ' ';
        inputAddFavoritePlacesDescription.value = ' ';








        var imageInputElement = document.getElementsByClassName('favoritePlace' + flag)[0];
        var imageInputElements = document.getElementsByClassName('labelPhoto favoritePlace' + flag);
        for (var x = 0; x < imageInputElements.length; x++) {
            if (imageInputElements[x].value != '') {
                //console.log(imageInputElements[x]);
                //console.log(imageInputElements[x].files);
            }
        }









        var imageInputElementClone = imageInputElement.cloneNode(true);
        imageInputElementClone.value = '';



        var a = flag + 1;
        imageInputElementClone.setAttribute('class', 'labelPhoto ' + 'favoritePlace' + a);

        imageInputElementClone.addEventListener("change", function () {
            changeImage(this);
        });

        var imageLabel = document.getElementById('imageLabel');

        imageLabel.insertBefore(imageInputElementClone, imageInputElement);

        imageInputElement.style.display = 'none';




    } else if (flag == 3) {
        cxL = parseFloat(cx) + 5;
        cyL = parseFloat(cy) + 210; //131 

        let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        newElement.setAttribute("d", "M " + " " + cx + " " + cy + " L" + " " + cxL.toString() + " " + cyL.toString());
        newElement.style.stroke = "#000";
        newElement.style.strokeWidth = "5px";
        mapSvg.appendChild(newElement);

        //--------------------------------------//


        rectX = cxL - 143.6539;
        rectY = cyL;
        let newRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        newRect.setAttribute('width', 280)
        newRect.setAttribute('height', 150)
        newRect.setAttribute('fill', 'white')
        newRect.setAttribute('stroke', 'black')
        newRect.setAttribute('stroke-width', 1)
        newRect.setAttribute('x', rectX)
        newRect.setAttribute('y', rectY)
        mapSvg.appendChild(newRect);


        //--------------------------------------//
        var inputAddFavoritePlacesAddress = document.getElementsByClassName('nameOfPlace')[0];
        var inputAddFavoritePlacesDescription = document.getElementsByClassName('textareaFavPlaceDescription')[0];



        var inputAddFavoritePlacesAddressValue = inputAddFavoritePlacesAddress.value;
        var inputAddFavoritePlacesDescriptionValue = inputAddFavoritePlacesDescription.value;
        inputAddFavoritePlacesAddress.value = ' ';
        inputAddFavoritePlacesDescription.value = ' ';


        textX = rectX + 10;
        textY = rectY + 20;
        let textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        textElement.setAttribute('x', textX);
        textElement.setAttribute('y', textY);
        textElement.setAttribute('width', 50);
        textElement.setAttribute('class', 'favoritePlace' + flag + ' imageInput');
        textElement.setAttribute('name', 'place');
        textElement.style.fill = 'black';
        textElement.style.fontFamily = 'Calibri';
        textElement.style.fontSize = '15';
        textElement.style.fontWeight = 50;
        textElement.innerHTML = inputAddFavoritePlacesAddressValue;
        mapSvg.appendChild(textElement);


        textY = rectY + 40;
        textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        textElement.setAttribute('x', textX);
        textElement.setAttribute('y', textY);
        textElement.setAttribute('width', 50);
        textElement.setAttribute('class', 'favoritePlace' + flag);
        textElement.setAttribute('name', 'description');
        textElement.style.fill = 'black';
        textElement.style.fontFamily = 'Calibri';
        textElement.style.fontSize = '15';
        textElement.style.fontWeight = 50;
        textElement.innerHTML = inputAddFavoritePlacesDescriptionValue;
        mapSvg.appendChild(textElement);


        //--------------------------------------//



        // -------------------------------- place coordinates --------------------------------

        let fullAddress = `${inputAddFavoritePlacesAddressValue}, ${nhood}, ${boro}, New York, NY, ${zcode}`;


        getPlaceInfo(fullAddress, (error, response) => {

            let coords = response['items'][0]['position'];

            textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            textElement.setAttribute('class', 'favoritePlace' + flag);
            textElement.setAttribute('name', 'coordinates');
            textElement.style.display = 'none';
            textElement.innerHTML = JSON.stringify(coords);
            mapSvg.appendChild(textElement);

        })
        //---------------------------------------------------------------------------------


        var imageInput = document.getElementById('preview');

        var imagesInput = document.getElementsByClassName('previewImage');



        for (var i = 0; i < imagesInput.length; i++) {

            if (imagesInput[i].className.indexOf(flag) > -1) {
                // console.log(imagesInput[i]);
                // console.log(imagesInput[i].src);

                imageX = textX;
                imageY = textY + 15;
                let foreignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
                foreignObject.setAttribute("x", imageX);
                foreignObject.setAttribute("y", imageY);
                foreignObject.setAttribute("width", "180");
                foreignObject.setAttribute("height", "80");
                var newImg = document.createElement('img');
                newImg.src = imagesInput[i].src;
                newImg.setAttribute("width", imagesInput[i].width);
                newImg.setAttribute("height", imagesInput[i].height);
                newImg.setAttribute('name', 'image');
                foreignObject.appendChild(newImg);
                mapSvg.appendChild(foreignObject);

                imagesInput[i].src = '';
                imagesInput[i].setAttribute("width", 'auto');
                imagesInput[i].setAttribute("width", 'auto');


            }

        };


        inputAddFavoritePlacesAddress.value = ' ';
        inputAddFavoritePlacesDescription.value = ' ';


        imageInput.setAttribute("width", 'auto');
        imageInput.setAttribute("width", 'auto');







        var imageInputElement = document.getElementsByClassName('favoritePlace' + flag)[0];
        var imageInputElements = document.getElementsByClassName('labelPhoto favoritePlace' + flag);
        for (var x = 0; x < imageInputElements.length; x++) {
            if (imageInputElements[x].value != '') {
                //console.log(imageInputElements[x]);
                //console.log(imageInputElements[x].files);
            }
        }



        console.log('========================================');


        var imageInputElementClone = imageInputElement.cloneNode(true);
        imageInputElementClone.value = '';

        var a = flag + 1;
        imageInputElementClone.setAttribute('class', 'labelPhoto ' + 'favoritePlace' + a);

        imageInputElementClone.addEventListener("change", function () {
            changeImage(this);
        });

        var imageLabel = document.getElementById('imageLabel');

        //imageLabel.insertBefore(imageInputElementClone, imageInputElement);

        imageInputElement.style.display = 'none';


    }
});



