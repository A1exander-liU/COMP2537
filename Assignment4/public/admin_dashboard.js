current_tab = ""
old_username = ""

{/* <div class="users-container-item">
<p>4</p>
<p>4</p>
<p>User <i class="fa-solid fa-pencil"></i></p>
</div> */}

function close_edit_tab() {
    $(".edit-user").hide()
}

function save_this_user() {
    username = $("#username").val()
    password = $("#password").val()
    user_type = $("#user-type-dropdown option:selected").val()
    console.log(username, password, user_type)
    $.ajax(
        {
            "url": "/editUserInfo",
            "type": "POST",
            "data": {
                "old_username": old_username,
                "new_username": username,
                "password": password,
                "type": user_type
            },
            "success": function(data) {
                console.log(data)
            }
        }
    )
}

function edit_this_user() {
    username = $(this).attr("id")
    $(".edit-user").show()
    $.ajax(
        {
            "url": "/getUser",
            "type": "POST",
            "data": {
                "username": username
            },
            "success": function(data) {
                console.log(data)
                old_username = data[0].username
                $(".edit-user-username").text(data[0].username)
                $("#username").val(data[0].username)
                $("#password").val(data[0].password)
                $("#user-type-dropdown").val(data[0].type).change()
            } 
        }
    )
}

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

$(".edit-user").hide()

function setup() {
    load_user_data()
    $(".dashboard-tab").removeClass("active")
    $("#users").addClass("active")
    $(".dashboard-page").hide()
    $("#users-page").show()
    $(".dashboard-tab").click(change_page)
    $(".go-back-home").click(return_to_home)
    $("#users").click(load_user_data)
    $("body").on("click", ".users-container-item", edit_this_user)
    $(".save-user-info").click(save_this_user)
    $(".close-edit-tab").click(close_edit_tab)
}

$(document).ready(setup)