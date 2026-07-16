/*=========================================
        STATISTICS
=========================================*/

function calculateStatistics(responses){

    const totalTrials = responses.length;

    const answeredTrials = responses.filter(r => r.userAnswer !== null);

    const missedTrials = responses.filter(r => r.userAnswer === null);

    const correctTrials = responses.filter(r => r.correct).length;

    const incorrectTrials = answeredTrials.length - correctTrials;

    const accuracy =
        answeredTrials.length > 0
        ? (correctTrials / answeredTrials.length) * 100
        : 0;

    const rtValues = answeredTrials
        .map(r => r.rt)
        .filter(rt => rt !== null);

    const meanRT =
        rtValues.length > 0
        ? rtValues.reduce((a,b)=>a+b,0) / rtValues.length
        : 0;

    const fastestRT =
        rtValues.length > 0
        ? Math.min(...rtValues)
        : 0;

    const slowestRT =
        rtValues.length > 0
        ? Math.max(...rtValues)
        : 0;

    return{

        totalTrials,

        answeredTrials: answeredTrials.length,

        missedTrials: missedTrials.length,

        correctTrials,

        incorrectTrials,

        accuracy,

        meanRT,

        fastestRT,

        slowestRT

    };

}


/*=========================================
        EXPORT
=========================================*/

window.calculateStatistics = calculateStatistics;
