import { dateString, generateId, getDayIndex } from "./helperKalMo.js";

export const MODE = {
        VIEW: 1,
        UPDATE: 2,
        CREATE: 3
};

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

    get dayIndex(){
        return getDayIndex(new Date(this.date));
    }

    get startHour(){
        return parseInt(this.start.substring(0,2));

    }

    get endHour(){
        return parseInt(this.end.substring(0,2));

    }

    get startMinutes(){
        return parseInt(this.start.substring(3,5));

    }

    get endMinutes(){
        return parseInt(this.end.substring(3,5));

    }

    isValidIn(kalender){
        const newStart = $("#eventStart").val();
        const newEnd = $("#eventEnd").val();
        const newDate = $("#eventDate").val();
        if(kalender.events[newDate]){
            const event = Object.values(kalender.events[newDate]).find(event => 
            event.id != this.id && event.end > newStart && event.start < newEnd
        );
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
        const h = kalender.slotHeight;
        if ($(`#${this.id}`).length){
            eventSlot = $(`#${this.id}`);
        }        else {
            eventSlot = $("<div></div>")
            .attr("id", this.id)
            .addClass("event")
            .click(()=> this.clickIn(kalender));
            
        }
        eventSlot
        .text(this.title)
        .css("backgroundColor", `var(--color-${this.color})`)
        .css("top", (this.startHour + this.startMinutes/60) * h + 2 + "px")
        .css("bottom", 24 * h - (this.endHour + this.endMinutes/60) * h + 1 + "px")
        .appendTo(`.day[data-dayIndex=${this.dayIndex}] .slots`);
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
        kalender.saveEvents(kalender.events);              
    }

    clickIn(kalender){
        if (kalender.mode == MODE.VIEW) {
            kalender.mode = MODE.UPDATE;
            kalender.openModal(this);
        }
    }

    deleteIn(kalender){
        kalender.closeModal();
        $(`#${this.id}`).remove();
        delete kalender.events[this.date][this.id];
        if (Object.values(kalender.events[this.date]).length == 0){
            delete kalender.events[this.date];
        }
        kalender.saveEvents();
    }

    copyIn(kalender){
        if(kalender.mode != MODE.UPDATE) return;
        kalender.closeModal();
        kalender.mode = MODE.CREATE;
        const copy = new Event({
            title: "Copy of " + this.title,
            start: this.start,
            end: this.end,
            date: this.date,
            description: this.description,
            color: this.color
        });
        kalender.openModal(copy);
    }
}
