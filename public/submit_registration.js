var registration_form = document.getElementsByClassName('register-form')[0];

registration_form.addEventListener('submit', function (e) {

    e.preventDefault();

    form_elements = registration_form.elements



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

    console.log(formValues);

    if (enteredPassword === reenteredPassword) {

        const xhr = new XMLHttpRequest();
        formValues['role'] = 'publisher';

        // log response
        let token = '';
        xhr.onload = () => {
            console.log(xhr.response);
            token = JSON.parse(xhr.response).token;
        };

       
        xhr.open('POST', '/register');
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(formValues));

        setTimeout(() => {

            console.log(token);

            var registrationForm = document.getElementById('goToMainForm')
    
            registrationForm.href = `users/${token}`
            
            registrationForm.pathname = `users/${token}`

            console.log(registrationForm.pathname);
    
            registrationForm.click()
    
        }, 2000);

        //=======================



    } else {
        console.log('passwords do not match')
    }




})