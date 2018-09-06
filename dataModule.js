var dataModule = (function () {
    let newLine = '|';
    //shuffle
    let shuffle = function (list) {

        let answer = [];
        for (let i = 0; i < list.length; i++) {
            answer.push(list[i]);
        }
        answer.sort(function (item) {
            return 0.5 - Math.random();
        })
        return answer;



    }
    //capitalize random
    let capitalizeRandom = function (list) {

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        let numCapitalizeWords = Math.random() * list.length | 0;
        let ratioCapit = numCapitalizeWords / list.length;

        let ans = list.map(word => {
            let ran = Math.random();
            if (ran * 2 < ratioCapit) {

                let res = capitalizeFirstLetter(word);
                return res;

            }
            else {
                return word;
            }
        });

        return ans;

    }
    //random punctuation
    let addRandomPunctuation = function (list) {

        let punctuation = [',', ',', '!', '?', '.', ',', '', ',', '.', newLine]
        String.prototype.addPunct = function (p) {
            return this + p;
        }
        let numCapitalizeWords = Math.random() * list.length | 0;
        let ratioCapit = numCapitalizeWords / list.length;

        let ans = list.map(word => {
            let ran = Math.random();
            if (ran * 2 < ratioCapit) {
                let punctIndex = Math.random() * punctuation.length | 0;
                let res = word.addPunct(punctuation[punctIndex]);
                return res;
            }
            else {
                return word;
            }
        });

        return ans;
    }
    let numCorrectChar;
    let charCallback = function (c, i) {
        if (c === this.characters.user[i]) {
            numCorrectChar++;
        }
    }

    var appData = {
        indicators: {
            testStarted: false, testEnded: false, totalTestTime: 0, timeLeft: 0
        },
        results: {
            wpm: 0, wpmChange: 0, cpm: 0, cpmChange: 0, accuracy: 0, accuracyChange: 0, numOfCorrectWords: 0, numOfCorrectCharacters: 0, numOfTestCharacters: 0
        },
        words: {
            currentWordIndex: -1, testWords: [], currentWord: {}
        },
    };



    //word constructor
    //    {
    //      value: {correct: '', user: '' , isCorrect: false },
    //      characters: {correct: [], user: [], totalCorrect: 0, totalTest: 0 }
    //    }

    var word = function (index) {
        //      value: {correct: '', user: '' , isCorrect: false },
        this.value = {
            correct: appData.words.testWords[index] + ' ',
            user: '',
            isCorrect: false
        }
        //      characters: {correct: [], user: [], totalCorrect: 0, totalTest: 0 }
        this.characters = {
            correct: this.value.correct.split(''),
            user: [],
            totalCorrect: 0,
            totalTest: this.value.correct.length
        }

    };

    //update method
    word.prototype.update = function (value) {
        //update user input
        this.value.user = value;

        //update words status
        this.value.isCorrect = (this.value.correct === this.value.user);

        //update user characters
        this.characters.user = this.value.user.split('');

        //calculate the number of correct characters
        numCorrectChar = 0;

        let charCallbackRec = charCallback.bind(this);
        this.characters.correct.forEach(charCallbackRec);

        this.characters.totalCorrect = numCorrectChar;
    };

    return {
        //indicators - test Control
        //sets the total test time to x
        setTestTime: function (x) {
            appData.indicators.totalTestTime = x;
        },
        //initializes time left to the total test time
        initializeTimeLeft() {
            appData.indicators.timeLeft = appData.indicators.totalTestTime;

        },
        //starts the test
        startTest: function () {
            appData.indicators.testStarted = true;

        },
        //ends the test
        //return the remaining test time
        endTest: function () {
            appData.indicators.testEnded=true;

         },

        getTimeLeft: function () {
            return appData.indicators.timeLeft;
        },
        // reduces the time by one sec
        reduceTime: function () {
            appData.indicators.timeLeft--;
            return appData.indicators.timeLeft;
        },
        //checks if there is time left to continue the test
        timeLeft() {
            return appData.indicators.timeLeft !== 0;
        },
        //checks if the test has already ended
        testEnded() {
            return appData.indicators.testEnded;
        },
        //checks if the test has started
        testStarted() {
            return appData.indicators.testStarted;
        },

        //results
        //calculates wpm and wpmChange and updates them in appData
        calculateWpm: function () {
            var wpmOld = appData.results.wpm;
            var numOfCorrectWords = appData.results.numOfCorrectWords;
            if (appData.indicators.timeLeft !== appData.indicators.totalTestTime) {
                appData.results.wpm
                    = Math.round(60 * numOfCorrectWords / (appData.indicators.totalTestTime - appData.indicators.timeLeft))
            }
            else {
                appData.results.wpm = 0;
            }
            appData.results.wpmChange = appData.results.wpm - wpmOld;
            return [appData.results.wpm, appData.results.wpmChange];

        },
        //calculates cpm and cpmChange and updates them in appData
        calculateCpm: function () {
            var cpmOld = appData.results.cpm;
            var numOfCorrectCharacters = appData.results.numOfCorrectCharacters;
            if (appData.indicators.timeLeft !== appData.indicators.totalTestTime) {
                appData.results.cpm
                    = Math.round(60 * numOfCorrectCharacters / (appData.indicators.totalTestTime - appData.indicators.timeLeft))
            }
            else {
                appData.results.cpm = 0;
            }
            appData.results.cpmChange = appData.results.cpm - cpmOld;
            return [appData.results.cpm, appData.results.cpmChange];


        },
        //calculates accuracy and accuracyChange and updates them in appData
        calculateAccuracy: function () {
            var accuracyOld = appData.results.accuracy;
            var numOfCorrectCharacters = appData.results.numOfCorrectCharacters;
            var numOfTestCharacters = appData.results.numOfTestCharacters;
            if (appData.indicators.timeLeft !== appData.indicators.totalTestTime) {
                appData.results.accuracy
                    = numOfTestCharacters !== 0 ? Math.round(100 * numOfCorrectCharacters / numOfTestCharacters) : 0;


            }
            else {
                appData.results.accuracy = 0;
            }
            appData.results.accuracyChange = appData.results.accuracy - accuracyOld;

            return [appData.results.accuracy, appData.results.accuracyChange];


        },

        //test words
        // fills words.testWords
        fillListOfTestWords: function (textNumber, words) {
            let result = words.split(" ");

            if (textNumber === 0) {
                //shuffle the words
                result = shuffle(result);

                //capitalize random words
                result = capitalizeRandom(result)

                //add random punctuation
                result = addRandomPunctuation(result);

            }
            appData.words.testWords = result;

        },
        // get list of test words: words.testWords
        getListofTestWords() {

            return appData.words.testWords;
        },
        // increments the currentWordIndex - updates the current word (appData.words.currentWord)
        // by creating a new instance of the word class - updates numOfCorrectWords, numOfCorrectCharacters 
        //and numOfTestCharacters
        moveToNewWord: function () {
            if (appData.words.currentWordIndex > -1) {
                //update number of correct words
                if (appData.words.currentWord.value.isCorrect) {
                    appData.results.numOfCorrectWords++;
                }
                //update number of correct characters
                appData.results.numOfCorrectCharacters += appData.words.currentWord.characters.totalCorrect;
                //update number of test characters
                appData.results.numOfTestCharacters += appData.words.currentWord.characters.totalTest;
            }

            appData.words.currentWordIndex++;
            let currentIndex = appData.words.currentWordIndex;
            let newWord = new word(currentIndex)
            appData.words.currentWord = newWord;
        },
        //get the current word index
        getCurrentWordIndex: function () {
            return appData.words.currentWordIndex;
        },
        getCurrentWord: function () {
            let currentWord = appData.words.currentWord;
            return {
                value: {
                    correct: currentWord.value.correct,
                    user: currentWord.value.user
                }
            }
        },
        // updates current word using user input
        updateCurrentWord: function (value) {
            appData.words.currentWord.update(value);

        },
        getLineReturn() {
            return newLine;
        },
        getCertificateData(){
            return{
                wpm:appData.results.wpm,
                accuracy:appData.results.accuracy
            }
        },
        testReturnData() {
            console.log(appData);
        }
    }

})();