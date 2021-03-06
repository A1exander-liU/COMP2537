ability_name = ""
ability_info = ""
result = ""
searched_pokemons = []
searched_type = ""
current_page = 1
total_pages = 0
min_weight = 0
max_weight = 0
search_history = []
current_tab = "home-page"

function confirm_timeline_update(data) {
    console.log(data)
    // $(".pokemons").html("<p></p>")
}

function insert_or_update_event(data) {
    console.log("Full data" , data)
    // console.log("Full data", data[0][0].timeline.length)
    // console.log(data[1])
    if (data[0].length > 0) {
        $.ajax(
            {
                "url": `/updateEvent`,
                "type": "POST",
                "data": {
                    "event": `${data[1]}`
                },
                "success": confirm_timeline_update
            }
        )
    }
    else {
        current_timestamp = get_current_timestamp()
        $.ajax(
            {
                "url": `/insertEvent`,
                "type": "POST",
                "data": {
                    "event": `${data[1]}`,
                    "times": 1,
                    "date": current_timestamp
                }
            }
        )
    }
}

function get_current_timestamp() {
    var date = new Date()
    return date.toUTCString()
}

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
    return data.name
}

function get_all_pokemons(data) {
    searched_pokemons.push(data)
}

function get_color(type) {
    if (type == "normal") {
        return "#aa9"
    }
    if (type == "ice") {
        return "#6cf"
    }
    if (type == "psychic") {
        return "#f59"
    }
    if (type == "fire") {
        return "#f42"
    }
    if (type == "fighting") {
        return "#b54"
    }
    if (type == "bug") {
        return "#ab2"
    }
    if (type == "dark") {
        return "#754"
    }
    if (type == "water") {
        return "#39f"
    }
    if (type == "poison") {
        return "#a59"
    }
    if (type == "rock") {
        return "#ba6"
    }
    if (type == "steel") {
        return "#aab"
    }
    if (type == "electric") {
        return "#fc3"
    }
    if (type == "ground") {
        return "#db5"
    }
    if (type == "ghost") {
        return "#66b"
    }
    if (type == "fairy") {
        return "#e9e"
    }
    if (type == "grass") {
        return "#7c5"
    }
    if (type == "flying") {
        return "#89f"
    }
    if (type == "dragon") {
        return "#76e"
    }
}

function apply_border_colours(data) {
    if (data.types.length == 2) {
        $(`.pokemons #${data.name} > div`).css({"border-color": `${get_color(data.types[0])} ${get_color(data.types[1])} ${get_color(data.types[1])} ${get_color(data.types[0])}`,
    "border-style": "solid", "border-width": "3px"})
    }else {
        $(`.pokemons #${data.name} > div`).css({"border-color": `${get_color(data.types[0])}`,
    "border-style": "solid", "border-width": "3px"})
    }
}

function apply_background_gradient_full_info(data) {
    if (data.types.length == 2) {
        $(`.pokemons .pokemon_full`).css("background-image", `linear-gradient(to bottom right, ${get_color(data.types[0].type.name)}, ${get_color(data.types[1].type.name)})`)
    }else {
        $(`.pokemons .pokemon_full`).css("background-image", `linear-gradient(to bottom right, ${get_color(data.types[0].type.name)}, rgb(228, 228, 228))`)
    }
}

function apply_background_gradient(data) {
    if (data.types.length == 2) {
        $(`.pokemon#${data.name}`).css("background-image", `linear-gradient(to bottom right, ${get_color(data.types[0])}, ${get_color(data.types[1])})`)
    }else {
        $(`.pokemon#${data.name}`).css("background-image", `linear-gradient(to bottom right, ${get_color(data.types[0])}, rgb(228, 228, 228))`)
    }
}

function remove_page_buttons() {
    this_page = $(this).attr("id") + "-page"
    $(`#${this_page} #page_buttons`).html("")
}

function expand_cards() {
    $(".purchase-history-card > i").removeClass("fa-minus")
    $(".purchase-history-card > i").addClass("fa-plus")
    if ($(this).parent().find(".purchase-history-pokemons").css("display") == "none") {
        $(this).removeClass("fa-plus")
        $(this).addClass("fa-minus")
        $(".purchase-history-pokemons").hide()
        $(this).next().show()
    }
    else {
        $(this).removeClass("fa-minus")
        $(this).addClass("fa-plus")
        $(".purchase-history-pokemons").hide()
    }
}

