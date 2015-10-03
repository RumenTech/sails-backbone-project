/**
 * TestController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {


  sayHello: function (req, res) {
    res.send({message: ''},200);
  },


    login: function (req, res){
        res.view();
    },

    session: function(req,res){
        res.send(req.session.user);

    },

    new_student: function(req,res){
        res.view();
    },

    new_alumni: function(req,res){
        res.view();
    },

    my_alumni: function(req,res){
        res.view();
    },

    my_student: function(req,res){
        res.view();
    }
};
