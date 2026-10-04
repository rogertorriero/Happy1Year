/* =========================================
   FIREBASE
========================================= */

import { initializeApp }
    from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const firebaseConfig = {

    apiKey:
        "AIzaSyBvyTQPAfQsqaEe1hgiwE8JqPKiaJnIaqY",

    authDomain:
        "one-year-37ab5.firebaseapp.com",

    projectId:
        "one-year-37ab5",

    storageBucket:
        "one-year-37ab5.firebasestorage.app",

    messagingSenderId:
        "1000120944636",

    appId:
        "1:1000120944636:web:f1a4bdc5fb989705751479",

    measurementId:
        "G-0Q6K8CVV0V"
};


const app =
    initializeApp(firebaseConfig);


const db =
    getFirestore(app);


/* =========================================
   GUESS THE MEMORY GAME
========================================= */

const memories = [

    {
        image: "IMG_20251219_173515.jpg",

        question:
            "Lets Start Easy! Where were we when this photo was taken?",

        options: [
            "Our first date",
            "Distillery District",
            "The Beach",
            "Main Street"
        ],

        answer: 1,

        explanation:
            "Correct! This was one of my favourite moments together, It was the first time we went downtown together ❤️"
    },


    {
        image: "Snapchat-946154130.jpg",

        question:
            "When was this photo taken?",

        options: [
            "Valentine's Day",
            "Christmas",
            "Halloween",
            "Thanksgiving"
        ],

        answer: 0,

        explanation:
            "This was taken on Valentine's Day in your basement ❤️"
    },


    {
        image: "20260423_160814.jpg",

        question:
            "Where was this photo taken?",

        options: [
            "Southampton",
            "Gorrie",
            "Montreal",
            "The Zoo",
        ],

        answer: 3,

        explanation:
            "It was taken at the Toronto Zoo! We had so much fun that day ❤️"
    },


    {
        image: "20260505_163215.jpg",

        question:
            "Where was this photo taken?",

        options: [
            "Restaurant in Old Montreal",
            "St. Hubert in Montreal",
            "Distillery District Toronto",
            "Kesleys"
        ],

        answer: 1,

        explanation:
            "This was taken at St. Hubert in Montreal! I remember we were so hungry and the food was amazing ❤️"
    },


    {
        image: "20260505_163215.jpg",

        question:
            "What happened about 1hr after this moment?",

        options: [
            "We went back to the hotel and took a nap",
            "we went to the basilica and took a tour",
            "we missed our train and had to stay an extra night",
            "We went to old montreal and took a walk around the city"
        ],

        answer: 2,

        explanation:
            "We missed our train and had to stay an extra night! It was a bit stressful at the time but it ended up being a really fun night ❤️"
    },


    {
        image: "20260725_200452.jpg",

        question:
            "Why is this photo important to us?",

        options: [
            "It was one of our first photos",
            "It was your birthday",
            "We became parents to a new baby bear",
            "It was our first trip away together",
        ],

        answer: 2,

        explanation:
            "We became parents to a new baby bear Teddy! ❤️"
    },


    {
        image: "20260327_225231.jpg",

        question:
            "What month was this photo taken?",

        options: [
            "March",
            "October",
            "June",
            "July"
        ],

        answer: 0,

        explanation:
            "This was taken in March! ❤️"
    },


    {
        image: "20260519_203931.jpg",

        question:
            "What Activity did we do prior to this photo?",

        options: [
            "We went to the beach",
            "We went to the zoo",
            "We went to downtown Toronto",
            "We went to the Gym"
        ],

        answer: 3,

        explanation:
            "We went to the Gym! ❤️"
    },


    {
        image: "20260815_232421.jpg",

        question:
            "Who ate this cookie?",

        options: [
            "You",
            "Your Mom",
            "Me",
            "Owen"
        ],

        answer: 1,

        explanation:
            "Your Mom ate it, I remember how mad you were tehehehehe ❤️"
    },


    {
        image: "20260822_172946.jpg",

        question:
            "REALLY HARD ONE! What was the name of the kid who had the behavior at tennis camp that unironically brought us together for the first time?",

        options: [
            "Micheal",
            "Liam",
            "Logan",
            "Jokey Five Fingers"
        ],

        answer: 2,

        explanation:
            "It was Logan! I remember because of him we were introduced in person for the first time! ❤️"
    }

];


let currentMemory = 0;

let memoryScore = 0;

let memoryAnswered = false;


/* =========================================
   LOAD MEMORY
========================================= */

