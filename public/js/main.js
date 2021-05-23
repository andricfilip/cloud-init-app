$(document).ready(function() {

    var hash = $(location).attr('hash');
    $(".active").removeClass("active");
    hash = hash.substr(1);
    $(document.getElementById(hash)).addClass("active");
    if (hash == "ljubimci") {
        showPets();
        // showPets();
    }
    if (hash == "vlasnici") {
        showOwners();
        // showOwners();
    }
    $("#ljubimci").click(function() {
        showPets();
        // showPets();
        $(".active").removeClass("active");
        $("#ljubimci").addClass("active");
        // location.href = "glavna.html#ljubimci"
    });
    $("#vlasnici").click(function() {
        showOwners();
        // showOwners();
        $(".active").removeClass("active");
        $("#vlasnici").addClass("active");
        // location.href = "glavna.html#vlasnici";
    });
});

function informacijeLjubimca(id) {
    $.ajax({
        url: '/ljubimacInfo',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({ "id": id }),
        success: function(data) {
            var stavke = JSON.parse(data);
            $("#ljubimac_info").text(stavke[0].ime);
            $("#vrstaInfo").val(stavke[0].vrsta);
            $("#datumInfo").val(stavke[0].datum_rodjenja);
            $("#vlasnikInfo").val(stavke[0].ime_vlasnika);
            $("#ljubimacOpis").text(stavke[0].opis);
            $("#ljubimacInfoModal").modal("show");
        }
    });
}

function informacijeVlasnika(id) {
    $.ajax({
        url: '/ownerInfo',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({ "id": id }),
        success: function(data) {
            var stavke = JSON.parse(data);
            $("#vlasnik_info").text(stavke[0].ime + " " + stavke[0].prezime);
            $("#telefonInfo").val(stavke[0].telefon);
            $("#emailInfo").val(stavke[0].email);
            $("#opisInfo").text(stavke[0].opis);
            $("#infoModal").modal("show");
            ljubimciVlasnika(id);
        }
    });
}

function showPets() {
    $.ajax({
        url: '/ljubimci',
        type: 'post',
        contentType: 'application/json',
        success: function(data) {
            printPets(data);
        }
    });
}

function showOwners() {
    $.ajax({
        url: '/vlasnici',
        type: 'post',
        contentType: 'application/json',
        success: function(data) {
            printOwnes(data);
        }
    });
}

function printPets(data) {

    data = JSON.parse(data);
    var str = "<table class='table table-hover'><tr><th>Ime ljubimca</th><th>Ime vlasnika</th><th>Datum trodjenja</th><th>Vrsta</th><th>Opcije</th>";
    for (var g in data) {
        str += "<tr><td>" + data[g].ime + "</td><td>" + data[g].ime_vlasnika + "</td><td>" + data[g].datum_rodjenja + "</td><td>" + data[g].naziv_vrste + "</td>";
        str += "<td><span onclick='informacijeLjubimca(" + data[g].id + ")' class = 'fas fa-info' ></span>";
        str += "<span onclick='izmeniLjubimca(" + data[g].id + ")' class='fas fa-pencil-alt'></span>";
        str += "<span onclick='izbrisiLjubimca(" + data[g].id + ")' class='fas fa-trash-alt'></span></td>";
    }
    str += "</table>";
    $("#tabela").html(str);
    str = "<button type='button' class='btn btn-outline-info col-md-12' data-toggle='modal' data-target='#dodajLjubimca' onclick='popuniModalLjubimca()'>Dodaj ljubimca</button>"
    $("#dodaj").html(str);
}

function printOwnes(data) {
    data = JSON.parse(data);
    var str = "<table class='table table-hover'><tr><th>Ime</th><th>Prezime</th><th>Telefon</th><th>E-mail</th><th>Opcije</th>";
    for (var g in data) {
        str += "<tr><td>" + data[g].ime + "</td><td>" + data[g].prezime + "</td><td>" + data[g].telefon + "</td><td>" + data[g].email + "</td>";
        str += "<td><span onclick='informacijeVlasnika(" + data[g].id + ")' class = 'fas fa-info' ></span>";
        str += "<span onclick='izmeniVlasnika(" + data[g].id + ")' class='fas fa-pencil-alt'></span>";
        str += "<span onclick='izbrisiVlasnika(" + data[g].id + ")' class='fas fa-trash-alt'></span></td>";
    }
    str += "</table>";
    $("#tabela").html(str);
    str = "<button type='button' class='btn btn-outline-info col-md-12' data-toggle='modal' data-target='#dodajVlasnika' >Dodaj vlasnika</button>"
    $("#dodaj").html(str);

    return;
}

