//  create a string of topics -- again we will do kpop idol groups
const topics = ["twice", "blackpink", "red velvet", "mamamoo", "bts", "got7", "iu", "heize"];
//  create an array keeping track of buttons already on the page, we don't want duplicate buttons
let buttonsShown = [];
// var that keeps track of the currently selected topic
let currentTopic = '';
let currentTopicBtn = '';
//  create var for the button-area
const buttonArea = $("#button-area");
// keep track of gif-area
const gifArea = $("#gif-area");

//  form input
const formInput = $("#input-text");
// submit button
const submitBtn = $("#submit-btn");

// define function to add button to page
const showButton = str => {
    if (!buttonsShown.includes(str)) {
        let newBtn = $("<button>");
        newBtn.addClass("btn btn-secondary m-2 topic-button");
        newBtn.attr("data-topic", str)
        newBtn.text(str);
        buttonArea.append(newBtn);
        buttonsShown.push(str);
    }

};
// for loop to add initial topics to page
topics.forEach(element => {
    showButton(element);
});
// add listener to topic
// button listener
$(document.body).on('click', '.topic-button', function() {
    const topic = $(this).attr('data-topic');
    if (topic !== currentTopic) {
        if (currentTopic !== '') {
            currentTopicBtn.removeClass("active");
        }

        currentTopic = topic;
        currentTopicBtn = $(this);
        currentTopicBtn.addClass("active");
        gifArea.empty();
        console.log(topic)
        const gifArr = []
        $.ajax({
            url: createQueryUrl(topic),
            method: "GET"
        }).then(function(response) {
            const dataArr = response.data
            dataArr.forEach(element => {
                gifArr.push(new gifObject(element.images.fixed_height_still.url, element.images.fixed_height.url, element.rating, element.images.fixed_height.width, element.images.fixed_height.height))
            });

            gifArr.forEach(element => {
                console.log(element)
                showGifs(element)
            })

        })
    }



})

// gif listener
$(document.body).on('click', '.gif', function() {

    console.log("you've clicked", this)
    const still = $(this).attr('data-still');
    const animated = $(this).attr('data-animated');
    const state = $(this).attr('data-state')
    if (state === 'still') {
        $(this).attr('data-state', 'animated');
        $(this).attr('src', animated);
    }
    if (state === 'animated') {
        $(this).attr('data-state', 'still');
        $(this).attr('src', still);
    }
})


submitBtn.on('click', function(event) {
    event.preventDefault();
    topics.push(formInput.val());
    buttonsShown = [];
    buttonArea.empty();
    topics.forEach(element => {
        showButton(element);
    });
})




//  apiKey
const apiKey = 'XeGkmEndo2mjsZUb5H7dgYlvQWsDs6f6'

// function that make the queryURL
const createQueryUrl = topic => "https://api.giphy.com/v1/gifs/search?limit=10&q=" + topic + "&api_key=" + apiKey;


// constructor for gif object
function gifObject(still, animated, rating, w, h) {
    this.stillImg = still;
    this.animatedImg = animated;
    this.imgRating = rating;
    this.width = parseInt(w);
    this.height = parseInt(h);
    console.log(w, h)
};

// function that displays image onto page
const showGifs = gifObj => {
    const gifDiv = $("<div>");
    const gifImg = $("<img>");
    const gifRating = $("<p>");
    const w = gifObj.width + 20;
    const h = gifObj.height + 20;
    gifDiv.attr('style', 'width:' + w + 'px;height:' + h + 'px;');
    gifImg.attr('data-still', gifObj.stillImg);
    gifImg.attr('data-animated', gifObj.animatedImg);
    gifImg.attr('src', gifObj.stillImg);
    gifImg.attr('data-state', 'still');
    gifImg.addClass('gif rounded');
    gifDiv.append(gifImg);
    gifDiv.addClass('p-2');
    gifRating.text('Rated: ' + gifObj.imgRating);
    gifDiv.append(gifRating);
    gifArea.prepend(gifDiv);
}

//  grab the data list via ajax

// function getGifs(topic) {
//     console.log('getGifs topic: ', topic)
//     $.ajax({
//         url: createQueryUrl(topic),
//         method: "GET"
//     }).then(response => {
//         const gifObjArray = []
//         const dataArr = response.data
//         console.log
//         dataArr.forEach(element => {
//             gifObjArray.push(new gifObject(element.images.fixed_height_still.url, element.images.fixed_height.url, element.rating, element.images.fixed_height.width, element.images.fixed_height.height))
//         });
//         return gifObjArray;
//     })
// }