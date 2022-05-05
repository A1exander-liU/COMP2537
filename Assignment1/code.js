ability_name = ""

function captialize(some_string) {
    return some_string[0].toUpperCase() + some_string.slice(1)
}

function change_type_background(type_name) {
    return `<span class='${type_name}'>${captialize(type_name)}</span>`
}

function get_english_version(data) {
    if (data.language.name == "en") {
        return data
    }
}

function get_english_ability_info(data) {
    english_ability_info = data.effect_entries.filter(get_english_version)
    if ($(`#abilities div#${ability_name}`).text() == "") {
        $(".ability-content").text("")
        $(`#abilities div#${ability_name}`).text(english_ability_info[0].effect)
    }
    else {
        $(`#abilities div#${ability_name}`).text("")
    }
}

async function view_ability_detail() {
    ability_name = $(this).attr("id")
    console.log(ability_name)
    await $.ajax(
        {
            "url": `https://pokeapi.co/api/v2/ability/${ability_name}`,
            "type": "GET",
            "success": get_english_ability_info    
        }
    )
}

function view_abilities() {
    $(".tabcontent").removeClass("active")
    $(".tabcontent").hide()
    $("#abilities").show()
    $("#abilities button").css({"display":"block", "width":"100%"})
    $("#abilities").addClass("active")
}

function view_desc() {
    console.log("called desc")
    $(".tabcontent").removeClass("active") // class active has css rule to set display to block
    $(".tabcontent").hide() // hide all content of each tab
    $("#description").show() // show the clicked tab's content
    $("#description div").css("display", "block") // add a class to make the display to block
}

function view_base_stats() {
    console.log("called stats")
    $(".tabcontent").removeClass("active")
    $(".tabcontent").hide()
    $("#base-stats").show()
    $("#base-stats").addClass("active")

}

function display_this_pokemon(data) {
    $(".pokemons").empty()
    old = $(".pokemons").html()
    result = ""
    result += `<div class='pokemon_full'>`
    result += `<div>`
    result += `<h3>${captialize(data.name)}</h3>`
    result += `<img src='${data.sprites.other["official-artwork"].front_default}'><br>`
    for (i = 0; i < data.types.length; i++) {
        result += change_type_background(data.types[i].type.name)
    }
    result += `</div>`
    result += `<div class='tabs'>`
    result += `<button class="tablinks" id="base_stats">Base Stats</button>`
    result += `<button class="tablinks" id="desc">Desc</button>`
    result += `<button class="tablinks" id="abilities-tab">Abilities</button>`
    result += `<div>`
    result += `<div id="base-stats" class="tabcontent active" style='text-align:right; display:grid; grid-template-columns:auto auto; grid-template-rows:auto auto auto auto auto auto; column-gap:5px;'>
                    <label for="hp">HP   ${data.stats[0].base_stat}</label>
                    <progress class="hp" value="${data.stats[0].base_stat}" max="255"></progress>
                    <label for="attack">Attack   ${data.stats[1].base_stat}</label>
                    <progress class="attack" value="${data.stats[1].base_stat}" max="255"></progress>
                    <label for="defense">Defense   ${data.stats[2].base_stat}</label>
                    <progress class="defense" value="${data.stats[2].base_stat}" max="255"></progress>
                    <label for="special_attack">Sp. Atk   ${data.stats[3].base_stat}</label>
                    <progress class="special_attack" value="${data.stats[3].base_stat}" max="255"></progress>
                    <label for="special_defense">Sp. Def   ${data.stats[4].base_stat}</label>
                    <progress class="special_defense" value="${data.stats[4].base_stat}" max="255"></progress>
                    <label for="speed">Speed   ${data.stats[5].base_stat}</label>
                    <progress class="speed" value="${data.stats[5].base_stat}" max="255"></progress>
               </div>`
    result += `<div id="description" class="tabcontent" style="text-align:right; display:grid; grid-template-columns:auto auto; grid-template-rows:auto;">
                    <div style='display:none'>
                        <p>Height</p>
                        <p>Weight</p>
                        <p>Base Exp</p>
                    </div>
                    <div style='display:none'>
                        <p>${(data.height) / 10}m</p>
                        <p>${(data.weight) / 10}kg</p>
                        <p>${data.base_experience}</p>
                    </div>
               </div>`
    result += `<div id='abilities' class='tabcontent' style="display:none">`
    for (i = 0; i < data.abilities.length; i++) {
        console.log(captialize(data.abilities[i].ability.name))
        result += `<button class='ability' id='${data.abilities[i].ability.name}'>${captialize(data.abilities[i].ability.name)}</button><div id="${data.abilities[i].ability.name}" class="ability-content"></div>`
    }
    result += `</div>`
    result += `</div>`
    $(".pokemons").html(old + result)
}

function get_this_pokemon_info() {
    console.log($(this).attr("id"))
    $.ajax({
        "url": `https://pokeapi.co/api/v2/pokemon/${$(this).attr("id")}`,
        "type": "GET",
        "success": display_this_pokemon
    })
}

function display_random_pokemons(data) {
    old = $(".pokemons").html()
    result = ""
    result += `<div class='pokemon' id='${data.name}'>`
    result += `<p>${captialize(data.name)}</p>`
    result += `<img src='${data.sprites.other["official-artwork"].front_default}'>`
    result += "<p>"
    for (i = 0; i < data.types.length; i++) {
        result += change_type_background(data.types[i].type.name)
    }
    result += "</p>"
    result += "</div>"
    $(".pokemons").html(old + result)
}

function get_random_pokemons() {
    for (i = 0; i < 12; i++) {
        $.ajax({
            "url": `https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 899)}`,
            "type": "GET",
            "success": display_random_pokemons
        })
    }
}

function setup() {
    get_random_pokemons()
    $("body").on("click", ".pokemon", get_this_pokemon_info)
    $("body").on("click", "#base_stats", view_base_stats)
    $("body").on("click", "#desc", view_desc)
    $("body").on("click", "#abilities-tab", view_abilities)
    $("body").on("click", "#abilities button", view_ability_detail)

}

$(document).ready(setup)