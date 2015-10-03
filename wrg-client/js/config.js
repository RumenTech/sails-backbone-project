define([], function () {
    return {
        loc: {
            restUrl: 'http://127.0.0.1:8080',
            autoLoginRegistration: true, //Autologin user after success in registration (Student and Alumni only)
            clientLocation: 'http://127.0.0.1',
            uploadImageUrl: 'http://127.0.0.1:8080/imgUpload/image/', //  it works
            holdItPlaceHolders: '//placehold.it/180x180',
            imageSize: 3000000,
            spinnerTimeout: 100, //in Miliseconds
            //AutoComplete Settings
            minCharsAComplete: 0, //Autocomplete will be activated after 3 characters. Higher number gives better performance
            minCharTimeout: 50, //Request is being sent to server every 2 seconds. Increase number for better performance,
            aCompleteEndPoint: /*'https://127.0.0.1:8080/searchType/searchData',*/ "https://127.0.0.1:8080/elasticsearch/searchindex",
            consoleEnabled: false,  //will create problems if current browser is IE < 10
            searchEngineURL: 'https://www.googleapis.com/customsearch/v1?',
            searchEngineId: '011929739871171234312:gb2o2tppoma',
            googleApiKey: 'AIzaSyBaKbf_uQDKKDfulQzoQDvqdKRI7oZjSmk',

            errorMessages: {
                imageSizeBig: 'File size is too big.',
                imageBadType: 'File type is not allowed.'
            },
            endPoints: {
                // Groups
                userPendingResolution: 'https://127.0.0.1:8080/groupuser/getspecificgroupdata',
                userPendingGroups: 'https://127.0.0.1:8080/group/getmypendinggroups',
                usersGroups: 'https://127.0.0.1:8080/group/getmygroups',
                isUserInGroup: 'https://127.0.0.1:8080/groupuser/isuseringroup',
                getComments: 'https://127.0.0.1:8080/groupcomment/getComments',
                postComment: 'https://127.0.0.1:8080/groupcomment',
                editComment: 'https://127.0.0.1:8080/groupcomment/update',
                // Reporting
                getAlumniIndustryData: 'https://127.0.0.1:8080/reporting/getAlumnusIndustry',
                getAlumniEducationData: 'https://127.0.0.1:8080/reporting/getAlumnusEducation',
                getAlumniSkillsData: 'https://127.0.0.1:8080/reporting/getAlumnusSkills',
                getAlumniEmploymentData: 'https://127.0.0.1:8080/reporting/getAlumnusEmployment',
                uploadPrepImage: 'https://127.0.0.1:8080/imgUpload/savePreparationImage',
                cropImage: 'https://127.0.0.1:8080/imgUpload/cropme',
                localStorage: 'https://127.0.0.1:8080/uploads/fullsize/',
                deleteUser: 'https://127.0.0.1:8080/delete/deleteuser/',
                //Point of light
                pointOfLight: 'https://127.0.0.1:8080/pointoflight/searchPositions'
            },
            media: {
                maxNumberOfVideoFiles: 10,
                maxNumberOfPhotoFiles: 10,
                googleImageSize: 200,    //Size in pixels of the image retreived from the gmail social network
                facebookImageSize: "large", //Possible values are small, normal, large, square
                idealCandidatePointsSlider: 25   //Ideal Candidate Slider maximum value (Employer profile)
            },
            admin: {
                username: 'administrator'
            },
            socialOptions: {
                  fb: {
                      inviteFriendRoute: 'http://www.workreadygrad.com', //send this route to friends on facebook
                      inviteFriendsMessage: 'Join WorkReadyGrad and help students become successful.'
                  },
                  ln: {},
                  gp: {}
            },
            externalLogins: {
                morehouse: {
                    link: 'http://127.0.0.1:8080/auth/saml'
                },
                atlantacollege: {
                    link: 'http://www.google.com'
                }
            }
        },
        dev: {
            restUrl: 'http://54.186.206.29:8080',
            autoLoginRegistration: true, //Autologin user after success in registration (Student and Alumni only)
            clientLocation: 'http://dev-www.workreadygrad.com/',
            uploadImageUrl: 'http://54.186.206.29:8080/imgUpload/image/', //  it works
            holdItPlaceHolders: '//placehold.it/180x180',
            imageSize: 3000000,
            spinnerTimeout: 100, //in Miliseconds
            //AutoComplete Settings
            minCharsAComplete: 0, //Autocomplete will be activated after 3 characters. Higher number gives better performance
            minCharTimeout: 50, //Request is being sent to server every 2 seconds. Increase number for better performance,
            aCompleteEndPoint: /*'http://54.186.206.29:8080/searchType/searchData',*/ "http://54.186.206.29:8080/elasticsearch/searchindex",
            consoleEnabled: false,  //will create problems if current browser is IE < 10
            searchEngineURL: 'https://www.googleapis.com/customsearch/v1?',
            searchEngineId: '011929739871171234312:gb2o2tppoma',
            googleApiKey: 'AIzaSyBaKbf_uQDKKDfulQzoQDvqdKRI7oZjSmk',

            errorMessages: {
                imageSizeBig: 'File size is too big.',
                imageBadType: 'File type is not allowed.'
            },
            endPoints: {
                // Groups
                userPendingResolution: 'http://54.186.206.29:8080/groupuser/getspecificgroupdata',
                userPendingGroups: 'http://54.186.206.29:8080/group/getmypendinggroups',
                usersGroups: 'http://54.186.206.29:8080/group/getmygroups',
                isUserInGroup: 'http://54.186.206.29:8080/groupuser/isuseringroup',
                getComments: 'http://54.186.206.29:8080/groupcomment/getComments',
                postComment: 'http://54.186.206.29:8080/groupcomment',
                editComment: 'http://54.186.206.29:8080/groupcomment/update',
                // Reporting
                getAlumniIndustryData: 'http://54.186.206.29:8080/reporting/getAlumnusIndustry',
                getAlumniEducationData: 'http://54.186.206.29:8080/reporting/getAlumnusEducation',
                getAlumniSkillsData: 'http://54.186.206.29:8080/reporting/getAlumnusSkills',
                getAlumniEmploymentData: 'http://54.186.206.29:8080/reporting/getAlumnusEmployment',
                uploadPrepImage: 'http://54.186.206.29:8080/imgUpload/savePreparationImage',
                cropImage: 'http://54.186.206.29:8080/imgUpload/cropme',
                localStorage: 'http://54.186.206.29:8080/uploads/fullsize/',
                deleteUser: 'http://54.186.206.29:8080/delete/deleteuser/',
                //Point of light
                pointOfLight: 'http://54.186.206.29:8080/pointoflight/searchPositions'
            },
            media: {
                maxNumberOfVideoFiles: 10,
                maxNumberOfPhotoFiles: 10,
                googleImageSize: 200,    //Size in pixels of the image retreived from the gmail social network
                facebookImageSize: "large", //Possible values are small, normal, large, square
                idealCandidatePointsSlider: 25   //Ideal Candidate Slider maximum value (Employer profile)
            },
            admin: {
                username: 'administrator'
            },
            socialOptions: {
                  fb: {
                      inviteFriendRoute: 'http://www.workreadygrad.com', //send this route to friends on facebook
                      inviteFriendsMessage: 'Join WorkReadyGrad and help students become successful.'
                  },
                  ln: {},
                  gp: {}
            },
            externalLogins: {
                morehouse: {
                    link: 'http://54.186.206.29:8080/auth/saml'
                },
                atlantacollege: {
                    link: 'http://www.google.com'
                }
            }
        },
        qa: {
            restUrl: 'http://54.201.67.125:8080',
            autoLoginRegistration: true, //Autologin user after success in registration (Student and Alumni only)
            clientLocation: 'http://54.201.67.125',
            uploadImageUrl: 'http://54.201.67.125:8080/imgUpload/image/', //  it works
            holdItPlaceHolders: '//placehold.it/180x180',
            imageSize: 3000000,
            spinnerTimeout: 100, //in Miliseconds
            //AutoComplete Settings
            minCharsAComplete: 0, //Autocomplete will be activated after 3 characters. Higher number gives better performance
            minCharTimeout: 50, //Request is being sent to server every 2 seconds. Increase number for better performance,
            aCompleteEndPoint: /*'https://54.201.67.125:8080/searchType/searchData',*/ "https://54.201.67.125:8080/elasticsearch/searchindex",
            consoleEnabled: false,  //will create problems if current browser is IE < 10
            searchEngineURL: 'http://www.googleapis.com/customsearch/v1?',
            searchEngineId: '011929739871171234312:gb2o2tppoma',
            googleApiKey: 'AIzaSyBaKbf_uQDKKDfulQzoQDvqdKRI7oZjSmk',

            errorMessages: {
                imageSizeBig: 'File size is too big.',
                imageBadType: 'File type is not allowed.'
            },
            endPoints: {
                // Groups
                userPendingResolution: 'http://54.201.67.125:8080/groupuser/getspecificgroupdata',
                userPendingGroups: 'http://54.201.67.125:8080/group/getmypendinggroups',
                usersGroups: 'http://54.201.67.125:8080/group/getmygroups',
                isUserInGroup: 'http://54.201.67.125:8080/groupuser/isuseringroup',
                getComments: 'http://54.201.67.125:8080/groupcomment/getComments',
                postComment: 'http://54.201.67.125:8080/groupcomment',
                editComment: 'http://54.201.67.125:8080/groupcomment/update',
                // Reporting
                getAlumniIndustryData: 'http://54.201.67.125:8080/reporting/getAlumnusIndustry',
                getAlumniEducationData: 'http://54.201.67.125:8080/reporting/getAlumnusEducation',
                getAlumniSkillsData: 'http://54.201.67.125:8080/reporting/getAlumnusSkills',
                getAlumniEmploymentData: 'http://54.201.67.125:8080/reporting/getAlumnusEmployment',
                uploadPrepImage: 'http://54.201.67.125:8080/imgUpload/savePreparationImage',
                cropImage: 'http://54.201.67.125:8080/imgUpload/cropme',
                localStorage: 'http://54.201.67.125:8080/uploads/fullsize/',
                deleteUser: 'http://54.201.67.125:8080/delete/deleteuser/',
                //Point of light
                pointOfLight: 'http://54.201.67.125:8080/pointoflight/searchPositions'
            },
            media: {
                maxNumberOfVideoFiles: 10,
                maxNumberOfPhotoFiles: 10,
                googleImageSize: 200,    //Size in pixels of the image retreived from the gmail social network
                facebookImageSize: 'large', //Possible values are small, normal, large, square
                idealCandidatePointsSlider: 25   //Ideal Candidate Slider maximum value (Employer profile)
            },
            admin: {
                username: 'administrator'
            },
            socialOptions: {
                fb: {
                    inviteFriendRoute: 'http://www.workreadygrad.com', //send this route to friends on facebook
                    inviteFriendsMessage: 'Join WorkReadyGrad and help students become successful'
                },
                ln: {},
                gp: {}
            },
            externalLogins: {
                morehouse: {
                    link: 'https://54.201.67.125:8080/auth/saml'
                },
                atlantacollege: {
                    link: 'http://www.google.com'
                }
            }
        },
        prod: {
            restUrl: 'https://www.workreadygrad.com:8080',
            autoLoginRegistration: true, //Autologin user after success in registration (Student and Alumni only)
            clientLocation: 'https://www.workreadygrad.com',
            uploadImageUrl: 'https://www.workreadygrad.com:8080/imgUpload/image/', //  it works
            holdItPlaceHolders: '//placehold.it/180x180',
            imageSize: 3000000,
            spinnerTimeout: 100, //in Miliseconds
            //AutoComplete Settings
            minCharsAComplete: 0, //Autocomplete will be activated after 3 characters. Higher number gives better performance
            minCharTimeout: 50, //Request is being sent to server every 2 seconds. Increase number for better performance,
            aCompleteEndPoint: /*'https://www.workreadygrad.com:8080/searchType/searchData',*/ "https://www.workreadygrad.com:8080/elasticsearch/searchindex",
            consoleEnabled: false,  //will create problems if current browser is IE < 10
            searchEngineURL: 'https://www.googleapis.com/customsearch/v1?',
            searchEngineId: '011929739871171234312:gb2o2tppoma',
            googleApiKey: 'AIzaSyBaKbf_uQDKKDfulQzoQDvqdKRI7oZjSmk',

            errorMessages: {
                imageSizeBig: 'File size is too big.',
                imageBadType: 'File type is not allowed.'
            },
            endPoints: {
                //Groups
                userPendingResolution: 'https://www.workreadygrad.com:8080/groupuser/getspecificgroupdata',
                userPendingGroups: 'https://www.workreadygrad.com:8080/group/getmypendinggroups',
                usersGroups: 'https://www.workreadygrad.com:8080/group/getmygroups',
                isUserInGroup: 'https://www.workreadygrad.com:8080/groupuser/isuseringroup',
                getComments: 'https://www.workreadygrad.com:8080/groupcomment/getComments',
                postComment: 'https://www.workreadygrad.com:8080/groupcomment',
                editComment: 'https://www.workreadygrad.com:8080/groupcomment/update',
                // Reporting
                getAlumniIndustryData: 'https://www.workreadygrad.com:8080/reporting/getAlumnusIndustry',
                getAlumniEducationData: 'https://www.workreadygrad.com:8080/reporting/getAlumnusEducation',
                getAlumniSkillsData: 'https://www.workreadygrad.com:8080/reporting/getAlumnusSkills',
                getAlumniEmploymentData: 'https://www.workreadygrad.com:8080/reporting/getAlumnusEmployment',
                uploadPrepImage: 'https://www.workreadygrad.com:8080/imgUpload/savePreparationImage',
                cropImage: 'https://www.workreadygrad.com:8080/imgUpload/cropme',
                localStorage: 'https://www.workreadygrad.com:8080/uploads/fullsize/',
                deleteUser: 'https://www.workreadygrad.com:8080/delete/deleteuser/',
                //Point of light
                pointOfLight: 'https://www.workreadygrad.com:8080/pointoflight/searchPositions'
            },
            media: {
                maxNumberOfVideoFiles: 10,
                maxNumberOfPhotoFiles: 10,
                googleImageSize: 200,    //Size in pixels of the image retreived from the gmail social network
                facebookImageSize: 'large', //Possible values are small, normal, large, square
                idealCandidatePointsSlider: 25   //Ideal Candidate Slider maximum value (Employer profile)
            },
            admin: {
                username: 'administrator'
            },
            socialOptions: {
                fb: {
                    inviteFriendRoute: 'https://www.workreadygrad.com', //send this route to friends on facebook
                    inviteFriendsMessage: 'Join WorkReadyGrad and help students become successful'
                },
                ln: {},
                gp: {}
            },
            externalLogins: {
                morehouse: {
                    link: 'https://www.workreadygrad.com:8080/auth/saml'
                },
                atlantacollege: {
                    link: 'http://www.google.com'
                }
            }
        },
        stg: {
            restUrl: 'https://localhost:8080',
            autoLoginRegistration: true, //Autologin user after success in registration (Student and Alumni only)
            clientLocation: 'https://localhost',
            uploadImageUrl: 'https://localhost:8080/imgUpload/image/', //  it works
            holdItPlaceHolders: '//placehold.it/180x180',
            imageSize: 3000000,
            spinnerTimeout: 100, //in Miliseconds
            //AutoComplete Settings
            minCharsAComplete: 0, //Autocomplete will be activated after 3 characters. Higher number gives better performance
            minCharTimeout: 50, //Request is being sent to server every 2 seconds. Increase number for better performance,
            aCompleteEndPoint: /*'https://localhost:8080/searchType/searchData',//*/"https://localhost:8080/elasticsearch/searchindex",
            consoleEnabled: false,  //will create problems if current browser is IE < 10
            searchEngineURL: 'https://www.googleapis.com/customsearch/v1?',
            searchEngineId: '011929739871171234312:gb2o2tppoma',
            googleApiKey: 'AIzaSyBaKbf_uQDKKDfulQzoQDvqdKRI7oZjSmk',

            errorMessages: {
                imageSizeBig: 'File size is too big. Comes form Client',
                imageBadType: 'File type is not allowed. Comes from Client'
            },
            endPoints: {
                // Groups
                userPendingResolution: 'https://localhost:8080/groupuser/getspecificgroupdata',
                userPendingGroups: 'https://localhost:8080/group/getmypendinggroups',
                usersGroups: 'https://localhost:8080/group/getmygroups',
                isUserInGroup: 'https://localhost:8080/groupuser/isuseringroup',
                getComments: 'https://localhost:8080/groupcomment/getComments',
                postComment: 'https://localhost:8080/groupcomment',
                editComment: 'https://localhost:8080/groupcomment/update',

                // Reporting
                getAlumniIndustryData: 'https://localhost:8080/reporting/getAlumnusIndustry',
                getAlumniEducationData: 'https://localhost:8080/reporting/getAlumnusEducation',
                getAlumniSkillsData: 'https://localhost:8080/reporting/getAlumnusSkills',
                getAlumniEmploymentData: 'https://localhost:8080/reporting/getAlumnusEmployment',
                uploadPrepImage: 'https://localhost:8080/imgUpload/savePreparationImage',
                cropImage: 'https://localhost:8080/imgUpload/cropme',
                localStorage: 'https://localhost:8080/uploads/fullsize/',
                deleteUser: 'https://localhost:8080/delete/deleteuser/',
                //Point of light
                pointOfLight: 'https://localhost:8080/pointoflight/searchPositions'

            },
            media: {
                maxNumberOfVideoFiles: 10,
                maxNumberOfPhotoFiles: 10,
                googleImageSize: 200,    //Size in pixels of the image retreived from the gmail social network
                facebookImageSize: 'large', //Possible values are small, normal, large, square.
                idealCandidatePointsSlider: 50   //Ideal Candidate Slider maximum value (Employer profile)
            },
            admin: {
                username: 'administrator'
            },
            socialOptions: {
                fb: {
                    inviteFriendRoute: 'http://www.workreadygrad.com', //send this route to friends on facebook
                    inviteFriendsMessage: 'Join WorkReadyGrad and help students become successful.'
                },
                ln: {},
                gp: {}
            },
            externalLogins: {
                  morehouse: {
                      link: 'https://localhost:8080/auth/saml'
                  },
                  atlantacollege: {
                      link: 'http://www.google.com'
                  }
            }
        }
    };
});