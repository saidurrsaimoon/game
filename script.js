/* =========================================================
   SAIMOON MISSION ❤️
   FIXED JAVASCRIPT
   ========================================================= */

"use strict";

/* =========================================================
   GLOBAL STATE
   ========================================================= */

const Game = {
    score: 0,
    xp: 0,
    level: 1,
    heartsCaught: 0,
    combo: 0,
    comboBest: 0,
    love: 0,
    currentGame: 0,
    muted: false,
    finished: false,
    heartTimer: null,
    comboTimer: null,
    audio: null
};

/* =========================================================
   SHORTCUTS
   ========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function byId(id) {
    return document.getElementById(id);
}

function exists(id) {
    return !!document.getElementById(id);
}

/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    createStars();
    createFloatingHearts();
    setupNavigation();
    setupButtons();
    setupGame1();
    setupGame2();
    setupGame3();
    setupGame4();
    setupGame5();
    setupGame6();
    setupRestart();
    setupMute();

    updateScore();
    updateXP();
    updateLevel();
    updateLoveMeter();

    showToast("Saimoon Mission শুরু! ❤️");

    setTimeout(() => {
        const loader = byId("loader");

        if (loader) {
            loader.classList.add("hide");

            setTimeout(() => {
                loader.style.display = "none";
            }, 800);
        }
    }, 1200);

    console.log("❤️ SAIMOON MISSION READY");
});


/* =========================================================
   AUDIO SYSTEM
   ========================================================= */

function initAudio() {

    if (Game.muted) return;

    try {

        if (!Game.audio) {
            Game.audio = new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
        }

        if (Game.audio.state === "suspended") {
            Game.audio.resume();
        }

    } catch (error) {
        console.log("Audio unavailable");
    }
}


function beep(
    frequency = 500,
    duration = 100,
    type = "sine",
    volume = 0.04
) {

    if (Game.muted) return;

    try {

        initAudio();

        if (!Game.audio) return;

        const oscillator = Game.audio.createOscillator();
        const gain = Game.audio.createGain();

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(
            volume,
            Game.audio.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            Game.audio.currentTime + duration / 1000
        );

        oscillator.connect(gain);
        gain.connect(Game.audio.destination);

        oscillator.start();

        oscillator.stop(
            Game.audio.currentTime + duration / 1000
        );

    } catch (error) {
        console.log("Beep error");
    }
}


/* =========================================================
   MUTE
   ========================================================= */

function setupMute() {

    const buttons = [
        byId("muteBtn"),
        byId("soundBtn"),
        $(".mute-btn")
    ];

    buttons.forEach(button => {

        if (!button) return;

        button.addEventListener("click", () => {

            Game.muted = !Game.muted;

            button.textContent = Game.muted
                ? "🔇"
                : "🔊";

            if (!Game.muted) {
                beep(700, 100);
            }

        });

    });
}


/* =========================================================
   STAR BACKGROUND
   ========================================================= */

function createStars() {

    let container =
        byId("stars") ||
        $(".stars");

    if (!container) {

        container = document.createElement("div");

        container.id = "stars";

        document.body.prepend(container);

    }

    const amount =
        window.innerWidth < 600
            ? 45
            : 90;

    container.innerHTML = "";

    for (let i = 0; i < amount; i++) {

        const star = document.createElement("span");

        star.className = "generated-star";

        star.style.left =
            Math.random() * 100 + "%";

        star.style.top =
            Math.random() * 100 + "%";

        star.style.animationDelay =
            Math.random() * 4 + "s";

        star.style.animationDuration =
            2 + Math.random() * 4 + "s";

        const size =
            1 + Math.random() * 3;

        star.style.width = size + "px";
        star.style.height = size + "px";

        container.appendChild(star);
    }
}


/* =========================================================
   FLOATING HEARTS
   ========================================================= */

function createFloatingHearts() {

    let container =
        byId("floatingHearts") ||
        $(".floating-hearts");

    if (!container) {

        container = document.createElement("div");

        container.id = "floatingHearts";

        container.className =
            "floating-hearts";

        document.body.appendChild(container);

    }

    const emojis = [
        "❤️",
        "💖",
        "💕",
        "💗",
        "💘",
        "💝",
        "✨"
    ];

    for (let i = 0; i < 20; i++) {

        const heart =
            document.createElement("span");

        heart.textContent =
            emojis[
                Math.floor(
                    Math.random() * emojis.length
                )
            ];

        heart.className =
            "floating-heart-generated";

        heart.style.left =
            Math.random() * 100 + "%";

        heart.style.animationDelay =
            Math.random() * 10 + "s";

        heart.style.animationDuration =
            8 + Math.random() * 12 + "s";

        heart.style.fontSize =
            12 + Math.random() * 20 + "px";

        container.appendChild(heart);
    }
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    $$("[data-scroll]").forEach(button => {

        button.addEventListener("click", () => {

            const target =
                button.getAttribute("data-scroll");

            scrollToSection(target);

        });

    });

    $$("a[href^='#']").forEach(link => {

        link.addEventListener("click", event => {

            const href =
                link.getAttribute("href");

            if (
                href &&
                href !== "#" &&
                document.querySelector(href)
            ) {

                event.preventDefault();

                scrollToSection(href);

            }

        });

    });

}


