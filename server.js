//Express initialisieren
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

//Ejs initialisiern
app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");

//freigabe der ordner
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/pictures"));
app.use(express.static(__dirname + "/public"));

//initialisierung Datenbank
const DATABASE = "benutzer.db";
const db = require("better-sqlite3")(DATABASE);

// init express fileupload
const fileUpload = require("express-fileupload");
app.use(fileUpload());
//cookies-parser init
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//functions
function anmeldung(benutzername, passwort) {
    const benutzer = db.prepare("SELECT * FROM benutzer").all();
    for (daten of benutzer) {
        if (daten.benutzername == benutzername && daten.passwort == passwort) {
            return true;
        }
    }
    return false;
}

//server starten
app.listen(3000, function () {
    console.log("http://localhost:3000/startseite");
});

//get Requests
app.get("/startseite", function (req, res) {
    res.sendFile(__dirname + "/views/startseite.html");
});

app.get("/features", function (req, res) {
    res.sendFile(__dirname + "/views/features.html");
});

app.get("/aboutUs", function (req, res) {
    res.sendFile(__dirname + "/views/aboutUs.html");
});
/*app.get("/login",function(req,res){
    res.sendFile(__dirname + "/views/loginformular.html")
});*/
app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/registrierung", function (req, res) {
    res.render("registrierung");
});

//Post Requests
app.post("/login", function (req, res) {});

app.post("/registrierung", function (req, res) {});

app.post("/neuerBenutzer", function (req, res) {
    const param_name = req.body.name;
    const param_email = req.body.email;
    const param_passwort = req.body.passwort;

    const info = db
        .prepare(
            "INSERT INTO benutzer (email, benutzername, passwort) VALUES(?,?,?)"
        )
        .run(param_email, param_name, param_passwort);
    console.log(info);
    res.redirect("/login");
});

// Anmeldung
app.post("/startseite", function (req, res) {
    const benutzername = req.body.benutzername;
    const passwort = req.body.passwort;

    if (anmeldung(benutzername, passwort)) {
        res.redirect("/startseite");
    }
});


app.get("/kalender", function (req, res) {
    res.sendFile(__dirname + "/views/kalendarmark.html");
});
