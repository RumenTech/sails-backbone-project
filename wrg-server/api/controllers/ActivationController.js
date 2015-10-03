/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 11/28/13
 * Time: 10:02 AM
 * To change this template use File | Settings | File Templates.
 * ACCEPTED VALID PARAMETER IS: http://XXXXX:1337/activation/activateAccount/241e9e0c-d661-437e-bf6b-e5244e8be1c1
 * This controller will take hash parameter from REQ.
 * Will look in activated table for its existance.
 * If it exists, it will take user is which is located there and simply activate it.
 * After activation, that has will be deleted
 */

var mc = (require('../../config/mainConfig.js')());



"use strict";

module.exports = {
            activateAccount: function (req, res) {

                //http://XXXX:1337/activation/activateAccount/241e9e0c-d661-437e-bf6b-e5244e8be1c1


           //purpose of this if is to combat against following calls:http://localhost:1337/activation/activateAccount
           //if server receives that request, it will fall through and call DB to check
           //since the parameter is undefined there is no need to execute expensive code
           //if it is undefined, route request somewhere else, in this case route it to  WRG home page
                if (typeof(req.param('id')) === "undefined") {
                    res.view('404');
                }

            //TODO  not critical, but could save some server speed
            // the has that is checked always has same format 241e9e0c-d661-437e-bf6b-e5244e8be1c1 [8-4-4-4-12]
            // If there is parameter in the string, split it to array and check the size and spacing of array
            // if it matches  the above format, continue with the execution



                try{    //TODO Try to use only single try!!!
                    Activation.find({hash : req.param('id')}).done(
                        function(err,document){
                            try{
                                if (err || document.length === 0  ){
                                    console.log("Sending account/e-mail does not exist");

                                    var template = '<a href="'+ mc.appSettings.clientLocation + '/">Account does not exist. You will be shortly redirected.</a> <script type="text/javascript"> (function(){setTimeout(function(){window.location.href="'+ mc.appSettings.clientLocation + '";},3000);})(); </script>';
                                    return res.send(template);
                                    //return res.send(err,500);
                                  }else{
                                    if(document.length === 1) {
                                        User.update({id: document[0].user_id},{
                                            activated: true
                                           }, function(err, users) {
                                            // Error handling
                                                    if (err) {
                                                        return console.log(err);
                                                        // User is activated!!!
                                                    } else {
                                                       // console.log("Users updated:", users);
                                                            //Delete hashed table entry
                                                        console.log("About to execute Activation destroy method");
                                                                Activation.destroy(
                                                                    {hash: req.param('id')}).done(function(err) {
                                                                        // Error handling
                                                                        if (err) {
                                                                            return console.log(err);
                                                                        } else {
                                                                            console.log("Activation hash deleted");
                                                                        }
                                                                    });
                                                        var template = '<a href="'+ mc.appSettings.clientLocation + '">Your Account has been activated. You will be shortly redirected.</a> <script type="text/javascript"> (function(){setTimeout(function(){window.location.href="'+ mc.appSettings.clientLocation + '";},3000);})(); </script>';
                                                        return res.send(template);
                                            }
                                        });
                                    }
                                }
                            }catch (err){
                                return res.send({message:err.message},500);
                            }
                        }
                    );
                }catch(err){
                    return res.send({message:err.message},500);
           }
    }
};



