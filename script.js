"use strict";

/* =====================================================
   SAIMOON MISSION
   JAVASCRIPT
   ===================================================== */

const state = {
    score: 0,
    xp: 0,
    level: 1,

    hearts: 0,
    love: 0,

    combo: 0,
    comboBest: 0,

    muted: false,
    comboRunning: false,
    finished: false,

    audio: null
};


/* =====================================================
   HELPERS
   ===================================================== */

const $ = (id) =>
    document.getElementById(id);

const all = (selector) =>
    document.querySelectorAll(selector);


/* =====================================================
   START
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        createStars();
        createFloatingHearts();

        setupMute();
        setupNavigation();

        setupGame1();
        setupGame2();
        setupGame3();
        setupGame4();
        setupGame5();
        setupGame6();

        setupRestart();

        updateAll();

        console.log(
            "❤️ Saimoon Mission loaded"
        );

    }
);


/* =====================================================
   AUDIO
   ===================================================== */

function startAudio() {

    if (state.muted) return;

    try {

        if (!state.audio) {

            state.audio =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

        }

        if (
            state.audio.state ===
            "suspended"
        ) {

            state.audio.resume();

        }

    } catch (e) {

        console.log(
            "Audio unavailable"
        );

    }

}


function sound(
    frequency = 600,
    duration = 100
) {

    if (state.muted) return;

    startAudio();

    if (!state.audio) return;

    try {

        const oscillator =
            state.audio.createOscillator();

        const gain =
            state.audio.createGain();

        oscillator.frequency.value =
            frequency;

        oscillator.type = "sine";

        gain.gain.setValueAtTime(
            .05,
            state.audio.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            .001,
            state.audio.currentTime +
            duration / 1000
        );

        oscillator.connect(gain);
        gain.connect(
            state.audio.destination
        );

        oscillator.start();

        oscillator.stop(
            state.audio.currentTime +
            duration / 1000
        );

    } catch (e) {}

}


/* =====================================================
   MUTE
   ===================================================== */

function setupMute() {

    const button =
        $("muteBtn");

    if (!button) return;

    button.addEventListener(
        "click",
        () => {

            state.muted =
                !state.muted;

            button.textContent =
                state.muted
                    ? "🔇"
                    : "🔊";

            if (!state.muted) {
                sound(700, 100);
            }

        }
    );

}


/* =====================================================
   STARS
   ===================================================== */

function createStars() {

    const container =
        $("stars");

    if (!container) return;

    for (
        let i = 0;
        i < 100;
        i++
    ) {

        const star =
            document.createElement("span");

        star.className =
            "generated-star";

        const size =
            Math.random() * 3 + 1;

        star.style.width =
            size + "px";

        star.style.height =
            size + "px";

        star.style.left =
            Math.random() * 100 + "%";

        star.style.top =
            Math.random() * 100 + "%";

        star.style.animationDelay =
            Math.random() * 5 + "s";

        star.style.animationDuration =
            Math.random() * 4 + 2 + "s";

        container.appendChild(
            star
        );

    }

}


/* =====================================================
   FLOATING HEARTS
   ===================================================== */

function createFloatingHearts() {

    let container =
        document.querySelector(
            ".floating-hearts"
        );

    if (!container) {

        container =
            document.createElement("div");

        container.className =
            "floating-hearts";

        document.body.appendChild(
            container
        );

    }

    const emojis = [
        "❤️",
        "💖",
        "💕",
        "💗",
        "✨"
    ];

    for (
        let i = 0;
        i < 25;
        i++
    ) {

        const heart =
            document.createElement("span");

        heart.className =
            "floating-heart-generated";

        heart.textContent =
            emojis[
                Math.floor(
                    Math.random() *
                    emojis.length
                )
            ];

        heart.style.left =
            Math.random() * 100 + "%";

        heart.style.animationDelay =
            Math.random() * 12 + "s";

        heart.style.animationDuration =
            8 + Math.random() * 12 + "s";

        container.appendChild(
            heart
        );

    }

}


/* =====================================================
   NAVIGATION
   ===================================================== */

function setupNavigation() {

    all("[data-scroll]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    startAudio();

                    const target =
                        button.dataset.scroll;

                    const element =
                        document.querySelector(
                            target
                        );

                    if (!element) return;

                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }
            );

        });

}


