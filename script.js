```javascript
(function () {
  let testDuration = 60;
  let timeRemaining = 0;
  let countdownTimer = null;
  let taskTimer = null;
  let trialNumber = 0;
  let currentTrial = null;
  let trialStartTime = 0;
  let responses = [];
  let testActive = false;
  let trialResponded = false;

  const setupEl = document.getElementById("setup");
  const startBtn = document.getElementById("startBtn");
  const countdownEl = document.getElementById("countdown");
  const statusEl = document.getElementById("status");
  const timeLeftEl = document.getElementById("timeLeft");
  const trialNowEl = document.getElementById("trialNow");
  const taskAreaEl = document.getElementById("taskArea");
  const topCardEl = document.getElementById("topCard");
  const bottomCardEl = document.getElementById("bottomCard");
  const topStimulusEl = document.getElementById("topStimulus");
  const bottomStimulusEl = document.getElementById("bottomStimulus");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const resultsEl = document.getElementById("results");
  const testDurationEl = document.getElementById("testDuration");

  function resetState() {
    timeRemaining = testDuration;
    trialNumber = 0;
    currentTrial = null;
    trialStartTime = 0;
    responses = [];
    testActive = false;
    trialResponded = false;
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return (
      String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0")
    );
  }

  function startCountdown() {
    setupEl.style.display = "none";
    countdownEl.style.display = "block";
    let count = 3;
    countdownEl.textContent = String(count);

    countdownTimer = setInterval(function () {
      count--;
      if (count > 0) {
        countdownEl.textContent = String(count);
      } else {
        clearInterval(countdownTimer);
        countdownTimer = null;
        countdownEl.style.display = "none";
        startTask();
      }
    }, 1000);
  }

  function startTask() {
    resetState();
    testActive = true;

    statusEl.style.display = "block";
    taskAreaEl.style.display = "block";
    resultsEl.style.display = "none";

    timeLeftEl.textContent = formatTime(timeRemaining);
    trialNowEl.textContent = String(trialNumber);

    nextTrial();

    taskTimer = setInterval(function () {
      timeRemaining--;
      timeLeftEl.textContent = formatTime(Math.max(timeRemaining, 0));

      if (timeRemaining <= 0) {
        endTask();
      }
    }, 1000);

    document.addEventListener("keydown", handleKeydown);
    yesBtn.addEventListener("click", handleYesClick);
    noBtn.addEventListener("click", handleNoClick);
  }

  function nextTrial() {
    currentTrial = window.generateTrial();
    trialResponded = false;
    trialNumber++;
    trialNowEl.textContent = String(trialNumber);
    displayTrial(currentTrial);
    trialStartTime = performance.now();
  }

  function displayTrial(trial) {
    topCardEl.classList.remove("active", "inactive");
    bottomCardEl.classList.remove("active", "inactive");
    topStimulusEl.textContent = "";
    bottomStimulusEl.textContent = "";

    if (trial.activeTask === "top") {
      topCardEl.classList.add("active");
      bottomCardEl.classList.add("inactive");
      topStimulusEl.textContent = trial.stimulus.text;
    } else if (trial.activeTask === "bottom") {
      bottomCardEl.classList.add("active");
      topCardEl.classList.add("inactive");
      bottomStimulusEl.textContent = trial.stimulus.text;
    }
  }

  function handleKeydown(e) {
    if (!testActive) return;
    if (e.repeat) return;
    if (e.key === "ArrowRight") {
      recordResponse(true);
    } else if (e.key === "ArrowLeft") {
      recordResponse(false);
    }
  }

  function handleYesClick() {
    if (!testActive) return;
    recordResponse(true);
  }

  function handleNoClick() {
    if (!testActive) return;
    recordResponse(false);
  }

  function recordResponse(userAnswer) {
    if (!testActive || !currentTrial || trialResponded) return;
    trialResponded = true;

    const rt = performance.now() - trialStartTime;
    const correct = userAnswer === currentTrial.correctAnswer;

    responses.push({
      trial: trialNumber,
      activeTask: currentTrial.activeTask,
      stimulus: currentTrial.stimulus.text,
      userAnswer: userAnswer,
      correctAnswer: currentTrial.correctAnswer,
      correct: correct,
      rt: rt
    });

    if (testActive) {
      nextTrial();
    }
  }

  function endTask() {
    if (!testActive) return;
    testActive = false;

    if (currentTrial && !trialResponded) {
      trialResponded = true;
      responses.push({
        trial: trialNumber,
        activeTask: currentTrial.activeTask,
        stimulus: currentTrial.stimulus.text,
        userAnswer: null,
        correctAnswer: currentTrial.correctAnswer,
        correct: false,
        rt: null
      });
    }

    if (taskTimer) {
      clearInterval(taskTimer);
      taskTimer = null;
    }
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }

    document.removeEventListener("keydown", handleKeydown);
    yesBtn.removeEventListener("click", handleYesClick);
    noBtn.removeEventListener("click", handleNoClick);

    taskAreaEl.style.display = "none";
    statusEl.style.display = "none";

    showResults();
  }

  function computeStatistics() {
    const answeredResponses = responses.filter(function (r) {
      return r.userAnswer !== null;
    });

    const totalTrials = responses.length;
    const correctTrials = responses.filter(function (r) {
      return r.correct;
    }).length;
    const incorrectTrials = totalTrials - correctTrials;
    const accuracy = totalTrials > 0 ? (correctTrials / totalTrials) * 100 : 0;

    let meanRT = 0;
    if (answeredResponses.length > 0) {
      const sumRT = answeredResponses.reduce(function (sum, r) {
        return sum + r.rt;
      }, 0);
      meanRT = sumRT / answeredResponses.length;
    }

    return {
      totalTrials: totalTrials,
      correctTrials: correctTrials,
      incorrectTrials: incorrectTrials,
      accuracy: accuracy,
      meanRT: meanRT
    };
  }

  function showResults() {
    const stats = computeStatistics();

    resultsEl.innerHTML =
      "<h2>Results</h2>" +
      "<p>Total Trials: " + stats.totalTrials + "</p>" +
      "<p>Correct: " + stats.correctTrials + "</p>" +
      "<p>Incorrect: " + stats.incorrectTrials + "</p>" +
      "<p>Accuracy: " + stats.accuracy.toFixed(2) + "%</p>" +
      "<p>Mean RT: " + Math.round(stats.meanRT) + " ms</p>";

    resultsEl.style.display = "block";
  }

  function handleStartClick() {
    const durationValue = parseInt(testDurationEl.value, 10);
    testDuration = isNaN(durationValue) ? 60 : durationValue;
    startCountdown();
  }

  startBtn.addEventListener("click", handleStartClick);
})();
```