function loadMemory() {

    const memory =
        memories[currentMemory];


    const number =
        document.getElementById(
            "memory-number"
        );


    const progress =
        document.getElementById(
            "memory-progress-fill"
        );


    const image =
        document.getElementById(
            "memory-image"
        );


    const question =
        document.getElementById(
            "memory-question-text"
        );


    const result =
        document.getElementById(
            "memory-result"
        );


    const nextButton =
        document.getElementById(
            "next-memory"
        );


    const optionsContainer =
        document.getElementById(
            "memory-options"
        );


    if (
        !number ||
        !progress ||
        !image ||
        !question ||
        !result ||
        !nextButton ||
        !optionsContainer
    ) {

        return;

    }


    number.textContent =
        `Memory ${currentMemory + 1} of ${memories.length}`;


    progress.style.width =
        `${((currentMemory + 1) / memories.length) * 100}%`;


    image.src =
        memory.image;


    question.textContent =
        memory.question;


    result.textContent =
        "";

    result.className =
        "memory-result";


    nextButton.classList.add(
        "hidden"
    );


    memoryAnswered =
        false;


    optionsContainer.innerHTML =
        "";


    memory.options.forEach(
        function (option, index) {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "memory-option";


            button.textContent =
                option;


            button.addEventListener(
                "click",
                function () {

                    checkMemory(index);

                }
            );


            optionsContainer.appendChild(
                button
            );

        }
    );

}


/* =========================================
   CHECK MEMORY ANSWER
========================================= */

function checkMemory(
    selectedAnswer
) {

    if (memoryAnswered) {

        return;

    }


    memoryAnswered =
        true;


    const memory =
        memories[currentMemory];


    const buttons =
        document.querySelectorAll(
            ".memory-option"
        );


    buttons.forEach(
        function (button) {

            button.classList.add(
                "disabled"
            );

        }
    );


    const result =
        document.getElementById(
            "memory-result"
        );


    const nextButton =
        document.getElementById(
            "next-memory"
        );


    if (
        selectedAnswer ===
        memory.answer
    ) {

        memoryScore++;


        buttons[selectedAnswer]
            .classList.add(
                "correct"
            );


        result.textContent =
            "✓ Correct! " +
            memory.explanation;


        result.className =
            "memory-result correct-result";

    }

    else {

        buttons[selectedAnswer]
            .classList.add(
                "incorrect"
            );


        buttons[memory.answer]
            .classList.add(
                "correct"
            );


        result.textContent =
            "Not quite! " +
            memory.explanation;


        result.className =
            "memory-result incorrect-result";

    }


    document.getElementById(
        "memory-score"
    ).textContent =
        memoryScore;


    nextButton.classList.remove(
        "hidden"
    );

}


/* =========================================
   NEXT MEMORY
========================================= */

function nextMemory() {

    currentMemory++;


    if (
        currentMemory >=
        memories.length
    ) {

        showMemoryResults();

    }

    else {

        loadMemory();

    }

}


/* =========================================
   MEMORY FINAL SCORE
========================================= */

function showMemoryResults() {

    const game =
        document.querySelector(
            ".memory-game"
        );


    let message;


    if (
        memoryScore ===
        memories.length
    ) {

        message =
            "Okay... you definitely remember our relationship better than I expected 😂❤️";

    }

    else if (
        memoryScore >= 3
    ) {

        message =
            "Not bad! You remembered most of our memories ❤️";

    }

    else {

        message =
            "I think we need to make some more memories so you can study for the next test 😂❤️";

    }


    game.innerHTML = `

        <div class="memory-complete">

            <p class="memory-label">
                MEMORY TEST COMPLETE
            </p>

            <h3>
                You made it to the end ❤️
            </h3>

            <div class="memory-final-score">
                ${memoryScore}/${memories.length}
            </div>

            <p>
                ${message}
            </p>

            <button
                class="memory-restart"
                onclick="restartMemoryGame()"
            >
                Try Again
            </button>

        </div>

    `;

}


/* =========================================
   RESTART MEMORY GAME
========================================= */

