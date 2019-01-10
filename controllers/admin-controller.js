
const Parse = require('parse/node');
const soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

class Admin {
    //gets data for any SOLE sessions that haven't been approved or rejected yet
    static getPendingSoles (sessionToken) {
        return Parse.Cloud.run('webapp.getUnapprovedSoles', {
            limit: 400,
            sessionToken: sessionToken
        }).then(solesJson => {
            return Promise.resolve(solesJson);
        });
    }


    // static getPendingSole (soleId, sessionToken) {
    //     return Parse.Cloud.run('webapp.getSoleByIdApproveReject', {
    //         id: soleId,
    //         sessionToken: sessionToken
    //     }).then(soleJson => {
    //         return Parse.Promise.as(soleJson);
    //     });
    // };

    //approve a sole and records comments, sends email async
    /*
    param:
        soleId - string
        comment - string
        sessionToken - string
     returns
        promise with soleId

     */
    static approveSole (soleId, comment, sessionToken) {
        return Parse.Cloud.run('webapp.approveSole', {
            id: soleId,
            comment: comment,
            sessionToken: sessionToken
        }).catch(error=>{
            console.log('catch error!', error);
        })
    };

    //reject a sole and share feedback
    static rejectSole (soleId, comment, sessionToken) {
        //do a webapp call to reject a sole
        console.log('feedback: ', feedback);
        console.log('soleId: ', soleId);
        return Promise.resolve(soleId);
    };

}

module.exports = Admin;


