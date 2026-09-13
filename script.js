/* =========================================================
   SAIMOON.EXE
   COMPLETE GAME ENGINE
========================================================= */

/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let xp = 0;
let level = 1;
let soundEnabled = true;

let missionStarted = false;
let missionCompleted = false;


/* =========================================================
   GAME 1
========================================================= */

let catchScore = 0;
let catchRunning = false;


/* =========================================================
   GAME 2
========================================================= */

let questionAnswered = false;


/* =========================================================
   GAME 3
========================================================= */

let combo = 0;
let comboRunning = false;
let comboTime = 10;
let comboTimer = null;


/* =========================================================
   GAME 4
========================================================= */

let findRound = 0;
let findActive = false;


/* =========================================================
   GAME 5
========================================================= */

let love = 0;


/* =========================================================
   GAME 6
========================================================= */

let mysteryOpened = false;


/* =========================================================
   MEMORY
========================================================= */

let memoryFirst = null;
let memorySecond = null;
let memoryLock = false;
let memoryMatches = 0;


/* =========================================================
   AUDIO
========================================================= */

let audioContext = null;

function getAudio(){

    if(!soundEnabled){
        return null;
    }

    try{

        if(!audioContext){

            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

        }

        return audioContext;

    }catch(error){

        return null;

    }

}

