/**
 * Upload
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {


        name: {
            type: 'string',
            required: true
        },

        name_original: {
            type: 'string',
            required: true
        },

        size: {
            type: 'string',
            required: true
        },

        type: {
            type: 'string',
            required: true
        },

        fullsize:{
            type: 'string',
            required: true
        },

        thumbnail: {
            type: 'string',
            required: true
        },

        fullsize_path:{
            type: 'string',
            required: true
        },

        thumbnail_path: {
            type: 'string',
            required: true
        },

        toJSON: function() {
            var obj = this.toObject();
            delete obj.fullsize_path;
            delete obj.thumbnail_path;
            return obj;
        }


    }


};
