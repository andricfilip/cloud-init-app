$(document).ready(function() {
    showWorkoutsUsers();
});

// GET WORKOUT VIDEOS
function showWorkoutsUsers(week) {
    $.ajax({
        type: "GET",
        url: urlWorkout,
        headers: {
            'Authorization': 'Bearer ' + window.sessionStorage['token']
        },
        contentType: "application/json",
        success: function(response) {
            printWorkoutsByWeek(response);
        },
        error: function(response) {
            console.log(response);
        }
    });
}

// PRINT WORKOUT VIDEOS
function printWorkoutsByWeek(data) {
    for (let i = 0; i < data.length; i++) {
        $("#n" + data[i].week + "-" + data[i].day).attr("title", data[i].title);
        $("#n" + data[i].week + "-" + data[i].day).attr("href", data[i].yTlink);
    }
}