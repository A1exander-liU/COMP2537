function captialize(some_string) {
    return some_string[0].toUpperCase() + some_string.slice(1)
}

function change_type_background(type_name) {
    return `<span class='${type_name}'>${captialize(type_name)}</span>`
}

function display_random_pokemons(data) {
    old = $(".pokemons").html()
    result = ""
    result += "<div class='pokemon'>"
    result += `<p>${captialize(data.name)}</p>`
    result += `<img src='${data.sprites.other["official-artwork"].front_default}'>`
    for (i = 0; i < data.types.length; i++) {
        result += change_type_background(data.types[i].type.name)
    }
    result += "</div>"
    $(".pokemons").html(old + result)
}

function get_random_pokemons() {
    for (i = 0; i < 12; i++) {
        $.ajax(
            {
                "url": `https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 899)}`,
                "type": "GET",
                "success": display_random_pokemons
            }
        )
    }
}

function setup() {
    get_random_pokemons()
}

$(document).ready(setup)