/*------ Global ------*/
function preloadLogo() {
	heavyImage = new Image(); 
	heavyImage.src = "/angular/img/intherapii.png";
}
// preload logo
preloadLogo();

// format token for API calls
function make_base_auth(user, password) {
  var tok = user + ':' + password;
  var hash = btoa(tok);
  return "Basic " + hash;
}

// Return location url param value by passing 'name'
function getParam( name )
{
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
        return "";
    else
        return results[1];
}

// Matching passwords keyup false
$.validator.setDefaults({ onkeyup: false });

// Error/success message handling
function displayMessage(parent, type, hidePrev, message) {
	var msg = '';
	switch(type) {
		case 'error':
			msg = '<div class="alert alert-error errorMsg"><button class="close" data-dismiss="alert">&times;</button>There was a problem with your request, please try again later.</div>';
			break;
		case 'errorCustom':
			msg = '<div class="alert alert-error errorMsg"><button class="close" data-dismiss="alert">&times;</button>' + message + '</div>';
			break;
		case 'passwordReset':
			msg = '<div class="alert alert-success errorMsg"><button class="close" data-dismiss="alert">&times;</button>An email has been sent with instructions to reset your password.</div>';
			break;
		case 'nouuid':
			msg = '<div class="alert alert-error errorMsg"><button class="close" data-dismiss="alert">&times;</button>Your user id is not found, please follow the link sent in the password recovery email and try again.</div>';
			break;
		case 'resetSuccess':
			msg = '<div class="alert alert-success errorMsg"><button class="close" data-dismiss="alert">&times;</button>Your password has been reset successfully, you may now login with your new password.</div>';
			break;
		case 'regSuccess':
			msg = '<div class="alert alert-success errorMsg"><button class="close" data-dismiss="alert">&times;</button>Your account has been created successfully, to activate your account follow the link in the activation email.</div>';
			break;
		case 'reactivateSuccess':
			msg = '<div class="alert alert-success errorMsg"><button class="close" data-dismiss="alert">&times;</button>Your activation token has been reset, please click the link in the email.</div>';
			break;
	}
	if(hidePrev) {
		$('.errorMsg').remove();
	}
	$(parent).prepend(msg);
}

// Cookie
function setCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    } else {
			window.location.href = "/angular/#/login"; // no cookie
			return false;
		}
}
function deleteCookie ( c_name, domain )
{
    var domain_string = domain ?
        ("; domain=" + domain) : '' ;
    document.cookie = c_name +
        "=; max-age=0; path=/" + domain_string ;
}

function toggleNavFooter(footerClass, showTopbar, showNav) {
	if(footerClass) {
		$('footer').addClass('ml230');
	} else {
		$('footer').removeClass('ml230');
	}
	if(showTopbar) {
		$('#topBar').show();
	} else {
		$('#topBar').hide();
	}
	if(showNav) {
		$('#navBar').show();
	} else {
		$('#navBar').hide();
	}
}

// HTML5 Local Storage
if(window.Storage && window.JSON) {
  window.$storage = function(key) {
    return {
      set: function(value) {
        return localStorage.setItem(key, JSON.stringify(value));
      },

      get: function() {
        var item = localStorage.getItem(key);
        if (item) {
          return JSON.parse(item);
        }
      }
    };
  };
}

// Set default local storage for success messages
function resetSuccess() {
	var successObj = {
		'login': false
	}
	$storage('success').set(successObj);
}
resetSuccess();

/*------ Login ------*/
// Validate matching passwords on signup
jQuery.validator.addMethod("matchers", function(value, element) {
return $('#signupPassword').val() == $('#signupPasswordConfirm').val();
}, "Please enter matching passwords.");

// Validate password strength
jQuery.validator.addMethod("pwStrength", function(value, element) {
	var _pwAll = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/])/;
return _pwAll.test(value);
}, "Please check your password strength.");

