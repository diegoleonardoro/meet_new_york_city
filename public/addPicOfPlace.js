//var svgAddPhotoOfPlace = document.getElementById('Layer_1w');
//var ellipse = svgAddPhotoOfPlace.children[1];


var tooltip = document.getElementsByClassName('cls-1r')[0];
var tooltipText = document.getElementById('textToolTip');


// var imagePreview = document.getElementById("preview");

//var textAddNewPlace = document.getElementById('textAddNewPlace');
var textAddNewPlaceCirlce = document.getElementsByClassName('cls-1o')[0];
var svgAddNewPlace = document.getElementById('addNewPlace');







let opacity;
var interval;
function fadeIn() {
    interval = setInterval(show, 100);
}

function show() {
    if (opacity < 1) {
        opacity = opacity + 0.1;
        //arrowSvg.style.opacity = opacity
        tooltip.style.opacity = opacity;
        //nextArrowSvg.style.opacity = opacity;
    } else {
        clearInterval(interval);
    }
}

/* 
svgAddPhotoOfPlace.addEventListener('mouseover', () => {
    ellipse.style.fill = 'white';
    tooltip.style.display = 'inline';
    tooltipText.style.display = 'inline';
    opacity = 0;
    fadeIn()
})
*/

/* 
svgAddPhotoOfPlace.addEventListener('mouseout', () => {
    ellipse.style.fill = '#070707';
    tooltip.style.display = 'none';
    tooltipText.style.display = 'none';
    tooltip.style.opacity = 0;
})
*/

var inputPhoto = document.getElementsByName('placeImage')[0];
inputPhoto.addEventListener("change", function () {
    changeImage(this);
});


let flag = 0
let rotation = 27
let flagImageInput = 0;
let addPlaceButtonflag = 1;
let addPlaceButtonflag2 = 0;

addPlaceButtonflag2 = 0;


var addPlaceButton = document.getElementById('addPlaceButton');
addPlaceButton.addEventListener('click', () => {
    addPlaceButtonflag = addPlaceButtonflag + 1;
    addPlaceButtonflag2 = 0
})




// Each time the user slects a new image, a new img element will be added with class name of ("previewImage")[flag]. 
// The file input element will be stored on this input element. 
// this new img element will be added right below the previous img element, and its rotation will change. 



export function changeImage(input) {

    if (flagImageInput != 0) {
        var inputPhoto = document.getElementsByName('placeImage')[flagImageInput];
        inputPhoto.addEventListener("change", function () {
            changeImage(this);
        });
    }


    if (flag == 1) {
        rotation = -27
    } else if (flag == 2) {
        rotation = 29
    } else if (flag == 3) {
        rotation = -25
    } else if (flag == 4) {
        rotation = 32
    } else if (flag == 5) {
        rotation = -21
    } else if (flag == 6) {
        rotation = 35
    }

    let imagePreview = document.getElementsByClassName("previewImage")[flag];

    if (addPlaceButtonflag2 === 0) {
        imagePreview.className = imagePreview.className + ' ' + addPlaceButtonflag;
    }

    let newImagePreview = imagePreview.cloneNode();
    addPlaceButtonflag2 = 1;

    imagePreview.parentNode.insertBefore(newImagePreview, imagePreview.nextSibling);
    newImagePreview.style.transform = `rotate(${rotation}deg)`;

    flag = flag + 1;

    var imageInputElementClone = input.cloneNode(true);
    imageInputElementClone.value = '';
    var imageLabel = document.getElementById('imageLabel');
    imageLabel.insertBefore(imageInputElementClone, input);


    input.style.display = 'none';
    flagImageInput = flagImageInput + 1;

    imageInputElementClone.addEventListener("change", function () {
        changeImage(this);
    });


    var reader;

    if (input.files && input.files[0]) {
        // checks if the file input that triggers this function has a file. 

        reader = new FileReader();

        reader.onload = function (e) {

            var image = new Image();
            image.src = e.target.result
            image.onload = function () {

                var maxWidth = 100; // Max width for the image
                var maxHeight = 100;    // Max height for the image
                var ratio = 0;  // Used for aspect ratio

                var width = this.width;
                var height = this.height;

                if (width > maxWidth) {// <<< IF THE IMAGE WIDTH IS GREATER THAN THE MAX WIDTH.
                    ratio = maxWidth / width;   // GET RATIO FOR SCALING THE IMAGE
                    imagePreview.setAttribute('width', maxWidth);
                    imagePreview.setAttribute('height', height * ratio);
                    height = height * ratio;
                    width = width * ratio;
                }

                if (height > maxHeight) {
                    ratio = maxHeight / height;
                    imagePreview.setAttribute('width', width * ratio);
                    imagePreview.setAttribute('height', maxHeight);
                    width = width * ratio;
                    height = height * ratio;
                }

                imagePreview.setAttribute('src', e.target.result);// imagePreview changes as the user adds more images 

            }
        }
        reader.readAsDataURL(input.files[0]);
    }
}




// the img element is used to displayed the uploded image.
// every time a new image is uploaded, the img element will be cloned. 
// next time a new image is uploaded, the clone will be used to display the image
// all those img elements will have the same properties --> id:'preview' , class:'previewImage'



/* 
svgAddNewPlace.addEventListener('mouseover', () => {

    textAddNewPlaceCirlce.style.fill = "red";
    textAddNewPlaceCirlce.style.fillOpacity = "0.1";
})
svgAddNewPlace.addEventListener('mouseout', () => {
    textAddNewPlaceCirlce.style.fill = 'none';
})

*/