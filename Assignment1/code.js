ability_name = ""
ability_info = ""
result = ""
searched_pokemons = []
current_page = 1
total_pages = 0
min_weight = 0
max_weight = 0
search_history = []

function captialize(some_string) {
    return some_string[0].toUpperCase() + some_string.slice(1)
}

function change_type_background(type_name) {
    return `<span class='${type_name}'>${type_name.toUpperCase()}</span>`
}

function project_only_name(data) {
    return data.name
}

function project_search_name(data) {
    return data.pokemon.name
}

function get_all_pokemons(data) {
    searched_pokemons.push(data)
}

function view_search_result() {
    $(".pokemons").html("")
    searched_pokemons = []
    history_item = $(this).attr("id")
    history_item = history_item.split(",")
    for (i = 0; i < history_item.length; i++) {
        searched_pokemons.push(history_item[i])
    }
    display_current_page_pokemons()
}

function filter_by_low_stats(data) {
    base_stat_total = 0
    for (i = 0; i < data.stats.length; i++) {
        base_stat_total += data.stats[i].base_stat
    }
    if (base_stat_total < 300) {
        return data
    }
}

function filter_by_moderate_stats(data) {
    base_stat_total = 0
    for (i = 0; i < data.stats.length; i++) {
        base_stat_total += data.stats[i].base_stat
    }
    if (base_stat_total < 550 && base_stat_total >= 300) {
        return data
    }
}

function filter_by_high_stats(data) {
    base_stat_total = 0
    for (i = 0; i < data.stats.length; i++) {
        base_stat_total += data.stats[i].base_stat
    }
    if (base_stat_total >= 550) {
        return data
    }
}

async function get_pokemon_by_determined_base_stat_range() {
    searched_pokemons = []
    for (i = 1; i < 890; i++) {
        await $.ajax(
            {
                "url": `https://pokeapi.co/api/v2/pokemon/${i}`,
                "type": "GET",
                "success": get_all_pokemons
            }
        )   
    }
    console.log(searched_pokemons)
    if ($("#high_stats").is(":checked")) {
        searched_pokemons = searched_pokemons.filter(filter_by_high_stats)
    }
    if ($("#moderate_stats").is(":checked")) {
        searched_pokemons = searched_pokemons.filter(filter_by_moderate_stats)
    }
    if ($("#low_stats").is(":checked")) {
        searched_pokemons = searched_pokemons.filter(filter_by_low_stats)
    }
    console.log(searched_pokemons)
    searched_pokemons = searched_pokemons.map(project_only_name)
    console.log(searched_pokemons)
    search_history.push(searched_pokemons)
    display_current_page_pokemons()

}

function filter_selected_weight_range(data) {
    if ((data.weight / 10 >= min_weight) && (data.weight / 10 <= max_weight)) {
        return data
    }
}

async function search_pokemon_by_weight() {
    searched_pokemons = []
    console.log(min_weight, max_weight)
    if (parseInt(min_weight) < parseInt(max_weight)) {
        for (i = 1; i < 890; i++) {
            await $.ajax(
                {
                    "url": `https://pokeapi.co/api/v2/pokemon/${i}`,
                    "type": "GET",
                    "success": get_all_pokemons
                }
            )   
        }
        searched_pokemons = searched_pokemons.filter(filter_selected_weight_range)
        searched_pokemons = searched_pokemons.map(project_only_name)
        console.log(searched_pokemons)
        search_history.push(searched_pokemons)
        display_current_page_pokemons()
        
    }
}

function get_pokemon_by_weight() {
    min_weight = parseInt($("#min-weight").val())
    max_weight = parseInt($("#max-weight").val()) 
    if ($("#min-weight").val().length > 0 && $("#max-weight").val().length > 0) {
        if ((parseInt($("#min-weight").val()) >= 0) && (parseInt($("#max-weight").val()) >= 0)) {
            search_pokemon_by_weight()
        }
    }
}