// Bind validation and click events
function bindLoginValidation() {
	toggleNavFooter(true, false, false);
	// Login Form Validation
	$('#form-signin').validate({
		onkeyup: false,
		errorClass: 'error',
		errorElement: 'div',
		onfocusout: false,
		errorPlacement: function(error, element) {
			error.insertBefore(element);
		},
		rules: {
			loginUsername: {
				required: true,
				email: true
			},
			loginPassword: {
				required: true
			}
		},
		messages: {
			loginUsername: {
				required: 'Please enter a username.',
				required: 'Please enter a valid email address.'
			},
			loginPassword: {
				required: 'Please enter a password.'
			}
		}
	});
	// Register Form Validation
	$('#form-register').validate({
		onkeyup: false,
		errorClass: 'error',
		errorElement: 'div',
		onfocusout: false,
		errorPlacement: function(error, element) {
			error.insertBefore(element);
		},
		rules: {
			loginFirst: {
				required: true,
				minlength: 2
			},
			loginLast: {
				required: true,
				minlength: 2
			},
			loginEmail: {
				required: true,
				email: true
			},
			signupPassword: {
				required: true,
				matchers: true,
				pwStrength: true,
				minlength: 6
			},
			signupPasswordConfirm: {
				required: true,
				minlength:6
			},
			tcCheck: {
				required: true
			}
		},
		messages: {
			loginFirst: {
				required: 'Please enter a First Name.'
			},
			loginLast: {
				required: 'Please enter a Last Name.'
			},
			loginEmail: {
				required: 'Please enter an email address.',
				email: 'Please enter a valid email address.'
			},
			signupPassword: {
				required: 'Please enter a password.'
			},
			signupPasswordConfirm: {
				required: 'Please verify your password.'
			},
			tcCheck: {
				required: 'Please accept the Terms & Conditions'
			}
		}
	});
	// Forgot Password Validation
	$('#forgotPasswordForm').validate({
		onkeyup: false,
		errorClass: 'error',
		errorElement: 'div',
		onfocusout: false,
		errorPlacement: function(error, element) {
			error.insertBefore(element);
		},
		rules: {
			forgotPasswordEmail: {
				required: true,
				email: true
			}
		},
		messages: {
			forgotPasswordEmail: {
				required: 'Please enter a user name.',
				email: 'Please enter a valid email address'
			}
		}
	});
	
	// display redirect success message, if any
	var success = $storage('success').get();
	var loginSuccess = success.login;
	if(loginSuccess) {
		success.login = false;
		// Reset local storage
		$storage('success').set(success);
		displayMessage($('div.form-signin'), 'resetSuccess', false);
	}

}

/* ------ Reset Password ------*/
function bindResetValidation() {
	toggleNavFooter(true, false, false);
	// Validate matching reset passwords
	jQuery.validator.addMethod("matchersReset", function(value, element) {
	return $('#resetPassword').val() == $('#resetPassword2').val();
	}, "Please enter matching passwords.");

	// Reset form validation
	$('#form-reset').validate({
		onkeyup: false,
		errorClass: 'error',
		errorElement: 'div',
		onfocusout: false,
		errorPlacement: function(error, element) {
			error.insertBefore(element);
		},
		rules: {
			resetPassword: {
				required: true,
				matchersReset: true
			},
			resetPassword2: {
				required: true,
				matchersReset: true
			}
		},
		messages: {
			resetPassword: {
				required: 'Please enter a password.',
				matchersReset: 'Please enter matching passwords.'
			},
			resetPassword2: {
				required: 'Please confirm your password.',
				matchersReset: 'Please enter matching passwords.'
			}
		}
	});
}


/*------ Dashboard ------*/
function bindDashboardValidation() {
	toggleNavFooter(false, true, true);
}

