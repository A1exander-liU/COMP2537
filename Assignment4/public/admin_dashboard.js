function return_to_home() {
    location.href = "/pokedex"
}

function setup() {
    $(".go-back-home").click(return_to_home)
}

$(document).ready(setup)