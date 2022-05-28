poke_cards = []
poke_cards_copy = []

function flip_card() {
    clicks += 1
    $(this).addClass("flip")
    if (clicks == 1) {
        $(this).addClass("locked")
        firstCard = $(this).find(".front-face").attr("id")
    }
    // if you click a second time, then that would be the second card
    if (clicks == 2) {
        secondCard = $(this).find(".front-face").attr("id")
        // reset the clicks back to 0 and perform the match check in here
        clicks = 0
    }
}

function load_memory_cards() {
    card_size = Math.floor(Math.sqrt(random_cards.length / 2))
    console.log(`card size ${card_size}`)
    console.log("called", random_cards)
    $(".card-grid").html("")
    for (i = 0; i < random_cards.length; i++) {
        card_img = random_cards[i].sprites.other["official-artwork"].front_default
        card = ""
        card += `<div class="card">`
        card += `<img id="front-img${i + 1}" class="front-face" src="${card_img}">`
        card += `<img id="back-img${i + 1}" class="back-face" src="card_back.png">`
        card += `</div>`
        console.log(card)
        old = $(".card-grid").html()
        $(".card-grid").html(old + card)
    }
}

function shuffle_poke_cards(total_poke_cards, total_poke_cards_copy) {
    random_cards = []
    for (i = 0; i < total_poke_cards_copy.length; i++) {
        random_card_index = Math.floor(Math.random() * total_poke_cards.length)
        random_cards.push(total_poke_cards[random_card_index])
        total_poke_cards.splice(random_card_index, 1)
    }
    return random_cards
}

function build_memory_cards(data) {
    console.log(data)
    poke_cards.push(data, data)
    poke_cards_copy.push(data, data)
}

async function get_card_amount() {
    if ($("#card-amount").val() > 0) {
        console.log($("#card-amount").val())
        poke_cards = []
        poke_cards_copy = []
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
        shuffled_cards = shuffle_poke_cards(poke_cards, poke_cards_copy)
        console.log("randomized", shuffled_cards)
        load_memory_cards(shuffled_cards)
    }
}

function setup() {
    $("button").click(get_card_amount)
    $(".card-grid").on("click", ".card", flip_card)
}

$(document).ready(setup)