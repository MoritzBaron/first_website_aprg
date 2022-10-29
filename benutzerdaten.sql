/*Datenbank initialisieren mit .read*/

/*Tabelle mit benutzer und passwort*/

CREATE TABLE benutzer(
    benutzername TEXT NOT NULL,
    passwort TEXT NOT NULL
);

/* Probe Datensätze*/
INSERT INTO benutzer(benutzername,passwort) VALUES ("JJ","123");