function scrollToSection(target) {

    if (!target) return;

    let element = null;

    try {

        element =
            document.querySelector(target);

    } catch (error) {

        element =
            byId(
                target.replace("#", "")
            );

    }

    if (!element) return;

    element.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   BUTTON SETUP
   ========================================================= */

function setupButtons() {

    $$("button").forEach(button => {

        button.addEventListener("click", () => {

            initAudio();

        });

    });

}


/* =========================================================
   GAME 1
   CATCH THE HEART
   ========================================================= */

function setupGame1() {

    const area =
        byId("heartGame") ||
        byId("game1Area") ||
        $(".heart-game");

    const heart =
        byId("movingHeart") ||
        byId("gameHeart");

    const counter =
        byId("heartCount") ||
        byId("catchCount");

    if (!area || !heart) return;

    let caught = 0;

    function moveHeart() {

        const rect =
            area.getBoundingClientRect();

        const maxX =
            Math.max(
                10,
                rect.width - 80
            );

        const maxY =
            Math.max(
                10,
                rect.height - 80
            );

        heart.style.position = "absolute";

        heart.style.left =
            Math.random() * maxX + "px";

        heart.style.top =
            Math.random() * maxY + "px";

    }

    heart.addEventListener("click", () => {

        caught++;

        Game.heartsCaught = caught;

        beep(650 + caught * 40, 100);

        if (counter) {
            counter.textContent =
                `${caught}/5`;
        }

        heart.classList.remove("heart-hit");

        void heart.offsetWidth;

        heart.classList.add("heart-hit");

        addScore(10);

        if (caught >= 5) {

            beep(900, 200);

            showToast(
                "🎉 তুমি ৫টা Heart ধরেছো!"
            );

            addXP(100);

            heart.style.display = "none";

            setTimeout(() => {

                unlockGame(2);

            }, 500);

        } else {

            moveHeart();

        }

    });

    moveHeart();

}


/* =========================================================
   GAME 2
   FIND THE REAL HEART
   ========================================================= */

function setupGame2() {

    const container =
        byId("emojiGrid") ||
        byId("loveGrid") ||
        $(".emoji-grid");

    if (!container) return;

    let correctIndex = 0;

    function createGrid() {

        container.innerHTML = "";

        const total = 12;

        correctIndex =
            Math.floor(
                Math.random() * total
            );

        for (let i = 0; i < total; i++) {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "emoji-choice";

            button.textContent =
                i === correctIndex
                    ? "❤️"
                    : randomWrongEmoji();

            button.addEventListener(
                "click",
                () => {

                    if (i === correctIndex) {

                        button.classList.add(
                            "correct"
                        );

                        beep(900, 160);

                        addScore(30);
                        addXP(150);

                        showToast(
                            "💖 আসল Heart পেয়ে গেছো!"
                        );

                        createConfetti(20);

                        setTimeout(
                            () => unlockGame(3),
                            600
                        );

                    } else {

                        button.classList.add(
                            "wrong"
                        );

                        beep(180, 100);

                        showToast(
                            "😂 এটা না! আবার চেষ্টা করো!"
                        );

                        setTimeout(() => {

                            button.classList.remove(
                                "wrong"
                            );

                        }, 400);

                    }

                }
            );

            container.appendChild(button);

        }

    }

    createGrid();

}


function randomWrongEmoji() {

    const emojis = [
        "😎",
        "😂",
        "😜",
        "🔥",
        "⭐",
        "🌸",
        "🍕",
        "🎁",
        "🐼",
        "🦋",
        "✨",
        "😅"
    ];

    return emojis[
        Math.floor(
            Math.random() * emojis.length
        )
    ];
}


/* =========================================================
   GAME 3
   CHOICE CHALLENGE
   ========================================================= */

function setupGame3() {

    const buttons =
        $$(".choice-btn");

    if (!buttons.length) return;

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const text =
                button.dataset.answer ||
                button.textContent ||
                "দারুণ!";

            beep(700, 120);

            button.classList.add("selected");

            addScore(20);
            addXP(100);

            showToast(
                "💗 " + text
            );

            createMiniHearts(
                button
            );

            setTimeout(() => {

                buttons.forEach(
                    b => b.classList.remove(
                        "selected"
                    )
                );

            }, 500);

            unlockGame(4);

        });

    });

}


/* =========================================================
   GAME 4
   HEART COMBO
   ========================================================= */

