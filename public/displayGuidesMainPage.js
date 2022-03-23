
export function changeColorOfTourGuidesIllustration() {




    const loadingTourguides = document.getElementById('loadingTourguides');
    loadingTourguides.style.display = 'block';
    const backgroundRects = document.getElementsByClassName('backgroundRect');

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }


    const tourguidesHeader = document.getElementById('tourguidesHeader');

    const changeColors = async () => {



        let flag = true;


        for (var i = 0; i < backgroundRects.length; i++) {


            if (tourguidesHeader.innerHTML ==='No tour guides for this neighborhood'){
                flag =false;
            }

            await sleep(100);

            if (window.getComputedStyle(backgroundRects[i])['fill'] === 'rgb(255, 203, 121)') {

                backgroundRects[i].style.fill = 'rgb(252, 222, 175)';

            } else if (window.getComputedStyle(backgroundRects[i])['fill'] === 'rgb(252, 222, 175)') {

                backgroundRects[i].style.fill = 'rgb(255, 203, 121)';

            } else if (window.getComputedStyle(backgroundRects[i])['fill'] === 'rgb(90, 99, 171)') {

                backgroundRects[i].style.fill = 'rgb(158, 164, 211)';

            } else if (window.getComputedStyle(backgroundRects[i])['fill'] === 'rgb(158, 164, 211)') {

                backgroundRects[i].style.fill = 'rgb(90, 99, 171)';

            }

            if (loadingTourguides.style.display === 'block' && i === backgroundRects.length - 1 && flag ) {
                i = 0
            }



        }
    }

    changeColors();





}










