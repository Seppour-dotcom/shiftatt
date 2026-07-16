/*=========================================
        CONSTANTS
=========================================*/

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const VOWELS = ["A","E","I","O","U"];


/*=========================================
        RANDOM HELPERS
=========================================*/

function randomInt(min, max){

    return Math.floor(Math.random() * (max - min + 1)) + min;

}

function randomChoice(array){

    return array[randomInt(0, array.length - 1)];

}

function randomBoolean(){

    return Math.random() < 0.5;

}


/*=========================================
        GENERATE STIMULUS
=========================================*/

function generateStimulus(){

    const letter = randomChoice(LETTERS);

    const number = randomInt(1,9);

    const letterFirst = randomBoolean();

    return{

        letter,

        number,

        text: letterFirst
            ? `${letter}${number}`
            : `${number}${letter}`

    };

}


/*=========================================
        GENERATE TRIAL
=========================================*/

function generateTrial(){

    const stimulus = generateStimulus();

    const topTask = randomBoolean();

    let correctAnswer;

    if(topTask){

        // بالا فعال است
        // آیا عدد زوج است؟

        correctAnswer = stimulus.number % 2 === 0;

    }
    else{

        // پایین فعال است
        // آیا حرف صدادار است؟

        correctAnswer = VOWELS.includes(stimulus.letter);

    }

    return{

        activeTask : topTask ? "top" : "bottom",

        stimulus,

        correctAnswer

    };

}


/*=========================================
        EXPORT
=========================================*/

// برای استفاده در script.js

window.generateTrial = generateTrial;
