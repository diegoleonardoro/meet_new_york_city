


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

    for (var i = 0; i < mainForm.children.length; i++) {

        var displayAttribute = getComputedStyle(mainForm.children[i]).display;

        if (displayAttribute === 'flex' || displayAttribute === 'block') {

            displayedQuestion = mainForm.children[i];
            nextQuestionKeyWord = displayedQuestion.className.split(' ')[1];

            if (displayedQuestion.className.split(' ')[0].indexOf('neighborhoodSatisfactionScale') > -1) {
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
            displayedQuestion.className = displayedQuestion.className.replace('display', '');
            for (var e = 0; e < mainForm.children.length; e++) {
                keyWord = mainForm.children[e].className.split(' ')[0];

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