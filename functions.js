function anmeldung(benutzername, passwort){
    const benutzer = db.prepare("SELECT * FROM benutzerdaten").all();
    for (daten of benutzer){
        if(daten.benutzername == benutzername && daten.passwort == passwort ){
            return true;
        }

    }
    return false; 
}