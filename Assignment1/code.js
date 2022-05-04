function captialize(some_string) {
    return some_string[0].toUpperCase() + some_string.slice(1)
}

function change_type_background(type_name) {
    return `<span class='${type_name}'>${captialize(type_name)}</span>`
}

function get_this_pokemon_info() {
    console.log($(this).attr("id"))
    $.ajax(
        {
            "url": `https://pokeapi.co/api/v2/pokemon/${$(this).attr("id")}`,
            "type": "GET",
            "success": display_this_pokemon
        }
    )
}

function display_random_pokemons(data) {
    old = $(".pokemons").html()
    result = ""
    result += `<div class='pokemon' id='${data.name}'>`
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
    $("body").on("click", ".pokemon", get_this_pokemon_info)
}

$(document).ready(setup)