function detect_quantity_change() {
    pokemon_name = $(this).parent().parent().parent().parent().find(".pokemon-card").attr("id")
    amount = $(`#${current_tab} #card-quantity`).val()
    $.ajax(
        {
            "url": "/findPokemonByName",
            "type": "POST",
            "data": {
                "name": pokemon_name
            },
            "success": function(data) {
                if (amount < 0) {
                    $(`#${current_tab} #card-quantity`).val(0)
                    $(".pricing").text("0.00")
                }
                else {
                    $(".pricing").text((data.price * amount).toFixed(2))
                }
            } 
        }
    )
}

function display_all_orders(data) {
    $(".purhcase-history-cards").html("")
    console.log(data)
    price = 0
    for (i = 0; i < data[0].orders.length; i++) {
        order_card = ""
        order_card += `<div class="purchase-history-card">`
        order_card += `<p>${data[0].orders[i].date}</p><i class="fa-solid fa-plus expand-cards"></i>`

        order_card += `<div class="purchase-history-pokemons">`
        for (j = 0; j < data[0].orders[i].order.length; j++) {
            order_card += `<p>${captialize(data[0].orders[i].order[j].name)} Card X${data[0].orders[i].order[j].quantity}</p><p>$${parseFloat(data[0].orders[i].order[j].price).toFixed(2)}</p>`
            price += parseFloat(data[0].orders[i].order[j].price)
        }
        order_card += `<p>Total</p><p>$${parseFloat(price * 1.08).toFixed(2)}</p>`
        order_card += `</div>`
        order_card += `</div>`
        old = $(".purhcase-history-cards").html()
        $(".purhcase-history-cards").html(old + order_card)
        $(".purchase-history-pokemons").hide()
    }
}

async function clear_shopping_cart() {
    await $.ajax(
        {
            "url": "/clearCart",
            "type": "DELETE",
            "success": function(data) {
                console.log(data)
            }
        }
    )
    load_shopping_cart()
}

async function remove_item_from_cart() {
    pokemon_name = $(this).attr("id")
    $.ajax(
        {
            "url": "/removeCartItem",
            "type": "DELETE",
            "data": {
                "name": pokemon_name
            },
            "success": function(data) {
                console.log(data)
            }
        }
    )
    load_shopping_cart()
}

function display_user_stats(data) {
    ordered_cards = 0
    spent_cash = 0
    console.log("user stats", data[0].orders)
    $(".profile-total-orders").text(data[0].orders.length)
    if (data[0].orders.length == 0) {
        $(".profile-total-cards").text("0")
    $(".profile-spent-cash").text("$0.00")
    }
    else {
        orders_array = data[0].orders
        for (i = 0; i < orders_array.length; i++) {
            for (j = 0; j < orders_array[i].order.length; j++) {
                ordered_cards += parseInt(orders_array[i].order[j].quantity)
                spent_cash += parseFloat(orders_array[i].order[j].price)
            }
        }
        $(".profile-total-cards").text(ordered_cards)
        $(".profile-spent-cash").text("$" + spent_cash.toFixed(2))
    }
}

function load_user_stats() {
    $.ajax(
        {
            "url": "/getOrders",
            "type": "GET",
            "success": display_user_stats
        }
    )
}

function load_purhcase_history() {
    $.ajax(
        {
            "url": "/getOrders",
            "type": "GET",
            "success": display_all_orders
        }
    )
}

async function add_order_to_orders(data) {
    $(".shopping-cart-card-container").text("Order Processed Successfully!")
    console.log(data[0].shopping_cart)
    if (data[0].shopping_cart.length > 0) {
        await $.ajax(
            {
                "url": "/addToOrders",
                "type": "POST",
                "data": {
                    "order": data[0].shopping_cart,
                    "date": get_current_timestamp()
                },
                "success": function(data) {
                    console.log(data)
                } 
            }
        )
        $.ajax(
            {
                "url": "/clearCart",
                "type": "DELETE",
                "success": function(data) {
                    console.log("success")
                }
            }
        )
    }
}

function check_out_cart() {
    $.ajax(
        {
            "url": "/getShoppingCart",
            "type": "GET",
            "success": add_order_to_orders
        }
    )
}

