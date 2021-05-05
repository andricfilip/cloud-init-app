// var url = "https://localhost:44329/login/";
// var urlWorkout = "https://localhost:44329/workout/";
// var urlWorkout = "http://147.91.204.116:2058/workout/";
// var url = "http://147.91.204.116:2058/login/";

if (window.sessionStorage["token"] != undefined) {
    loggedUserContent(window.sessionStorage["name"], window.sessionStorage["role"]);
} else {
    $(".login-menu").show();
    $(".user-menu").hide();
    $(".admin-menu").hide();
}

$(document).ready(function() {

    if (window.sessionStorage["name"] != undefined) {
        $("#name-edit").val(window.sessionStorage["name"].split(" ")[0]);
        $("#surname-edit").val(window.sessionStorage["name"].split(" ")[1]);
    }

    // EDIT PROFILE
    $("#edit-profile-form").submit(function() {
        var name = $("#name-edit").val().trim();
        var surname = $("#surname-edit").val().trim();

        var oldName = window.sessionStorage["name"].split(" ")[0];
        var oldSurname = window.sessionStorage["name"].split(" ")[1];

        if (oldName == name && oldSurname == surname) {
            $("#error-edit-text").html("Nema izmene.");
            $("#error-edit").show();
            $("#error-edit").delay(4000).fadeToggle();

            return false;
        }

        var data = JSON.stringify({
            "firstname": name,
            "lastname": surname
        });

        $.ajax({
            url: url,
            type: "PUT",
            data: data,
            contentType: "application/json",
            headers: {
                'Authorization': 'Bearer ' + window.sessionStorage['token']
            },
            success: function(response) {
                $("#succ-edit-text").html("Uspešno izmenjeni podaci.");
                $("#succ-edit").show();
                $("#succ-edit").delay(4000).fadeToggle();

                window.sessionStorage["name"] = name + " " + surname;

                $(".edit-username").html(name + " " + surname);
            },
            error: function(jqXHR, exception) {
                $("#error-edit-text").html(jqXHR.responseText);
                $("#error-edit").show();
                $("#error-edit").delay(4000).fadeToggle();
            }
        });
        return false;
    });

    // CHANGE PASSWORD
    $("#change-pass-form").submit(function() {
        var oldPass = $("#old-pass-ch").val().trim();
        var newPass = $("#new-pass-ch").val().trim();
        var repeatedPass = $("#new-pass-ch-repeat").val().trim();

        if (newPass != repeatedPass) {
            $("#error-pass-text").html("Lozinke moraju da se poklapaju!");
            $("#error-pass").show();
            $("#error-pass").delay(4000).fadeToggle();

            return false;
        }

        $.ajax({
            url: url + "changePassword",
            type: "post",
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + window.sessionStorage['token']
            },
            data: JSON.stringify({
                "oldPassword": oldPass,
                "newPassword": newPass
            }),
            success: function(response) {
                // $("#change-pass-form").trigger("reset");
                $("#succ-pass-text").html(response);
                $("#succ-pass").show();
                $("#succ-pass").delay(4000).fadeToggle();

                $("#old-pass-ch").val("");
                $("#new-pass-ch").val("");
                $("#new-pass-ch-repeat").val("");
            },
            error: function(jqXHR, exception) {
                $("#error-pass-text").html(jqXHR.responseText);
                $("#error-pass").show();
                $("#error-pass").delay(4000).fadeToggle();
            }
        });
        return false;
    });
});