//Kalender
import {Kalender} from "./kalenderMo.js";

$(()=> {
    new Kalender().setup();

})
$.post({
    traditional: true,
    url: "/neuerEintrag",
    contenTyoe:"application/json",
    data: JSON.stringify(events),
    dataType:"json",
    sucess: function(response){console.log(response);}
})



