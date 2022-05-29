current_tab = ""

{/* <div class="users-container-item">
<p>4</p>
<p>4</p>
<p>User <i class="fa-solid fa-pencil"></i></p>
</div> */}

function display_user_data(data) {
    $(".users-container").html("")
    console.log(data)
    for (i = 0; i < data.length; i++) {
        user = ""
        user += `<div class="users-container-item" id="${data[i].username}">`

        user += `<p>${data[i].username}</p>`
        user += `<p>${data[i].password}</p>`
        user += `<p>${data[i].type} <i class="fa-solid fa-pencil"></i></p>`

        user += `</div>`
        old = $(".users-container").html()
        $(".users-container").html(old + user)
    }
}

function load_user_data() {
    $.ajax(
        {
            "url": "/getUsers",
            "type": "GET",
            "success": display_user_data
        }
    )
}

function change_page() {
    current_tab = $(this).attr("id")
    $(".dashboard-tab").removeClass("active")
    $(`#${current_tab}`).addClass("active")
    $(".dashboard-page").hide()
    $(`#${current_tab}-page`).show()
}

function return_to_home() {
    location.href = "/pokedex"
}

function setup() {
    load_user_data()
    $(".dashboard-tab").removeClass("active")
    $("#users").addClass("active")
    $(".dashboard-page").hide()
    $("#users-page").show()
    $(".dashboard-tab").click(change_page)
    $(".go-back-home").click(return_to_home)
    $("#users").click(load_user_data)
}

$(document).ready(setup)