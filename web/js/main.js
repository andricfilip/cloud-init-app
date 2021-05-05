// var url = "https://localhost:44329/login/";
// var urlWorkout = "https://localhost:44329/workout/";
var urlWorkout = "http://147.91.204.116:2058/workout/";
var url = "http://147.91.204.116:2058/login/";
var rootUrl = "http://147.91.204.116:2058/";

// USER CHECK - SESSION
if (window.sessionStorage["token"] != undefined) {
    exp = window.sessionStorage["expireDate"]
    if (Date.now() >= exp * 1000) { // token expired
        refreshToken();
    }
    loggedUserContent(window.sessionStorage["name"], window.sessionStorage["role"]);
} else {
    $(".login-menu").show();
    $(".user-menu").hide();
    $(".admin-menu").hide();
}

$(document).ready(function() {
    // LOADER
    $.LoadingOverlaySetup({
        background: "rgba(37, 40, 45, 0.7)",
        imageColor: "#f8895e",
    });
    $(document).ajaxStart(function() {
        $.LoadingOverlay("show");
    });
    $(document).ajaxStop(function() {
        $.LoadingOverlay("hide");
    });

    // LOGIN
    $("#login-form").submit(function() {
        var data = '{ "email" : "' + $("#email-log").val() + '", "password" : "' + $("#password-log").val() + '" }';

        $.ajax({
            url: url,
            data: data,
            dataType: "json",
            type: "POST",
            contentType: "application/json",
            success: function(response) {
                // response - UserLogin(Firstname, Lastname, ExpireDay, Token, RefreshToken)
                var firstname = response.firstname;
                var lastname = response.lastname;
                var expireDay = response.expireDay;
                var token = response.token;
                var refreshToken = response.refreshToken;

                var tokenObj = parseJwt(token);

                var nameid = tokenObj.nameid;
                var role = tokenObj.role;
                var expireDate = tokenObj.exp;

                window.sessionStorage["name"] = firstname + " " + lastname;
                window.sessionStorage["role"] = role;
                window.sessionStorage["token"] = token;
                window.sessionStorage["refreshToken"] = refreshToken;
                window.sessionStorage["expireDate"] = expireDate;

                loggedUserContent(window.sessionStorage["name"], role);
            },
            error: function(jqXHR, exception) {
                $("#error-login-text").html(jqXHR.responseText);
                $("#error-login").show();
                $("#error-login").delay(4000).fadeToggle();
            }
        });
        return false;
    });
});

// LOGOUT
function logout() {
    // ciscenje sesije
    window.sessionStorage.clear();

    $(".login-menu").show(1000);
    $(".user-menu").hide(1000);
    $(".admin-menu").hide(1000);

    window.location.replace("index.html");
}

// CUSTOM MENU ITEMS SHOW
function loggedUserContent(name, role) {
    $(".login-menu").hide(1000);

    $(".edit-username").html(name);
    $(".user-menu").show(1000);

    if (role == "Admin") {
        $(".admin-menu").show(1000);
    } else {
        $(".admin-menu").hide(1000);
    }
}

function refreshToken() {
    var accessToken = window.sessionStorage["token"];
    var refreshToken = window.sessionStorage["refreshToken"];

    $.ajax({
        url: url + "refresh",
        data: JSON.stringify({
            "accessToken": accessToken,
            "refreshToken": refreshToken
        }),
        dataType: "json",
        type: "POST",
        contentType: "application/json",
        success: function(response) {
            window.sessionStorage["token"] = response.accessToken;
            window.sessionStorage["refreshToken"] = response.refreshToken;

            var tokenObj = parseJwt(response.accessToken);

            window.sessionStorage["expireDate"] = tokenObj.exp;

        },
        error: function(jqXHR, exception) {
            logout();
        }
    });
}