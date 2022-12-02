import { addDays, getDayIndex, dateString } from "./helperKalMo.js";
import { Event, MODE } from "./event.js";


//Kalender 
export class Kalender {
    constructor() {
        this.weekStart = null;
        this.weekEnd = null;
        this.weekOffSet = 0;
        this.mode = MODE.VIEW;
        this.events = {};
        this.slotHeight = 30;
        this.eventsLoaded = false;
    }
    setup() {
        this.setupTimes();
        this.setupDays();
        this.calculateCurrentWeek();
        this.showWeek();
        this.setupControls();
        this.loadEvents();
    }

    setupTimes() {
        const header = $("<div></div>").addClass("columnHeader");
        const slots = $("<div></div>").addClass("slots");
        for (let hour = 0; hour < 24; hour++) {
            $("<div></div>")
                .attr("data-hour", hour)
                .addClass("time")
                .text(`${hour}:00 - ${hour + 1}:00`)
                .appendTo(slots);
        }
        $(".time").append(header).append(slots);


    }

    setupDays() {
        const cal = this;
        $(".day").each(function () {
            const dayIndex = parseInt($(this).attr("data-dayIndex"));
            const name = $(this).attr("data-name");
            const header = $("<div></div>").addClass("columnHeader").text(name);
            $("<div></div>").addClass("day").appendTo(header);
            const slots = $("<div></div>").addClass("slots");
            for (let hour = 0; hour < 24; hour++) {
                $("<div></div>")
                    .attr("data-hour", hour)
                    .addClass("slot")
                    .appendTo(slots)
                    .click(() => cal.clickSlot(hour, dayIndex))
                    .hover(
                        () => cal.hoverOver(hour),
                        () => cal.hoverOut()
                    );
            }
            $(this).append(header).append(slots)
        });
    }

    clickSlot(hour, dayIndex) {
        if (this.mode != MODE.VIEW) {
            return;
        }
        this.mode = MODE.CREATE;
        const start = hour.toString().padStart(2, "0") + ":00";
        const end = hour < 23 ? (hour + 1).toString().padStart(2, "0") + ":00" : "23:59";
        const date = dateString(addDays(this.weekStart, dayIndex));
        const event = new Event({
            start,
            end,
            date,
            title: "",
            description: "",
            color: "red"
        });
        this.openModal(event);
    }

    openModal(event) {
        $("#modalTitle").text(
            this.mode == MODE.CREATE ? "Create a new Event" : "Upate your Event"
        );
        $("#eventTitle").val(event.title);
        $("#eventDate").val(event.date);
        $("#eventStart").val(event.start);
        $("#eventEnd").val(event.end);
        $("#eventDescription").val(event.description);
        $(".color").removeClass("active");
        $(`.color[data-color=${event.color}`).addClass("active");
        if (this.mode == MODE.UPDATE) {
            $("#submitButton").val("update");
            $("#deleteButton").show().off("click").click(() => {
                event.deleteIn(this);
            });
            $("#copyButton").show().off("click").click(() => {
                event.copyIn(this);
                console.log("copy Event", event)
            });

        } else if (this.mode == MODE.CREATE) {
            $("#submitButton").val("Create");
            $("#deleteButton, #copyButton").hide();
        }
        $("#eventModal").fadeIn(200);
        $("#eventTitle").focus();
        $("#kalender").addClass("opaque");
        $("#eventModal")
            .off("submit")
            .submit((e) => {
                e.preventDefault();
                this.submitModal(event);
            })
    }

    closeModal() {
        $("#eventModal").fadeOut(200);
        $("#errors").text("");
        $("#kalender").removeClass("opaque");
        this.mode = MODE.VIEW;
    }

    submitModal(event) {
        if (event.isValidIn(this)) {
            event.updateIn(this);
            this.closeModal();
            this.saveEvents();
        }
    }

    hoverOver(hour) {
        $(`.time[data-hour=${hour}]`).addClass("currentTime");
    }

    hoverOut() {
        $(".time").removeClass("currentTime");
    }

    calculateCurrentWeek() {
        const now = new Date();
        this.weekStart = addDays(now, -getDayIndex(now));
        this.weekEnd = addDays(this.weekStart, 6);
    }

    showWeek() {
        const options = {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        };
        $("#weekStartDisp").text(
            this.weekStart.toLocaleDateString(undefined, options)
        );
        $("#weekEndDisp").text(
            this.weekEnd.toLocaleDateString(undefined, options)
        );
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = addDays(this.weekStart, dayIndex);
            const display = date.toLocaleDateString(undefined, {
                month: "2-digit",
                day: "2-digit",
            });
            $(`.day[data-dayIndex=${dayIndex}] .day`).text(display);
        }

        if (this.weekOffSet == 0) {
            this.showCurrentDay();
        } else {
            this.hideCurrentDay
        }

    }

    setupControls() {
        $("#nextWeekBtn").click(() => this.changeWeek(1));
        $("#prevWeekBtn").click(() => this.changeWeek(-1));
        $("#cancelButton").click(() => this.closeModal());
        $(".color").click(this.changeColor);
    }

    changeColor() {
        $(".color").removeClass("active");
        $(this).addClass("active");
    }

    changeWeek(number) {
        this.weekOffSet += number;
        this.weekStart = addDays(this.weekStart, 7 * number);
        this.weekEnd = addDays(this.weekEnd, 7 * number);
        this.showWeek();
        this.loadEvents();
    }

    showCurrentDay() {
        const now = new Date();
        const dayIndex = getDayIndex(now);
        $(`.day[data-dayIndex=${dayIndex}]`).addClass("currentDay");
    }

    hideCurrentDay() {
        $(".day").removeClass("currentDay");
    }

    saveEvents() {
        $.post({
            traditional: true,
            url: "/neuerEintrag",
            contenTyoe: "application/json",
            data: JSON.stringify(this.events),
            dataType: "json",
            sucess: function (response) { console.log(response); }
        })
        //localStorage.setItem("events",JSON.stringify(this.events));   
    }

    loadEvents() {
        //test
        $.get("/loadEvents", function (dataKal) {
            $(".event").remove();
            if (!this.eventsLoaded) {
                this.events = JSON.parse(dataKal);
                console.log(dataKal)
                if (this.events) {
                    for (const date of Object.keys(this.events)) {
                        for (const id of Object.keys(this.events[date])) {
                            const event = new Event(this.events[date][id]);
                            this.events[date][id] = event;
                        }
                    }
                }
                this.eventsLoaded = true;
            }
            if (this.events) {
                for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                    const date = dateString(addDays(this.weekStart, dayIndex));
                    if (this.events[date]) {
                        for (const event of Object.values(this.events[date])) {
                            event.showIn(this);
                        }
                    }
                }
            } else {
                this.events = {};
            }
        });
    }
}