function playSound(
    frequency = 500,
    duration = .08,
    type = "sine"
){

    const ctx = getAudio();

    if(!ctx){
        return;
    }

    try{

        const oscillator =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.value =
            frequency;

        gain.gain.setValueAtTime(
            .05,
            ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            .001,
            ctx.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();

        oscillator.stop(
            ctx.currentTime + duration
        );

    }catch(error){}

}

function playSuccessSound(){

    playSound(700,.08);
    
    setTimeout(()=>{
        playSound(900,.1);
    },100);

}

function playFinalSound(){

    playSound(600,.1);

    setTimeout(()=>{
        playSound(800,.1);
    },120);

    setTimeout(()=>{
        playSound(1000,.18);
    },250);

}


/* =========================================================
   LOADING SCREEN
========================================================= */

window.addEventListener(
    "load",
    startLoader
);

function startLoader(){

    let percent = 0;

    const percentText =
        document.getElementById(
            "loaderPercent"
        );

    const progress =
        document.getElementById(
            "loaderProgress"
        );

    const interval =
        setInterval(()=>{

            percent +=
                Math.floor(
                    Math.random()*8
                ) + 3;

            if(percent >= 100){

                percent = 100;

                clearInterval(interval);

                setTimeout(()=>{
                    document
                        .getElementById("loader")
                        .classList.add("hide");
                },500);

            }

            progress.style.width =
                percent + "%";

            percentText.textContent =
                percent + "%";

        },90);

}


/* =========================================================
   STAR GENERATOR
========================================================= */

function createStars(){

    const container =
        document.getElementById("stars");

    for(let i=0;i<180;i++){

        const star =
            document.createElement("div");

        star.className="star";

        star.style.left =
            Math.random()*100 + "%";

        star.style.top =
            Math.random()*100 + "%";

        star.style.opacity =
            Math.random();

        star.style.animationDelay =
            Math.random()*4 + "s";

        star.style.animationDuration =
            2 + Math.random()*5 + "s";

        const size =
            Math.random()*2.5 + 1;

        star.style.width =
            size + "px";

        star.style.height =
            size + "px";

        container.appendChild(star);

    }

}

createStars();


/* =========================================================
   PARTICLES
========================================================= */

function createParticles(){

    const container =
        document.getElementById("particles");

    for(let i=0;i<35;i++){

        const particle =
            document.createElement("div");

        particle.className="particle";

        particle.style.left =
            Math.random()*100 + "%";

        particle.style.animationDuration =
            10 + Math.random()*15 + "s";

        particle.style.animationDelay =
            Math.random()*10 + "s";

        const size =
            1 + Math.random()*3;

        particle.style.width =
            size + "px";

        particle.style.height =
            size + "px";

        container.appendChild(particle);

    }

}

createParticles();


/* =========================================================
   FLOATING HEARTS
========================================================= */

const heartEmojis = [
    "❤️",
    "💖",
    "💕",
    "💗",
    "💓",
    "💞",
    "💘",
    "✨"
];

function createFloatingHeart(){

    const container =
        document.getElementById(
            "floatingHearts"
        );

    const heart =
        document.createElement("div");

    heart.className =
        "float-heart";

    heart.textContent =
        heartEmojis[
            Math.floor(
                Math.random() *
                heartEmojis.length
            )
        ];

    heart.style.left =
        Math.random()*100 + "%";

    heart.style.fontSize =
        12 + Math.random()*22 + "px";

    heart.style.animationDuration =
        7 + Math.random()*8 + "s";

    container.appendChild(heart);

    setTimeout(()=>{
        heart.remove();
    },16000);

}

setInterval(
    createFloatingHeart,
    650
);


/* =========================================================
   NAVIGATION
========================================================= */

function goTo(id){

    const element =
        document.getElementById(id);

    if(!element){
        return;
    }

    element.scrollIntoView({
        behavior:"smooth",
        block:"start"
    });

}

function startMission(){

    if(!missionStarted){

        missionStarted=true;

        addXP(20);

        playSuccessSound();

        showToast(
            "🚀 Mission Started!"
        );

    }

    goTo("level1");

}


/* =========================================================
   XP SYSTEM
========================================================= */

function addXP(amount){

    xp += amount;

    if(xp > 1000){
        xp = 1000;
    }

    level =
        Math.min(
            10,
            Math.floor(xp / 100) + 1
        );

    updateXPUI();

}

function updateXPUI(){

    const xpText =
        document.getElementById(
            "xpText"
        );

    const xpFill =
        document.getElementById(
            "xpFill"
        );

    const levelText =
        document.getElementById(
            "levelText"
        );

    if(xpText){
        xpText.textContent = xp;
    }

    if(xpFill){
        xpFill.style.width =
            (xp / 1000 * 100) + "%";
    }

    if(levelText){
        levelText.textContent =
            level;
    }

}


/* =========================================================
   TOAST
========================================================= */

let toastTimeout;

function showToast(message){

    const toast =
        document.getElementById(
            "toast"
        );

    toast.textContent =
        message;

    toast.classList.add("show");

    clearTimeout(
        toastTimeout
    );

    toastTimeout =
        setTimeout(()=>{

            toast.classList.remove(
                "show"
            );

        },2300);

}


/* =========================================================
   INSTRUCTIONS
========================================================= */

function showInstructions(){

    openPopup(
        "🎮",
        "How To Play",
        "একেকটা level complete করো, XP collect করো এবং শেষে Mission Result দেখো। সব game খেলতেই হবে না—কিন্তু সবগুলো খেললে final score বেশি হবে! ❤️"
    );

}


/* =========================================================
   LEVEL 1 — CATCH HEART
========================================================= */

function startCatchGame(){

    catchScore = 0;
    catchRunning = true;

    const heart =
        document.getElementById(
            "catchHeart"
        );

    const count =
        document.getElementById(
            "catchCount"
        );

    const message =
        document.getElementById(
            "catchMessage"
        );

    count.textContent =
        "0";

    heart.style.display =
        "block";

    message.textContent =
        "ধরতে পারলে +20 XP ❤️";

    document.getElementById(
        "catchStart"
    ).textContent =
        "🏃 CATCH IT!";

    moveCatchHeart();

    playSound(650,.1);

}

function moveCatchHeart(){

    if(!catchRunning){
        return;
    }

    const arena =
        document.getElementById(
            "catchArena"
        );

    const heart =
        document.getElementById(
            "catchHeart"
        );

    const arenaWidth =
        arena.clientWidth;

    const arenaHeight =
        arena.clientHeight;

    const x =
        15 +
        Math.random() *
        Math.max(
            20,
            arenaWidth - 90
        );

    const y =
        20 +
        Math.random() *
        Math.max(
            20,
            arenaHeight - 90
        );

    heart.style.left =
        x + "px";

    heart.style.top =
        y + "px";

}

function catchHeart(){

    if(!catchRunning){
        return;
    }

    catchScore++;

    document.getElementById(
        "catchCount"
    ).textContent =
        catchScore;

    addXP(20);

    playSound(
        450 + catchScore * 70,
        .06
    );

    if(catchScore >= 5){

        catchRunning=false;

        document.getElementById(
            "catchHeart"
        ).style.display =
            "none";

        document.getElementById(
            "catchStart"
        ).textContent =
            "✅ COMPLETED";

        document.getElementById(
            "catchMessage"
        ).innerHTML =
            "🎉 Great! তুমি heart-টা ৫ বার ধরেছো!";

        addXP(30);

        celebrateSmall();

        setTimeout(()=>{
            goTo("level2");
        },900);

        return;
    }

    moveCatchHeart();

}


/* =========================================================
   LEVEL 2 — QUESTION
========================================================= */

function answerQuestion(
    answer,
    button
){

    if(questionAnswered){
        return;
    }

    questionAnswered=true;

    document
        .querySelectorAll(".answer-card")
        .forEach(card=>{
            card.style.pointerEvents =
                "none";
        });

    button.style.borderColor =
        "#ff4ca5";

    const result =
        document.getElementById(
            "answerResult"
        );

    if(answer === 1){

        result.textContent =
            "ভালো? 😐 এত কম কেন! একটু upgrade করো।";

        addXP(25);

    }else if(answer === 2){

        result.textContent =
            "হুম! কাছাকাছি আসছো 😏";

        addXP(45);

    }else{

        result.innerHTML =
            "❤️ Correct answer detected! System happy.";

        addXP(80);

        celebrateSmall();

    }

    playSuccessSound();

    setTimeout(()=>{
        goTo("level3");
    },1200);

}


/* =========================================================
   LEVEL 3 — COMBO
========================================================= */

function startCombo(){

    if(comboRunning){
        return;
    }

    combo=0;
    comboTime=10;
    comboRunning=true;

    document.getElementById(
        "comboCount"
    ).textContent =
        "0";

    document.getElementById(
        "comboTime"
    ).textContent =
        "10";

    document.getElementById(
        "comboStart"
    ).textContent =
        "🔥 TAP THE HEART!";

    document.getElementById(
        "comboMessage"
    ).textContent =
        "20 taps needed!";

    clearInterval(
        comboTimer
    );

    comboTimer =
        setInterval(()=>{

            comboTime--;

            document.getElementById(
                "comboTime"
            ).textContent =
                comboTime;

            if(comboTime <= 0){

                clearInterval(
                    comboTimer
                );

                comboRunning=false;

                if(combo >= 20){

                    finishCombo();

                }else{

                    document.getElementById(
                        "comboStart"
                    ).textContent =
                        "🔄 TRY AGAIN";

                    document.getElementById(
                        "comboMessage"
                    ).textContent =
                        "আরো fast tap করতে হবে! 😈";

                    showToast(
                        "Almost! Try again 🔥"
                    );

                }

            }

        },1000);

}

function tapCombo(){

    if(!comboRunning){
        return;
    }

    combo++;

    document.getElementById(
        "comboCount"
    ).textContent =
        combo;

    playSound(
        350 + combo*20,
        .04
    );

    const heart =
        document.getElementById(
            "comboHeart"
        );

    heart.style.transform =
        "scale(.8)";

    setTimeout(()=>{
        heart.style.transform =
            "";
    },70);

    if(combo >= 20){

        finishCombo();

    }

}

function finishCombo(){

    clearInterval(
        comboTimer
    );

    comboRunning=false;

    document.getElementById(
        "comboTime"
    ).textContent =
        "0";

    document.getElementById(
        "comboStart"
    ).textContent =
        "✅ COMBO COMPLETE";

    document.getElementById(
        "comboMessage"
    ).innerHTML =
        "🔥 PERFECT! 20 heart taps complete!";

    addXP(150);

    celebrateSmall();

    setTimeout(()=>{
        goTo("level4");
    },1000);

}


/* =========================================================
   LEVEL 4 — FIND HEART
========================================================= */

function newFindRound(){

    const grid =
        document.getElementById(
            "findGrid"
        );

    const message =
        document.getElementById(
            "findMessage"
        );

    grid.innerHTML="";

    findActive=true;

    const fakeEmojis=[
        "💖",
        "💕",
        "💗",
        "💓",
        "💞",
        "💘",
        "😍",
        "🥰",
        "💜",
        "✨",
        "🌸",
        "🩷"
    ];

    const correctIndex =
        Math.floor(
            Math.random()*9
        );

    for(let i=0;i<9;i++){

        const button =
            document.createElement(
                "button"
            );

        button.className =
            "find-item";

        const correct =
            i === correctIndex;

        button.innerHTML = `
            <span>
                ${correct
                    ? "❤️"
                    : fakeEmojis[
                        Math.floor(
                            Math.random() *
                            fakeEmojis.length
                        )
                    ]
                }
            </span>
            <small>
                ${correct
                    ? "REAL HEART"
                    : "FAKE"
                }
            </small>
        `;

        button.onclick =
            ()=>{

                if(!findActive){
                    return;
                }

                if(correct){

                    findActive=false;

                    findRound++;

                    document.getElementById(
                        "findRound"
                    ).textContent =
                        findRound;

                    addXP(45);

                    playSuccessSound();

                    message.textContent =
                        "🎯 Correct! আসল heart পেয়ে গেছো!";

                    button.style.borderColor =
                        "#ff4ca5";

                    if(findRound >= 3){

                        addXP(50);

                        celebrateSmall();

                        setTimeout(()=>{
                            goTo("level5");
                        },900);

                    }else{

                        setTimeout(
                            newFindRound,
                            700
                        );

                    }

                }else{

                    button.classList.add(
                        "shake"
                    );

                    setTimeout(()=>{
                        button.classList.remove(
                            "shake"
                        );
                    },400);

                    playSound(
                        180,
                        .08,
                        "square"
                    );

                    showToast(
                        "😂 এটা fake!"
                    );

                }

            };

        grid.appendChild(button);

    }

}

newFindRound();


/* =========================================================
   LEVEL 5 — LOVE METER
========================================================= */

function addLove(){

    if(love >= 100){

        showToast(
            "💥 Meter already MAX!"
        );

        return;
    }

    const amount =
        Math.floor(
            Math.random()*9
        ) + 5;

    love += amount;

    if(love > 100){
        love=100;
    }

    document.getElementById(
        "lovePercent"
    ).textContent =
        love;

    document.getElementById(
        "loveFill"
    ).style.width =
        love + "%";

    const status =
        document.getElementById(
            "loveStatus"
        );

    if(love < 30){

        status.textContent =
            "System warming up... 👀";

    }else if(love < 60){

        status.textContent =
            "Love detected! 💗";

    }else if(love < 85){

        status.textContent =
            "Dangerously cute! 🔥";

    }else if(love < 100){

        status.textContent =
            "Almost maximum... 😳";

    }else{

        status.textContent =
            "❤️ LOVE LEVEL: MAXIMUM ❤️";

    }

    addXP(4);

    playSound(
        450 + love*3,
        .06
    );

    if(love >= 100){

        addXP(100);

        celebrateBig();

        setTimeout(()=>{
            goTo("level6");
        },1300);

    }

}


/* =========================================================
   LEVEL 6 — MYSTERY
=======