function display_card_items(data) {
    old = $(".shopping-cart-card-container").html("")
    console.log(data)
    sub_total = 0
    for (i = 0; i < data[0].shopping_cart.length; i++) {
        display_card = ""
        display_card += `<div class="shopping-cart-item">`
        display_card += `<p>${captialize(data[0].shopping_cart[i].name)} Pokemon Card X${data[0].shopping_cart[i].quantity}</p>`
        display_card += `<p>Price: $${(data[0].shopping_cart[i].price * data[0].shopping_cart[i].quantity).toFixed(2)}</p>` // change with price
        display_card += `<p class="remove-cart-item" id="${data[0].shopping_cart[i].name}">Remove Item</p>`
        display_card += `</div>`
        old = $(".shopping-cart-card-container").html()
        $(".shopping-cart-card-container").html(old + display_card)
        sub_total += data[0].shopping_cart[i].price * data[0].shopping_cart[i].quantity// change with price
    }
    $(".sub-total").text(`Sub-total: $${sub_total.toFixed(2)}`)
    $(".tax").text(`Tax: $${(sub_total * 0.08).toFixed(2)}`)
    $(".total").text(`Total: $${(sub_total + (sub_total * 0.08)).toFixed(2)}`)
}

function load_shopping_cart() {
    $.ajax(
        {
            "url": "/getShoppingCart",
            "type": "GET",
            "success": display_card_items
        }
    )
}

function confirm_addition_to_cart(data) {
    console.log(data)
}

function return_poke_names(data) {
    return data.name
}

async function add_card_to_cart() {
    total_card_price = 0
    quantity = parseInt($(`#${current_tab} #card-quantity`).val())
    console.log(quantity)
    poke_name = $(this).parent().parent().find(`.pokemon-card`).attr("id")
    console.log(poke_name)
    await $.ajax(
        {
            "url": "/findPokemonByName",
            "type": "POST",
            "data": {
                "name": poke_name
            },
            "success": function(data) {
                total_card_price = data.price * quantity
            }    
        }
    )
    $.ajax(
        {
            "url": "/getShoppingCart",
            "type": "GET",
            "success": function(data) {
                console.log(data)
                pokemons_in_cart = data[0].shopping_cart.map(return_poke_names)
                if (pokemons_in_cart.includes(poke_name) && quantity > 0) {
                    $.ajax(
                        {
                            "url": "/updateCartItem",
                            "type": "POST",
                            "data": {
                                "pokemon_name": poke_name,
                                "amount": quantity,
                                "price": total_card_price.toFixed(2)
                            },
                            "success": confirm_addition_to_cart
                        }
                    )
                }
                else if (!pokemons_in_cart.includes(poke_name) && quantity > 0) {
                    $.ajax(
                        {
                            "url": "/addToCart",
                            "type": "POST",
                            "data": {
                                "pokemon_name": poke_name,
                                "amount": quantity,
                                "price": total_card_price.toFixed(2)
                            },
                            "success": confirm_addition_to_cart
                        }
                    )
                }
            }
        }
    )
}

function display_card_detail(data) {
    console.log(data)
    $(".pokemons").empty()
    $(".card-info-shop").empty()
    old = $(".pokemons").html()
    result = ""
    result +=`<div class="displayed-card-detail">`
    result += `<div class="pokemon-card" id="${data.name}">`
    result += `<div class='pokemon' id='${data.name}'>`
    result += `<p>#${data.poke_id} ${captialize(data.name)}</p>`
    result += `<img src='${data.official_artwork}'>`
    result += "<p>"
    for (i = 0; i < data.types.length; i++) {
        result += change_type_background(data.types[i])
    }
    result += "</p>"
    result += `<div class="stat-section">`
    result += `<p>Stats:</p>`
    result += `<p>${data.base_stat_total}</p>`
    result += `<p>Weight:</p>`
    result += `<p>${data.weight}</p>`
    result += `<p>Height:</p>`
    result += `<p>${data.height}</p>`
    result += `</div>`
    result += "</div>"
    result += `<p class="card-price">$${(data.price).toFixed(2)}</p>`
    result += `<p class="cart" id="${data.poke_id}"><i class="fa-solid fa-cart-shopping"></i> Add One to Cart</p>`
    result += "</div>"
    result += `<div class="card-shop-settings">`
    result += `<div class="card-title"><h4>${captialize(data.name)} Pokemon Card</h4></div>`
    result += `<div class="card-purchase-section">`
    result += `<div>`
    result += `<p>Quantity</p>`
    result += `<input type="number" id="card-quantity">`
    result += `</div>`
    result += `<p>Price</p>`
    result += `<p class="updated-price">$<span class="pricing" style="border-style:none; color:black;">0.00</span></p>`
    result += `</div>`
    result += `<div class="card-add-to-cart">`
    result += `<p><i class="fa-solid fa-cart-shopping"></i> Add to My Cart</p>`
    result += "</div>"
    result += "</div>"
    result += "</div>"
    $(".card-info-shop").html(old + result)
    apply_background_gradient(data)
    apply_border_colours(data)
}

