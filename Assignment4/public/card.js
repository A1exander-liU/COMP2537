secondCard = undefined
firstCard = undefined
score = 0

cardHasBeenFlipped = false
poke_cards = []
poke_cards_copy = []

function build_memory_cards(data) {
    // store 2 copies of each data inside array
    // loop through array, grab random array element 
    poke_cards.push(data, data)
    poke_cards_copy.push(data, data)
    console.log(poke_cards)
    // console.log(data)
    // card_img = data.sprites.other["official-artwork"].front_default
    // card = ""
    // card += `<div class="card">`
    // card += `<img id="${data.name}" class="front-face" src="${card_img}">`
    // card += `<img id="${data.name}" class="back-face" src="card_back.png">`
    // card += `</div>`
    // console.log(card)
}

async function get_card_amount() {
    if ($("#card-amount").val() > 0) {
        console.log($("#card-amount").val())
        poke_cards = []
        poke_cards_copy = []
        random_cards = []
        for (i = 0; i < $("#card-amount").val(); i++) {
            console.log(Math.floor(1 + (Math.random() * 897)))
            await $.ajax(
                {
                    "url": `https://pokeapi.co/api/v2/pokemon/${Math.floor((Math.random() * 897) + 1)}`,
                    "type": "GET",
                    "success": build_memory_cards
                }
            )
        }
        console.log("index", Math.floor(Math.random() * poke_cards.length))
        // to shuffle array contents
        // create copy of original array to make sure you are looping as there are as many cards
        // take a random index from the non copy, push the non copy array element to random cards array
        // splice the non copy array with the index just pushed and remove one only
        for (i = 0; i < poke_cards_copy.length; i++) {
            random_card_index = Math.floor(Math.random() * poke_cards.length)
            random_cards.push(poke_cards[random_card_index])
            poke_cards.splice(random_card_index, 1)
        }
        console.log("randomized", random_cards)
    }
}

function setup() {
    $("button").click(get_card_amount)
    $(".card").on("click", function () {
        $(this).toggleClass("flip")

        if (!cardHasBeenFlipped) {
            //captured first card
            firstCard = $(this).find(".front-face").attr("id")
            // console.log(firstCard);
            cardHasBeenFlipped = true
        } else {
            secondCard = $(this).find(".front-face").attr("id")
            console.log(firstCard, secondCard);
            cardHasBeenFlipped = false;

            // check if you have match
            if (
                $(`#${firstCard}`).attr("src")
                ==
                $(`#${secondCard}`).attr("src")
            ) {
                console.log("A Match!");
                score += 1
                console.log(score)
                $(`#${firstCard}`).parent().off("click")
                $(`#${secondCard}`).parent().off("click")
            } else {
                console.log("not a Match!");
                setTimeout(() => {
                    $(`#${firstCard}`).parent().removeClass("flip")
                    $(`#${secondCard}`).parent().removeClass("flip")
                }, 1000)

            }
        }



        // reset 
        // firstCard = undefined
        // secondCard = undefined

    })
}



$(document).ready(setup)