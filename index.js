"use strict";

import inquirer from "inquirer";
import sqlite3 from "sqlite3";

// CLI questions
// Domande per inserimento dati anagrafica studenti

const menu = [
    {
        type: "list",
        name: "menu",
        message: "Scegli un'opzione: ",
        choices: ["Inserisci studente", "Visualizza studenti", "Elimina studente", "Esci"],
    },
];

const questions = [
    {
        type: "input",
        name: "name",
        message: "Inserisci il nome dello studente: ",
        validate(value) {
            const pass = value.match(
                /^[a-zA-Z]{3,30}$/
            );
            if (pass) {
                return true;
            }
            return "Inserisci un nome valido";
        }
    },
    {
        type: "input",
        name: "surname",
        message: "Inserisci il cognome dello studente: ",
        validate(value) {
            const pass = value.match(
                /^[a-zA-Z]{3,30}$/
            );
            if (pass) {
                return true;
            }
            return "Inserisci un cognome valido";
        }
    },
    {
        type: "input",
        name: "age",
        message: "Inserisci l'età dello studente: ",
        validate(value) {
            const pass = value.match(
                /^[0-9]{1,2}$/
            );
            if (pass) {
                return true;
            }
            return "Inserisci un'età valida";
        },
    },
    {
        type: "input",
        name: "email",
        message: "Inserisci l'email dello studente: ",
        validate(value) {
            const pass = value.match(
                /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
            );
            if (pass) {
                return true;
            }
            return "Inserisci un'email valida";
        },
    },
    {
        type: "input",
        name: "phone",
        message: "Inserisci il numero di telefono dello studente: ",
        validate(value) {
            const pass = value.match(
                /^[0-9]{10}$/
            );
            if (pass) {
                return true;
            }
            return "Inserisci un numero di telefono valido";
        },
    },
    {
        type: "input",
        name: "classroom",
        message: "Inserisci la classe dello studente: ",
        validate(value) {
            const pass = value.match(
                /^[1-5][a-zA-Z]{1,3}$/
            );
            if (pass) {
                return true;
            }
            return "Inserisci una classe valida";
        },
    }
];

const questionsD = [
    {
        type: "input",
        name: "id",
        message: "Inserisci il codice id dello studente da eliminare: ",
        validate(value) {
            const pass = value.match(
                /^[0-9]+$/
            );
            if (pass) {
                return true;
            }
            return "Inserisci un codice id valido";
        }
    }
];

// Function to ask questions to insert a student
const askQuestions = () => {
    return inquirer.prompt(questions);
}

// Function to ask questions to delete a student
const askQuestionsD = () => {
    return inquirer.prompt(questionsD);
}


// Create a sqlite3 database named "students.db"
// and create a table named "students" with the following columns:
// name, surname, age, email, phone, classroom
const createDatabase = () => {
    const db = new sqlite3.Database("students.db");
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS students (name TEXT NOT NULL, surname TEXT NOT NULL, age INTEGER NOT NULL, email TEXT NOT NULL, phone INTEGER NOT NULL, classroom TEXT NOT NULL)");
    });
    db.close();
}

// Create a server that continually will prompt the menu
// then execute the corresponding function

const server = () => {
    inquirer.prompt(menu).then((answers) => {
        switch (answers.menu) {
            case "Inserisci studente":
                askQuestions().then((answers) => {
                    const db = new sqlite3.Database("students.db");
                    db.serialize(() => {
                        db.run("INSERT INTO students VALUES (?, ?, ?, ?, ?, ?)", [answers.name, answers.surname, answers.age, answers.email, answers.phone, answers.classroom]);
                    });
                    db.close();
                    server();
                });
                break;
            case "Visualizza studenti":
                const db = new sqlite3.Database("students.db");
                db.serialize(() => {
                    db.all("SELECT ROWID, * FROM students", (err, rows) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(rows);
                        }
                        db.close();
                        server();
                    });
                });
                break;
            case "Elimina studente":
                askQuestionsD().then((answers) => {
                    const db = new sqlite3.Database("students.db");
                    db.serialize(() => {
                        db.run("DELETE FROM students WHERE ROWID = ?", [answers.id]);
                        db.close();
                        server();
                    });
                });
                break;
            case "Esci":
                console.log("Arrivederci!");
                break;
        }
    });
}

createDatabase();
server();