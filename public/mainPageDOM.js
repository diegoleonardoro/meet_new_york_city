

var stringsToReplace = ['history', 'people', 'culinary', 'local']



var replaceHeaderWord = function () {


    for (let i = 0; i < stringsToReplace.length; i++) {
        var heroHeaderComplementStr = document.getElementById('heroHeaderComplement').innerHTML;

        setTimeout(() => {
            var wordToReplace = heroHeaderComplementStr.split(' ')[2];
            document.getElementById('heroHeaderComplement').innerHTML = heroHeaderComplementStr.replace(wordToReplace, `<span>${stringsToReplace[i]}</span>`)

            if (i == stringsToReplace.length - 1) {

                replaceHeaderWord()
            }

        }, i * 1300);  

    }
}

replaceHeaderWord()