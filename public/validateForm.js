export function validateForm(displayedElement) {
    var valid = true;
    if (displayedElement[0].className.indexOf("submitPhoto") > -1) {


        //console.log(1);

        return [valid, 1];

    } else if (displayedElement.length == 1 || displayedElement.length == 2) {

        //console.log(2);

        let inputValue
        if (displayedElement.length == 1) {// likert scale
            inputValue = displayedElement[0].children[0].value;

            if (inputValue == "") {
                valid = false;
                return [valid, 0];
            } else {
                return [valid, 0];
            }

        } else if (displayedElement.length == 2) {

            inputValue = displayedElement[1].children[0].value;

            if (inputValue == "") {
                valid = false;
                return [valid, 1];
            } else {
                return [valid, 1];
            }
        }

    } else if (displayedElement[0].parentElement.className.indexOf("seeYrslfOpertingBsnsInFuture") > -1 || displayedElement[0].parentElement.className.indexOf("submitPhoto") > -1) {

        //console.log(3);

        for (var s = 0; s < displayedElement.length; s++) {

            var inputValue = displayedElement[s].children[0].value;

            if (inputValue == "") {

                valid = false;
                return [valid, 0];
            }
            return [valid, 0];
        }


    } else if (displayedElement.length > 1) {


        // console.log(4);

        valid = false;
        for (var v = 0; v < displayedElement.length; v++) {

            if (displayedElement[v].parentElement.className.indexOf("headingQuestion") > -1) {
                continue;
            }

            if (displayedElement[v].className.indexOf('filterDivTextCheckBox') > -1) {
                let displayedElementNextSibling = displayedElement[v].nextElementSibling; // here we are getting the input value, which we will need to know if the input was checked. 

                if (displayedElementNextSibling.checked) {
                    valid = true;
                    return [valid, v];
                }
                if (v == displayedElement.length - 1) {

                    return [valid, v];
                }

                //return [valid, 1];

            } else if (displayedElement[v].className.indexOf('filterDivTextAfterLikert') > -1) {

                var inputElementValue = displayedElement[v].children[0].value;
                if (inputElementValue === '') {
                    return [valid, 0];
                }

                if (v == displayedElement.length - 1) {
                    valid = true;
                    return [valid, 1];
                }

            } else if (displayedElement[v].className.indexOf('filterDivTextNeighborhoodTips') > -1) {
                valid = true;
                return [valid, 1]
            } else if (displayedElement[v].className.indexOf('relevantPlacesInNeighborhood ') > -1) {

                //var svgChildren = document.getElementById('placeCircle').parentElement.children;

                //if (svgChildren.length == 2) {
                //  valid = false;
                //   return [valid, 0];
                //} else if (svgChildren.length > 2) {
                valid = true;
                return [valid, 1];
                //}

            }

        }
    }

}