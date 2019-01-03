
const Parse = require('parse/node');
const soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

class Admin {
    //gets data for any SOLE sessions that haven't been approved or rejected yet
    static getPendingSoles (session) {
        const exampleSoles = [{
            question: "How does sugar affect the body?",
            fullName: "Ms Crapapple",
            email: "drew+example@startsole.org",
            plannedDate : "12/17/2018 11:41:00",
            reflectionDate : "12/24/2018 14:25:19",
            pdf : "https://api.startsole.net/sole/files/Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp/6df36807297f9574f5cde058f3d47c41_pdf.pdf",
            helpRequested : false,
            client : "web",
            imgCount: 3,
            observations: [
                {
                    img: "https://app.startsole.org/images/test-images/photo23.png",
                    notes: "lorem ipsum 1"
                },
                {
                    img: "https://app.startsole.org/images/test-images/photo2.png",
                    notes: "lorem ipsum 2"
                },
                {
                    img: "https://app.startsole.org/images/test-images/photo31.png",
                    notes: "lorem ipsum 3"
                }
            ],
            iosTime : "19",
            eng : "",
            col: 100,
            tec : 100,
            com: 90,
            reflectionNotes : "Students were able to complete an exit ticket relating to the big question."
        },
            {
                question: "What is a sun?",
                fullName: "Mr Sigh",
                email: "drew+example@startsole.org",
                plannedDate : "12/17/2018 11:41:00",
                reflectionDate : "12/24/2018 14:25:19",
                pdf : "https://api.startsole.net/sole/files/Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp/6df36807297f9574f5cde058f3d47c41_pdf.pdf",
                helpRequested : false,
                client : "web",
                imgCount: 3,
                observations: [
                    {
                        img: "https://app.startsole.org/images/test-images/photo23.png",
                        notes: "lorem ipsum 1"
                    },
                    {
                        img: "https://app.startsole.org/images/test-images/photo2.png",
                        notes: "lorem ipsum 2"
                    },
                    {
                        img: "https://app.startsole.org/images/test-images/photo31.png",
                        notes: "lorem ipsum 3"
                    }
                ],
                iosTime : "19",
                eng : "",
                col: 100,
                tec : 100,
                com: 90,
                reflectionNotes : "Students were able to complete an exit ticket relating to the big question."
            }];
        return Promise.resolve(exampleSoles);
    }


    static getPendingSole (soleId) {
        const exampleSole =  {
            question: "What is a sun?",
            fullName: "Mr Sigh",
            email: "drew+example@startsole.org",
            plannedDate : "12/17/2018 11:41:00",
            reflectionDate : "12/24/2018 14:25:19",
            pdf : "https://api.startsole.net/sole/files/Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp/6df36807297f9574f5cde058f3d47c41_pdf.pdf",
            helpRequested : false,
            client : "web",
            imgCount: 3,
            observations: [
                {
                    img: "https://app.startsole.org/images/test-images/photo23.png",
                    notes: "lorem ipsum 1"
                },
                {
                    img: "https://app.startsole.org/images/test-images/photo2.png",
                    notes: "lorem ipsum 2"
                },
                {
                    img: "https://app.startsole.org/images/test-images/photo31.png",
                    notes: "lorem ipsum 3"
                }
            ],
            iosTime : "19",
            eng : "",
            col: 100,
            tec : 100,
            com: 90,
            reflectionNotes : "Students were able to complete an exit ticket relating to the big question."
        };
        return Promise.resolve(exampleSole);
    };

    //approve a sole and share feedback
    static approveSole (feedback, soleId) {
        return Promise.resolve(true);
    };

    //reject a sole and share feedback
    static rejectSole (feedback, soleId) {
        return true;
    };

}

module.exports = Admin;