function restartMemoryGame() {

    currentMemory = 0;

    memoryScore = 0;

    memoryAnswered = false;


    const game =
        document.querySelector(
            ".memory-game"
        );


    game.innerHTML = `

        <div class="memory-progress">

            <span id="memory-number">
                Memory 1 of ${memories.length}
            </span>

            <div class="progress-bar">

                <div
                    id="memory-progress-fill"
                    style="width: 10%;"
                ></div>

            </div>

        </div>


        <div class="memory-card">

            <div class="memory-photo">

                <img
                    id="memory-image"
                    src="20260503_005932.jpg"
                    alt="Memory"
                >

            </div>


            <div class="memory-question">

                <p class="memory-label">
                    CAN YOU REMEMBER?
                </p>


                <h3 id="memory-question-text">
                    Where were we when this photo
                    was taken?
                </h3>


                <div
                    id="memory-options"
                    class="memory-options"
                ></div>


                <div
                    id="memory-result"
                    class="memory-result"
                ></div>


                <button
                    id="next-memory"
                    class="memory-next hidden"
                    onclick="nextMemory()"
                >
                    Next Memory →
                </button>

            </div>

        </div>


        <div class="memory-score">

            <span>
                Score
            </span>

            <strong id="memory-score">
                0
            </strong>

        </div>

    `;


    loadMemory();

}


/* =========================================
   QUIZ
========================================= */

const quizQuestions = [

    {
        question:
            "What is my favourite thing about you?",

        options: [
            "Your smile",
            "Your laugh",
            "your eyes",
            "Your personality"
        ],

        answer: 2
    },


    {
        question:
            "What would I choose every time?",

        options: [
            "going out to a party",
            "Staying completely alone",
            "Doing homework",
            "Hanging out with you"
        ],

        answer: 3
    },


    {
        question:
            "Whats my favourite sports team?",

        options: [
            "Bengals",
            "Leafs",
            "Habs",
            "Blue Jays"
        ],

        answer: 2
    },


    {
        question:
            "What do I want more of in the future?",

        options: [
            "More memories with you",
            "More Cuddling with you",
            "More Adventures with you",
            "More early mornings with you",
            "More late nights with you",
            "All of the above"
        ],

        answer: 5
    },


    {
        question:
            "HARD ONE! What is my rap name?",

        options: [
            "RogPlayz",
            "RogTheGod",
            "RT Rhymes",
            "Rog Rhymes",
            "Drake",
            "All of the above"
        ],

        answer: 2
    }

];


let currentQuestion = 0;

let quizScore = 0;

let quizAnswered = false;


/* =========================================
   LOAD QUIZ
========================================= */

function loadQuiz() {

    const question =
        quizQuestions[currentQuestion];


    const questionText =
        document.getElementById(
            "quiz-question-text"
        );


    const optionsContainer =
        document.getElementById(
            "quiz-options"
        );


    const result =
        document.getElementById(
            "quiz-result"
        );


    const nextButton =
        document.getElementById(
            "next-question"
        );


    const number =
        document.querySelector(
            ".quiz-number"
        );


    if (
        !questionText ||
        !optionsContainer ||
        !result ||
        !nextButton ||
        !number
    ) {

        return;

    }


    number.textContent =
        `QUESTION ${currentQuestion + 1}`;


    questionText.textContent =
        question.question;


    result.textContent =
        "";

    result.className =
        "quiz-result";


    nextButton.classList.add(
        "hidden"
    );


    quizAnswered =
        false;


    optionsContainer.innerHTML =
        "";


    question.options.forEach(
        function (option, index) {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "quiz-option";


            button.textContent =
                option;


            button.addEventListener(
                "click",
                function () {

                    checkQuizAnswer(index);

                }
            );


            optionsContainer.appendChild(
                button
            );

        }
    );

}


/* =========================================
   CHECK QUIZ ANSWER
========================================= */

function checkQuizAnswer(
    selectedAnswer
) {

    if (quizAnswered) {

        return;

    }


    quizAnswered =
        true;


    const question =
        quizQuestions[currentQuestion];


    const buttons =
        document.querySelectorAll(
            ".quiz-option"
        );


    const result =
        document.getElementById(
            "quiz-result"
        );


    const nextButton =
        document.getElementById(
            "next-question"
        );


    buttons.forEach(
        function (button) {

            button.classList.add(
                "disabled"
            );

        }
    );


    if (
        selectedAnswer ===
        question.answer
    ) {

        quizScore++;


        buttons[selectedAnswer]
            .classList.add(
                "correct"
            );


        result.textContent =
            "✓ Correct! ❤️";

    }

    else {

        buttons[selectedAnswer]
            .classList.add(
                "incorrect"
            );


        buttons[question.answer]
            .classList.add(
                "correct"
            );


        result.textContent =
            "Not quite! ❤️";

    }


    document.getElementById(
        "quiz-score"
    ).textContent =
        quizScore;


    nextButton.classList.remove(
        "hidden"
    );

}


