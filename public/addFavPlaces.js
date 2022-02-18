import { changeImage } from '/addPicOfPlace.js';



var divFavPlaceImage = document.getElementById('divFavPlaceImage');
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



const nameOfPlace = document.getElementsByClassName('nameOfPlace')[0];
const textareaFavPlaceDescription = document.getElementsByClassName('textareaFavPlaceDescription')[0];

let photoOfPlaceFlag = 1
let favPlacePhoto = document.getElementsByClassName(`favoritePlace${photoOfPlaceFlag}`)[0];






let photoOfPlaceFlag_InputsCompletionCheck = 1;
let favPlacePhoto_InputsCompletionCheck = document.getElementsByClassName(`favoritePlace${photoOfPlaceFlag_InputsCompletionCheck}`)[0];




// fav places input flags
const divArrowNameOfPlace = document.getElementById('divArrowNameOfPlace');
const divArrowDescriptionOfPlace = document.getElementById('divArrowDescriptionOfPlace');
const divArrowPhotoOfPlace = document.getElementById('divArrowPhotoOfPlace');

// ---- end of fav places input flags



const addPlace = document.getElementById('addPlaceButton');
let flag = 0;


nameOfPlace.addEventListener('input', function (e) {
    divArrowNameOfPlace.style.display = 'none';
})

textareaFavPlaceDescription.addEventListener('input', function (e) {
    divArrowDescriptionOfPlace.style.display = 'none';
})

favPlacePhoto.addEventListener('input', function (e) {
    divArrowPhotoOfPlace.style.display = 'none';
})





