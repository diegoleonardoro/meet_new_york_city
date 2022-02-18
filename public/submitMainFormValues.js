

var form = document.getElementsByClassName('form')[0];



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


form.addEventListener("submit", function (err) {

    err.preventDefault();



    //  remove the header and form section 
    const mainForm = document.getElementsByClassName('main-form-page')[0];
    mainForm.style.display = 'none';
    // end of remove the header and form section 




    // Change display value of the loading illustration
    // --- illustration:
    const loadingUserProfileIllustration = document.getElementsByClassName('loadingUserProfileIllustration')[0];
    loadingUserProfileIllustration.style.display = 'inline';
    // --- text:
    const loadingUserProfileText = document.getElementById('loadingUserProfileText');
    loadingUserProfileText.style.display = 'inline';
    // end of change display value of the loading illustration




    // function that selects the loading illustration windows and dynamically changes their color

    var windowColors = ['black', 'white'];

    let colorFlag = 0

    function chageBuildingsWindowsColors() {

        var windowParent = document.getElementsByClassName('window');

        for (var g = 0; g < windowParent.length; g++) {

            var randomNum = Math.floor(Math.random() * windowParent.length);

            let groupOfWindows = windowParent[randomNum];

            let windows = groupOfWindows.children;

            for (var a = 0; a < windows.length; a++) {

                windows[a].style.fill = windowColors[colorFlag];
            }

        }

        if (colorFlag === 0) {
            colorFlag = 1;

        } else {
            colorFlag = 0;
        }

        setTimeout(() => {
            chageBuildingsWindowsColors();
        }, 500);

    }

    chageBuildingsWindowsColors();

    // end of  function that selects the loading illustration windows and dynamically changes their color





    var formElementsLength = form.elements.length;
    var formData = new FormData();

    let threeWordsToDecribeNeighborhood = [];
    let neighborhoodSatisfaction = {};
    let neighborhoodFactorDescription = {};
    let favoritePlaces = [];
    let neighborhoodTips = [];
    let flag = 1;
    let imagesArrayMain = [];

    let borough;
    let zipcode;
    let neighborhood;



    for (var i = 0; i < formElementsLength; i++) {

        if (form.elements[i].parentElement.className.indexOf('_fav_Places') > -1) {//&& form.elements[i].id != 'addPlaceButton' && flag === 1
            // What are your favorite places in this neighborhood? 
            // - Name or address of the place:
            // - Why is this one of you favorite places:
            // - Share an image of this place:
            flag = flag + 1;

            for (var e = 1; e <= 4; e++) {//four times becaue there will be a maximum of 4 favorite place elements

                let favPlaces = {};
                var favoritePlace = document.getElementsByClassName('favoritePlace' + e);

                if (favoritePlace.length > 1) {

                    let imagesArray = [];

                    let numberOfPhotos = 0;
                    for (var v = 0; v < favoritePlace.length; v++) {
                        if (favoritePlace[v].type != 'file') {
                            favPlaces[favoritePlace[v].getAttribute("name")] = favoritePlace[v].innerHTML;
                        } else {
                            if (favoritePlace[v].files.length > 0) {
                                numberOfPhotos = numberOfPhotos + 1;

                                formData.append(favoritePlace[v].getAttribute("name"), favoritePlace[v].files[0]);


                            }
                        }
                    }

                    favPlaces['numberOfPhotos'] = numberOfPhotos;

                    imagesArrayMain.push(imagesArray);
                    favoritePlaces.push(favPlaces);



                }
            }

        } else if (form.elements[i].className.indexOf('selectBoro') > -1) {

            //what borough:

            formData.append(form.elements[i].name, form.elements[i].value);
            borough = form.elements[i].value;

        } else if (form.elements[i].type === "radio" && form.elements[i].checked) {
            if (form.elements[i].name === "lengthLivingInNeighborhood") {

                /// How long have you been living in this neighborhood?
                formData.append(form.elements[i].name, form.elements[i].value);

            } else if (form.elements[i].className.indexOf('likertScale') > -1) {

                /// How do you feel with the following aspects of your neighborhood: 
                neighborhoodSatisfaction[form.elements[i].name] = form.elements[i].value

            }
        } else if (form.elements[i].type === "text" && form.elements[i].className.indexOf('textAreaLikertExplain') === -1) {

            if (form.elements[i].name === "threeWordsToDecribeNeighborhood") {

                // Describe your neighborhood in 3 words:
                threeWordsToDecribeNeighborhood.push(form.elements[i].value);

            } else if (form.elements[i].name === "neighborhoodTips" && form.elements[i].value != '') {

                // Share any tips for visitors to better enjoy your neighborhood:
                neighborhoodTips.push(form.elements[i].value)

            } else {

                // What neighborhood do you live in?
                /// How would you describe your neighborhood to someone who is visiting for the first time?
                // what zipcode 
                formData.append(form.elements[i].name, form.elements[i].value);

                if (form.elements[i].id.indexOf('zipcodeInput') > -1) {
                    zipcode = form.elements[i].value;
                } else if (form.elements[i].id.indexOf('neighborhoodName') > -1) {
                    neighborhood = form.elements[i].value;
                }

            }
        } else if (form.elements[i].className.indexOf('textAreaLikertExplain') > -1 && form.elements[i].value != '') {

            // likert scale explanation 
            neighborhoodFactorDescription[form.elements[i].name] = form.elements[i].value;

        } else if (form.elements[i].className.indexOf('textAreaExplanation') > -1 && form.elements[i].value != '') {

            // describe neighborhood  && More self introduction
            formData.append(form.elements[i].name, form.elements[i].value);

        }
    }




    console.log(favoritePlaces);


    var neighborhoodSatisfaction_ = JSON.stringify(neighborhoodSatisfaction);
    var neighborhoodFactorDescription_ = JSON.stringify(neighborhoodFactorDescription);
    var favoritePlaces_ = JSON.stringify(favoritePlaces);



    formData.append('threeWordsToDecribeNeighborhood', threeWordsToDecribeNeighborhood);
    formData.append('neighborhoodSatisfaction', neighborhoodSatisfaction_);
    formData.append('neighborhoodFactorDescription', neighborhoodFactorDescription_);
    formData.append('favoritePlaces', favoritePlaces_);
    formData.append('neighborhoodTips', neighborhoodTips);
    //formData.append('placeImage', imagesArrayMain);



    //console.log('==========================')
    //console.log('==========================')

    //for (var pair of formData.entries()) {
    //    console.log(pair[0] + ', ' + pair[1]);
    //}

    let token = '';
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    // log response
    xhr.onload = () => {
        token = xhr.response.token;
        //console.log(token);
        var formLink = document.getElementById('goToUserProfile');
        formLink.href = `users/profile/${token}`
        formLink.click()
    };


    xhr.open('POST', `/inputs/userId`);





    setTimeout(() => {
        xhr.send(formData);
    }, 1000);


})