/*------ Profile ------*/
// Validate matching passwords on signup
jQuery.validator.addMethod("notDefault", function(value, element) {
	var type = '';
	if(value == '' || !value) {
		return false;
	} else {
		return true;
	}
}, "Please make a selection.");
/*
function buildLightbox(d, type, id, lat, lng) {
	// Loop through data and build table, div, etc based on type variable
	var lightboxData = '';
	if(type == 'table') {
		lightboxData += '<h2>Select</h2>';
		lightboxData += '<table cellpadding="0" cellspacing="0" border="0" id="' + id + '">';
		lightboxData += '<tr>';
		lightboxData += '<th width="150" align="left">Referral</th>';
		lightboxData += '<th width="150" align="left">Phone</th>';
		lightboxData += '<th width="200" align="left">Location</th>';
		lightboxData += '<th width="116" align="left">Condition</th>';
		lightboxData += '</tr>';
		for(var i=0; i<10; i++) {
			if(i % 2 === 0) {
				lightboxData += '<tr>';
			} else {
				lightboxData += '<tr class="pageTableEven">';
			}
			lightboxData += '<td>Patient Name</td>';
			lightboxData += '<td>555-555-5555</td>';
			lightboxData += '<td>Location Name</td>';
			lightboxData += '<td>Condition Name</td>';
			lightboxData += '</tr>';
		}
		lightboxData += '</table>';
	} else if(type == 'map') {
		console.log('map called');
		lightboxData += '<div id="overlayContentDiv">';
		lightboxData += '<div id="overlayMap">Google Map! Latitude:' + lat + ' Longitude:' + lng;
		lightboxData += '</div>';
		lightboxData += '<div id="overlayMapLink"><a href="#" target=" _blank">View Full Size Map</a></div>';
		lightboxData += '</div>';
	}
	var overlay = '<div id="overlay"></div>'
	overlay += '<div id="overlayPosition">';
	overlay += '<div id="overlayContentWrap">';
	overlay += '<div id="overlayContent" class="pageTable">';
	overlay += '<div id="overlayClose">&times;</div>';
	overlay += lightboxData;
	overlay += '</div>';
	overlay += '</div>';
	overlay += '</div>';
	$('body').append(overlay);
	$('#overlay').show();
	$('#overlayPosition').fadeIn(250);
	this.bindOverlayClose();
}

function removeOverlay() {
	$('#overlay').remove();
	$('#overlayPosition').fadeOut(250, function() {
		$('#overlayPosition').remove();
	});
	$('#referralTable tr').removeClass('pageTableActive');
}

// Table selection effects/events
function bindTherapistTables() {
function showReferral() {
	$('#referralTable tr').removeClass('pageTableActive');
	$(e.currentTarget).parent().addClass('pageTableActive');
	// ajax call returns a list of therapists for this patient
	var d = 'response data populated from ajax call';
	// Add and open lightbox
	buildLightbox(d, 'table', 'selectReferral');
}
function selectTherapistActivity() {
	$('#therapistTableActivity tr').removeClass('pageTableActive');
	$(e.currentTarget).parent().addClass('pageTableActive');
}
$('#therapistTableTimesheets tr td').bind('click', function() {
	$('#therapistTableActivity tr').removeClass('pageTableActive');
	$(e.currentTarget).parent().addClass('pageTableActive');
});
// Toggle Therapist Tables
$('#therapistTables .nav li').bind('click', function() {
	var _thisId = $(e.currentTarget).prop('id');
	$('#therapistTables .nav li').removeClass('tabActive');
	$(e.currentTarget).addClass('tabActive');
	if(_thisId == 'tableActivity') {
		$('#therapistTableActivity').stop().fadeIn(500);
		$('#therapistTableTimesheets').hide();
	} else {
		$('#therapistTableTimesheets').stop().fadeIn(500);
		$('#therapistTableActivity').hide();
	}
});
}*/

/*------ Overlay ------*/
// Show lightbox function with cases
function showLightbox(id, type) {
	$('#overlay').fadeIn(250);
	$('#' + id).fadeIn(500);
	switch(type) {
		case 'password': {
			// sync value with user name entered if any
			$('#forgotPasswordEmail').val('');
			$('#forgotPasswordEmail').val($('#loginUsername').val());
		}
	}
}

/*------ Global ------*/
// Alerts
/*
function selectAlert() {
	$('.pageAlert').removeClass('pageAlertActive');
	$(e.currentTarget).addClass('pageAlertActive');
}
function removeAlert(e) {
	_thisParent = $(e.currentTarget).parent();
	var dataAlert = $(_thisParent).data('alert');
	$('.pageAlert').each(function(i) {
		if($(this).data('alert') == dataAlert) {
			$(this).remove();
		}
	});
	var _alerts = $('#topBar .pageAlert').length;
	if(_alerts == 0) {
		$('.alertNum').hide();
		$('#alerts .pageTable').html('<p id="noAlerts">No alerts found.</p>');
	} else {
		$('.alertNum').html('<span>' + _alerts + '</span>').show();
		if($('#noAlerts').is(':visible')) { $('#noAlerts').remove(); }
	}
	return false;
}

function bindPatientSearch() {
	var testData = [
		'aYev','bYev','cYev','dYev','eYev','fYev','gYev','hYev','iYev','jYev','kYev','lYev','mYev','nYev','oYev','pYev','qYev','rYev','sYev','tYev','uYev','vYev','wYev','xYev','yYev','zYev'
	];
	$('#patientSearchInput').autocomplete({
		// Ajax call for search results
		source: testData
	});
}*/
$(window).load(function() {
	if($('#container').hasClass('dNone')) {
		$('#container').fadeIn(750);
		$('footer').fadeIn(750);
	}
});