'use strict';

angular.module('myApp')
    .constant('Constants', {
        'GLOGIN': {
            'CLIENT_ID': '785259876868-92a13mgl9gpe2i0knu2budtum9ov6edi.apps.googleusercontent.com',
            'CLIENT_SECRET': 'x_GleC5WyJIb5-GUmIY0Csua',
            'SCOPE_GOOGLE': 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
        },
        'GCAPTCHA': {
            'SITE_KEY': '6Lfxp7sZAAAAAGMLFY8CpWZ_pl1sqBH8jxaYfv2h',
            'SECRET_KEY': '6Lfxp7sZAAAAADa5_Io1L6yFW9OOvYkPmRBab52M'
        }
    })
;