/* =========================================
   NEXT QUESTION
========================================= */

function nextQuestion() {

    currentQuestion++;


    if (
        currentQuestion >=
        quizQuestions.length
    ) {

        showQuizResults();

    }

    else {

        loadQuiz();

    }

}


/* =========================================
   QUIZ RESULTS
========================================= */

function showQuizResults() {

    const container =
        document.querySelector(
            ".quiz-container"
        );


    let message;


    if (
        quizScore ===
        quizQuestions.length
    ) {

        message =
            "Perfect score! You really do know me ❤️";

    }

    else if (
        quizScore >= 2
    ) {

        message =
            "Pretty good! I think you know me pretty well ❤️";

    }

    else {

        message =
            "Looks like we need another year of studying each other 😂❤️";

    }


    container.innerHTML = `

        <div class="memory-complete">

            <p class="memory-label">
                QUIZ COMPLETE
            </p>

            <h3>
                How well do you know me?
            </h3>

            <div class="memory-final-score">
                ${quizScore}/${quizQuestions.length}
            </div>

            <p>
                ${message}
            </p>

            <button
                class="memory-restart"
                onclick="restartQuiz()"
            >
                Try Again
            </button>

        </div>

    `;

}


/* =========================================
   RESTART QUIZ
========================================= */

function restartQuiz() {

    currentQuestion = 0;

    quizScore = 0;

    quizAnswered = false;


    const container =
        document.querySelector(
            ".quiz-container"
        );


    container.innerHTML = `

        <div class="quiz-question">

            <p class="quiz-number">
                QUESTION 1
            </p>


            <h3 id="quiz-question-text"></h3>


            <div
                id="quiz-options"
                class="quiz-options"
            ></div>


            <div
                id="quiz-result"
                class="quiz-result"
            ></div>


            <button
                id="next-question"
                class="quiz-next hidden"
                onclick="nextQuestion()"
            >
                Next Question →
            </button>

        </div>


        <div class="quiz-score">

            <span>
                Score
            </span>

            <strong id="quiz-score">
                0
            </strong>

        </div>

    `;


    loadQuiz();

}


/* =========================================
   SECRET MESSAGE
========================================= */

function showSecret() {

    const secret =
        document.getElementById(
            "secret-message"
        );


    if (!secret) {

        return;

    }


    secret.classList.remove(
        "hidden"
    );

}


/* =========================================
   FLOATING HEARTS
========================================= */

function createHeart() {

    const container =
        document.querySelector(
            ".hearts"
        );


    if (!container) {

        return;

    }


    const heart =
        document.createElement(
            "div"
        );


    heart.className =
        "heart";


    heart.textContent =
        "❤️";


    heart.style.left =
        Math.random() * 100 +
        "%";


    heart.style.fontSize =
        12 +
        Math.random() * 18 +
        "px";


    heart.style.animationDuration =
        5 +
        Math.random() * 6 +
        "s";


    container.appendChild(
        heart
    );


    setTimeout(
        function () {

            heart.remove();

        },

        12000
    );

}


/* =====================================================
   OUR NEXT CHAPTER
===================================================== */


/* =========================================
   ELEMENTS
========================================= */

const nextPhoto =
    document.getElementById(
        "next-photo"
    );

const nextPhotoCaption =
    document.getElementById(
        "next-photo-caption"
    );

const nextPhotoButton =
    document.getElementById(
        "next-photo-button"
    );

const nextPhotoStatus =
    document.getElementById(
        "next-photo-status"
    );


const nextUpdate =
    document.getElementById(
        "next-update"
    );

const nextUpdateButton =
    document.getElementById(
        "next-update-button"
    );

const nextUpdateStatus =
    document.getElementById(
        "next-update-status"
    );


const nextFuture =
    document.getElementById(
        "next-future"
    );

const nextFutureButton =
    document.getElementById(
        "next-future-button"
    );

const nextFutureStatus =
    document.getElementById(
        "next-future-status"
    );


const nextChapterFeed =
    document.getElementById(
        "next-chapter-feed"
    );


/* =========================================
   COMPRESS PHOTO
========================================= */

