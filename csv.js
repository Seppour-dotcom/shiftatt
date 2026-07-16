/*=========================================
        CSV EXPORT
=========================================*/

function exportCSV(responses){

    if(!responses || responses.length === 0){

        alert("No data available.");

        return;

    }

    const headers = [

        "Trial",
        "ActiveTask",
        "Stimulus",
        "UserAnswer",
        "CorrectAnswer",
        "Correct",
        "ReactionTime(ms)"

    ];

    const rows = responses.map(r => [

        r.trial,

        r.activeTask,

        r.stimulus,

        r.userAnswer,

        r.correctAnswer,

        r.correct,

        r.rt

    ]);

    const csv = [

        headers.join(","),

        ...rows.map(row => row.join(","))

    ].join("\n");

    const blob = new Blob(

        [csv],

        {

            type:"text/csv;charset=utf-8;"

        }

    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const now = new Date();

    const filename =

        "ShiftingAttention_" +

        now.getFullYear() +

        "-" +

        String(now.getMonth()+1).padStart(2,"0") +

        "-" +

        String(now.getDate()).padStart(2,"0") +

        "_" +

        String(now.getHours()).padStart(2,"0") +

        "-" +

        String(now.getMinutes()).padStart(2,"0") +

        "-" +

        String(now.getSeconds()).padStart(2,"0") +

        ".csv";

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}


/*=========================================
        EXPORT
=========================================*/

window.exportCSV = exportCSV;
