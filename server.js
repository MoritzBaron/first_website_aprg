//Express initialisieren
const express= require("express");
const app = express();
app.use(express.urlencoded({extended:true}))

//Ejs initialisiern
app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");

//freigabe der ordner
app.use(express.static(__dirname +'/views'));
app.use(express.static(__dirname +'/pictures'));
app.use(express.static(__dirname +'/public'));

//initialisierung Datenbank
const DATABASE = "benutzer.db";
const db =  require("better-sqlite3")(DATABASE);

// init express fileupload
const fileUpload = require('express-fileupload');
app.use(fileUpload());
//cookies-parser init
const cookieParser = require("cookie-parser")
app.use(cookieParser());


//server starten
app.listen(3000, function(){
    console.log("http://localhost:3000/startseite");
});


//get Requests
app.get("/startseite",function(req,res){
    res.sendFile(__dirname + "/views/startseite.html"); 
});

app.get("/features",function(req,res){
    res.sendFile(__dirname + "/views/features.html");
});

app.get("/aboutUs",function(req,res){
    res.sendFile(__dirname + "/views/aboutUs.html");
});
/*app.get("/login",function(req,res){
    res.sendFile(__dirname + "/views/loginformular.html")
});*/
app.get("/login",function(req,res){
    res.render("login")
});

//Post Requests
app.post("/login", function(req,res){

});