function get_current_page() {
    current_page = $(this).children().val()
    display_current_page_pokemons()
}

function get_first_prev_next_last() {
    if ($(this).attr("id") == "first") {
        current_page = 1
        display_current_page_pokemons()
    }
    if ($(this).attr("id") == "prev") {
        current_page -= 1
        if (current_page < 1) {
            current_page = 1
        }
        display_current_page_pokemons()
    }
    if ($(this).attr("id") == "next") {
        current_page += 1
        if (current_page > total_pages) {
            current_page = total_pages
        }
        display_current_page_pokemons()
    }
    if ($(this).attr("id") == "last") {
        current_page = total_pages
        display_current_page_pokemons()
    }
}

function display_page_buttons(total_pages) {
    console.log(total_pages)
    console.log("page button called")
    $("#search-page #page_buttons").html("")
    buttons = ""
    buttons += `<button id='first'>First</button> `
    buttons += `<button id='prev'>Prev</button>`
    for (i = 1; i < total_pages + 1; i++) {
        buttons += `<span class='page_button'>`
        buttons += `<button class='page_number_button' value='${i}'>${i}</button>`
        buttons += `</span>`
    }
    buttons += `<button id='next'>Next</button> `
    buttons += `<button id='last'>Last</button>`
    old = $("#page_buttons").html()
    $("#search-page #page_buttons").html(buttons)
}

function display_current_page_pokemons() {
    $(".pokemons").html("")
    if (searched_pokemons.length > 12) {
        page_size = 12
        total_pages = Math.ceil(searched_pokemons.length / 12)
        start = current_page * (current_page - 1)
        end = current_page * (current_page - 1) + page_size
        display_page_buttons(total_pages)
        for (start; start < end; start++) {
            $.ajax(
                {
                    "url": `https://pokeapi.co/api/v2/pokemon/${searched_pokemons[start]}`,
                    "type": "GET",
                    "success": display_random_pokemons
                }
            )
        }
    }
}

function get_pokemon_basic_info(data) {
    searched_pokemons = []
    for (i = 0; i < data.pokemon.length; i++) {
        searched_pokemons.push(data.pokemon[i].pokemon.name)
    }
    search_data = data.pokemon.map(project_search_name)
    search_history.push(search_data)
    display_current_page_pokemons()
}

function get_pokemon_by_type() {
    $(".pokemons").html("")
    searched_type = $("#type_dropdown option:selected").val()
    $.ajax(
        {
            "url": `https://pokeapi.co/api/v2/type/${searched_type}`,
            "type": "GET",
            "success": get_pokemon_basic_info
        }
    )
}

function get_pokemon_by_name() {
    searched_name = $("#name").val()
    search_history.push([searched_name])
    console.log(search_history)
    $.ajax(
        {
            "url": `https://pokeapi.co/api/v2/pokemon/${searched_name}`,
            "type": "GET",
            "success": display_random_pokemons 
        }
    )
}

function hide_pokemons() {
    $(".pokemons").html("")
}

function display_history() {
    $("#displayed-history").empty()
    for (i = 0; i < search_history.length; i++) {
        old = $("#displayed-history").html()
        result = ""
        result += `<div class="history-item" id="${search_history[i]}"><button>${i}: ${search_history[i]}</button></div>`
        $("#displayed-history").html(old + result)
    }
}

function view_page() {
    $(".pokemons").html("")
    tab = $(this).attr("id")
    $(".page-tab").removeClass("active")
    $(".tab-stuff").hide()
    $(`#${tab}-page`).addClass("active")
    $(`#${tab}-page`).show()
}

function get_english_version(data) {
    if (data.language.name == "en") {
        return data
    }
}

function get_english_ability_info(data) {
    // $(".ability-content").css("height", "0vh")
    ability_info = data.effect_entries.filter(get_english_version)
    result += `<div id="${ability_name}" class="ability-content">${ability_info}</div>`
    // if ($(`#abilities div#${ability_name}`).text() == "") {
    //     $(".ability-content").text("")
        // $(`#abilities div#${ability_name}`).css({"height":"10vh", "overflow":"auto"})
    // }
    // else {
    //     $(`#abilities div#${ability_name}`).text("")
    // }
}