function get_card_detail() {
    $.ajax(
        {
            "url": "/findPokemonByName",
            "type": "POST",
            "data": {
                "name": $(this).attr("id")
            },
            "success": display_card_detail
        }
    )
}

function view_profile_items() {
    if ($("#profile-tab").css("display") == "none") {
        load_user_info()
        $("#profile-tab").show()    
    }
    else {
        $("#profile-tab").hide()
    }
}

function redirect_to_login(data) {
    console.log(data)
    location.href = "/pokedex"
}

function sign_out_user() {
    $.ajax(
        {
            "url": "/signOut",
            "type": "GET",
            "success": redirect_to_login
        }
    )
}

function confirm_user(data) {
    console.log("user error messagers", data)
    if (data == "success") {
        location.href = "/pokedex"
    }
    else {
        $("#incorrect-login").text(data)
    }
}

function validate_existing_user() {
    if ($("#username").val().length > 0 && $("#password").val().length > 0) {
        $.ajax(
            {
                "url": "/findUser",
                "type": "POST",
                "data": {
                    "username": $("#username").val(),
                    "password": $("#password").val(),
                },
                "success": confirm_user
            }
        )
    }
    else {
        $("#incorrect-login").text("Please enter a username and password.")
    }
}

function add_new_user() {
    console.log("it works")
    if ($("#username").val().length > 0 && $("#password").val().length > 0) {
        $.ajax(
            {
                "url": "/signUp",
                "type": "POST",
                "data": {
                    "username": $("#username").val(),
                    "password": $("#password").val(),
                },
                "success": confirm_user
            }
        )
    }
    else {
        $("#incorrect-login").text("Please enter a username and password.")
    }
}

async function remove_from_timeline() {
    await $.ajax(
        {
            "url": "/removeThisEvent",
            "type": "DELETE",
            "data": {
                "event": `${$(this).attr("id")}`
            }
        }
    )
    load_timeline()
}

async function clear_timeline() {
    await $.ajax(
        {
            "url": "/removeAllEvents",
            "type": "DELETE"
        }
    )
    load_timeline()
}

function remove_from_history() {
    search_history.splice($(this).attr("id"), 1)
    $(this).parent().remove()
}

function clear_history() {
    search_history.length = 0
    $("#displayed-history").html("")
}

function view_search_result() {
    $(".pokemons").css("grid-template-columns", "auto auto auto auto")
    $(".pokemons").html("")
    searched_pokemons = []
    history_item = $(this).parent().attr("id")
    history_item = history_item.split(",")
    for (i = 0; i < history_item.length; i++) {
        searched_pokemons.push(history_item[i])
    }
    console.log(searched_pokemons)
    display_current_page_pokemons()
}

function filter_by_low_stats(data) {
    base_stat_total = 0
    for (i = 0; i < data.stats.length; i++) {
        base_stat_total += data.stats[i]
    }
    if (base_stat_total < 300) {
        return data
    }
}

function filter_by_moderate_stats(data) {
    base_stat_total = 0
    for (i = 0; i < data.stats.length; i++) {
        base_stat_total += data.stats[i]
    }
    if (base_stat_total < 550 && base_stat_total >= 300) {
        return data
    }
}

function filter_by_high_stats(data) {
    base_stat_total = 0
    for (i = 0; i < data.stats.length; i++) {
        base_stat_total += data.stats[i]
    }
    if (base_stat_total >= 550) {
        return data
    }
}

