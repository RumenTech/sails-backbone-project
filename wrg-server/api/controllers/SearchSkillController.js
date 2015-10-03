/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 11/21/13
 * Time: 3:42 PM
 * To change this template use File | Settings | File Templates.
 */


//TO DO ADD WHAT THIS METHOD DOES!!!!

module.exports = {

    searchSkillData: function (req, res) {

        var searchSkill = req.param('term');

        if (searchSkill !== "") {
            SchoolList.find({
                name: {
                    contains: searchSkill
                }
            }).limit(13).done(function (err, users) {
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