function view_ability_detail() {
    console.log("abiltes")
    for (i = 0; i < ability_name.length; i++) {
        $.ajax(
            {
                "url": `https://pokeapi.co/api/v2/ability/${ability_name[i]}`,
                "type": "GET",
                "success": get_english_ability_info    
            }
        )
    }
}

function view_abilities() {
    // view_ability_detail()
    // $(".tabcontent").removeClass("active")
    $(".tabcontent").hide()
    $("#abilities").show()
    // $("#abilities").addClass("active")
}

function view_desc() {
    // $(".tabcontent").removeClass("active")
    // $("#description").css("display", "grid") // class active has css rule to set display to block
    $(".tabcontent").hide() // hide all content of each tab
    $("#description").show() // show the clicked tab's content
    // $("#description div").css("display", "block") // add a class to make the display to block
}

function view_base_stats() {
    // $(".tablinks").attr("background-color", "rgb(239, 239, 239)")
    // $("#base-stats").css("display", "grid")
    // $(".tabcontent").removeClass("active")
    $(".tabcontent").hide()
    $("#base-stats").show()
    // $("#base-stats").addClass("active")

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
    result += `<div id="base-stats" class="tabcontent"'>
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
    result += `<div id="description" class="tabcontent">
                    <div style='text-align:right;'>
                        <p>Height</p>
                        <p>Weight</p>
                        <p>Base Exp</p>
                    </div>
                    <div style='text-align:right;'>
                        <p>${(data.height) / 10}m</p>
                        <p>${(data.weight) / 10}kg</p>
                        <p>${data.base_experience}</p>
                    </div>
               </div>`
    result += `<div id="abilities" class="tabcontent">`
    for (i = 0; i < data.abilities.length; i++) {
        ability_name = data.abilities[i].ability.name
        console.log(`ability name: ${ability_name}`)
        console.log(captialize(data.abilities[i].ability.name))
        result += `<button class='ability' id='${data.abilities[i].ability.name}'>${captialize(data.abilities[i].ability.name)}</button>`
        $.ajax(
            {
                url: `https://pokeapi.co/api/v2/ability/${ability_name}`,
                type: "GET",
                success: get_english_ability_info
            }
        )
    }
    result += `</div>`
    result += `</div>`
    $(".pokemons").html(old + result)
    $(".tabcontent").hide()
    $("#base-stats").show()
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
    $(".pokemons").empty()
    for (i = 0; i < 12; i++) {
        $.ajax({
            "url": `https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 899)}`,
            "type": "GET",
            "success": display_random_pokemons
        })
    }
}

function load_home_page() {
    $(".tab-stuff").hide()
    $("#home-page").show()
}

function setup() {
    get_random_pokemons()
    load_home_page()
    $("body").on("click", ".pokemon", get_this_pokemon_info)
    $("body").on("click", "#base_stats", view_base_stats)
    $("body").on("click", "#desc", view_desc)
    $("body").on("click", "#abilities-tab", view_abilities)
    $(".page-tabs button").click(view_page)
    $("#history").click(display_history)
    $("#home").click(get_random_pokemons)
    $("#search").click(hide_pokemons)
    $("#find_by_name").click(get_pokemon_by_name)
    $("#find_by_type").click(get_pokemon_by_type)
    $("body").on("click", "#page_buttons button", get_first_prev_next_last)
    $("body").on("click", ".page_button", get_current_page)
    $("#find_by_weight").click(get_pokemon_by_weight)
    $("#find_by_stats").click(get_pokemon_by_determined_base_stat_range)
    $("body").on("click", ".history-item", view_search_result)
    // $("body").on("click", "#abilities-tab", view_ability_detail)

}

$(document).ready(setup)