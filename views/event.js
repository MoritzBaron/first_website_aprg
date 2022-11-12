import { generateId } from "./helperKalMo.js";


export class Event{
    constructor(data){
        this.id = data.id || generateId();
        this.title = data.title;
        this.start = data.start;
        this.end = data.end;
        this.date = data.date;
        this.description = data.description;
        this.color = data.color;
    }

    isValidIn(kalender){
        const newStart = $("#eventStart").val();
        const newEnd = $("#eventEnd").val();
        const newDate = $("#eventDate").val();
        for(const event of kalender.events){
            if(event.id != this.id && event.end > newStart && event.start < newEnd){
                $("#errors").text(`This collides with the event ${event.title} (${event.start} - ${event.end}).`);
                return false;
            }
        }
        const duration = 
            (new Date(`${newDate}T${newEnd}`).getTime() - 
            new Date(`${newDate}T${newStart}`).getTime())/
            (1000*60);
        if (duration < 0){
                $("#errors").text("The start cannot be after the end");
                return false;
        }
        else if (duration < 30){
                $("#errors").text("Events cannot be under 30 minutes.");
                return false;
        }
        return true;
    }

    updateIn(kalender){
        this.title = $("eventTitle").val();
        this.start = $("eventStart").val();
        this.end = $("eventEnd").val();
        this.date = $("eventDate").val();
        this.description = $("eventDescription").val();
        this.color = $("eventColor").val();
        this.showIn(kalender);
        this.saveIn(kalender);
    }

    showIn(){
        //todo
        console.log("show event", this);
    }

    saveIn(kalender){
        //todo
        kalender.events.push(this);
    }
}