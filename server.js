const express= require("express");
const app = express();
app.use(express.urlencoded({extended:true}))

app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");

const DATABASE ="login.db";
const db =require("better-sqlite3")(DATABASE);

//server starten
app.listen(4242, function(){
    console.log("http://localhost:4242/anmeldedaten");
});

app.get("/startseite",function(req,res){
        res.sendFile(__dirname + "/views/startseite.html")
});