/* =====================================================
   GAME 1
   ===================================================== */

function setupGame1() {

    const arena =
        $("heartGame");

    const heart =
        $("movingHeart");

    const counter =
        $("heartCount");

    if (!arena || !heart) return;


    function moveHeart() {

        const maxX =
            arena.clientWidth -
            heart.offsetWidth;

        const maxY =
            arena.clientHeight -
            heart.offsetHeight;

        heart.style.left =
            Math.max(
                5,
                Math.random() *
                Math.max(maxX, 10)
            ) + "px";

        heart.style.top =
            Math.max(
                5,
                Math.random() *
                Math.max(maxY, 10)
            ) + "px";

    }


    heart.addEventListener(
        "click",
        () => {

            state.hearts++;

            counter.textContent =
                state.hearts + "/5";

            addScore(20);
            addXP(40);

            sound(
                550 +
                state.hearts * 70,
                100
            );

            heart.classList.remove(
                "heart-hit"
            );

            void heart.offsetWidth;

            heart.classList.add(
                "heart-hit"
            );


            if (
                state.hearts >= 5
            ) {

                heart.style.display =
                    "none";

                addScore(100);
                addXP(100);

                toast(
                    "🎉 Game 01 Complete!"
                );

                confetti(25);

                setTimeout(
                    () => {

                        scrollTo(
                            "#game2"
                        );

                    },
                    800
                );

            } else {

                moveHeart();

            }

        }
    );


    moveHeart();

}


/* =====================================================
   GAME 2
   ===================================================== */

function setupGame2() {

    const grid =
        $("emojiGrid");

    if (!grid) return;

    const wrong = [
        "😎",
        "😂",
        "🔥",
        "⭐",
        "🌸",
        "🎁",
        "🐼",
        "🦋",
        "✨",
        "😅",
        "🍕"
    ];


    function makeGame() {

        grid.innerHTML = "";

        const total = 12;

        const correct =
            Math.floor(
                Math.random() *
                total
            );


        for (
            let i = 0;
            i < total;
            i++
        ) {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "emoji-choice";

            button.textContent =
                i === correct
                    ? "❤️"
                    : wrong[
                        Math.floor(
                            Math.random() *
                            wrong.length
                        )
                    ];


            button.addEventListener(
                "click",
                () => {

                    if (
                        i === correct
                    ) {

                        button.classList.add(
                            "correct"
                        );

                        addScore(100);
                        addXP(150);

                        sound(
                            900,
                            180
                        );

                        confetti(20);

                        toast(
                            "💖 আসল Heart পেয়ে গেছো!"
                        );

                        setTimeout(
                            () => {
                                scrollTo(
                                    "#game3"
                                );
                            },
                            900
                        );

                    } else {

                        button.classList.add(
                            "wrong"
                        );

                        sound(
                            180,
                            100
                        );

                        toast(
                            "😂 এটা ভুল!"
                        );

                        setTimeout(
                            () => {

                                button.classList.remove(
                                    "wrong"
                                );

                            },
                            350
                        );

                    }

                }
            );


            grid.appendChild(
                button
            );

        }

    }


    makeGame();

}


/* =====================================================
   GAME 3
   ===================================================== */

function setupGame3() {

    all(".choice-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    button.classList.add(
                        "selected"
                    );

                    const answer =
                        button.dataset.answer;

                    addScore(50);
                    addXP(100);

                    sound(
                        700,
                        120
                    );

                    toast(
                        "💖 " +
                        answer
                    );

                    createHearts(
                        button
                    );

                    setTimeout(
                        () => {

                            scrollTo(
                                "#game4"
                            );

                        },
                        800
                    );

                }
            );

        });

}


/* =====================================================
   GAME 4
   ===================================================== */

