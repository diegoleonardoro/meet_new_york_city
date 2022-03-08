var registration_form = document.getElementsByClassName('register-form')[0];


const formElements = document.getElementsByClassName('formElement');


// const line = document.getElementById('sentEmailHandsLine');



const imgDiv = document.querySelector('.user-image-wrapper');
const img = document.querySelector('#photo');
const file = document.querySelector('#file');
const uploadBtn = document.querySelector('#uploadBtn');

//if user hover on img div 
imgDiv.addEventListener('mouseenter', function () {
    uploadBtn.style.display = "block";
});

//if we hover out from img div
imgDiv.addEventListener('mouseleave', function () {
    uploadBtn.style.display = "none";
});

file.addEventListener('change', function () {

    const choosedFile = this.files[0];
    if (choosedFile) {
        const reader = new FileReader();
        reader.addEventListener('load', function () {
            img.setAttribute('src', reader.result);
        });
        reader.readAsDataURL(choosedFile);
    }
});


registration_form.addEventListener('submit', function (e) {

    e.preventDefault();

    form_elements = registration_form.elements;
    const profilePic = file.files[0];













    // Hide the registration lay out and show confirm email illustration
    const img_form_container = document.getElementsByClassName('image_and_form_container')[0];
    img_form_container.style.display = 'none';





    // --- show illustration:
    const loadingUserProfileIllustration = document.getElementsByClassName('loadingUserProfileIllustration')[0];
    loadingUserProfileIllustration.style.display = 'inline';
    // --- show illustration text:
    const loadingUserProfileText = document.getElementById('loadingUserProfileText');
    loadingUserProfileText.style.display = 'inline';


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

    // const checkEmailContainer = document.getElementById('checkEmailContainer');
    // checkEmailContainer.style.display = 'inline';
    // ====== ====== ====== ====== ====== ====== ====== ====== ====== ====== 
















    const formData = new FormData();

    const formValues = {};

    let enteredPassword = '';
    let reenteredPassword = '';

    for (var i = 0; i < formElements.length; i++) {


        console.log(formElements[i].name)
        console.log(formElements[i].value)

        if (formElements[i].name === 'password') {
            enteredPassword = formElements[i].value
        }

        if (formElements[i].name === 're_pass') {
            reenteredPassword = formElements[i].value;
        }

        formData.append(formElements[i].name, formElements[i].value)
        formValues[formElements[i].name] = formElements[i].value

    }


    if (profilePic) {
        formData.append('profileImage', profilePic);
        //formValues['profileImage'] = profilePic;
        formValues['profileImage'] = profilePic;
    }



    if (enteredPassword === reenteredPassword) {

        const xhr = new XMLHttpRequest();
        formValues['role'] = 'publisher';
        xhr.responseType = 'json';

        //let token = '';

        xhr.onload = () => {

            // token = JSON.parse(xhr.response).token;

            // direct the user to the main form
            var registrationForm = document.getElementById('goToMainForm');
            registrationForm.href = 'users/questionnaire'//${token}



            registrationForm.click();



            // ==== ==== ==== ==== ==== ==== ==== 
        };

        //send the registration data to the /register route 
        xhr.open('POST', '/register');
        xhr.send(formData);
        // ===== ===== ===== ===== ===== ===== ===== ===== 

    } else {

        console.log('passwords do not match');

    }

})