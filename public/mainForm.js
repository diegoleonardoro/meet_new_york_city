

// grab the arrows

var prevQuestion = document.getElementById('prevQuestionSvg');
var nextQuestion = document.getElementById('nextQuestionSvg');

var mainForm = document.getElementsByClassName('form')[0];

nextQuestion.addEventListener('click', () => {


    let displayedQuestion;
    let nextQuestionKeyWord;

    let keyWord;
    let nextQuestion;

    let keywordsLikerExplanation = [];

    for (var i = 0; i < mainForm.children.length; i++) {// 1. --> iterate through all form children 

        var displayAttribute = getComputedStyle(mainForm.children[i]).display;// 2. --> get the display value of the form children.

        if (displayAttribute === 'flex' || displayAttribute === 'block') {// 3. --> if the display value of that form children is 'flex' of 'block'

            displayedQuestion = mainForm.children[i]; // 4. ---> 'displayedQuestion' represents the fomr child that is displayed.

            nextQuestionKeyWord = displayedQuestion.className.split(' ')[1]; // 5. ---> 'nextQuestionKeyWord' represents the key word that will display the next question



            if (displayedQuestion.className.split(' ')[0].indexOf('neighborhoodSatisfactionScale') > -1) {// 
                for (let c = 0; c < displayedQuestion.children.length; c++) {

                    let span = displayedQuestion.children[c];
                    if (span.className.indexOf('likertOptions') > -1) {
                        for (let d = 1; d < span.children.length; d++) {

                            let span2 = span.children[d];
                            let input = span2.children[0];

                            if (input.checked) {
                                var className = input.className.split(' ')[0];
                                keywordsLikerExplanation.push(className);
                            }
                        }
                    }
                }
            }


            displayedQuestion.className = displayedQuestion.className.replace('display', '');// 6. ---> hide the questions that was being displayed when the arrow was clicked

            for (var e = 0; e < mainForm.children.length; e++) {// 7. ---> iterate again through the form children.

                keyWord = mainForm.children[e].className.split(' ')[0];// 8. ---> 'keyWord' represents the word that will show the next questions

                if (keyWord === nextQuestionKeyWord) {
                    nextQuestion = mainForm.children[e];
                    if (keyWord != 'neighborhoodSatisfactionScale') {
                        nextQuestion.className = nextQuestion.className + ' display';
                    } else if (keyWord === 'neighborhoodSatisfactionScale') {
                        nextQuestion.className = nextQuestion.className + ' displayLikert';
                    }

                    if (keyWord === 'satisfactionScaleExplanation') {
                        for (var w = 0; w < nextQuestion.children.length; w++) {
                            if (keywordsLikerExplanation.includes(nextQuestion.children[w].className.split(' ')[1])) {
                                nextQuestion.children[w].className = nextQuestion.children[w].className + ' display';

                            }
                        }
                    }
                    break;
                }

            }

            break;
        }
    }

})


// previous arrow:


prevQuestion.addEventListener('click', () => {


    let displayedQuestion;
    let prevQuestionKeyWord;

    let keyWord;
    let prevQuestion;

    let keywordsLikerExplanation = [];

    for (var i = 0; i < mainForm.children.length; i++) {// 1. --> iterate through all form children 

        var displayAttribute = getComputedStyle(mainForm.children[i]).display;// 2. --> get the display value of the form children.

        if (displayAttribute === 'flex' || displayAttribute === 'block') {// 3. --> if the display value of that form children is 'flex' of 'block'

            displayedQuestion = mainForm.children[i]; // 4. ---> 'displayedQuestion' represents the fomr child that is displayed.


            prevQuestionKeyWord = displayedQuestion.className.split(' ')[0];  // 5. ---> 'prevQuestionKeyWord' represents the key word that will display the previous question


            displayedQuestion.className = displayedQuestion.className.replace('display', ' ');// 6. ---> hide the questions that was being displayed when the arrow was clicked


        
            for (var e = 0; e < mainForm.children.length; e++) {// 7. ---> iterate again through the form children.


                keyWord = mainForm.children[e].className.split(' ')[1];// 8. ---> 'keyWord' represents the word that will show the previous question

                if (keyWord === prevQuestionKeyWord) {

                    prevQuestion = mainForm.children[e];


                    if (keyWord != 'neighborhoodSatisfactionScale') {
                        prevQuestion.className = prevQuestion.className + ' display';
                    } else if (keyWord === 'neighborhoodSatisfactionScale') {
                        prevQuestion.className = prevQuestion.className + ' displayLikert';
                    }

                    if (keyWord === 'satisfactionScaleExplanation') {
                        for (var w = 0; w < prevQuestion.children.length; w++) {
                            if (keywordsLikerExplanation.includes(prevQuestion.children[w].className.split(' ')[1])) {
                                prevQuestion.children[w].className = prevQuestion.children[w].className + ' display';

                            }
                        }
                    }
                    break;
                }
            }


            



            break;

        }
    }

})