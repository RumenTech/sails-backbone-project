/**
 * Created with JetBrains PhpStorm.
 * User: mike
 * Date: 9/19/13
 * Time: 5:13 PM
 * To change this template use File | Settings | File Templates.
 */
module.exports = function (req, res, next) {

    if (req.session.user) {
        var action = req.param('action');
        if (action == "create") {
            //req.body.userId = req.session.user.id;
            //req.body.username = req.session.user.username;
            res.send(req.body.username, 403);

        }
        console.log("Page Enabled");
        next();
    } else {
        console.log("You Must Be Logged In");
        res.send("You Must Be Logged In", 403);
    }
};