function compressNextChapterPhoto(
    file
) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const image =
                        new Image();


                    image.onload =
                        function () {

                            const maxWidth =
                                1000;


                            let width =
                                image.width;


                            let height =
                                image.height;


                            if (
                                width >
                                maxWidth
                            ) {

                                height =
                                    height *
                                    (
                                        maxWidth /
                                        width
                                    );

                                width =
                                    maxWidth;

                            }


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                width;


                            canvas.height =
                                height;


                            const context =
                                canvas.getContext(
                                    "2d"
                                );


                            context.drawImage(
                                image,
                                0,
                                0,
                                width,
                                height
                            );


                            canvas.toBlob(
                                function (blob) {

                                    if (!blob) {

                                        reject(
                                            new Error(
                                                "Photo compression failed."
                                            )
                                        );

                                        return;

                                    }


                                    resolve(
                                        blob
                                    );

                                },

                                "image/jpeg",

                                0.55

                            );

                        };


                    image.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Could not read image."
                                )
                            );

                        };


                    image.src =
                        event.target.result;

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Could not read file."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================
   CONVERT PHOTO TO DATA URL
========================================= */

function blobToDataURL(
    blob
) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function () {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Could not process photo."
                        )
                    );

                };


            reader.readAsDataURL(
                blob
            );

        }
    );

}


/* =========================================
   ADD PHOTO
========================================= */

if (
    nextPhotoButton
) {

    nextPhotoButton.addEventListener(
        "click",
        async function () {

            const file =
                nextPhoto.files[0];


            const caption =
                nextPhotoCaption.value.trim();


            if (!file) {

                nextPhotoStatus.textContent =
                    "Choose a photo first ❤️";

                return;

            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                nextPhotoStatus.textContent =
                    "Please choose an image.";

                return;

            }


            if (
                file.size >
                25 *
                1024 *
                1024
            ) {

                nextPhotoStatus.textContent =
                    "Please choose a photo smaller than 25 MB.";

                return;

            }


            nextPhotoButton.disabled =
                true;


            nextPhotoStatus.textContent =
                "Preparing our memory... ❤️";


            try {

                const compressedPhoto =
                    await compressNextChapterPhoto(
                        file
                    );


                const photoData =
                    await blobToDataURL(
                        compressedPhoto
                    );


                /*
                 * Firestore documents have a size limit.
                 * This keeps the photo small enough
                 * for our free-plan setup.
                 */

                if (
                    photoData.length >
                    700000
                ) {

                    nextPhotoStatus.textContent =
                        "That photo is still too large. Please choose another photo.";

                    nextPhotoButton.disabled =
                        false;

                    return;

                }


                nextPhotoStatus.textContent =
                    "Saving our memory... ❤️";


                await addDoc(
                    collection(
                        db,
                        "nextChapter"
                    ),
                    {

                        type:
                            "photo",

                        photoData:
                            photoData,

                        caption:
                            caption,

                        createdAt:
                            serverTimestamp()

                    }
                );


                nextPhoto.value =
                    "";


                nextPhotoCaption.value =
                    "";


                nextPhotoStatus.textContent =
                    "Memory added to our story! ❤️";


                await loadNextChapter();

            }

            catch (error) {

                console.error(
                    error
                );


                nextPhotoStatus.textContent =
                    "Something went wrong while saving the photo.";

            }


            nextPhotoButton.disabled =
                false;

        }
    );

}


/* =========================================
   ADD RELATIONSHIP UPDATE
========================================= */

if (
    nextUpdateButton
) {

    nextUpdateButton.addEventListener(
        "click",
        async function () {

            const text =
                nextUpdate.value.trim();


            if (!text) {

                nextUpdateStatus.textContent =
                    "Write something first ❤️";

                return;

            }


            nextUpdateButton.disabled =
                true;


            nextUpdateStatus.textContent =
                "Saving our update...";


            try {

                await addDoc(
                    collection(
                        db,
                        "nextChapter"
                    ),
                    {

                        type:
                            "update",

                        text:
                            text,

                        createdAt:
                            serverTimestamp()

                    }
                );


                nextUpdate.value =
                    "";


                nextUpdateStatus.textContent =
                    "Update saved ❤️";


                await loadNextChapter();

            }

            catch (error) {

                console.error(
                    error
                );


                nextUpdateStatus.textContent =
                    "Something went wrong. Please try again.";

            }


            nextUpdateButton.disabled =
                false;

        }
    );

}


/* =========================================
   ADD FUTURE PLAN
========================================= */

