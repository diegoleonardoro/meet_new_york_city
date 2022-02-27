document.getElementsByClassName('burger-menu')[0].addEventListener('click', () => {



    const mobileNavDisplayValue = document.getElementsByClassName('mob-nav')[0].style.display;

    if (mobileNavDisplayValue === 'block') {
        document.getElementsByClassName('mob-nav')[0].style.display = 'none';
    } else {
        document.getElementsByClassName('mob-nav')[0].style.display = 'block';
    }



})