async function get_pokemon_by_determined_base_stat_range() {
    $(".pokemons").css("grid-template-columns", "auto auto auto auto")
    searched_pokemons = []
    // for (i = 1; i < 890; i++) {
    //     await $.ajax(
    //         {
    //             "url": `https://pokeapi.co/api/v2/pokemon/${i}`,
    //             "type": "GET",
    //             "success": get_all_pokemons
    //         }
    //     )   
    // }
    await $.ajax(
        {
            "url": "/findAllPokemons",
            "type": "GET",
            "success": function(data) {
                for (i = 0; i < data.length; i++) {
                   get_all_pokemons(data[i])
                }
            }
        }
    )
    console.log(searched_pokemons)
    if ($("#high_stats").is(":checked")) {
        searched_pokemons = searched_pokemons.filter(filter_by_high_stats)
        searched_pokemons = searched_pokemons.map(project_only_name)
        search_history.push([searched_pokemons, `Searched by high base stat total`])
        await $.ajax(
            {
                "url": "/findEvent",
                "type": "POST",
                "data": {
                    "event": `User searched pokemons by high base stat total.`
                },
                "success": insert_or_update_event
            }
        )
    }
    if ($("#moderate_stats").is(":checked")) {
        searched_pokemons = searched_pokemons.filter(filter_by_moderate_stats)
        searched_pokemons = searched_pokemons.map(project_only_name)
        search_history.push([searched_pokemons, `Searched by moderate base stat total`])
        await $.ajax(
            {
                "url": "/findEvent",
                "type": "POST",
                "data": {
                    "event": `User searched pokemons by moderate base stat total.`
                },
                "success": insert_or_update_event
            }
        )
    }
    if ($("#low_stats").is(":checked")) {
        searched_pokemons = searched_pokemons.filter(filter_by_low_stats)
        searched_pokemons = searched_pokemons.map(project_only_name)
        search_history.push([searched_pokemons, `Searched by low base stat total`])
        await $.ajax(
            {
                "url": "/findEvent",
                "type": "POST",
                "data": {
                    "event": `User searched pokemons by low base stat total.`
                },
                "success": insert_or_update_event
            }
        )
    }
    console.log(searched_pokemons)
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
        await $.ajax(
            {
                "url": "/findPokemonByWeightRange",
                "type": "POST",
                "data": {
                    "min_weight": min_weight,
                    "max_weight": max_weight
                },
                "success": function(data) {
                    console.log(data)
                    searched_pokemons = data.map(project_only_name)
                },
            }
        )
        $.ajax(
            {
                "url": "/findEvent",
                "type": "POST",
                "data": {
                    "event": `User searched pokemons by weight range: ${min_weight}kg - ${max_weight}kg.`
                },
                "success": insert_or_update_event
            }
        )
        // searched_pokemons = searched_pokemons.filter(filter_selected_weight_range)
        // searched_pokemons = searched_pokemons.map(project_only_name)
        console.log(searched_pokemons)
        search_history.push([searched_pokemons, `Searched by weight range: ${min_weight}kg - ${max_weight}kg`])
        display_current_page_pokemons()
        
    }
}

function get_pokemon_by_weight() {
    $(".pokemons").css("grid-template-columns", "auto auto auto auto")
    min_weight = parseInt($("#min-weight").val())
    max_weight = parseInt($("#max-weight").val()) 
    if ($("#min-weight").val().length > 0 && $("#max-weight").val().length > 0) {
        if ((parseInt($("#min-weight").val()) >= 0) && (parseInt($("#max-weight").val()) >= 0)) {
            search_pokemon_by_weight()
        }
    }
}

function get_current_page() {
    console.log(current_tab)
    $(`#${current_tab} #page_buttons button`).removeClass("active")
    current_page = $(this).val()
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
    $(`#${current_tab} #page_buttons`).html("")
    buttons = ""
    buttons += `<button id='first'>First</button> `
    buttons += `<button id='prev'>Prev</button>`
    for (i = 1; i < total_pages + 1; i++) {
        // buttons += `<span class='page_button'>`
        buttons += `<button class='page_number_button' value='${i}' id ='${i}'>${i}</button>`
        // buttons += `</span>`
    }
    buttons += `<button id='next'>Next</button> `
    buttons += `<button id='last'>Last</button>`
    old = $("#page_buttons").html()
    $(`#${current_tab} #page_buttons`).html(buttons)
}

