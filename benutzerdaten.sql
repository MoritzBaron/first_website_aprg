/*Datenbank initialisieren mit .read*/

/*Tabelle mit benutzer und passwort*/

CREATE TABLE benutzer(
    email TEXT NOT NULL,
    benutzername TEXT NOT NULL,
    passwort TEXT NOT NULL
);

/* Probe Datensätze*/
INSERT INTO benutzer(email,benutzername,passwort) VALUES ("j@j","JJ","123");