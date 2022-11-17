const dayInMillis = 1000*60*60*24;

export function addDays(date, number){
    return new Date(date.getTime() + number*dayInMillis);
}

export function getDayIndex(date){
    const falseIndex = date.getDay();
    return falseIndex == 0 ? 6 : falseIndex - 1;
}

export function dateString(date){
    return `${date.getFullYear()}-${(date.getMonth()+1)
    .toString()
    .padStart(2,"0")}-${date.getDate().toString().padStart(2,"0")}`;
}

export function generateId(length = 20){
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let id = "";
    for (let i = 0; i < length; i++){
        const randomIndex = Math.floor(Math.random()* chars.length);
        id += chars.charAt(randomIndex);
    }
    return id;
}