function display_current_page_pokemons() {
    $(`#${current_tab} .pokemons`).html("")
    $(`#${current_tab} .card-info-shop`).html("")
    if (searched_pokemons.length > 12) {
        page_size = 12
        total_pages = Math.ceil(searched_pokemons.length / 12)
        start = current_page * (current_page - 1)
        end = current_page * (current_page - 1) + page_size
        display_page_buttons(total_pages)
        $(`#${current_tab} #page_buttons button#${current_page}`).addClass("active")
        for (start; start < end; start++) {
            $.ajax(
                {
                    "url": "/findPokemonByName",
                    // "url": `https://pokeapi.co/api/v2/pokemon/${searched_pokemons[start]}`,
                    "type": "POST",
                    "data": {
                        "name": searched_pokemons[start]
                    },
                    "success": display_random_pokemons
                }
            )
        }
    }else {
        // console.log(`before display:`, $(`#${current_tab} .pokemons`).html())
        for (start = 0; start < searched_pokemons.length; start++) {
            $.ajax(
                {
                    "url": "/findPokemonByName",
                    // "url": `https://pokeapi.co/api/v2/pokemon/${searched_pokemons[start]}`,
                    "type": "POST",
                    "data": {
                        "name": searched_pokemons[start]
                    },
                    "success": display_random_pokemons
                }
            )
        }
    }
}

function get_pokemon_basic_info(data) {
    console.log(data)
    searched_pokemons = []
    for (i = 0; i < data.length; i++) {
        searched_pokemons.push(data[i].name)
    }
    search_data = data.map(project_search_name)
    search_history.push([search_data, `Searched by ${searched_type} type pokemons`])
    display_current_page_pokemons()
    $(`#${current_tab} #page_buttons button#1`).addClass("active")
}

async function get_pokemon_by_type() {
    $(".pokemons").css("grid-template-columns", "auto auto auto auto")
    $(".pokemons").html("")
    $(`#${current_tab} .card-info-shop`).html("")
    searched_type = $("#type_dropdown option:selected").val()
    console.log(searched_type)
    await $.ajax(
        {
            "url": `/findPokemonByType`,
            // "url": `https://pokeapi.co/api/v2/type/${searched_type}`,
            "type": "POST",
            "data": {
                "type": searched_type
            },
            "success": get_pokemon_basic_info
        }
    )
    $.ajax(
        {
            "url": "/findEvent",
            "type": "POST",
            "data": {
                "event": `User searched ${searched_type} pokemons.`
            },
            "success": insert_or_update_event
        }
    )
}

async function get_pokemon_by_name() {
    $(".pokemons").css("grid-template-columns", "auto auto auto auto")
    $(`#${current_tab} .pokemons`).html("")
    $(`#${current_tab} .card-info-shop`).html("")
    searched_name = $("#name").val()
    search_history.push([searched_name, `Searched by name: ${searched_name.toLowerCase()}`])
    console.log(search_history)
    await $.ajax(
        {
            "url": `/findPokemonByName`,
            // "url": `https://pokeapi.co/api/v2/pokemon/${searched_name}`,
            "type": "POST",
            "data": {
                "name": searched_name
            },
            "success": display_random_pokemons 
        }
    )
    $.ajax(
        {
            "url": "/findEvent",
            "type": "POST",
            "data": {
                "event": `User searched pokemons by name, ${searched_name}.`
            },
            "success": insert_or_update_event
        }
    )
}

function hide_pokemons() {
    $(".pokemons").html("")
}

function display_history() {
    $("#displayed-history").empty()
    for (i = 0; i < search_history.length; i++) {
        console.log(search_history[i])
        old = $("#displayed-history").html()
        result = ""
        result += `<div class="history-item" id="${search_history[i][0]}"><button class="show-result" id="${i}">${i}: ${search_history[i][1]}</button><button class="remove">Remove</button></div>`
        $("#displayed-history").html(old + result)
    }
}

function view_page() {
    $("#profile-tab").hide()
    $(".pokemons").css("grid-template-columns", "auto auto auto auto")
    current_tab = ($(this).attr("id") + "-page")
    $(`#${current_tab} .card-info-shop`).empty()
    $(`#${current_tab} .pokemons`).html("")
    tab = $(this).attr("id")
    $(".page-tab").removeClass("active")
    $(".tab-stuff").hide()
    $(`#${tab}`).addClass("active")
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
                "url": `https://pokeapi.co/api/v2/ability/${ability_name}`,
                "type": "GET",
                "success": get_english_ability_info    
            }
        )
    }
}

function view_abilities() {
    $(".tablinks").removeClass("active")
    $(".tabcontent").hide()
    $("#abilities").show()
    $("#abilities-tab").addClass("active")
}

