var UIModule = (function () {

    //classes used to select HTML elements
    var DOMElements = {
        timeLeft: document.getElementById('timeLeft'), //HTML element displaying time left
        //test results
        wpm: document.getElementById('wpm'),
        wpmChange: document.getElementById('wpmChange'),
        cpm: document.getElementById('cpm'),
        cpmChange: document.getElementById('cpmChange'),
        accuracy: document.getElementById('accuracy'),
        accuracyChange: document.getElementById('accuracyChange'),
        //user input
        textInput: document.getElementById('input'),
        nameInput: document.querySelector('.form-group'),
        nameField:document.getElementById('name'),
        //test words
        content: document.getElementById('content'),
        activeWord: '',
        //modal
        modal: $('#myModal'),
        //download button in modal
        download:document.getElementById('download')
    };

    var splitArray = function (string) {
        return string.split('');
    };

    var addSpace = function (array) {
        array.push(' ');
        return array;
    };

    var addSpanTags = function (array) {
        return array.map(function (currentCharacter) {
            return '<span>' + currentCharacter + '</span>';
        });
    };

    var addWordSpanTags = function (array) {
        array.push('</span>');
        array.unshift('<span>');
        return array;
    };

    var joinEachWord = function (array) {
        return array.join('');
    };
    let userValue;
    let returnCharacterClass = function (d, i) {
        if (i < userValue.length) {
            return d === userValue[i] ? 'correctChar' : 'wrongChar'
        }
        else {
            return '0';
        }
    }
    let updateChange = function (value, changeElement) {
        //determine the color of changeElement and add class
        var classToAdd, html;
        [classToAdd, html] = (value >= 0) ?
            ['scoreUp', '+' + value] : ['scoreDown', value];
        //add % sign if accuracy
        if (changeElement ===DOMElements.accuracyChange) {
            [classToAdd, html] = (value >= 0) ?
                ['scoreUp', '+' + value + '%'] : ['scoreDown', value + '%'];
        }

        //update the change element
        changeElement.innerHTML = html;
        //style the change element
        changeElement.removeAttribute('class');
        changeElement.className = classToAdd;
        //fade element
        fadeElement(changeElement);

    }
    let fadeElement=function(changeElement){
        changeElement.style.opacity=1;
        setTimeout(()=>{
             changeElement.style.opacity=0.8;
        },100);
    }


    return {

        //get DOM elements

        getDOMElements() {
            return {
                textInput: DOMElements.textInput,
                download:DOMElements.download
            };
        },

        //Indicators - Test Control

        updateTimeLeft: function (x) {
            DOMElements.timeLeft.innerHTML = x;
        },

        //results

        updateResults: function (results) {
            //update wpm
            DOMElements.wpm.innerText = results.wpm;
            //update cpm
            DOMElements.cpm.innerText = results.cpm;
            //update wpm
            DOMElements.accuracy.innerText = results.accuracy + '%';

            //update changes
            updateChange(results.wpmChange, DOMElements.wpmChange);
            updateChange(results.cpmChange, DOMElements.cpmChange);
            updateChange(results.accuracyChange, DOMElements.accuracyChange);


        },

        fillModal: function (wpm) {
            var result;
            if(wpm<40){
                result={
                    type:'turtle',
                    image:'turtle.jpg',
                    level:'Begginer'
                };
            }
            else if(wpm<70){
                result={
                    type:'horse',
                    image:'horse.jpg',
                    level:'Average'
                };
            }
            else {
                result={
                    type:'puma',
                    image:'puma.jpg',
                    level:'Expert'
                };
            }
            var html='<div class="result">'+
            '<p>You are a %type%!</p>'+
            '<p>You type at a speed of %wpm% words per minute!</p>'+
            '<img width="300" height="200" class="rounded-circle" src=images/%image% alt=%alt%>'+
            '</div>';
            html=html.replace('%type%',result.type);
            html=html.replace('%wpm%', wpm);
            html=html.replace('%image%',result.image);
            html=html.replace('%alt%',result.type);

            //insert html before form group
            DOMElements.nameInput.insertAdjacentHTML('beforebegin',html);
            //store the value of level in download button
            DOMElements.download.setAttribute('level', result.level);
         },

        showModal: function () {
            DOMElements.modal.modal('show');

         },

        //user input

        inputFocus: function () {
            DOMElements.textInput.focus();
        },

        isNameEmpty: function () { 
            return DOMElements.nameField.value==='';
        },

        flagNameInput: function () {
            DOMElements.nameField.style.borderColor='red';
         },

        spacePressed: function (event) {
            return event.data === " ";
        },

        enterPressed: function (lineReturn) {

            // return this.getTypedWord().includes(lineReturn+' ');
            return DOMElements.textInput.value.includes(lineReturn + ' ');

        },

        emptyInput: function () {

            DOMElements.textInput.value = '';
        },

        getTypedWord: function () {
            console.log(DOMElements.textInput.value);
            return DOMElements.textInput.value;
        },

        //test words

        fillContent: function (array, lineReturn) {
            //['word1,', 'word2']
            var content = array.map(splitArray);
            //[['w', 'o', 'r', 'd', '1', ',' ], ['w', 'o', 'r', 'd', '2']]
            content = content.map(addSpace);

            //[['w', 'o', 'r', 'd', '1', ',', ' ' ], ['w', 'o', 'r', 'd', '2', ' ']]
            content = content.map(addSpanTags);

            //[['<span>w</span>', '<span>o</span>', '<span>r</span>', '<span>d</span>', '<span>1</span>', '<span>,</span>', '<span> </span>'], ['<span>w</span>', '<span>o</span>', '<span>r</span>', '<span>d</span>', '<span>1</span>', '<span> </span>']]
            content = content.map(addWordSpanTags);

            //[['<span>', '<span>w</span>', '<span>o</span>', '<span>r</span>', '<span>d</span>', '<span>1</span>', '<span>,</span>', '<span> </span>', '</span>'], ['<span>', '<span>w</span>', '<span>o</span>', '<span>r</span>', '<span>d</span>', '<span>1</span>', '<span> </span>', '</span>']]
            content = content.map(joinEachWord);

            content = content.join('');
            // console.log(content);

            //<span><span>w</span><span>o</span><span>r</span><span>d</span><span>1</span><span>,</span><span> </span></span><span><span>w</span><span>o</span><span>r</span><span>d</span><span>2</span><span> </span></span>


            //replace the line return special code with the HTML entity (line return)

            // <span>|</span>
            // <span>&crarr;</span>
            //            content = content.replace('<span>|</span>', '<span>&crarr;</span>');
            //split, join
            content = content.split('<span>' + lineReturn + '</span>').join('<span>&crarr;</span>');


            //fill content
            DOMElements.content.innerHTML = content;
        },

        formatWord: function (wordObject) {
            let activeWord = DOMElements.activeWord;
            activeWord.className = 'activeWord';

            //format individual characters
            let correctValue = wordObject.value.correct;
            userValue = wordObject.value.user;

            let classes = Array.prototype.map.call(correctValue, returnCharacterClass);
            //get activ word
            activeWord = DOMElements.activeWord;
            //html collection
            let chars = activeWord.children;
            //loop 
            for (let i = 0; i < chars.length; i++) {
                chars[i].removeAttribute('class');
                chars[i].className = classes[i];
            }
        },

        setActiveWord: function (index) {
            DOMElements.activeWord = DOMElements.content.children[index];
        },

        deactivateCurrentWord: function () {
            DOMElements.activeWord.removeAttribute('class');
        },

        scroll: function () {
            activeWord = DOMElements.activeWord;
            content = DOMElements.content;

            let top1 = activeWord.offsetTop;
            let top2 = content.offsetTop;
            //in the middle of content
            let diff = top1 - top2 - 120 / 3;
            //scroll
            DOMElements.content.scrollTop = diff;
        }

    }
})();