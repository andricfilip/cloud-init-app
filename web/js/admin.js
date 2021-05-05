// var url = "https://localhost:44329/login/";
// var urlWorkout = "https://localhost:44329/workout/";

// var urlWorkout = "http://147.91.204.116:2058/workout/";
// var url = "http://147.91.204.116:2058/login/";

// USER CHECK - SESSION


$(document).ready(function() {
    // GET WORKOUT VIDEOS
    showUserRequests();

    // ADMINISTRATION METHODS CALLING
    $("#workout-form").submit(function() {
        addWorkout();
        return false;
    });

    $("#requests-tab").click(function(e) {
        showUserRequests();
        $("#searchRequests").val("");
        e.preventDefault();
    });

    $("#users-tab").click(function(e) {
        showUsers();
        $("#searchUsers").val("");
        e.preventDefault();
    });

    $("#workout-control").click(function(e) {
        showWorkouts();
        e.preventDefault();
    });

    $("#searchRequests").keyup(function() {
        showUserRequests();
    });

    $("#searchUsers").keyup(function() {
        showUsers();
    });
});

// SHOW USER REQUESTS
function showUserRequests() {
    var name = $("#searchRequests").val();
    if (name != undefined) {
        name = name.trim();
    }

    $.ajax({
        type: "POST",
        url: url + "filterRequests?name=" + name,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + window.sessionStorage['token']
        },
        dataType: "json",
        success: function(response) {
            printRequests(response);
        },
        error: function(response) {
            console.log(response);
        }
    });
}

// PRINT USER REQUESTS
function printRequests(data) {
    str = ""
    if (data.length > 0) {
        str = "<table class='table table-hover table-dark'><thead><tr><th>Ime</th><th>Prezime</th><th>E-mail</th><th>Uplatnica</th><th colspan=2 style='text-align:center'>Akcije</th></tr></thead><tbody>";
        for (var i = 0; i < data.length; i++) {
            str += "<tr><td>" + data[i].firstname + "</td><td>" + data[i].lastname + "</td><td>" +
                data[i].email + "</td><td><i class='fas fa-money-check zoom padding_icon ' onclick='showPaymentImage(\"" + data[i].paymentImage + "\")'></i></td><td><i class='fas fa-user-plus zoom' onclick='registerUser(\"" + data[i].id + "\")'></i></td><td><i class='fas fa-trash zoom' onclick='deleteRequest(\"" + data[i].id + "\")'></i></td></tr >"
        }
        str += "</tbody></table>"
    } else {
        str = "<h3>Nema zahteva za registraciju.</h3>";
    }
    $("#request-context").html(str);
}

// DELETE USER REQUESTS - DECLINE REQUESTS
function deleteRequest(requestID) {
    $.ajax({
        type: "DELETE",
        url: url + "deleteRequest?requestID=" + requestID,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + window.sessionStorage['token']
        },
        success: function(response) {
            showUserRequests();
        },
        error: function(response) {
            // alert(response);
        }
    });
}

// APPROVE REGISTRATION
function registerUser(registerID) {
    $.ajax({
        type: "post",
        url: url + "registerUser?registrationID=" + registerID,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + window.sessionStorage['token']
        },
        success: function(response) {
            showUserRequests();
        },
        error: function(response) {
            // alert(response);
        }
    });
}

// SHOW PAYCHECK 
function showPaymentImage(paymentUrl) {
    alert(rootUrl + paymentUrl);
    $.magnificPopup.open({
        items: {
            src: rootUrl + paymentUrl
        },
        type: 'image' // this is default type
    });
}

// SHOW USERS
function showUsers() {
    var name = $("#searchUsers").val().trim();
    $.ajax({
        type: "POST",
        url: url + "filterUsers?name=" + name,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + window.sessionStorage['token']
        },
        dataType: "json",
        success: function(response) {
            printUsers(response);
        },
        error: function(response) {
            console.log(response);
        }
    });
}