function view_desc() {
    $(".tablinks").removeClass("active")
    $(".tabcontent").hide() // hide all content of each tab
    $("#desc").addClass("active")
    $("#description").show() // show the clicked tab's content
}

function view_base_stats() {
    $(".tablinks").removeClass("active")
    $(".tabcontent").hide()
    $("#base_stats").addClass("active")
    $("#base-stats").show()

}

async function display_this_pokemon(data) {
    $(".pokemons").css("grid-template-columns", "auto")
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
    result += `<div class="tab-container">`
    result += `<button class="tablinks active" id="base_stats">Base Stats</button>`
    result += `<button class="tablinks" id="desc">Desc</button>`
    result += `<button class="tablinks" id="abilities-tab">Abilities</button>`
    result += `</div>`
    result += `<div id="base-stats" class="tabcontent"'>
                    <label for="hp">HP   ${data.stats[0].base_stat}</label>
                    <progress class="hp" value="${data.stats[0].base_stat}" max="255"></progress>
                    <label for="attack">Atk   ${data.stats[1].base_stat}</label>
                    <progress class="attack" value="${data.stats[1].base_stat}" max="255"></progress>
                    <label for="defense">Def   ${data.stats[2].base_stat}</label>
                    <progress class="defense" value="${data.stats[2].base_stat}" max="255"></progress>
                    <label for="special_attack">Sp. Atk   ${data.stats[3].base_stat}</label>
                    <progress class="special_attack" value="${data.stats[3].base_stat}" max="255"></progress>
                    <label for="special_defense">Sp. Def   ${data.stats[4].base_stat}</label>
                    <progress class="special_defense" value="${data.stats[4].base_stat}" max="255"></progress>
                    <label for="speed">Spd   ${data.stats[5].base_stat}</label>
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
        result += `<div class='ability' id='${data.abilities[i].ability.name}'>${captialize(data.abilities[i].ability.name)}</div>`
        await $.ajax(
            {
                url: `https://pokeapi.co/api/v2/ability/${ability_name}`,
                type: "GET",
                success: get_english_ability_info
            }
        )
        result += `<div id="${ability_name}" class="ability-content">${ability_info[0].short_effect}</div>`
    }
    result += `</div>`
    result += `</div>`
    $(`#${current_tab} .pokemons`).html(old + result)
    apply_background_gradient_full_info(data)
    $(".tabcontent").hide()
    $("#base-stats").show()
}

async function get_this_pokemon_info() {
    $(`#${current_tab} #page_buttons`).html("")
    console.log($(this).attr("id"))
    await $.ajax({
        "url": `https://pokeapi.co/api/v2/pokemon/${$(this).attr("id")}`,
        "type": "GET",
        "success": display_this_pokemon
    })
    $.ajax(
        {
            "url": "/findEvent",
            "type": "POST",
            "data": {
                "event": `User viewed full detail of ${$(this).attr("id")}.`
            },
            "success": insert_or_update_event
        }
    )
}

function display_random_pokemons(data) {
    // also need to display price, put price in db
    console.log(data)
    old = $(`#${current_tab} .pokemons`).html()
    // console.log("old", old)
    result = ""
    result += `<div class="pokemon-card" id="${data.name}">`
    result += `<div class='pokemon' id='${data.name}'>`
    result += `<p>#${data.poke_id} ${captialize(data.name)}</p>`
    result += `<img src='${data.official_artwork}'>`
    result += "<p>"
    for (i = 0; i < data.types.length; i++) {
        result += change_type_background(data.types[i])
    }
    result += "</p>"
    result += `<div class="stat-section">`
    result += `<p>Stats:</p>`
    result += `<p>${data.base_stat_total}</p>`
    result += `<p>Weight:</p>`
    result += `<p>${data.weight}kg</p>`
    result += `<p>Height:</p>`
    result += `<p>${data.height}m</p>`
    result += `</div>`
    result += "</div>"
    result += `<p class="card-price">$${(data.price).toFixed(2)}</p>`
    result += `<p class="cart" id="${data.poke_id}">View Item</p>`
    result += "</div>"
    $(`#${current_tab} .pokemons`).html(old + result)
    apply_background_gradient(data)
    apply_border_colours(data)
    // console.log("after update", $(`#${current_tab} .pokemons`).html())
}

