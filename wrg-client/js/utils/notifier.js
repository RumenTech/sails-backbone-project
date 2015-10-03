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
        'jquery'
    ],
    function ($) {
        'use strict';

        var notifier = {
            validate: function (message, action, className) {
                if (className === null || className === undefined || className === '') {
                    className = '.validation-messages';
                }

                $(className).click(function () {
                    $(this).css("display", "none");
                });

                switch (action) {
                    case "error":
                        $(className).fadeIn(2000);
                        $(className).addClass("alert-box radius");
                        $(className).html(message);
                        $(className).css('background', '#e50000');

                        setTimeout(function () {
                            $(className).fadeOut(2000);
                        }, 3000);

                        break;
                    case "success":
                        $(className).css("display", "block");
                        $(className).html(message);
                        $(className).css('background', '#8ec252');
                        $(className).css('border-radius', '10px');
                        $(className).css('height', '25px');
                        $(className).css('color', 'white');
                        $(className).css('font-weight', 'bold');

                        setTimeout(function () {
                            $(className).css("display", "none");
                        }, 2000);

                        break;
                    case "info":
                        $(className).css("display", "block");
                        $(className).html(message);
                        $(className).css('background', '#59CBF5');

                        /* setTimeout(function () {
                         $(className).fadeOut(2000);
                         }, 3000);*/

                        break;
                    default:
                }
            }
        };
        return notifier;
    }
);
