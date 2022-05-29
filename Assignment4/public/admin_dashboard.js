current_tab = ""
old_username = ""

{/* <div class="users-container-item">
<p>4</p>
<p>4</p>
<p>User <i class="fa-solid fa-pencil"></i></p>
</div> */}

function close_creation_tab() {
    $("#create-username").val("")
    $("#create-password").val("")
    $(".create-user").hide()
}

function close_edit_tab() {
    $(".edit-user").hide()
    $(".edit-admin").hide()
}

function delete_user() {
    username = $(".edit-user-username").text()
    $.ajax(
        {
            "url": "/deleteUser",
            "type": "DELETE",
            "data": {
                "username": username
            },
            "success": function(data) {
                console.log(data)
                $(".edit-user").hide()
                load_user_data()
            }
        }
    )

}

function cancel_user_deletion() {
    $(".confirm-deletion").remove()
}

function confirm_user_deletion() {
    $(".confirm-deletion").remove()
    $(".edit-user").append(`
    <div class="confirm-deletion">
    <p>Are you sure you want to delete this account?</p>
    <button class="cancel">Cancel</button>
    <button class="confirm">Confirm</button>
    </div>
    `)
}

function view_this_admin() {
    username = $(this).attr("id")
    $.ajax(
        {
            "url": "/getAdmin",
            "type": "POST",
            "data": {
                "username": username
            },
            "success": function(data) {
                console.log(data)
                $(".edit-admin-username").text(data[0].username)
                $("#admin-username").val(data[0].username)
                $("#admin-password").val(data[0].password)
            }
        }
    )
    $(".edit-admin").show()
}

function display_admin_data(data) {
    console.log(data)
    $(".admins-container").html("")
    for (i = 0; i < data.length; i++) {
        admin = ""
        admin += `<div class="admins-container-item" id="${data[i].username}">`

        admin += `<p>${data[i].username}</p>`
        admin += `<p>${data[i].password}</p>`
        admin += `<p>${data[i].type} <i class="fa-solid fa-pencil"></i></p>`

        admin += `</div>`
        old = $(".admins-container").html()
        $(".admins-container").html(old + admin)
    }
}

function load_admins() {
    $.ajax(
        {
            "url": "/getAdmins",
            "type": "GET",
            "success": display_admin_data
        }
    )
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
    $(".confirm-deletion").remove()
    $(".edit-user").hide()
    load_user_data()
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
    $(".edit-user").hide()
    $(".edit-admin").hide()
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
$(".edit-admin").hide()
$(".create-user").hide()

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
    $("#admins").click(load_admins)
    $("body").on("click", ".admins-container-item", view_this_admin)
    $(".delete-user-info").click(confirm_user_deletion)
    $("body").on("click", ".cancel", cancel_user_deletion)
    $("body").on("click", ".confirm", delete_user)
    $(".close-creation-tab").click(close_creation_tab)
}

$(document).ready(setup)