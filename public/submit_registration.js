var registration_form = document.getElementsByClassName('register-form')[0];


const line = document.getElementById('sentEmailHandsLine');




registration_form.addEventListener('submit', function (e) {

    e.preventDefault();

    form_elements = registration_form.elements

    const registerPage = document.getElementsByClassName('register-page')[0];
    registerPage.style.display = 'none';

    const checkEmailContainer = document.getElementById('checkEmailContainer');
    checkEmailContainer.style.display = 'inline';


    const formData = new FormData();

    const formValues = {}

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

   

    if (enteredPassword === reenteredPassword) {

        const xhr = new XMLHttpRequest();
        formValues['role'] = 'publisher';

        // log response
        let token = '';
        xhr.onload = () => {
            //console.log(xhr.response);
            token = JSON.parse(xhr.response).token;
        };


        xhr.open('POST', '/register');
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(formValues));



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