var registration_form = document.getElementsByClassName('register-form')[0];
const line = document.getElementById('sentEmailHandsLine');

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

    const registerPage = document.getElementsByClassName('register-page')[0];
    registerPage.style.display = 'none';

    const checkEmailContainer = document.getElementById('checkEmailContainer');
    checkEmailContainer.style.display = 'inline';

    const formData = new FormData();

    const formValues = {};

    let enteredPassword = '';
    let reenteredPassword = '';

    for (var i = 0; i < form_elements.length - 2; i++) {

        if (form_elements[i].name === 'password') {
            enteredPassword = form_elements[i].value
        }

        if (form_elements[i].name === 're_pass') {
            reenteredPassword = form_elements[i].value;
        }

        formData.append(form_elements[i].name, form_elements[i].value)
        formValues[form_elements[i].name] = form_elements[i].value

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

        // log response
        let token = '';
        xhr.onload = () => {
            //console.log(xhr.response);
            token = JSON.parse(xhr.response).token;
        };

        xhr.open('POST', '/register');

        xhr.send(formData);

        //JSON.stringify(formValues)
        //formData

        //setTimeout(() => {
        //    var registrationForm = document.getElementById('goToMainForm');
        //    registrationForm.href = `users/${token}`
        //    registrationForm.pathname = `users/${token}`
        //    registrationForm.click();
        //}, 2000);



    } else {
        console.log('passwords do not match')
    }




})