function izbrisiLjubimca(id) {
    $.ajax({
        url: '/deletePet',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({ "id": id }),
        success: function(data) {
            showPets()
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    });
    showPets();
}

function izbrisiVlasnika(id) {
    $.ajax({
        url: '/deleteOwner',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({ "id": id }),
        success: function(data) {
            // alert("Usopesno izbrisano ");
            showOwners();
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    });
}

function ljubimciVlasnika(id) {
    $.ajax({
        url: '/ljubimciID',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({ "id": id }),
        success: function(data) {
            printPetsInfo(data);
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    });
}

function dodajVlasnika() {

    var ime = $('#dodajImeVlasnika').val();
    var prezime = $('#dodajPrezimeVlasnika').val();
    var telefon = $('#dodajTelefon').val();
    var email = $('#dodajEmail').val();
    var opis = $('#dodajOpisVlasnika').val();
    $.ajax({
        url: '/addOwner',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({ "ime": ime, "prezime": prezime, "telefon": telefon, "email": email, "opis": opis }),
        success: function(data) {
            $("#dodajVlasnika").modal("toggle");
            showOwners();
            $('#dodajImeVlasnika').val("");
            $('#dodajPrezimeVlasnika').val("");
            $('#dodajTelefon').val("");
            $('#dodajEmail').val("");
            $('#dodajOpisVlasnika').val("");
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    });
}

function printPetsInfo(data) {
    data = JSON.parse(data);
    if (data.length > 0) {

        var str = "<table class='table table-hover'><tr><th>Ime ljubimca</th><th>Datum trodjenja</th><th>Vrsta</th>";
        for (var g in data) {
            str += "<tr><td>" + data[g].ime + "</td><td>" + data[g].datum_rodjenja + "</td><td>" + data[g].naziv_vrste + "</td>";
        }
        str += "</table>";
        $("#tabelaInfo").html(str);
    } else {
        $("#tabelaInfo").html("");
    }

}

function dodajLjubimca() {
    var ime = $('#dodajImeLjubimca').val();
    var vrsta = $('#dodajVrsta').val();
    var datum = $('#dodajDatum').val();
    var vlasnik = $('#dodajVlasnikaLjubimca').val();
    var opis = $('#dodajOpisLjubimca').val();
    console.log(vrsta + " " + datum + " " + vlasnik);
    $.ajax({
        url: '/addPet',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({ "ime": ime, "vrsta": vrsta, "datum": datum, "vlasnik": vlasnik, "opis": opis }),
        success: function(data) {
            showPets();
            $('#dodajImeLjubimca').val("");
            $('#dodajDatum').val("");
            $('#dodajOpisLjubimca').val("");
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    });
}

function popuniModalLjubimca(idVrsta = 0, idVlasnika = 0) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "vlasnici", true);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var html = "";
            var stavke = JSON.parse(this.responseText);
            var vlasnici = document.getElementById('dodajVlasnikaLjubimca');
            var vlasniciUpdate = document.getElementById('updateVlasnik');
            stavke.forEach(stavka => {
                if (stavka.id == idVlasnika) {
                    html += "<option value='" + stavka.id + "' selected> " + stavka.ime + " " + stavka.prezime + "</option> ";
                } else {
                    html += "<option value='" + stavka.id + "' > " + stavka.ime + " " + stavka.prezime + "</option> ";
                }
            });
            // alert(html);
            vlasniciUpdate.innerHTML = html;
            vlasnici.innerHTML = html;
        }
    }


    xhttp.send();
    var x = new XMLHttpRequest();
    x.open("POST", "vrste", true);
    x.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var html = "";
            var stavke = JSON.parse(this.responseText);
            var vrsta = document.getElementById('dodajVrsta');
            var updateVrsta = document.getElementById("updateVrsta");
            stavke.forEach(stavka => {
                if (idVrsta == stavka.id) {
                    html += "<option value='" + stavka.id + "' selected> " + stavka.naziv_vrste + "</option> ";
                } else {
                    html += "<option value='" + stavka.id + "' > " + stavka.naziv_vrste + "</option> ";
                }
            });
            // alert(html);
            updateVrsta.innerHTML = html;
            vrsta.innerHTML = html;
        }
    }


    x.send();
}

function izmeniLjubimca(id) {
    $.ajax({
        url: '/ljubimacInfo',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({ "id": id }),
        success: function(data) {
            var pet = JSON.parse(data);
            pet = pet[0];
            $("#updateLjubimacId").val(pet.id);
            popuniModalLjubimca(pet.vrsta_id, pet.vlasnik_id);
            $("#updateImeLjubimca").val(pet.ime);
            document.getElementById("updateDate").value = pet.datum_rodjenja
            $("#updateOpisLjubimca").val(pet.opis);
            $("#updateLjubimac").modal("show");
        }
    });

}

function izmeniVlasnika(id) {
    $.ajax({
        url: '/ownerInfo',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({ "id": id }),
        success: function(data) {
            var owner = JSON.parse(data);
            owner = owner[0];
            $("#updateVlasnikId").val(owner.id);
            $("#updateImeVlasnika").val(owner.ime);
            $("#updatePrezimeVlasnika").val(owner.prezime);
            $("#updateTelefon").val(owner.telefon);
            $("#updateEmail").val(owner.email);
            $("#updateOpisVlasnika").val(owner.opis);
            $("#updateVlasnikModal").modal("show");
        }
    });
}

function updatePet() {
    var updatePetName = $("#updateImeLjubimca").val();
    var updateDate = document.getElementById("updateDate").value;
    var updateOpis = $("#updateOpisLjubimca").val();
    var id = $("#updateLjubimacId").val();
    var vrsta_id = $("#updateVrsta").val();
    var vlasnik_id = $("#updateVlasnik").val();
    console.log(id);
    $.ajax({
        url: '/updatePet',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({ "id": id, "ime": updatePetName, "vrsta_id": vrsta_id, "datum_rodjenja": updateDate, "opis": updateOpis, "vlasnik_id": vlasnik_id }),
        success: function(data) {
            showPets();
        }
    });
}

function updateOwner() {
    var id = $("#updateVlasnikId").val();
    var updateFirstName = $("#updateImeVlasnika").val();
    var updateLastName = $("#updatePrezimeVlasnika").val();
    var updateTelefon = $("#updateTelefon").val();
    var updateMail = $("#updateEmail").val();
    var updateOpis = $("#updateOpisVlasnika").val();
    console.log(id);
    $.ajax({
        url: '/updateOwner',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({ "id": id, "ime": updateFirstName, "prezime": updateLastName, "telefon": updateTelefon, "opis": updateOpis, "email": updateMail }),
        success: function(data) {
            showOwners();
        }
    });
}