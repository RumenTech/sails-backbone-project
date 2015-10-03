/**
 * ProjectController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */

    create: function(req,res){
        Project.create(req.body).done(function(err,project){
            if (err){
                console.log("Error create Project",err);
                res.send(err,500);
            }else{
                res.send(project,200);
            }
        })
    },

    update: function(req,res){
        var id = req.param("id");
        Project.update({id: id},req.body,function(err,project){
            if (err){
                console.log("Error update Project",err);
                res.send(err,500);
            } else{
                res.send(project);
            }
        });
    }
  

};
