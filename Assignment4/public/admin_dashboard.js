current_tab = ""

function change_page() {
    current_tab = $(this).attr("id")
    $(".dashboard-tab").removeClass("active")
    $(`#${current_tab}`).addClass("active")
}

function return_to_home() {
    location.href = "/pokedex"
}

function setup() {
    $(".dashboard-tab").removeClass("active")
    $("#users").addClass("active")
    $(".dashboard-tab").click(change_page)
    $(".go-back-home").click(return_to_home)
}

$(document).ready(setup)