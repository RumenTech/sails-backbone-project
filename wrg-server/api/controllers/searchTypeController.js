/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 11/21/13
 * Time: 3:42 PM
 * To change this template use File | Settings | File Templates.
 */


//TO DO ADD WHAT THIS METHOD DOES!!!!

module.exports = {

    searchData: function (req, res) {

         if(req.body.q.keys !== "") {
            SchoolList.find({
                name: {
                    contains:  req.body.q.keys
                }
            }).limit(13).done(function(err, users) {
                    // Error handling
                    if (err) {
                        return console.log(err);
                        // Found multiple users!
                    } else {
                        //console.log(users);
                        return res.send(users, 200);
                    }
                });

         }
    }
};

