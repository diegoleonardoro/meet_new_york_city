

const tooltip = document.getElementsByClassName('cls-1r')[0];

const divFavPlaceImage = document.getElementById('divFavPlaceImage');


const formIllustration = document.getElementsByClassName('formIllustration')[0];

const formIllustrationDisplayValue = getComputedStyle(formIllustration).display;


//var tooltipText = document.getElementById('textToolTip');
// var imagePreview = document.getElementById("preview");
//var textAddNewPlace = document.getElementById('textAddNewPlace');
//var textAddNewPlaceCirlce = document.getElementsByClassName('cls-1o')[0];
//var svgAddNewPlace = document.getElementById('addNewPlace');



let opacity;
var interval;
function fadeIn() {
    interval = setInterval(show, 100);
}

function show() {
    if (opacity < 1) {
        opacity = opacity + 0.1;
        tooltip.style.opacity = opacity;
    } else {
        clearInterval(interval);
    }
}

let inputPhoto = document.getElementsByName('placeImage')[0]; // 1. --- select first input element that will be use to upload the first image. 
inputPhoto.addEventListener("change", function () {// 2. --- add 'changeImage' as an event listener to the input element that will be used to upload the first image. 
    changeImage(this);
});


let flag = 0;

let rotation = 27;

let flagImageInput = 0;

let addPlaceButtonflag = 1;

let addPlaceButtonflag2 = 0;



//addPlaceButtonflag2 = 0;



var addPlaceButton = document.getElementById('addPlaceButton'); // 3. --- select the button that will add the places to the svg map.


const nameOfPlace = document.getElementsByClassName('nameOfPlace')[0]; // 4. --- select the input element where the user will type the name of the place.
const textareaFavPlaceDescription = document.getElementsByClassName('textareaFavPlaceDescription')[0]; // 5. --- select the input element where the user will type the description of the place.
let photoOfPlaceFlag = 1
let favPlacePhoto = document.getElementsByClassName(`favoritePlace${photoOfPlaceFlag}`)[0];// 6. --- select the first input element where the user will upload the first image of the place 


addPlaceButton.addEventListener('click', () => {// 7. --- add an event listener to the button that adds the places to the svg map 



    // if (formIllustrationDisplayValue === 'flex') {

    //     console.log('hola')

    // } else {

    //     console.log('hello')

    // }



    // 7.1 --- this event listener will check if all the input elements for the favorite place have a value.


    // 7.2 --- favPlacePhoto will be the image input element used to upload the photos of the first place,
    // because we want photoOfPlaceFlag to be added one only when all the place input elements have a value,
    // favPlacePhoto will only be  the image input element of the next place when all the place input elements have a value, 
    // so in order to check if image input element of the next place exists, we need to create 'photoOfPlaceFlag' and 'favPlacePhotoTest'

    let photoOfPlaceTestFlag = photoOfPlaceFlag += 1;
    let favPlacePhotoTest = document.getElementsByClassName(`favoritePlace${photoOfPlaceTestFlag}`)[0]


    if (nameOfPlace.value != '' && textareaFavPlaceDescription.value != '' && favPlacePhotoTest !== undefined) {// 7.3 --- check if all the place input elements have a value 


        addPlaceButtonflag = addPlaceButtonflag + 1; // 7.4 --- 'addPlaceButtonflag' original value is 1 and it will be included only in the class name of the first img element.
        photoOfPlaceFlag += 1;// 7.5 --- increase the value of the flag used to select the correct place image input element by one 
        favPlacePhoto = document.getElementsByClassName(`favoritePlace${photoOfPlaceFlag}`)[0];// 7.6  --- the new value of favPlacePhoto will be the newly added image input element. 

    };

    addPlaceButtonflag2 = 0;

})




// Each time the user slects a new image, a new img element will be added with class name of ("previewImage")[flag]. 
// The file input element will be stored on this input element. 
// this new img element will be added right below the previous img element, and its rotation will change. 



export function changeImage(input) {


    // console.log(formIllustration.style.display);




    // if (formIllustrationDisplayValue === 'flex') {


    /* This function will be used as a call back function every time an image input element changes*/

    if (flagImageInput != 0) { // 8. --- the only time that flagImageInput will be 0 is when the user sends the images of the first place, so we will enter this if statement every time except when favPlacePhoto represents the image input for the first place. 

        inputPhoto = document.getElementsByName('placeImage')[flagImageInput];

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

    flag = flag + 1;

    if (addPlaceButtonflag2 === 0) {

        imagePreview.className = 'previewImage' + ' ' + addPlaceButtonflag;
        addPlaceButtonflag += 1;

    }


    let newImagePreview = imagePreview.cloneNode();

    addPlaceButtonflag2 = 1;
    imagePreview.parentNode.insertBefore(newImagePreview, imagePreview.nextSibling);
    newImagePreview.style.transform = `rotate(${rotation}deg)`;

    var imageInputElementClone = input.cloneNode(true);//

    imageInputElementClone.value = '';
    var imageLabel = document.getElementById('imageLabel');
    //imageLabel.insertBefore(imageInputElementClone, input.nextSibling);// input is not a node of imageInputElementClone


    divFavPlaceImage.prepend(imageInputElementClone);
    //input.after(imageInputElementClone);

    input.style.display = 'none';
    flagImageInput = flagImageInput + 1;










    imageInputElementClone.addEventListener("change", function () {
        changeImage(this);
    });

    var reader;

    if (input.files && input.files[0]) {


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










    // } else {

    //     console.log('hello')

    // }














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