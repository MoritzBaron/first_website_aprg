

//Express initialisieren
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

//Express-Session initialisieren
const session = require('express-session')
app.use(session({
    secret: 'example',
    saveUninitialized: false,
    resave: false
}));

//bcrypt initialisieren
const bcrypt = require('bcrypt');

//Ejs initialisiern
app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");

//freigabe der ordner
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/pictures"));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/kalenderMo"));

//initialisierung Datenbank
const DATABASE = "benutzer.db";
const db = require("better-sqlite3")(DATABASE);

// init express fileupload
const fileUpload = require("express-fileupload");
app.use(fileUpload());
//cookies-parser init
const cookieParser = require("cookie-parser");
app.use(cookieParser());

/*functions
function anmeldung(benutzername, passwort) {
    const benutzer = db.prepare("SELECT * FROM benutzer").all();
    for (daten of benutzer) {
        if (daten.benutzername == benutzername && daten.passwort == passwort) {
            return true;
        }
    }
    return false;
}*/

//server starten
app.listen(3000, function () {
    console.log("http://localhost:3000/startseite");
});

//get Requests

app.get("/startseite", function(req,res){
    if(angemeldet){
    res.render("startseite",{"message": "Guten Tag"});   
    }
    else{
        res.render("startseite", {"message": "Guten Tag " + req.session.user});
    }
    
});


app.get("/features", function (req, res) {
    res.sendFile(__dirname + "/views/startseite.html");
});

app.get("/contactus", function (req, res) {
    res.sendFile(__dirname + "/views/contactus.html");
});

app.get("/login", function (req, res) {
    res.render("login");
    
});

app.get("/registrierung", function (req, res) {
    res.render("registrierung");
});

app.get("/logout", function(req,res){
  
    req.session.destroy();
    res.clearCookie();
    res.render("startseite", {"message":"Ausgeloggt"})
    showButton();

});

//Post Requests
app.post("/login", function (req, res){});

app.post("/registrierung", function (req, res) {});

//Registrierungsfunktion
app.post("/neuerBenutzer", function (req, res) {
    //Eingaben aus dem registrierung.ejs Formular
    const param_name = req.body.benutzername;
    const param_email = req.body.email;
    const param_passwort = req.body.passwort;
    // überprüfen ob Benutzer schon existiert
    rows = db.prepare("SELECT * FROM benutzer WHERE benutzername = ?").all(param_name);
    //Passwort verschlüsseln
    if (rows.length == 0){
        const hash = bcrypt.hashSync(param_passwort, 10);
        const info = db.prepare("INSERT INTO benutzer(email, benutzername, passwort) VALUES(?,?,?)").run(param_email, param_name, hash);
        console.log(info);
        
        res.redirect("login");
    }
    else{
        res.render('registrierung');
    }
    
    
});

// Anmeldung
app.post("/startseite", function (req, res) {
    const benutzername = req.body.benutzername;
    const passwort = req.body.passwort;
    const rows = db.prepare("SELECT passwort FROM benutzer WHERE benutzername=?").all(benutzername);
    if(rows && rows.length == 1){
        const hash = rows[0].passwort;
        const isValid = bcrypt.compareSync(passwort, hash);
        if(isValid == true){
            req.session.authenticated = true;
            req.session.user = benutzername;
            console.log(req.session.user);
            req.session.benutzername = benutzername;
            res.redirect("startseite");
        }
        else {
            res.redirect("login")
        }
        
        }
        else {
            res.redirect("login")
    }
});

//Funnktion istAngemeldet ?
function angemeldet(req,res){
    if(req.session.authenticated==true){
        return true
        
    }
    else{
        return false
    }
};
 



app.get("/kalender", function (req, res) {
    res.sendFile(__dirname + "/views/kalenderMo.html");
});

//ajax
$.post()

// Kalender Speichern funktion
app.post("/events",function(req,res){
    const benutzername = req.body.benutzername;
    const funktioniert = db.prepare(`UPDATE benutzer(kalender) WHERE benutzername= ${benutzername} VALUES(?) `).run( JSON.stringify(this.events));
   console.log(funktioniert)
});
