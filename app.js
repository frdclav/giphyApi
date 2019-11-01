//  create a string of topics -- again we will do kpop idol groups
const topics = ["twice", "blackpink", "red velvet", "mamamoo", "bts", "got7", "iu", "heize"];
//  create an array keeping track of buttons already on the page, we don't want duplicate buttons
let buttonsShown = [];
//  create var for the button-area
const buttonArea = $("#button-area")
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
    // button listener
    $(".topic-button").on('click', function () {
        const topic = $(this).attr('data-topic');
        console.log(topic)
        const gifArr = []
        $.ajax(
            {
                url: createQueryUrl(topic),
                method: "GET"
            }
        ).then(function (response) {
            const dataArr = response.data
            dataArr.forEach(element => {
                gifArr.push(new gifObject(element.images.fixed_height_still.url, element.images.fixed_height.url, element.rating))
            });

            gifArr.forEach(element => {
                console.log(element)
                showGifs(element)
            })
            // gif listener
            $(".gif").on('click', function () {
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
        })


    })
}
// for loop to add initial topics to page
topics.forEach(element => {
    showButton(element);
});

// 
const formInput = $("#input-text")
// 
const submitBtn = $("#submit-btn")
submitBtn.on('click', function (event) {
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
const createQueryUrl = topic => "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=" + apiKey;
//  test createQueryUrl
// console.log(createQueryUrl("dog"), 'testing createQueryUrl')


// constructor for gif object
function gifObject(still, animated, rating) {
    this.stillImg = still;
    this.animatedImg = animated;
    this.imgRating = rating;
};
// keep track of gif-area
const gifArea = $("#gif-area");
// function that displays image onto page
const showGifs = gifObj => {
    const gifDiv = $("<div>");
    const gifImg = $("<img>");
    const gifRating = $("<p>");
    gifImg.attr('data-still', gifObj.stillImg);
    gifImg.attr('data-animated', gifObj.animatedImg);
    gifImg.attr('src', gifObj.stillImg);
    gifImg.attr('data-state', 'still');
    gifImg.addClass('gif');
    gifDiv.append(gifImg);
    gifRating.text('Rated: ' + gifObj.imgRating);
    gifDiv.append(gifRating);
    gifArea.append(gifDiv);
}

//  grab the data list via ajax

function getGifs(topic) {
    console.log('getGifs topic: ', topic)
    $.ajax({ url: createQueryUrl(topic), method: "GET" }).then(response => {
        const gifObjArray = []
        const dataArr = response.data
        dataArr.forEach(element => {
            gifObjArray.push(new gifObject(element.images.fixed_height_still.url, element.images.fixed_height.url, element.rating))
        });
        return gifObjArray;
    })
}





