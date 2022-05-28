poke_cards = []
poke_cards_copy = []

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
    }
}

function setup() {
    $("button").click(get_card_amount)
}

$(document).ready(setup)