addPlace.addEventListener('click', () => {


    //console.log(nameOfPlace.value);
    //console.log(textareaFavPlaceDescription.value);
    //console.log(favPlacePhoto_InputsCompletionCheck);

    // console.log(favPlacePhoto_InputsCompletionCheck);
    // console.log(favPlacePhoto_InputsCompletionCheck.value);


    if (nameOfPlace.value === '') {

        divArrowNameOfPlace.style.display = 'block';

    } else if (nameOfPlace.value != '') {


        divArrowNameOfPlace.style.display = 'none';
    }
    if (textareaFavPlaceDescription.value === '') {

        divArrowDescriptionOfPlace.style.display = 'block';

    } else if (textareaFavPlaceDescription.value != '') {

        divArrowDescriptionOfPlace.style.display = 'none';

    }
    if (favPlacePhoto_InputsCompletionCheck.value === '') { //favPlacePhoto_InputsCompletionCheck == undefined

        divArrowPhotoOfPlace.style.display = 'block';

    } else if (favPlacePhoto_InputsCompletionCheck.value != '') { // //favPlacePhoto_InputsCompletionCheck !== undefined

        divArrowPhotoOfPlace.style.display = 'none';

    }





    if (nameOfPlace.value != '' && textareaFavPlaceDescription.value != '' && favPlacePhoto_InputsCompletionCheck.value != '') {//favPlacePhoto.value != ''

        favPlacePhoto = document.getElementsByClassName(`favoritePlace${photoOfPlaceFlag}`)[0];


        favPlacePhoto.addEventListener('input', function (e) {
            divArrowPhotoOfPlace.style.display = 'none';
        });


        photoOfPlaceFlag += 1;

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

            // 1-- this block gets the coordinates used to place the new path and rect in the map
            cxL = parseFloat(cx) + 39.9443;
            cyL = parseFloat(cy) - 88.8956;
            let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            newElement.setAttribute("d", "M " + " " + cx + " " + cy + " L" + " " + cxL.toString() + " " + cyL.toString());
            newElement.style.stroke = "#000";
            newElement.style.strokeWidth = "1px";
            mapSvg.appendChild(newElement); // 2 -- append the new path element to the place circle in the map svg 



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

            var inputAddFavoritePlacesAddress = document.getElementsByClassName('nameOfPlace')[0]; // 4 -- select the name of place input element 
            var inputAddFavoritePlacesDescription = document.getElementsByClassName('textareaFavPlaceDescription')[0];// 5 -- select the place description input element 

            var inputAddFavoritePlacesAddressValue = inputAddFavoritePlacesAddress.value;// 5 -- select the value of the name of place input element 
            var inputAddFavoritePlacesDescriptionValue = inputAddFavoritePlacesDescription.value;// 6 -- select the value of the place description input element

            inputAddFavoritePlacesAddress.value = ''; // 7 -- remove what the user typed in the name of place input element 
            inputAddFavoritePlacesDescription.value = '';// 8 -- remove what the user typed in the place description input element 







            textX = rectX + 10;
            textY = rectY + 20;



            let mainDivPlaceDesciptionForeignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
            mainDivPlaceDesciptionForeignObject.setAttribute("x", textX);
            mainDivPlaceDesciptionForeignObject.setAttribute("y", textY);
            mainDivPlaceDesciptionForeignObject.setAttribute("width", "180");
            mainDivPlaceDesciptionForeignObject.setAttribute("height", "80");


            const mainDivPlaceDesciption = document.createElement('div');
            mainDivPlaceDesciption.setAttribute("width", "180");
            mainDivPlaceDesciption.setAttribute("height", "80");


            mainDivPlaceDesciptionForeignObject.appendChild(mainDivPlaceDesciption);
            mapSvg.appendChild(mainDivPlaceDesciptionForeignObject);


            const divPlaceName = document.createElement('div');
            divPlaceName.innerHTML = inputAddFavoritePlacesAddressValue
            divPlaceName.setAttribute('class', 'favoritePlace' + flag);
            divPlaceName.setAttribute('name', 'place');
            mainDivPlaceDesciption.appendChild(divPlaceName);


            const divPlaceDescription = document.createElement('div');
            divPlaceDescription.innerHTML = inputAddFavoritePlacesDescriptionValue;
            divPlaceDescription.setAttribute('class', 'favoritePlace' + flag);
            divPlaceDescription.setAttribute('name', 'description');
            mainDivPlaceDesciption.appendChild(divPlaceDescription);


            var imageInput = document.getElementById('preview');
            var imagesInput = document.getElementsByClassName('previewImage');

            for (var i = 0; i < imagesInput.length; i++) {

                if (imagesInput[i].className.indexOf(flag) > -1) {

                   

                    var newImg = document.createElement('img');
                    newImg.src = imagesInput[i].src;
                    newImg.setAttribute("width", imagesInput[i].width);
                    newImg.setAttribute("height", imagesInput[i].height);
                    newImg.setAttribute('name', 'image');

                    mainDivPlaceDesciption.appendChild(newImg);


                    console.log(newImg)

                    imagesInput[i].src = '';
                    imagesInput[i].setAttribute("width", 'auto');
                    imagesInput[i].setAttribute("width", 'auto');

                }


            }








            var imageInputElement = document.getElementsByClassName('favoritePlace' + flag)[0];// 15 ---  select the input element that includes the first uploaded image 

            var imageInputElementClone = imageInputElement.cloneNode(true);// 16 -- clone the image input element that inclues the first uploaded image 
            imageInputElementClone.value = '';// 17 -- remove the value of the image input element that was cloned

            var a = flag + 1;
            imageInputElementClone.setAttribute('class', 'labelPhoto ' + 'favoritePlace' + a);// 18 -- assign a class name to cloned image input element, which in this case is favoritePlace2

            imageInputElementClone.addEventListener("change", function () {// 19 -- attach 'changeImage' as an event listener to the cloned image input element. 
                changeImage(this);
            });

            divFavPlaceImage.prepend(imageInputElementClone);
            imageInputElement.style.display = 'none';

            photoOfPlaceFlag_InputsCompletionCheck += 1;
            favPlacePhoto_InputsCompletionCheck = document.getElementsByClassName(`favoritePlace${photoOfPlaceFlag_InputsCompletionCheck}`)[0];

            favPlacePhoto_InputsCompletionCheck.addEventListener('input', function (e) {
                divArrowPhotoOfPlace.style.display = 'none';
            })






        } else if (flag == 2) {



            cxL = parseFloat(cx) + 50.3407;
            cyL = parseFloat(cy) + 47.6287;

            let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            newElement.setAttribute("d", "M " + " " + cx + " " + cy + " L" + " " + cxL.toString() + " " + cyL.toString());
            newElement.style.stroke = "#000";
            newElement.style.strokeWidth = "1px";
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

            inputAddFavoritePlacesAddress.value = '';
            inputAddFavoritePlacesDescription.value = '';



            textX = rectX + 10;
            textY = rectY + 20;





            let mainDivPlaceDesciptionForeignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
            mainDivPlaceDesciptionForeignObject.setAttribute("x", textX);
            mainDivPlaceDesciptionForeignObject.setAttribute("y", textY);
            mainDivPlaceDesciptionForeignObject.setAttribute("width", "180");
            mainDivPlaceDesciptionForeignObject.setAttribute("height", "80");


            const mainDivPlaceDesciption = document.createElement('div');
            mainDivPlaceDesciption.setAttribute("width", "180");
            mainDivPlaceDesciption.setAttribute("height", "80");


            mainDivPlaceDesciptionForeignObject.appendChild(mainDivPlaceDesciption);
            mapSvg.appendChild(mainDivPlaceDesciptionForeignObject);


            const divPlaceName = document.createElement('div');
            divPlaceName.innerHTML = inputAddFavoritePlacesAddressValue
            divPlaceName.setAttribute('class', 'favoritePlace' + flag);
            divPlaceName.setAttribute('name', 'place');
            mainDivPlaceDesciption.appendChild(divPlaceName);


            const divPlaceDescription = document.createElement('div');
            divPlaceDescription.innerHTML = inputAddFavoritePlacesDescriptionValue;
            divPlaceDescription.setAttribute('class', 'favoritePlace' + flag);
            divPlaceDescription.setAttribute('name', 'description');
            mainDivPlaceDesciption.appendChild(divPlaceDescription);


            var imageInput = document.getElementById('preview');
            var imagesInput = document.getElementsByClassName('previewImage');






            for (var i = 0; i < imagesInput.length; i++) {

                if (imagesInput[i].className.indexOf(flag) > -1) {
  

                    var newImg = document.createElement('img');
                    newImg.src = imagesInput[i].src;
                    newImg.setAttribute("width", imagesInput[i].width);
                    newImg.setAttribute("height", imagesInput[i].height);
                    newImg.setAttribute('name', 'image');

                    mainDivPlaceDesciption.appendChild(newImg);


                    console.log(newImg)

                    imagesInput[i].src = '';
                    imagesInput[i].setAttribute("width", 'auto');
                    imagesInput[i].setAttribute("width", 'auto');
                }


            }








            inputAddFavoritePlacesAddress.value = '';
            inputAddFavoritePlacesDescription.value = '';

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



            divFavPlaceImage.prepend(imageInputElementClone);

            imageInputElement.style.display = 'none';

            photoOfPlaceFlag_InputsCompletionCheck += 1;
            favPlacePhoto_InputsCompletionCheck = document.getElementsByClassName(`favoritePlace${photoOfPlaceFlag_InputsCompletionCheck}`)[0];

            favPlacePhoto_InputsCompletionCheck.addEventListener('input', function (e) {
                divArrowPhotoOfPlace.style.display = 'none';
            })




        } else if (flag == 3) {
            cxL = parseFloat(cx) + 5;
            cyL = parseFloat(cy) + 210; //131 

            let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            newElement.setAttribute("d", "M " + " " + cx + " " + cy + " L" + " " + cxL.toString() + " " + cyL.toString());
            newElement.style.stroke = "#000";
            newElement.style.strokeWidth = "1px";
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
            inputAddFavoritePlacesAddress.value = '';
            inputAddFavoritePlacesDescription.value = '';

            textX = rectX + 10;
            textY = rectY + 20;


            let mainDivPlaceDesciptionForeignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
            mainDivPlaceDesciptionForeignObject.setAttribute("x", textX);
            mainDivPlaceDesciptionForeignObject.setAttribute("y", textY);
            mainDivPlaceDesciptionForeignObject.setAttribute("width", "180");
            mainDivPlaceDesciptionForeignObject.setAttribute("height", "80");


            const mainDivPlaceDesciption = document.createElement('div');
            mainDivPlaceDesciption.setAttribute("width", "180");
            mainDivPlaceDesciption.setAttribute("height", "80");


            mainDivPlaceDesciptionForeignObject.appendChild(mainDivPlaceDesciption);
            mapSvg.appendChild(mainDivPlaceDesciptionForeignObject);


            const divPlaceName = document.createElement('div');
            divPlaceName.innerHTML = inputAddFavoritePlacesAddressValue
            divPlaceName.setAttribute('class', 'favoritePlace' + flag);
            divPlaceName.setAttribute('name', 'place');
            mainDivPlaceDesciption.appendChild(divPlaceName);


            const divPlaceDescription = document.createElement('div');
            divPlaceDescription.innerHTML = inputAddFavoritePlacesDescriptionValue;
            divPlaceDescription.setAttribute('class', 'favoritePlace' + flag);
            divPlaceDescription.setAttribute('name', 'description');
            mainDivPlaceDesciption.appendChild(divPlaceDescription);


            var imageInput = document.getElementById('preview');
            var imagesInput = document.getElementsByClassName('previewImage');

            for (var i = 0; i < imagesInput.length; i++) {

                if (imagesInput[i].className.indexOf(flag) > -1) {

                

                    var newImg = document.createElement('img');
                    newImg.src = imagesInput[i].src;
                    newImg.setAttribute("width", imagesInput[i].width);
                    newImg.setAttribute("height", imagesInput[i].height);
                    newImg.setAttribute('name', 'image');

                    mainDivPlaceDesciption.appendChild(newImg);


                    console.log(newImg)

                    imagesInput[i].src = '';
                    imagesInput[i].setAttribute("width", 'auto');
                    imagesInput[i].setAttribute("width", 'auto');
                }
            }











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


            photoOfPlaceFlag_InputsCompletionCheck += 1;
            favPlacePhoto_InputsCompletionCheck = document.getElementsByClassName(`favoritePlace${photoOfPlaceFlag_InputsCompletionCheck}`)[0];


            //favPlacePhoto_InputsCompletionCheck.addEventListener('input', function (e) {
            //    divArrowPhotoOfPlace.style.display = 'none';
            //})


            const _fav_Places = document.getElementsByClassName('_fav_Places')[0];
            _fav_Places.style.display = 'none';


            //var nextQuestionKeyWord = displayedQuestion.className.split(' ')[4];

            const enoughPlaces = document.getElementById('enoughPlaces');
            enoughPlaces.className = enoughPlaces.className + ' display';

            setTimeout(() => {
                enoughPlaces.className = enoughPlaces.className.replace('display', '');
                const _anythingElseAboutYou = document.getElementById('_anythingElseAboutYou');
                _anythingElseAboutYou.className = _anythingElseAboutYou.className + ' display';
            }, 1000);


        }




    }
});




            // 9 -- this block will include what the user typed in the name of place input element inside the rect element that was appended to the map svg
            //textX = rectX + 10;
            //textY = rectY + 20;



            /*
            let textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            textElement.setAttribute('x', textX);
            textElement.setAttribute('y', textY);
            textElement.setAttribute('width', 50);
            textElement.setAttribute('class', 'favoritePlace' + flag); // 9.1 -- give a class name of 'favoritePlace1' to the text element that includes what the user typed in the name of place input element 
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
            textElement.setAttribute('class', 'favoritePlace' + flag); // 10.1 -- give a class name of 'favoritePlace1' to the text element that includes what the user typed in the place description input element 
            textElement.setAttribute('name', 'description');
            textElement.style.fill = 'black';
            textElement.style.fontFamily = 'Calibri';
            textElement.style.fontSize = '15';
            textElement.style.fontWeight = 50;
            textElement.innerHTML = inputAddFavoritePlacesDescriptionValue;
            mapSvg.appendChild(textElement);

            
            let texttForeignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
            texttForeignObject.setAttribute("x", textX);
            texttForeignObject.setAttribute("y", textY);
            texttForeignObject.setAttribute("width", "180");
            texttForeignObject.setAttribute("height", "80");
   

            var divTextArea = document.createElement('div');
            divTextArea.setAttribute("width",  "180" );
            divTextArea.setAttribute("height","80" );
            divTextArea.setAttribute('class', 'favoritePlace' + flag);
            divTextArea.setAttribute('name', 'description');

            divTextArea.innerHTML = inputAddFavoritePlacesDescriptionValue;

            texttForeignObject.appendChild(divTextArea);
            mapSvg.appendChild(texttForeignObject);

              
            imageX = textX;
            imageY = textY + 15;
            let foreignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
            foreignObject.setAttribute("x", imageX);
            foreignObject.setAttribute("y", imageY);
            foreignObject.setAttribute("width", "180");
            foreignObject.setAttribute("height", "80");
    
            foreignObject.appendChild(newImg);
            mapSvg.appendChild(foreignObject);



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




            */