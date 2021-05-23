var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var sqlite3 = require('sqlite3');
var db  = new sqlite3.Database('seminarski.db');
var async = require('async');
var path = require('path');
var rezultat = "";
var owner = "";
app.use(express.static('public'));
app.use('css', express.static('public/css'));
app.use('js', express.static('public/js'));
app.use('slike', express.static('public/slike'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let sql = "";
app.post('/ljubimci', function(req, res) {
    sql = 'select * from Ljubimac'
    sql = "select lj.id,lj.ime,lj.datum_rodjenja,lj.opis,lj.vrsta_id,lj.vlasnik_id,v.ime || ' ' || v.prezime as ime_vlasnika,vr.naziv_vrste ";
    sql += "from Ljubimac lj join Vlasnik v on v.id = lj.vlasnik_id ";
    sql += "join VrstaLjubimca vr on vr.id = lj.vrsta_id ";
    db.all(sql, function(err, rows) {
        rezultat = JSON.stringify(rows);
        // console.log(res);
        res.send(rezultat);

    });

});
app.post('/vlasnici', function(req, res) {
    sql = "select * from Vlasnik";
    db.all(sql, function(err, rows) {
        rezultat = JSON.stringify(rows);
        // console.log(rezultat);
        res.send(rezultat);
        // console.log(rezultat);
    });
});
app.post('/vrste', function(req, res) {
    sql = "select * from VrstaLjubimca";
    db.all(sql, function(err, rows) {
        rezultat = JSON.stringify(rows);
        res.send(rezultat);
        // console.log(rezultat);
    });
});

app.post('/ljubimciID', function(req, res) {

    sql = "SELECT lj.*,v.naziv_vrste FROM Ljubimac lj JOIN VrstaLjubimca v ON lj.vrsta_id = v.id WHERE lj.vlasnik_id =" + req.body.id;
    // console.log(req.body.id);
    db.all(sql, function(err, rows) {
        rezultat = JSON.stringify(rows);
        // console.log(rows);
        res.send(rezultat);
    });
});
app.post('/ownerInfo', function(req, res) {
    sql = "select * from Vlasnik where id=" + req.body.id;
    db.all(sql, function(err, rows) {
        rezultat = JSON.stringify(rows);
        // console.log(rows[0]);
        res.send(rezultat);
    });

});
app.post('/ljubimacInfo', function(req, res) {
    // console.log(req.params.id_ljubimca);
    sql = "select lj.id,lj.ime,lj.datum_rodjenja,lj.opis,lj.vrsta_id,lj.vlasnik_id,v.ime || ' ' || v.prezime as ime_vlasnika,vr.naziv_vrste as vrsta ";
    sql += "from Ljubimac lj join Vlasnik v on v.id = lj.vlasnik_id ";
    sql += "join VrstaLjubimca vr on vr.id = lj.vrsta_id ";
    sql += "where lj.id =" + req.body.id;
    db.all(sql, function(err, rows) {
        rezultat = JSON.stringify(rows);
        // console.log(rows);
        res.send(rezultat);
    });

});
app.post('/addOwner', function(req, res) {
    sql = "insert into Vlasnik(ime,prezime,telefon,email,opis) values('"
    sql += req.body.ime + "','" + req.body.prezime + "','" + req.body.telefon + "','" + req.body.email + "','" + req.body.opis + "')"
        // console.log(req.body.id);
    db.run(sql, function(err, rows) {
        // rezultat = JSON.stringify(rows);
        // console.log(rows);
        res.send();
    });
});
app.post('/addPet', function(req, res) {
    sql = "insert into Ljubimac(ime,vrsta_id,datum_rodjenja,opis,vlasnik_id) values('"
    sql += req.body.ime + "','" + req.body.vrsta + "','" + req.body.datum + "','" + req.body.opis + "','" + req.body.vlasnik + "')";
    // console.log(req.body.id);
    db.run(sql, function(err, rows) {
        res.send();
    });
});
app.post('/deleteOwner', function(req, res) {
    sql = "delete from Vlasnik where id=" + req.body.id;
    db.run(sql, function(err, rows) {
        // rezultat = JSON.stringify(rows);
        // console.log(rows);
        res.send();
    });
});
app.post('/deletePet', function(req, res) {
    sql = "delete from Ljubimac where id=" + req.body.id;
    db.run(sql, function(err, rows) {
        // rezultat = JSON.stringify(rows);
        // console.log(rows);
        res.send();
    });
});
app.post("/updatePet", function(req, res) {
    sql = "UPDATE Ljubimac SET ime = '" + req.body.ime + "', vrsta_id= " + req.body.vrsta_id;
    sql += " , datum_rodjenja = '" + req.body.datum_rodjenja + "' , opis = '" + req.body.opis + "', vlasnik_id=" + req.body.vlasnik_id;
    sql += " where id = " + req.body.id;
    db.run(sql, function(err, rows) {
        res.send();
    });
});
app.post("/updateOwner", function(req, res) {
    sql = "UPDATE Vlasnik SET ime = '" + req.body.ime + "', prezime= '" + req.body.prezime;
    sql += "' , telefon = '" + req.body.telefon + "' , email = '" + req.body.email + "', opis='" + req.body.opis + "'";
    sql += " where id = " + req.body.id;
    db.run(sql, function(err, rows) {
        res.send();
    });
});

var server = app.listen(8080, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})