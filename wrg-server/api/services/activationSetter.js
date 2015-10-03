/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 11/28/13
 * Time: 9:27 AM
 * To change this template use File | Settings | File Templates.
 * This function will create has entry in database after the registration proccess
 * Currently only two parameters are used [HASH and USERID]. It can be easily expanded to utilize more parameters.
 */
var uuid = require('node-uuid');

"use strict";


exports.setActivation = function (user) {

    var hashObject = {
        hash: user.hash,
        user_id: user.id
    };

    try{
        Activation.create(hashObject).done(
            function(err,messages){
                try{
                    if (err){
                        console.log(err);
                    }else{
                         console.log('New Hash entry in database: ', messages);
                        //return res.send(messages,200);
                    }
                }catch (err){
                    console.log("Error during hashing the user: " + err)
                    //return res.send({message:err.message},500);
                }
            }
        );
    }catch(err){
        return res.send({message:err.message},500);
    }
};