export function displayTourGuides(resValue) {


    var container_neighborhoodGuides = document.getElementById('container_neighborhoodGuides');

    let neighborhoodUsers = JSON.parse(resValue);
    neighborhoodUsers = neighborhoodUsers['data'];


    if (neighborhoodUsers.length > 0) {

        const loadingTourguides = document.getElementById('loadingTourguides');
        loadingTourguides.style.display = 'none';

        let whoCanShowArray = [];

        for (var i = 0; i < neighborhoodUsers.length; i++) {

            let whoCanShow = '';
            let userName = neighborhoodUsers[i]['name'];
            let neighborhood = neighborhoodUsers[i]['neighborhood'];
            let lengthLivingInNeighborhood = neighborhoodUsers[i]['lengthLivingInNeighborhood'];
            let neighborhoodDescription = neighborhoodUsers[i]['neighborhoodDescription'];

            let imgSrc

            if (neighborhoodUsers[i]['profileImg'] != '') {
                imgSrc = `data:image/png;base64,${neighborhoodUsers[i]['profileImg']}`
            } else {
                imgSrc = 'https://raw.githubusercontent.com/diegoleonardoro/bronx_tourism/master/2feca4c9330929232091f910dbff7f87.jpg'
            }

            whoCanShow =
                `<div class='whoCanShow'>

            <div class='profileImgNameContainer'>

                <svg xmlns="http://www.w3.org/2000/svg" id ='visitProfileSvg' width=15 viewBox="0 0 448 512"><path id ='path_visitProfileSvg'd="M256 64C256 46.33 270.3 32 288 32H415.1C415.1 32 415.1 32 415.1 32C420.3 32 424.5 32.86 428.2 34.43C431.1 35.98 435.5 38.27 438.6 41.3C438.6 41.35 438.6 41.4 438.7 41.44C444.9 47.66 447.1 55.78 448 63.9C448 63.94 448 63.97 448 64V192C448 209.7 433.7 224 416 224C398.3 224 384 209.7 384 192V141.3L214.6 310.6C202.1 323.1 181.9 323.1 169.4 310.6C156.9 298.1 156.9 277.9 169.4 265.4L338.7 96H288C270.3 96 256 81.67 256 64V64zM0 128C0 92.65 28.65 64 64 64H160C177.7 64 192 78.33 192 96C192 113.7 177.7 128 160 128H64V416H352V320C352 302.3 366.3 288 384 288C401.7 288 416 302.3 416 320V416C416 451.3 387.3 480 352 480H64C28.65 480 0 451.3 0 416V128z"/></svg>

                <div class= 'profilePicIntro'>
                    <div class='user-image-wrapper'>
                        <img src= "${imgSrc} " />
                    </div>
                </div>

                <p class='whoCanShowItem whocanShow_name'> ${userName} </p>     

            </div>


            <p class='whoCanShowItem plc_description'> "I have lived in ${neighborhood} ${lengthLivingInNeighborhood}. I would describe ${neighborhood} as ${neighborhoodDescription}."</p>
            <p class='whoCanShowItem' id='whoCanShowItemLast'> These are some of ${userName}'s favorite places in ${neighborhood}: </p>
            `


            let imagesDiv = [];
            for (var x = 0; x < neighborhoodUsers[i]['imageFormatted'].length; x++) {

                let imagesFormattedInnerArray = neighborhoodUsers[i]['imageFormatted'][x];
                let imagesImgDom = '';

                for (var q = 0; q < imagesFormattedInnerArray.length; q++) {



                    if (imagesFormattedInnerArray.length === 1) {// if there is only one image

                        imagesImgDom = imagesImgDom +
                            ` 
                    <div class ='imagesAndSvgsContainer visible_imagesAndSvgsContainer'>

                        <img class='placeImage'  src=data:image/png;base64,${imagesFormattedInnerArray[q]}>

                    </div> `

                    } else if (q === 0) {// If we are in the first image, I want it to be visible, and the left arrow to have less opacity and not any functionality 


                        imagesImgDom = imagesImgDom +
                            ` 
                    <div class ='imagesAndSvgsContainer visible_imagesAndSvgsContainer'>

                        <svg style='opacity:0.1' xmlns="http://www.w3.org/2000/svg"  width='15'  viewBox="0 0 73 131.58">
                            <path d="M870.57,479.23l-51.44-50.68a5.25,5.25,0,0,1-.24-7.21l47.64-53.69" transform="translate(-807.57 -357.65)"/>
                        </svg>
                    
                        <img class='placeImage'  src=data:image/png;base64,${imagesFormattedInnerArray[q]}>

                        <svg class='_nextImageFavPlaceSvg' xmlns="http://www.w3.org/2000/svg" width='15' viewBox="0 0 72.33 130.17">
                            <path class="path_imgArr" d="M886.61,368l50.79,50a5.17,5.17,0,0,1,.24,7.12l-47,53" transform="translate(-876.61 -358)"/>
                        </svg>
                    </div> `

                    } else if (q === imagesFormattedInnerArray.length - 1) { // If we are in the last image, it should not be visible and the right arrow should have less opacity and not funtionality 


                        imagesImgDom = imagesImgDom +
                            ` 
                    <div class ='imagesAndSvgsContainer nonVisible_imagesAndSvgsContainer'>

                        <svg  class='prevImageFavPlaceSvg'  xmlns="http://www.w3.org/2000/svg" width='15' viewBox="0 0 73 131.58">
                            <path class="path_prevImageArrow" d="M870.57,479.23l-51.44-50.68a5.25,5.25,0,0,1-.24-7.21l47.64-53.69" transform="translate(-807.57 -357.65)"/>
                        </svg>

                        <img class='placeImage'  src=data:image/png;base64,${imagesFormattedInnerArray[q]}>

                        <svg style='opacity:0.1' width='15' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72.33 130.17">
                            <path  d="M886.61,368l50.79,50a5.17,5.17,0,0,1,.24,7.12l-47,53" transform="translate(-876.61 -358)"/>
                        </svg>

                    </div> `
                    } else { // if we are in any of the middle images, they should be unvisible and both arrows should have functionality 

                        imagesImgDom = imagesImgDom +
                            ` 
                    <div class ='imagesAndSvgsContainer nonVisible_imagesAndSvgsContainer'>

                        <svg class='prevImageFavPlaceSvg'  xmlns="http://www.w3.org/2000/svg" width='15'  viewBox="0 0 73 131.58">
                            <path class="path_prevImageArrow" d="M870.57,479.23l-51.44-50.68a5.25,5.25,0,0,1-.24-7.21l47.64-53.69" transform="translate(-807.57 -357.65)"/>
                        </svg>

                        <img class='placeImage'  src=data:image/png;base64,${imagesFormattedInnerArray[q]}>

                        <svg  class='_nextImageFavPlaceSvg' xmlns="http://www.w3.org/2000/svg" width='15' viewBox="0 0 72.33 130.17">
                            <path class="path_imgArr" d="M886.61,368l50.79,50a5.17,5.17,0,0,1,.24,7.12l-47,53" transform="translate(-876.61 -358)"/>
                        </svg>      

                    </div> `

                    }

                }

                let imagesDivDom = `<div class ='placeImagesDiv'> ${imagesImgDom} </div>`;
                imagesDiv.push(imagesDivDom);
            }



            let placesDivs = '';
            for (var e = 0; e < neighborhoodUsers[i]['favoritePlaces'].length; e++) {

                let place = neighborhoodUsers[i]['favoritePlaces'][e];

                if (neighborhoodUsers[i]['favoritePlaces'].length === 1) {// if there is only one favorite place, then do not add prev and next arrows to the places

                    placesDivs = placesDivs +
                        `<div class = 'divPlaceContainer shownPlace'> 
                    <i style='opacity:0.1' class="fas fa-arrow-circle-left"></i> 
                    <div class='divOfFavPlace' >
                        <p class='place_p'><b>Place: </b>${place['place']} </p>
                        <p class='place_p'> ${place['description']}</p>
                        <p class ='place_p'><b>Images of place:</b></p>
                        ${imagesDiv[e]}
                    </div>
                    <i style ='opacity:0.1' class="fas fa-arrow-circle-right"></i>
                </div>`
                } else if (e === 0) {// first place

                    placesDivs = placesDivs +
                        `<div class = 'divPlaceContainer shownPlace'>
                    <i style='opacity:0.1' class="fas fa-arrow-circle-left"></i>  
                    <div class='divOfFavPlace' >
                        <p class='place_p'><b>Place: </b>${place['place']} </p>
                        <p class='place_p'> ${place['description']}</p>
                        <p class ='place_p'><b>Images of place:</b></p>
                        ${imagesDiv[e]}
                    </div>
                    <i class="fas fa-arrow-circle-right rightArowNextPlace"></i>
                </div>`
                } else if (e === neighborhoodUsers[i]['favoritePlaces'].length - 1) {//if it is the last place 
                    placesDivs = placesDivs +
                        `<div class='divPlaceContainer hiddenPlace'>
                    <i class="fas fa-arrow-circle-left leftArowNextPlace"></i>  
                    <div class='divOfFavPlace '>
                        <p class='place_p'><b>Place: </b>${place['place']} </p>
                        <p class='place_p'> ${place['description']}</p>
                        <p class ='place_p'><b>Images of place:</b></p>
                        ${imagesDiv[e]}
                    </div>

                    <i style ='opacity:0.1' class="fas fa-arrow-circle-right"></i>
                </div>`

                } else {// if it is not the first nor the last place and there is more than one place, then add both arrows
                    placesDivs = placesDivs +
                        `<div class='divPlaceContainer hiddenPlace'>
                    <i class="fas fa-arrow-circle-left leftArowNextPlace"></i>  
                    <div class='divOfFavPlace '>
                        <p class='place_p'><b>Place: </b>${place['place']} </p>
                        <p class='place_p'> ${place['description']}</p>
                        <p class ='place_p '><b>Images of place:</b></p>
                        ${imagesDiv[e]}
                    </div>
                    <i class="fas fa-arrow-circle-right rightArowNextPlace"></i>
                </div>`

                }

            }

            whoCanShow = whoCanShow + placesDivs;
            whoCanShowArray.push(whoCanShow);
        }

        for (var i = 0; i < whoCanShowArray.length; i++) {
            container_neighborhoodGuides.innerHTML = container_neighborhoodGuides.innerHTML + whoCanShowArray[i];
        }


        // add an event listener to the next div place arrow
        const place_arrow_right = document.getElementsByClassName('rightArowNextPlace');
        for (var i = 0; i < place_arrow_right.length; i++) {
            place_arrow_right[i].addEventListener('click', (e) => {

                let clickedArrow = e.target;
                let divPlaceContainers = clickedArrow.parentElement;

                let mainDiv = divPlaceContainers.parentElement;
                let mainDivdivPlaceContainer = mainDiv.getElementsByClassName('divPlaceContainer');

                for (var e = 0; e < mainDivdivPlaceContainer.length; e++) {

                    if (mainDivdivPlaceContainer[e].className.indexOf('shownPlace') > -1) {

                        mainDivdivPlaceContainer[e].className = 'divPlaceContainer hiddenPlace';
                        mainDivdivPlaceContainer[e + 1].className = 'divPlaceContainer shownPlace';

                        break;

                    }

                }
            })
        }
        // end of add an event listener to the next div place arrow


        // add an event listener to the previous  div place arrow
        const place_arrow_left = document.getElementsByClassName('leftArowNextPlace');
        for (var i = 0; i < place_arrow_left.length; i++) {

            place_arrow_left[i].addEventListener('click', (e) => {

                let clickedArrow = e.target;
                let divPlaceContainers = clickedArrow.parentElement;

                let mainDiv = divPlaceContainers.parentElement;
                let mainDivdivPlaceContainer = mainDiv.getElementsByClassName('divPlaceContainer');

                for (var e = 0; e < mainDivdivPlaceContainer.length; e++) {

                    if (mainDivdivPlaceContainer[e].className.indexOf('shownPlace') > -1) {

                        // if (e != mainDivdivPlaceContainer.length - 1) {

                        mainDivdivPlaceContainer[e].className = 'divPlaceContainer hiddenPlace';
                        mainDivdivPlaceContainer[e - 1].className = 'divPlaceContainer shownPlace';

                        break;

                    }
                }
            })
        }
        // end of add an event listener to the previous  div place arrow



        // add an event listener to the next image arrow 
        const nextImageFavPlacePaths = document.getElementsByClassName('path_imgArr');
        for (var i = 0; i < nextImageFavPlacePaths.length; i++) {

            nextImageFavPlacePaths[i].addEventListener('click', (e) => {

                let clickedArrow = e.target;
                let svg = clickedArrow.parentElement
                let div = svg.parentElement
                let placeImagesDiv = div.parentElement;

                for (var e = 0; e < placeImagesDiv.children.length; e++) {

                    if (placeImagesDiv.children[e].className.indexOf('visible_imagesAndSvgsContainer') > -1) {

                        placeImagesDiv.children[e].className = 'imagesAndSvgsContainer nonVisible_imagesAndSvgsContainer';
                        placeImagesDiv.children[e + 1].className = 'imagesAndSvgsContainer visible_imagesAndSvgsContainer';
                        break;

                    }
                }


            })
        }
        // end of add an event listener to the next image arrow 


        // add an event listener to the prev image arrow 
        const path_prevImageArrow = document.getElementsByClassName('path_prevImageArrow');
        for (var i = 0; i < path_prevImageArrow.length; i++) {

            path_prevImageArrow[i].addEventListener('click', (e) => {

                let clickedArrow = e.target;
                let svg = clickedArrow.parentElement
                let div = svg.parentElement
                let placeImagesDiv = div.parentElement;

                for (var e = 0; e < placeImagesDiv.children.length; e++) {

                    if (placeImagesDiv.children[e].className.indexOf('visible_imagesAndSvgsContainer') > -1) {

                        placeImagesDiv.children[e].className = 'imagesAndSvgsContainer nonVisible_imagesAndSvgsContainer';
                        placeImagesDiv.children[e - 1].className = 'imagesAndSvgsContainer visible_imagesAndSvgsContainer';
                        break;

                    }
                }

            })
        }
        // end of add an event listener to the prev image arrow 



        // resize the photo of the place and add text
        function resizePhotoOfPlace() {
            var placeImages = document.getElementsByClassName('placeImage');
            let maxWidth = 100;
            let maxHeight = 100;

            for (var i = 0; i < placeImages.length; i++) {
                let srcWidth = placeImages[i].width;
                let srcHeight = placeImages[i].height;

                let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
                let newWidth = srcWidth * ratio;
                let newHeight = srcHeight * ratio;

                placeImages[i].style.widht = newWidth + 'px';
                placeImages[i].style.height = newHeight + 'px';
                placeImages[i].style.display = 'inline';
            }
        };

        setTimeout(() => {
            resizePhotoOfPlace()
        }, 100);
        // ------ end of  resize the photo of the place and add text


    } else {// if there are no tour guides for the selected neighborhood/

        // loadingTourguidesFlag = false;

        const loadingProfilesHeader = document.getElementById('loadingProfilesHeader');
        loadingProfilesHeader.style.display = 'none';
        tourguidesHeader.innerHTML = 'No tour guides for this neighborhood';

        const loadingTourguides = document.getElementById('loadingTourguides')
        loadingTourguides.style.marginTop = '1%';

        const svgLoadingProfiles = document.getElementById('svgLoadingProfiles');
        for (var i = 0; i < svgLoadingProfiles.children.length; i++) {
            svgLoadingProfiles.children[i].style.opacity = '0.4';
        }

    }

}
