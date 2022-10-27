const express= require("express");
const app = express();
app.use(express.urlencoded({extended:true}))

app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");
//
app.use(express.static('public'));
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

app.get("/startseite",function(req,res){
    res.sendFile(__dirname + "/views/startseite.html")
        
});

app.get("/views/features.html",function(req,res){
    res.sendFile(__dirname + "/views/features.html")
        
});