function setupGame4() {

    const start =
        $("startCombo");

    const heart =
        $("comboHeart");

    const counter =
        $("comboCount");

    if (
        !start ||
        !heart ||
        !counter
    ) return;


    start.addEventListener(
        "click",
        () => {

            state.combo = 0;

            state.comboRunning =
                true;

            counter.textContent =
                "0";

            heart.disabled =
                false;

            start.disabled =
                true;

            toast(
                "🔥 ৭ সেকেন্ড! Tap tap tap!"
            );

            sound(
                600,
                100
            );


            setTimeout(
                () => {

                    state.comboRunning =
                        false;

                    heart.disabled =
                        true;

                    start.disabled =
                        false;

                    if (
                        state.combo >= 10
                    ) {

                        addScore(200);
                        addXP(250);

                        confetti(35);

                        toast(
                            "🔥 COMBO COMPLETE!"
                        );

                        setTimeout(
                            () => {
                                scrollTo(
                                    "#game5"
                                );
                            },
                            700
                        );

                    } else {

                        toast(
                            "😅 আবার চেষ্টা করো!"
                        );

                    }

                },
                7000
            );

        }
    );


    heart.addEventListener(
        "click",
        () => {

            if (
                !state.comboRunning
            ) return;

            state.combo++;

            counter.textContent =
                state.combo;

            if (
                state.combo >
                state.comboBest
            ) {

                state.comboBest =
                    state.combo;

            }

            addScore(5);

            sound(
                400 +
                state.combo * 40,
                55
            );

            heart.classList.remove(
                "combo-pop"
            );

            void heart.offsetWidth;

            heart.classList.add(
                "combo-pop"
            );

            createHearts(
                heart
            );

        }
    );

}


/* =====================================================
   GAME 5
   ===================================================== */

function setupGame5() {

    const button =
        $("loveButton");

    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            if (
                state.love >= 100
            ) return;

            const amount =
                Math.floor(
                    Math.random() *
                    8
                ) + 5;

            state.love =
                Math.min(
                    100,
                    state.love +
                    amount
                );

            updateLove();

            addScore(amount);
            addXP(amount * 3);

            sound(
                500 +
                state.love * 5,
                70
            );

            createHearts(
                button
            );


            if (
                state.love >= 100
            ) {

                confetti(60);

                sound(
                    1100,
                    300
                );

                toast(
                    "❤️ LOVE = 100%"
                );

                setTimeout(
                    () => {

                        scrollTo(
                            "#game6"
                        );

                    },
                    1000
                );

            }

        }
    );

}


/* =====================================================
   UPDATE LOVE
   ===================================================== */

function updateLove() {

    const meter =
        $("loveMeter");

    const percent =
        $("lovePercent");

    meter.style.width =
        state.love + "%";

    percent.textContent =
        state.love + "%";

}


/* =====================================================
   GAME 6
   ===================================================== */

function setupGame6() {

    const boxes =
        all(".mystery-box");

    if (!boxes.length) return;


    boxes.forEach(
        box => {

            box.addEventListener(
                "click",
                () => {

                    if (
                        box.classList.contains(
                            "opened"
                        )
                    ) return;

                    box.classList.add(
                        "opened"
                    );

                    addScore(100);
                    addXP(200);

                    sound(
                        800,
                        180
                    );

                    createHearts(
                        box
                    );

                    confetti(40);

                    toast(
                        "🎁 Mystery unlocked!"
                    );

                    setTimeout(
                        () => {

                            finish();

                        },
                        1000
                    );

                }
            );

        }
    );

}


/* =====================================================
   SCORE
   ===================================================== */

function addScore(amount) {

    state.score += amount;

    updateScore();

}


function updateScore() {

    $("score").textContent =
        state.score;

}


/* =====================================================
   XP / LEVEL
   ===================================================== */

function addXP(amount) {

    state.xp += amount;

    const required =
        state.level * 250;


    while (
        state.xp >= required
    ) {

        state.xp -= required;

        state.level++;

        toast(
            "⭐ LEVEL " +
            state.level +
            " UNLOCKED!"
        );

        confetti(15);

    }

    updateXP();

}


function updateXP() {

    $("xp").textContent =
        state.xp;

    $("level").textContent =
        state.level;

    const required =
        state.level * 250;

    const percentage =
        Math.min(
            100,
            state.xp /
            required *
            100
        );

    $("xpBar").style.width =
        percentage + "%";

}


/* =====================================================
   ALL UPDATE
   ===================================================== */

function updateAll() {

    updateScore();
    updateXP();
    updateLove();

}


/* =====================================================
   SCROLL
   ===================================================== */

function scrollTo(selector) {

    const element =
        document.querySelector(
            selector
        );

    if (!element) return;

    element.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =====================================================
   TOAST
   =