function setupGame4() {

    const heart =
        byId("comboHeart") ||
        byId("tapHeart");

    const count =
        byId("comboCount") ||
        byId("tapCount");

    const start =
        byId("startCombo") ||
        byId("comboStart");

    if (!heart) return;

    let clicks = 0;
    let active = false;
    let timer = null;

    function startGame() {

        clicks = 0;
        active = true;

        heart.disabled = false;

        if (count) {
            count.textContent = "0";
        }

        showToast(
            "🔥 দ্রুত Heart-এ tap করো!"
        );

        clearTimeout(timer);

        timer = setTimeout(() => {

            active = false;

            heart.disabled = true;

            if (clicks >= 10) {

                addScore(100);
                addXP(250);

                createConfetti(40);

                showToast(
                    "🔥 COMBO COMPLETE!"
                );

                unlockGame(5);

            } else {

                showToast(
                    `😅 ${clicks}/10! আবার চেষ্টা করো।`
                );

            }

        }, 7000);

    }

    if (start) {

        start.addEventListener(
            "click",
            startGame
        );

    }

    heart.addEventListener("click", () => {

        if (!active) return;

        clicks++;

        Game.combo = clicks;

        if (
            clicks >
            Game.comboBest
        ) {
            Game.comboBest = clicks;
        }

        if (count) {
            count.textContent =
                clicks;
        }

        heart.classList.remove(
            "combo-pop"
        );

        void heart.offsetWidth;

        heart.classList.add(
            "combo-pop"
        );

        beep(
            400 + clicks * 35,
            60
        );

        addScore(5);

    });

}


/* =========================================================
   GAME 5
   LOVE METER
   ========================================================= */

function setupGame5() {

    const button =
        byId("loveButton") ||
        byId("addLove") ||
        $(".love-add");

    const meter =
        byId("loveMeter");

    const percent =
        byId("lovePercent");

    if (!button) return;

    button.addEventListener("click", () => {

        if (Game.love >= 100) return;

        const amount =
            Math.floor(
                Math.random() * 10
            ) + 5;

        Game.love =
            Math.min(
                100,
                Game.love + amount
            );

        updateLoveMeter();

        addScore(amount);
        addXP(amount * 3);

        beep(
            500 + Game.love * 4,
            80
        );

        createMiniHearts(button);

        if (Game.love >= 100) {

            createConfetti(60);

            beep(1000, 250);

            showToast(
                "❤️ LOVE METER = 100%"
            );

            setTimeout(
                () => unlockGame(6),
                700
            );

        }

    });

    if (meter) {
        meter.style.width =
            Game.love + "%";
    }

    if (percent) {
        percent.textContent =
            Game.love + "%";
    }

}


/* =========================================================
   UPDATE LOVE METER
   ========================================================= */

function updateLoveMeter() {

    const meter =
        byId("loveMeter") ||
        $(".love-meter-fill");

    const percent =
        byId("lovePercent") ||
        $(".love-percent");

    if (meter) {
        meter.style.width =
            Game.love + "%";
    }

    if (percent) {
        percent.textContent =
            Game.love + "%";
    }

}


/* =========================================================
   GAME 6
   MYSTERY BOX
   ========================================================= */

function setupGame6() {

    const boxes =
        $$(".mystery-box");

    if (!boxes.length) return;

    const messages = [

        "😎 Saimoon detected!",
        "💖 100% suspicious love!",
        "😂 তুমি ধরা খেয়ে গেছো!",
        "🎉 Mission almost complete!",
        "❤️ Heart signal confirmed!"

    ];

    boxes.forEach((box, index) => {

        box.addEventListener("click", () => {

            if (box.classList.contains("opened")) {
                return;
            }

            box.classList.add("opened");

            beep(
                600 + index * 100,
                150
            );

            const message =
                messages[
                    Math.floor(
                        Math.random() *
                        messages.length
                    )
                ];

            showToast(message);

            addScore(50);
            addXP(200);

            createConfetti(15);

            setTimeout(() => {

                showFinal();

            }, 800);

        });

    });

}


/* =========================================================
   UNLOCK GAME
   ========================================================= */

function unlockGame(number) {

    Game.currentGame =
        Math.max(
            Game.currentGame,
            number
        );

    updateProgress();

}


/* =========================================================
   SCORE
   ========================================================= */

function addScore(points) {

    Game.score += points;

    updateScore();

}


function updateScore() {

    const elements = [

        byId("score"),
        byId("gameScore"),
        byId("totalScore")

    ];

    elements.forEach(element => {

        if (element) {
            element.textContent =
                Game.score;
        }

    });

}


/* =========================================================
   XP
   ========================================================= */

function addXP(points) {

    Game.xp += points;

    while (
        Game.xp >=
        Game.level * 250
    ) {

        Game.xp -=
            Game.level * 250;

        Game.level++;

        beep(900, 200);

        showToast(
            `⭐ LEVEL ${Game.level} UNLOCKED!`
        );

        createConfetti(25);
    }

    updateXP();
    updateLevel();

}


function updateXP() {

    const xpText =
        byId("xp") ||
        byId("xpText");

    const xpBar =
        byId("xpBar") ||
        byId("xpProgress");

    const required =
        Game.level * 250;

    const percentage =
        Math.min(
            100,
            (Game.xp / required) * 100
        );

    if (xpText) {

        xpText.textContent =
            `${Game.xp}/${required} XP`;

    }

    if (xpBar) {

        xpBar.style.width =
            percentage + "%";

    }

}


function updateLevel() {
      
