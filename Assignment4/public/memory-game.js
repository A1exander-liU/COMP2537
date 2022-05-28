poke_cards = []
poke_cards_copy = []

function get_card_amount() {
    if ($("#card-amount").val() > 0) {
        console.log($("#card-amount").val())
        poke_cards = []
        poke_cards_copy = []
        for (i = 0; i < $("#card-amount").val(); i++) {
            console.log(Math.floor(1 + (Math.random() * 897)))
            $.ajax(
                {
                    "url": `https://pokeapi.co/api/v2/pokemon/${Math.floor((Math.random() * 897) + 1)}`,
                    "type": "GET",
                    "success": build_memory_cards
                }
            )
        }
    }
}

function setup() {
    $("button").click(get_card_amount)
}

$(document).ready(setup)