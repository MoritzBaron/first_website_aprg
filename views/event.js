import { dateString, generateId } from "./helperKalMo.js";


export class Event{
    constructor(data){
        this.id = data.id || generateId();
        this.title = data.title;
        this.start = data.start;
        this.end = data.end;
        this.prevDate =  data.date;
        this.date = data.date;
        this.description = data.description;
        this.color = data.color;
    }

    isValidIn(kalender){
        const newStart = $("#eventStart").val();
        const newEnd = $("#eventEnd").val();
        const newDate = $("#eventDate").val();
        if(kalender.events[newDate]){
            const event = Object.values(kalender.events[newDate]).find(event => {
            event.id != this.id && event.end > newStart && event.start < newEnd
        });
            if(event){
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
        this.title = $("#eventTitle").val();
        this.start = $("#eventStart").val();
        this.end = $("#eventEnd").val();
        this.prevDate = this.date;
        this.date = $("#eventDate").val();
        this.description = $("#eventDescription").val();
        this.color = $(".color.active").attr("data-color");
        this.showIn(kalender);
        this.saveIn(kalender);
    }

    showIn(kalender){
        if (this.date < dateString(kalender.weekStart) || this.date > dateString(kalender.weekEnd)) {
            $(`#${this.id}`).remove();
            return;
        }
        let eventSlot;
        if ($(`#${this.id}`).length){
            eventSlot = $(`#${this.id}`);
        }        else {
            eventSlot = $("<div></div>").attr("id", this.id).addClass("event");
        }
        eventSlot.text(this.title);
    }

    saveIn(kalender){
        if(this.prevDate && this.date != this.prevDate){
            delete kalender.events[this.prevDate][this.id];
            if (Object.values(kalender.events[this.prevDate]).length == 0){
                delete kalender.events[this.prevDate]
            }
        }
        if (!kalender.events[this.date]){
            kalender.events[this.date] = {};
        }
        kalender.events[this.date][this.id] = this;
        kalender.saveEvents();
    }
}