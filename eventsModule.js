var eventsModule = (function (dModule, uModule, cModule, wModule) {
    var addEventListeners = function () {

        //enter click event
        uModule.getDOMElements().textInput.addEventListener('keydown', function (event) {
            if (dModule.testEnded()) {
                return;
            }
            //check if the user pressed enter key
            let key = event.keyCode;
            if (key === 13) {
                uModule.getDOMElements().textInput.value += dModule.getLineReturn() + ' ';

                //cretate new 'input' event
                let inputEvent = new Event('input');

                //dispatch it
                uModule.getDOMElements().textInput.dispatchEvent(inputEvent);
            }
        })
        //character typing event listener
        uModule.getDOMElements().textInput.addEventListener('input', function (event) {
            //check if test ended
            if (dModule.testEnded()) {
                return;
            }
            //if test started
            if (!dModule.testStarted()) {
                //start the test data module
                dataModule.startTest();
                //start counter
                var b = setInterval(function () {
                    //calculate the results data module

                    //update wpm and wpm change
                    var results = {};
                    [results.wpm, results.wpmChange] = dataModule.calculateWpm();
                    //update cpm and cpm change
                   
                    [results.cpm, results.cpmChange] = dataModule.calculateCpm();
                    //update accuracy and accuracy change
                   
                    [results.accuracy, results.accuracyChange] = dataModule.calculateAccuracy();
                    //update results in UI module
                    uModule.updateResults(results);
                    //update timeleft
                    if (dModule.timeLeft()) {
                        var timeLeft = dModule.reduceTime();
                        //update time remaining in UI
                        uModule.updateTimeLeft(timeLeft);
                    }
                    else{
                        clearInterval(b);
                        dModule.endTest();
                        dModule.testReturnData();
                        //fill the modal
                        uModule.fillModal(results.wpm);
                        //show the modal
                        uModule.showModal();
                    }

                    //dModule.testReturnData();
                }, 1000);
            }
            //get typed word:UI module
            let typedWord = uModule.getTypedWord();
            //update current word:data Module
            dModule.updateCurrentWord(typedWord);
            //format the active word
            let curWord = dModule.getCurrentWord();
            uModule.formatWord(curWord);
            //check if user press space or enter
            if (UIModule.spacePressed(event) || UIModule.enterPressed(dModule.getLineReturn())) {
                //console.log('spassed Pressed'); //test if getting space
                //empty text input
                uModule.emptyInput();

                //deactivate current word
                uModule.deactivateCurrentWord();

                //move to a new word :Data module
                dModule.moveToNewWord();

                //set active word: UI module
                let curWordIndex = dModule.getCurrentWordIndex();
                uModule.setActiveWord(curWordIndex);

                //format activ word: UI module
                let curWord = dModule.getCurrentWord();
                uModule.formatWord(curWord);

                //scroll word into the middle view
                uModule.scroll();
            }

        })
        //click on download button event listener
        uModule.getDOMElements().download.addEventListener('click',function(e){
            if(uModule.isNameEmpty()){
                uModule.flagNameInput();
            }
            else{
                var certificateData=dModule.getCertificateData();
                certificateModule.generateCertificate(certificateData);
            }
        })
        //click on restart button event listener

    };
    //scroll in the middle view on window resize
    window.addEventListener('resize', UIModule.scroll);

    return {
        //init function, initializes the test before start
        init: function (duration, textNumber) {
            //fill the list of the words: data module
            let words = wModule.getWords(textNumber);

            dModule.fillListOfTestWords(textNumber, words);

            //fill the list of the words: UI  module
            let testWords = dataModule.getListofTestWords();
            let lineReturn = dataModule.getLineReturn();
            uModule.fillContent(testWords, lineReturn);
            //set the total test time
            dModule.setTestTime(duration);
            //update time left: data Module
            dModule.initializeTimeLeft();
            //update time left:UI module
            var timeLeft = dModule.getTimeLeft();
            uModule.updateTimeLeft(timeLeft);

            //move to a new word :Data module
            dModule.moveToNewWord();

            //set active word: UI module
            let curWordIndex = dModule.getCurrentWordIndex();
            uModule.setActiveWord(curWordIndex);

            //format activ word: UI module
            let curWord = dModule.getCurrentWord();
            uModule.formatWord(curWord);

            //focus on text input: UI module
            uModule.inputFocus();
            //add event listeners

            addEventListeners();
        }
    };


})(dataModule, UIModule, certificateModule, wordsModule);