/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 12/13/13
 * Time: 9:08 AM
 * To change this template use File | Settings | File Templates.
 * Will return true if file size is correct and if file type is correct
 * Will return Size and Type if they are incorrect
 */

define([
        'jquery',
        '../config'
    ],
    function ($, config) {
        'use strict';

        var imageValidator = {
            //Image validation
            validate: function (file, imageSize) {
                ////GET THESE vars FROM CONFIG

                var allowedFileTypes = ['jpg', 'jpeg', 'png'],
                    fileType = file[0].type.split('/')[1];

                if (file[0].size > imageSize) {
                    return "Size";
                }
                if (allowedFileTypes.indexOf(fileType) > -1 === false) { //Faster then Regex!!!
                    return "Type";
                }
                return true; //type and size check are ok
            },

            //Job Application uploads
            validateJobApplicationFile: function (file, fileSize) {
                var allowedFileTypes = ['pdf'],
                    fileType = file[0].type.split('/')[1];

                if (file[0].size > fileSize) {
                    return "Size";
                }
                if (allowedFileTypes.indexOf(fileType) > -1 === false) { //Faster then Regex!!!
                    return "Type";
                }
                return true; //type and size check are ok
            }
        };
        return imageValidator;
    }
);
