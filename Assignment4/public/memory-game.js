current_tab = "memory-game"
secondCard = undefined
firstCard = undefined
score = 0
poke_cards = []
poke_cards_copy = []
seconds = 0

clicks = 0

timer = null

function change_page() {
    current_tab = $(this).attr("id")
    $(".page").hide()
    $(".memory-game-tab").removeClass("active")
    $(`#${current_tab}`).addClass("active")
    $(`#${current_tab}-page`).show()
}

function game_over() {
    // remove all cards display you lose screen
    $(".card").remove()
    $(".lose").show()
    console.log("You  lose!")
    clearInterval(timer)
    timer = null
}

function win() {
    $(".card").remove()
    $(".victory").show()
    // remove all cards display win screen
    console.log("You win!")
}

function stop_game() {
    $(".card").remove()
    clearInterval(timer)
    timer = null
    $(".time").text(0)
}

function flip_back_cards() {
    $(".card:not(.matched)").removeClass("flip")
    $(".card:not(.matched)").removeClass("locked")
}

function perform_match_check() {
    console.log(firstCard, secondCard)
    console.log($(`#${firstCard}`).attr("src"))
    console.log($(`#${secondCard}`).attr("src"))
    if ($(`#${firstCard}`).attr("src") == $(`#${secondCard}`).attr("src")) {
        console.log("Match!")
        score += 1
        if (score == poke_cards_copy.length / 2) {
            clearInterval(timer)
            timer = null
            setTimeout(win, 500)
        }
        console.log("score", score)
        $(`#${firstCard}`).parent().addClass("matched locked")
        $(`#${secondCard}`).parent().addClass("matched locked")
    }
    else {
        $(`#${firstCard}`).parent().removeClass("locked")
        console.log("Not a match.")
        $(".card").addClass("locked")
        setTimeout(flip_back_cards, 1000)
    }
}

function flip_card() {
    clicks += 1
    $(this).addClass("flip")
    if (clicks == 1) {
        // locks the first selected card
        $(this).addClass("locked")
        firstCard = $(this).find(".front-face").attr("id")
    }
    // if you click a second time, then that would be the second card
    if (clicks == 2) {
        secondCard = $(this).find(".front-face").attr("id")
        // reset the clicks back to 0 and perform the match check in here
        clicks = 0
        perform_match_check()
    }
}

function load_memory_cards() {
    card_size = Math.sqrt(random_cards.length)
    console.log(`card size ${card_size}`)
    console.log("called", random_cards)
    $(".card").remove()
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
        $(".card").css("width", `calc(${100 / card_size}% - 16px)`)
    }
    if (!timer) {
        $(".time").text(seconds)
        timer = setInterval(function() {
            $(".time").text(seconds -= 1)
            if (seconds == 0) {
                game_over()
            }
        }, 1000)
    }
    $(".loader").hide()
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

function determine_countdown(size) {
    if (size == 8) {
        seconds = 35
    }
    if (size == 18) {
        seconds = 120
    }
    if (size == 32) {
        seconds = 500
    }
    if (size == 50) {
        seconds = 1000
    }
}

async function get_card_amount() {
    $(".card").remove()
    $(".lose").hide()
    $(".victory").hide()
    $(".loader").show()
    if (timer) {
        clearInterval(timer)
        timer = null
    }
    size = $("#difficulty-dropdown option:selected").val()
    determine_countdown(size)
    console.log(size)
    poke_cards = []
    poke_cards_copy = []
    for (i = 0; i < size; i++) {
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

// 4 x 4: 35 sec to solve
// 6 x 6: 120 sec
// 8 x 8: 500 sec
// 10 x 10: 1000 sec

function setup() {
    $(".page").hide()
    $(".memory-game-tab").removeClass("active")
    $("#memory-game").addClass("active")
    $("#memory-game-page").show()
    $(".start-game").click(get_card_amount)
    $(".card-grid").on("click", ".card", flip_card)
    $(".return-to-home").click(function() {
        location.href = "/pokedex"
    })
    $(".stop-game").click(stop_game)
    $(".memory-game-tab").click(change_page)
}

$(document).ready(setup)