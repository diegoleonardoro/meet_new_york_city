var registration_form = document.getElementsByClassName('right-content-form')[0];

registration_form.addEventListener('submit', function (e) {

    e.preventDefault();
    console.log(registration_form);

    form_elements = registration_form.elements
    const formData = new FormData();
    const formValues = {};

    for (var i = 0; i < form_elements.length; i++) {
        formData.append(form_elements[i].name, form_elements[i].value)
        formValues[form_elements[i].name] = form_elements[i].value
    }

    console.log(formValues)

    // post form data
    const xhr = new XMLHttpRequest();
    //xhr.responseType = 'json';



    let token = '';
    let flag;

    xhr.onload = () => {

        //console.log(xhr.response);

        token = JSON.parse(xhr.response).token;
        flag = JSON.parse(xhr.response).flag;
    };

    // create and send the request
    xhr.open('POST', '/register/login');// inputs
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(formValues));/*1. <---- NEEDS YO HAPPEN FIRST FOR 2. TO HAVE A VALUE */





    setTimeout(() => {
        if (flag === undefined) {
            var formLink = document.getElementById('goToForm');
            formLink.href = `users/${token}`
            formLink.pathname = `users/${token}`
            formLink.click()

        } else if (flag === '1') {
            console.log('jijiji');

            var formLink = document.getElementById('goToForm');
            formLink.href = `users/profile/${token}`
            formLink.pathname = `users/profile/${token}`
            formLink.click()
        }




    }, 2000);



})