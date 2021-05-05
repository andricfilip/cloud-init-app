// var url = "https://localhost:44329/login/";
// var urlWorkout = "https://localhost:44329/workout/";
// var urlWorkout = "http://147.91.204.116:2058/workout/";
// var url = "http://147.91.204.116:2058/login/";

$(document).ready(function() {

    // ZOOM PAYCHECK
    $('#payment-example').magnificPopup({
        items: {
            src: '_include/img/work/uplatnica.png'
        },
        type: 'image' // this is default type
    });

    // LOAD FILE
    $("#picture").change(function(e) {
        var file = $('#picture')[0].files[0].name;
        $("#show-file-name").html("<br><strong>Učitan fajl: </strong>" + file);
        e.preventDefault();
    });

    // REGISTRATION
    $("#register-form").submit(function() {
        var formData = new FormData($("#register-form")[0]);

        $.ajax({
            url: url + "register",
            data: formData,
            type: "POST",
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                // $("#register-form").hide();
                $("#register-form").trigger("reset");
                // $("#login-form").show();
                $("#show-file-name").html("");
                $("#succ-reg-text").html(response);
                $("#succ-reg").show();
                $("#succ-reg").delay(4000).fadeToggle();
            },
            error: function(jqXHR, exception) {
                $("#error-reg-text").html(jqXHR.responseText);
                $("#error-reg").show();
                $("#error-reg").delay(4000).fadeToggle();
            },
        });
        return false;
    });

    // SEND FORGOTTEN PASSWORD CODE
    $("#forgot-pass").click(function() {
        var email = $("#email-log").val();
        if (email.length === 0) {
            $("#error-login-text").html("Unesite mejl adresu.");
            $("#error-login").show();
            $("#error-login").delay(4000).fadeToggle();
            return false;
        }

        $.ajax({
            url: url + "forgotPassword/" + email,
            type: "GET",
            contentType: "application/json",
            success: function(response) {
                $("#user-email-hidden").val(email);
                $("#forgot-pass-modal").modal("show");
            },
            // complete: function() {
            //     $.LoadingOverlay("hide");
            // },
            error: function(jqXHR, exception) {
                $("#error-login-text").html(jqXHR.responseText);
                $("#error-login").show();
                $("#error-login").delay(4000).fadeToggle();
            }
        });
        return false;
    });

    // NEW PASSWORD - RENEW AFTER FORGOTTEN PASSWORD
    $("#forgot-pass-form").submit(function() {
        var new_pass = $("#new-pass-forgot").val().trim();
        var repeated_pass = $("#repeat-pass-forgot").val().trim();
        var email = $("#user-email-hidden").val().trim();
        var code = $("#new-pass-code").val().trim();

        if (new_pass != repeated_pass) {
            $("#error-forgot-text").html("Lozinke se ne poklapaju.");
            $("#error-forgot").show();
            $("#error-forgot").delay(4000).fadeToggle();

            return false;
        }

        var data = JSON.stringify({
            "email": email,
            "code": code,
            "newPassword": new_pass
        });

        $.ajax({
            url: url + "resetPassword",
            type: "PUT",
            data: data,
            contentType: "application/json",
            success: function(response) {
                $("#succ-forgot-text").html(response);
                $("#succ-forgot").show();
                $("#succ-forgot").delay(4000).fadeToggle();
                $("#forgot-pass-form").trigger("reset");
            },
            error: function(jqXHR, exception) {
                $("#error-forgot-text").html(jqXHR.responseText);
                $("#error-forgot").show();
                $("#error-forgot").delay(4000).fadeToggle();
            }
        });
        return false;
    });
});

// LOGIN PAGE SHOW
function goToLoginPage() {
    $("#register-form").hide();
    $("#login-form").show();
}

// REGISTER PAGE SHOW
function goToRegistrationPage() {
    $("#login-form").hide();
    $("#register-form").show();
}

// PARSE JWT
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}