function loop_through_pokemon_db(data) {
    console.log(data)
    for (q = 0; q < data.length; q++) {
        console.log(Math.floor(Math.random() * data.length))
        display_random_pokemons(data[q])
    }
}

function get_random_pokemons() {
    $(".pokemons").empty()
    // for (i = 0; i < 12; i++) {
    //     $.ajax({
    //         "url": `https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 898) + 1}`,
    //         "type": "GET",
    //         "success": display_random_pokemons
    //     })
    // }
    $.ajax(
        {
            "url": "/findAllPokemons",
            "type": "GET",
            "success": loop_through_pokemon_db
        }
    )
}

function display_timeline(data) {
    console.log("Timeline Data", data)
    console.log("Timeline only", data.timeline)
    data = data.timeline
    $("#displayed-timeline").html("")
    for (i = 0; i < data.length; i++){
        result = ``
        result += `<div class="timeline-item" id="${data[i].event}">`
        result += `<div>`
        result += `<p class="timeline-date">${data[i].date}</p>`
        result += `<hr>`
        result += `<p class="timeline-event">${data[i].event}</p>`
        result += `<p class="timeline-hits">Times: ${data[i].times}</p>`
        result += `</div>`
        result += `<button class="timeline-remove" id="${data[i].event}">Remove</button>`
        result += `</div>`
        // 
        old = $("#displayed-timeline").html()
        $("#displayed-timeline").html(old + result)
    }
}

function load_timeline() {
    $.ajax(
        {
            "url": `/timeline`,
            "type": "GET",
            "success": display_timeline
        }
    )
}

function load_user_info() {
    $.ajax(
        {
            "url": "/getUserInfo",
            "type": "GET",
            "success": function(data) {
                console.log(data)
                $(".user_profile_name").text(data[0].username)
                $(".profile-username").text(data[0].username)
            }
        }
    )
}

function hide_stuff() {
    $("#profile-tab").hide()
}

function load_home_page() {
    $(".tab-stuff").hide()
    $("#home-page").show()
}

function setup() {
    get_random_pokemons()
    load_home_page()
    hide_stuff()
    // $("body").on("click", ".pokemon", get_this_pokemon_info)
    $("body").on("click", "#base_stats", view_base_stats)
    $("body").on("click", "#desc", view_desc)
    $("body").on("click", "#abilities-tab", view_abilities)
    $(".page-tabs .page-tab").click(view_page)
    $("#history").click(display_history)
    $("#home").click(get_random_pokemons)
    // $("#search").click(hide_pokemons)
    $("#find_by_name").click(get_pokemon_by_name)
    $("#find_by_type").click(get_pokemon_by_type)
    $("body").on("click", "#page_buttons button", get_first_prev_next_last)
    $("body").on("click", ".page_number_button", get_current_page)
    $("#find_by_weight").click(get_pokemon_by_weight)
    $("#find_by_stats").click(get_pokemon_by_determined_base_stat_range)
    $("body").on("click", ".history-item button.show-result", view_search_result)
    $("body").on("click", "#history", remove_page_buttons)
    $("body").on("click", "#search", remove_page_buttons)
    $("#clear-history").click(clear_history)
    $("body").on("click", ".remove", remove_from_history)
    $("#clear-timeline").click(clear_timeline)
    $("body").on("click", ".timeline-remove", remove_from_timeline)
    $("#timeline").click(load_timeline)
    $("#sign-up").click(add_new_user)
    $("#login").click(validate_existing_user)
    $(".secondary-tab").click(view_profile_items)
    $("#favourites").click(view_page)
    $("#user_profile").click(view_page)
    $("#timeline").click(view_page)
    $("#sign-out").click(sign_out_user)
    $("body").on("click", ".card-add-to-cart", add_card_to_cart)
    $("body").on("click", ".pokemon-card", get_card_detail)
    $("#favourites").click(load_shopping_cart)
    $("#clear-cart").click(clear_shopping_cart)
    $(".check-out-cart").click(check_out_cart)
    $("#user_profile").click(load_purhcase_history)
    $("#user_profile").click(load_user_stats)
    $("body").on("change", "#card-quantity", detect_quantity_change)
    $("body").on("keyup", "#card-quantity", detect_quantity_change)
    $("body").on("click", ".expand-cards", expand_cards)
    $("body").on("click", ".remove-cart-item", remove_item_from_cart)
}

$(document).ready(setup)