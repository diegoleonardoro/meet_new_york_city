

var stringsToReplace = ['history', 'locals', 'context' , 'culture',  'residents', 'stories']


let flag = 0;
var replaceHeaderWord = function () {

    var heroHeaderComplementStr = document.getElementById('headerMainSection').innerHTML;

    setTimeout(() => {
        var wordToReplace = heroHeaderComplementStr.split(' ')[4];

        document.getElementById('headerMainSection').innerHTML = heroHeaderComplementStr.replace(wordToReplace, `<span>${stringsToReplace[flag]}</span>`);


        flag = flag + 1;

        if ( flag === stringsToReplace.length){
            flag = 0
        }

        replaceHeaderWord()

    }, 1000)


}

replaceHeaderWord()