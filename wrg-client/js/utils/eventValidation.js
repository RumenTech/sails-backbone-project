define([
    'utils/conversionUtils',
    '../utils/notifier'], function (conversionUtils, notificator) {
    'use strict';

    var eventValidation = {
        validateInput: function (model) {
            var message = '';
            if (model.name === '' || model.name === undefined) {
                message = 'Name cannot be empty';
            } else if (model.date === '' || model.date === undefined) {
                message = 'Date cannot be empty';
            } else if (model.location === '' || model.location === undefined) {
                message = 'Location cannot be empty';
            } else if (model.start === '' || model.start === undefined
                || model.start === 'StartTime') {
                message = 'Please set correct start time';
            } else if (model.end === '' || model.end === undefined
                || model.end === 'StartTime') {
                message = 'Please set correct end time';
            } else {
                message = true;
            }
            return message;
        },

        validateNewEntryTime: function (model) {
            var startTimeInt = conversionUtils.convertTime(model.start),
                endTimeInt = conversionUtils.convertTime(model.end);

            var startMinute = model.start.split(':')[1],
                endMinute = model.end.split(':')[1];

            startMinute = conversionUtils.returnInteger(startMinute.slice(0, 2));
            endMinute = conversionUtils.returnInteger(endMinute.slice(0, 2));

            var message = '';

            if (startTimeInt < 0 || startTimeInt > 24) {
                message = 'Start time is not in valid range';
            } else if (endTimeInt < 0 || endTimeInt > 24) {
                message = 'End time is not in valid range';
            } else if (startTimeInt === endTimeInt) {
                if (startMinute >= endMinute) {
                    message = 'Start time cannot be greater than or equal to end time';
                } else {
                    message = true;
                }
            } else if (startTimeInt > endTimeInt) {
                message = 'Start time cannot be greater than or equal to end time';
            } else {
                message = true;
            }
            return message;
        },

        validatorEngine: function (e) {
            var validationRulesContainer = { //todo Move this to configuration
                urlValidation: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
                passwordValidation: 'something',
                numberValidation: 'something',
                whiteSpaceTrim: '',
                emailValidation: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            };

            var elementSelected = $("#" + e.target.id);
            var elementValue = $("#" + e.target.id).val();

            //urlValidation
            if (elementSelected.hasClass('url')) {
                //todo move this error message to configuration
                var errorMessage = '<div class="validationMessage" rel="url">Please provide a valid url</div>';

                if (elementValue.match(validationRulesContainer.urlValidation) ? true : false) {

                    var enteredUrl = elementSelected.val().split('/');

                    if (enteredUrl.length === 1) {//User entered only www.example.com
                        elementSelected.val('http://' + enteredUrl);
                    }
                    elementSelected.css('background-color', 'green');
                } else {
                    elementSelected.css('background-color', 'red');
                    notificator.validate('Please provide valid URL. Example: www.example.com', "error");
                    elementSelected.val(""); //Delete url if it is wrong
                }
            }

            //emailValidation
            if (elementSelected.hasClass('email')) {
                //todo move this error message to configuration
                var errorMessage = '<div class="validationMessage" rel="email">Please provide a valid E-mail</div>';

                if (elementValue.match(validationRulesContainer.emailValidation) ? true : false) {
                    elementSelected.css('background-color', 'green');
                    elementSelected.removeClass('validationIsBad');
                    elementSelected.removeClass('validationstop');
                } else {
                    elementSelected.addClass('validationIsBad');
                    elementSelected.addClass('validationstop');
                    elementSelected.css('background-color', '');
                    //elementSelected.val("");
                    notificator.validate("Please enter a valid email address. Example: john@example.com", "error");
                }
            }
            //passwordValidation
            if (elementSelected.hasClass('pwd')) {
                //todo move this error message to configuration
                //todo move password length to configuraiton file
                var pass = $("#password").val();
                var repeatPass = $("#repeatPassword").val();

                if (pass === repeatPass) {
                    $("#password").css('background-color', 'green');
                    $("#repeatPassword").css('background-color', 'green');
                    $("#password").removeClass('validationIsBad');
                    $("#repeatPassword").removeClass('validationIsBad');

                    if (pass.length < 7) {
                        notificator.validate("Password is less then eight characters.", "error");
                        $("#password").addClass('validationIsBad');
                    }

                    if (repeatPass.length < 7) {
                        notificator.validate("Password should have over eight characters.", "error");
                        $("#repeatPassword").addClass('validationIsBad');
                    }

                } else {
                    notificator.validate("Both password fields must be identical.", "error");
                    $("#password").addClass('validationIsBad');
                    $("#repeatPassword").addClass('validationIsBad');
                }
            }
            if (elementSelected.hasClass('pwdfastregister')) {
                //todo move this error message to configuration
                //todo move password length to configuraiton file
                var pass = $("#passwordfastregister").val();
                var repeatPass = $("#repeatpasswordfastregister").val();

                if (pass === repeatPass) {
                    $("#passwordfastregister").css('background-color', 'green');
                    $("#repeatpasswordfastregister").css('background-color', 'green');
                    $("#passwordfastregister").removeClass('validationIsBad');
                    $("#repeatpasswordfastregister").removeClass('validationIsBad');
                    $("#passwordfastregister").removeClass('validationstop');
                    $("#repeatpasswordfastregister").removeClass('validationstop');

                    if (pass.length < 7) {
                        notificator.validate("Password is less then eight characters.", "error");
                        $("#passwordfastregister").addClass('validationIsBad');
                        $("#passwordfastregister").addClass('validationstop');
                    }

                    if (repeatPass.length < 7) {
                        notificator.validate("Password should have over eight characters.", "error");
                        $("#repeatpasswordfastregister").addClass('validationIsBad');
                        $("#repeatpasswordfastregister").addClass('validationstop');
                    }

                } else {
                    notificator.validate("Both password fields must be identical.", "error");
                    $("#passwordfastregister").addClass('validationIsBad');
                    $("#repeatpasswordfastregister").addClass('validationIsBad');
                    $("#passwordfastregister").addClass('validationstop');
                    $("#repeatpasswordfastregister").addClass('validationstop');
                }
            }

            if (elementSelected.hasClass('required')) {
                var sizeOfSelectedElement = elementSelected.val().
                    replace(/(^\s*)|(\s*$)/gi, ""). // removes leading and trailing spaces
                    replace(/[ ]{2,}/gi, " "). // replaces multiple spaces with one space
                    replace(/\n +/, "\n"); // Removes spaces after newlines
                elementSelected.val(sizeOfSelectedElement);

                if (sizeOfSelectedElement.length === 0) {
                    notificator.validate("Field is required.", "error");
                    elementSelected.addClass('validationIsBad animated rubberBand');
                    elementSelected.addClass('validationstop');
                } else {
                    elementSelected.removeClass('validationIsBad animated rubberBand');
                    elementSelected.removeClass('validationstop');
                }
            }
        }
    };
    return eventValidation;
});