// PRINT USERS
function printUsers(data) {
    if (data.length > 0) {
        str = "<table class='table table-hover table-dark'><thead><tr><th>Ime</th><th>Prezime</th><th>E-mail</th><th>Preostalo vreme</th><th colspan=2 >Akcije</th></tr></thead><tbody>";
        var now = new Date();
        for (var i = 0; i < data.length; i++) {
            var exp = new Date(data[i].expireDate)
            var diff = new Date(exp - now);
            var days = diff / 1000 / 60 / 60 / 24; // decimal 1.125546 expired -1.125546
            str += "<tr>";
            str += "<td>" + data[i].firstname + "</td><td>" + data[i].lastname + "</td><td>" +
                data[i].email + "</td>";
            if (days < 0) {
                str += "<td class='expired-time'><b>" + data[i].leftTime + "</b></td>";
            } else if (days < 3) {
                str += "<td class='less-then-3'><b>" + data[i].leftTime + "</b></td>";
            } else {
                str += "<td><b>" + data[i].leftTime + "</b></td>";
            }
            "<td><b>" + data[i].leftTime + "</b></td>"
            str += "<td><i class='fas fa-trash zoom' onclick='deleteUser(\"" + data[i].id + "\")'></i></td></tr >"
        }
        str += "</tbody></table>"
    } else {
        str = "<h3>Nema registrovanih korisnika.</h3>";
    }

    $("#users-context").html(str);
}

// DELETE USERS
function deleteUser(userID) {
    $.ajax({
        type: "DELETE",
        url: url + "deleteUser?userID=" + userID,
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + window.sessionStorage['token']
        },
        success: function(response) {
            showUsers();
        },
        error: function(response) {
            console.log(response);
        }
    });
}

// ADD WORKOUT VIDEO
function addWorkout() {
    var week = $("#workout-week").val();
    var day = $("#workout-day").val();
    var title = $("#workout-title").val();
    var link = $("#workout-link").val();

    $.ajax({
        type: "POST",
        url: urlWorkout + "addWorkout",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + window.sessionStorage['token']
        },
        data: '{ "week":' + week + ', "day":' + day + ',"title":"' + title + '", "yTlink":"' + link + '"}',
        success: function(response) {
            $("#workout-form").trigger("reset");
            $("#succ-workout-text").html(response);
            $("#succ-workout").show();
            $("#succ-workout").delay(4000).fadeToggle();

        },
        error: function(jqXHR, exception) {
            $("#error-workout-text").html(jqXHR.responseText);
            $("#error-workout").show();
            $("#error-workout").delay(4000).fadeToggle();
        }
    });
}

// DELETE WORKOUT VIDEO
function deleteWorkout(workoutID) {
    $.ajax({
        type: "DELETE",
        url: urlWorkout + "?workoutID=" + workoutID,
        headers: {
            'Authorization': 'Bearer ' + window.sessionStorage['token']
        },
        contentType: "application/json",
        success: function() {
            showWorkouts();
        },
        error: function(response) {
            console.log(response);
        }
    });
}

// GET WORKOUT VIDEOS
function showWorkouts() {
    $.ajax({
        type: "GET",
        url: urlWorkout,
        // credentials: "MyPolicy",
        headers: {
            'Authorization': 'Bearer ' + window.sessionStorage['token']
        },
        contentType: "application/json",
        success: function(response) {
            printWorkouts(response);
        },
        error: function(response) {
            console.log(response);
        }
    });
}

// PRINT WORKOUT VIDEOS
function printWorkouts(data) {
    str = ""
    if (data.length > 0) {
        str = "<table class='table table-hover table-dark'><thead><tr><th>Nedelja</th><th>Dan</th><th>Naslov</th><th style='text-align:center'>Akcije</th></tr></thead><tbody>";
        for (var i = 0; i < data.length; i++) {
            str += "<tr><td>" + data[i].week + "</td><td>" + data[i].day + "</td><td>" +
                data[i].title + "</td><td><i class='fancybox-media fas fa-play zoom' style='color: white;' data-fancybox-group='video' title='" + data[i].title + "' href='" + data[i].yTlink + "'></i>";
            str += "<i class='fas fa-trash zoom padding_icon' onclick='deleteWorkout(\"" + data[i].id + "\")'></i></td></tr>";
        }
        str += "</tbody></table>"
    } else {
        str = "<h3>Nema treninga.</h3>";
    }
    $("#workout-control-context").html(str);
}