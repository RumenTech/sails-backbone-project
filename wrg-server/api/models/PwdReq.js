/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 12/3/13
 * Time: 11:09 AM
 * To change this template use File | Settings | File Templates.
 */


module.exports = {

    attributes: {
        hash:{
            type: 'string',
            required: true
        },
        user_id:{
            type: 'string',
            required: true
        },
        email:{
            type: 'email',
            required: true,
            unique: true
        }
    }

  /* beforeCreate: function(pwdreq, cb) {
                  pwdreq.createdAt = new Date().getTime();
                  cb(null, pwdreq);

    }*/
};