if (
    nextFutureButton
) {

    nextFutureButton.addEventListener(
        "click",
        async function () {

            const text =
                nextFuture.value.trim();


            if (!text) {

                nextFutureStatus.textContent =
                    "Write something first ❤️";

                return;

            }


            nextFutureButton.disabled =
                true;


            nextFutureStatus.textContent =
                "Adding it to our future...";


            try {

                await addDoc(
                    collection(
                        db,
                        "nextChapter"
                    ),
                    {

                        type:
                            "future",

                        text:
                            text,

                        createdAt:
                            serverTimestamp()

                    }
                );


                nextFuture.value =
                    "";


                nextFutureStatus.textContent =
                    "Added to our future ❤️";


                await loadNextChapter();

            }

            catch (error) {

                console.error(
                    error
                );


                nextFutureStatus.textContent =
                    "Something went wrong. Please try again.";

            }


            nextFutureButton.disabled =
                false;

        }
    );

}


/* =========================================
   LOAD NEXT CHAPTER
========================================= */

async function loadNextChapter() {

    if (!nextChapterFeed) {

        return;

    }


    try {

        const memoriesQuery =
            query(
                collection(
                    db,
                    "nextChapter"
                ),

                orderBy(
                    "createdAt",
                    "desc"
                )
            );


        const snapshot =
            await getDocs(
                memoriesQuery
            );


        nextChapterFeed.innerHTML =
            "";


        if (
            snapshot.empty
        ) {

            nextChapterFeed.innerHTML = `

                <p class="next-empty">
                    Our next memories will appear here. ❤️
                </p>

            `;

            return;

        }


        snapshot.forEach(
            function (doc) {

                const data =
                    doc.data();


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "next-memory";


                /* =================================
                   PHOTO
                ================================= */

                if (
                    data.type ===
                    "photo"
                ) {

                    const image =
                        document.createElement(
                            "img"
                        );


                    image.src =
                        data.photoData;


                    image.alt =
                        "A new memory of us";


                    item.appendChild(
                        image
                    );


                    if (
                        data.caption
                    ) {

                        const textContainer =
                            document.createElement(
                                "div"
                            );


                        textContainer.className =
                            "next-memory-text";


                        const caption =
                            document.createElement(
                                "p"
                            );


                        caption.textContent =
                            data.caption;


                        textContainer.appendChild(
                            caption
                        );


                        item.appendChild(
                            textContainer
                        );

                    }

                }


                /* =================================
                   RELATIONSHIP UPDATE
                ================================= */

                else if (
                    data.type ===
                    "update"
                ) {

                    const icon =
                        document.createElement(
                            "div"
                        );


                    icon.className =
                        "next-memory-icon";


                    icon.textContent =
                        "💌";


                    const title =
                        document.createElement(
                            "h4"
                        );


                    title.textContent =
                        "Relationship Update";


                    const container =
                        document.createElement(
                            "div"
                        );


                    container.className =
                        "next-memory-update";


                    const text =
                        document.createElement(
                            "p"
                        );


                    text.textContent =
                        data.text;


                    container.appendChild(
                        text
                    );


                    item.appendChild(
                        icon
                    );


                    item.appendChild(
                        title
                    );


                    item.appendChild(
                        container
                    );

                }


                /* =================================
                   FUTURE
                ================================= */

                else if (
                    data.type ===
                    "future"
                ) {

                    const icon =
                        document.createElement(
                            "div"
                        );


                    icon.className =
                        "next-memory-icon";


                    icon.textContent =
                        "✨";


                    const title =
                        document.createElement(
                            "h4"
                        );


                    title.textContent =
                        "Our Future";


                    const container =
                        document.createElement(
                            "div"
                        );


                    container.className =
                        "next-memory-update";


                    const text =
                        document.createElement(
                            "p"
                        );


                    text.textContent =
                        data.text;


                    container.appendChild(
                        text
                    );


                    item.appendChild(
                        icon
                    );


                    item.appendChild(
                        title
                    );


                    item.appendChild(
                        container
                    );

                }


                nextChapterFeed.appendChild(
                    item
                );

            }
        );

    }

    catch (error) {

        console.error(
            error
        );


        nextChapterFeed.innerHTML = `

            <p class="next-empty">
                We couldn't load our memories right now.
            </p>

        `;

    }

}


/* =========================================
   MAKE EXISTING HTML BUTTONS WORK
========================================= */

window.nextMemory =
    nextMemory;


window.restartMemoryGame =
    restartMemoryGame;


window.nextQuestion =
    nextQuestion;


window.restartQuiz =
    restartQuiz;


window.showSecret =
    showSecret;


/* =========================================
   START EVERYTHING
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadMemory();

        loadQuiz();


        setInterval(
            createHeart,
            1800
        );

    }
);


/* =========================================
   LOAD NEXT CHAPTER
========================================= */

loadNextChapter();