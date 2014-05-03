'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('activate', function( $scope, $http, $location, $timeout) {
		
		toggleNavFooter(true, false, false);
		
		var uuid = getParam('uuid');
		
		$scope.resendActivation = function() {
			$('#accountActivation').html('');
			$('#reActivate').hide();
			$.ajax({
				beforeSend: function(xhr) {
			  	xhr.setRequestHeader("Accept", "application/json");
			    xhr.setRequestHeader("Content-Type", "application/json");
			  },
			  type: "GET",
			  contentType: "application/json; charset=UTF-8",
			  url: 'http://edafeks.dyndns.biz:9090/api/v1/signup/resend/?uuid=' + uuid,
			  success: function(d) {
			  	displayMessage($('#accountActivation'),'reactivateSuccess', true);
			  },
			  error: function (d) {
			  	if(d.responseJSON) {
						displayMessage($('#accountActivation'),'errorCustom', true, d.responseJSON.messages[0].message);
					} else {
						displayMessage($('#accountActivation'), 'error', true);
					}
				}
			});
		}
		
		if(uuid) {
			var _scope = $scope;
			$.ajax({
				beforeSend: function(xhr) {
			  	xhr.setRequestHeader("Accept", "application/json");
			    xhr.setRequestHeader("Content-Type", "application/json");
			  },
			  type: "GET",
			  url: 'http://edafeks.dyndns.biz:9090/api/v1/signup/activate?uuid='+uuid,
			 	success: function(d) {
					$('#accountActivation').html('<div class="alert alert-success"><p>Your account has been activated, you will be redirected in 5 seconds to the login screen.  If you do not automatically redirect, please <a href="/angular/#/login">click here</a>.</div>');
			  	$timeout(function() {
						$location.path('/login').replace();
						$scope.$apply();
					}, 5000);
				},
			  error: function (d) {
					if(d.responseJSON) {
						displayMessage($('#accountActivation'),'errorCustom', true, d.responseJSON.messages[0].message);
						$('#reActivate').show();
					} else {
						displayMessage($('#accountActivation'), 'error', true);
					}
			  }
			});
		} else {
			$('#accountActivation').html('<div class="alert alert-error"><p>Your user id is not found, please click the link in the email.</p></div>');
		}
	})
	.controller('global', function( $scope, $http, $location) {
		$scope.logOut = function() {
			var token = getCookie("token");
			$.ajax({
				type: "DELETE",
				url: 'http://edafeks.dyndns.biz:9090/api/v1/token',
				beforeSend: function (xhr){
					xhr.setRequestHeader("Accept", "application/json");
			    xhr.setRequestHeader("Content-Type", "application/json");
					xhr.setRequestHeader('token', getCookie("token"));
				},
			  crossDomain: true,
				success: function(d) {
					deleteCookie("token");
					resetSuccess();
					$location.path('/login').replace();
					$scope.$apply();
				},
				error: function (d) {
					$location.path('/dashboard').replace();
					$scope.$apply();
				}
			});
		}
	})
	.controller('dashboard', function ($scope, $http, $location) {
		
    /*$http({
      method: 'GET',
      url: '/api/test'
    }).
    success(function (data, status, headers, config) {
      $scope.name = data.name;
    }).
    error(function (data, status, headers, config) {
      $scope.name = 'Error!'
    });*/

		$scope.checkLogin = function() {
			var token = getCookie("token");
			if(!token) {
				$location.path('/login').replace();	
				$scope.$apply();
			} else { // user logged in, bind page validation
				bindDashboardValidation();
			}
		}

		// Verify login
		$scope.checkLogin();

  })
	.controller('profile', function ($scope, $http, $location) {
		
		var states = [
		    { name: 'ALABAMA', abbr: 'AL'},
		    { name: 'ALASKA', abbr: 'AK'},
		    { name: 'ARIZONA', abbr: 'AZ'},
		    { name: 'ARKANSAS', abbr: 'AR'},
		    { name: 'CALIFORNIA', abbr: 'CA'},
		    { name: 'COLORADO', abbr: 'CO'},
		    { name: 'CONNECTICUT', abbr: 'CT'},
		    { name: 'DELAWARE', abbr: 'DE'},
		    { name: 'DISTRICT OF COLUMBIA', abbr: 'DC'},
		    { name: 'FLORIDA', abbr: 'FL'},
		    { name: 'GEORGIA', abbr: 'GA'},
		    { name: 'HAWAII', abbr: 'HI'},
		    { name: 'IDAHO', abbr: 'ID'},
		    { name: 'ILLINOIS', abbr: 'IL'},
		    { name: 'INDIANA', abbr: 'IN'},
		    { name: 'IOWA', abbr: 'IA'},
		    { name: 'KANSAS', abbr: 'KS'},
		    { name: 'KENTUCKY', abbr: 'KY'},
		    { name: 'LOUISIANA', abbr: 'LA'},
		    { name: 'MAINE', abbr: 'ME'},
		    { name: 'MARYLAND', abbr: 'MD'},
		    { name: 'MASSACHUSETTS', abbr: 'MA'},
		    { name: 'MICHIGAN', abbr: 'MI'},
		    { name: 'MINNESOTA', abbr: 'MN'},
		    { name: 'MISSISSIPPI', abbr: 'MS'},
		    { name: 'MISSOURI', abbr: 'MO'},
		    { name: 'MONTANA', abbr: 'MT'},
		    { name: 'NEBRASKA', abbr: 'NE'},
		    { name: 'NEVADA', abbr: 'NV'},
		    { name: 'NEW HAMPSHIRE', abbr: 'NH'},
		    { name: 'NEW JERSEY', abbr: 'NJ'},
		    { name: 'NEW MEXICO', abbr: 'NM'},
		    { name: 'NEW YORK', abbr: 'NY'},
		    { name: 'NORTH CAROLINA', abbr: 'NC'},
		    { name: 'NORTH DAKOTA', abbr: 'ND'},
		    { name: 'OHIO', abbr: 'OH'},
		    { name: 'OKLAHOMA', abbr: 'OK'},
		    { name: 'OREGON', abbr: 'OR'},
		    { name: 'PALAU', abbr: 'PW'},
		    { name: 'PENNSYLVANIA', abbr: 'PA'},
		    { name: 'RHODE ISLAND', abbr: 'RI'},
		    { name: 'SOUTH CAROLINA', abbr: 'SC'},
		    { name: 'SOUTH DAKOTA', abbr: 'SD'},
		    { name: 'TENNESSEE', abbr: 'TN'},
		    { name: 'TEXAS', abbr: 'TX'},
		    { name: 'UTAH', abbr: 'UT'},
		    { name: 'VERMONT', abbr: 'VT'},
		    { name: 'VIRGINIA', abbr: 'VA'},
		    { name: 'WASHINGTON', abbr: 'WA'},
		    { name: 'WEST VIRGINIA', abbr: 'WV'},
		    { name: 'WISCONSIN', abbr: 'WI'},
		    { name: 'WYOMING', abbr: 'WY' }
		];
		
		var countries = new Array("Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Morocco", "Monaco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino", " Sao Tome", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe");
		
		
		toggleNavFooter(false, true, false);
		
		// Build statecode select menus from obj
		$scope.buildStateSelect = function(parent, value) {
			$('#' + parent).html('');
			for(var i=0; i<states.length; i++) {
				$('#' + parent).append('<option value="' + states[i].abbr +'">' + states[i].name + '</option>');
			}
			$('#' + parent).val(value);
		}
		
		// Build countrycode select menus from array
		$scope.buildCountrySelect = function(parent, value) {
			$('#' + parent).html('');
			for(var i=0; i<countries.length; i++) {
				$('#' + parent).append('<option value="' + countries[i] +'">' + countries[i] + '</option>');
			}
			$('#' + parent).val(value);
		}
		
		$scope.populateProfile = function(d) {
			// populate page
			$('#profileAddresses').html(''); // clear previous if cached
			$('#profileBusinesses').html(''); // clear previous if cached
			var dob = d.dob;
			var dobSplit = dob.split('-');
			$('#profileFirstName').val(d.firstName);
			$('#profileLastName').val(d.lastName);
			$('#profileEmail').val(d.email);
			$('#profileEthnicity').val(d.ethnicity);
			$('#profileDOBYear').val(dobSplit[0]);
			$('#profileDOBMonth').val(dobSplit[1]);
			$('#profileDOBDay').val(dobSplit[2]);
			$('#profileAge').html('Age: ' + d.age);
			$('#profilePrimaryLanguage').val(d.primaryLanguage);
			$('#profileFirstName').val();
			$('#profileFirstName').val();
			for(var i=0; i<d.address.length; i++) {
				var _this = d.address[i];
				var _address = '';
				if(i > 0) { _address += '<hr />'; }
				_address += '<div class="left w438">';
				_address += '<label for="profile' + i + 'Line1">Address Line 1:</label>';
				_address += '<input type="text" id="profile' + i + 'Line1" value="' + _this.line1 + '" />';
				_address += '</div>';
				_address += '<div class="right w438">';
				_address += '<label for="profile' + i + 'Line2">Address Line 2:</label>';
				_address += '<input type="text" id="profile' + i + 'Line2" value="' + _this.line2 + '" />';
				_address += '</div>';
				_address += '<div class="left w438">';
				_address += '<label for="profile' + i + 'City">City:</label>';
				_address += '<input type="text" id="profile' + i + 'City" value="' + _this.city + '" />';
				_address += '</div>';
				_address += '<div class="right w438">';
				_address += '<label for="profileState' + i + '">State:</label>';
				_address += '<select id="profileState' + i + '" class="w200">';
				_address += '</select>';
				_address += '</div>';
				_address += '<div class="clear"></div>';
				_address += '<div class="left w438">';
				_address += '<label for="profileZip">Zip Code:</label>';
				_address += '<input type="text" id="profile' + i + 'Zip" value="' + _this.zipCode + '" class="w200" />';
				_address += '</div>';
				_address += '<div class="right w438">';
				_address += '<label for="profileCountry' + i + '">Country:</label>';
				_address += '<select id="profileCountry' + i + '" class="w200">';
				_address += '</select>';
				_address += '</div>';
				_address += '<div class="clear"></div>';
				$('#profileAddresses').append(_address);
				$scope.buildStateSelect('profileState' + i, _this.state);
				$scope.buildCountrySelect('profileCountry' + i, _this.country);
			}
			var business = d.businesses;
			for(var i=0; i<d.businesses.length; i++) {
				var _business = '';
				_business += '<div class="left w438">';
				_business += '<label for="businessName' + i + '">Business Name</label>';
				_business += '<input id="businessName' + i + '" value="' + business[i].name + '" type="text" />';
				_business += '</div>';
				_business += '<div class="right w438">';
				_business += '<label for="businessDesc' + i + '">Business Description</label>';
				_business += '<input id="businessDesc' + i + '" value="' + business[i].description + '" type="text" />';
				_business += '</div>';
				_business += '<div class="clear"></div>';
				_business += '<label for="businessProviderType' + i + '">Provider Type</label>';
				_business += '<select id="businessProviderType' + i + '" value="' + business[i].providerType + '">';
				_business += '<option value="AGENCY">Agency</option>';
				_business += '<option value="OTHER">Other</option>';
				_business += '</select>';
				$('#profileBusinesses').append(_business);
			}
			$('#contentLoader').hide();
			//$('#profileContent').fadeIn(500);
		}

		$scope.checkUserData = function() {
			console.log('check user data');
			var _date = new Date();
			var _currentYear = _date.getUTCFullYear();
			console.log(_currentYear);
			// build year select menu
			for(var i=1900; i<=_currentYear; i++) {
				$('#profileDOBYear').append('<option value="' + i + '">' + i + '</option>');
			}
			var token = getCookie("token");
			// check local storage
			var userProfile = $storage('userProfile').get();
			/*if(userProfile && userProfile.token == token) {
				// build page from local storage
				var userData = userProfile.userData;
				$scope.populateProfile(userData);
			} else { // ajax to get user profile info*/
				var _scope = $scope;
				$.ajax({
					beforeSend: function (xhr){
	        	xhr.setRequestHeader("Accept", "application/json");
	        	xhr.setRequestHeader("Content-Type", "application/json");
	        	xhr.setRequestHeader('token', getCookie("token"));
	        },
				  type: "GET",
				  contentType: "application/json; charset=UTF-8",
				  dataType: "json",
				  url: 'http://edafeks.dyndns.biz:9090/api/v1/users/3',
				  success: function(d) {
						// populate user data
						var userData = d.result.user;
						var userProfile = {
							'token': token,
							'userData': userData
						}
						_scope.populateProfile(userData);
				  },
				  error: function (d) {
						if(d.responseJSON) {
							displayMessage($('.form-profile'),'errorCustom', true, d.responseJSON.messages[0].message);
						} else {
							displayMessage($('.form-profile'), 'error', true);
						}
						$storage('userProfile').set('');
				  }
				});
				
			/*}*/
			
		}

		$scope.checkLogin = function() {
			var token = getCookie("token");
			if(!token) {
				$location.path('/login').replace();	
				$scope.$apply();
			} else { // user logged in, bind page validation
				//bindProfileValidation();
				$scope.checkUserData();
			}
		}

		// Verify login
		$scope.checkLogin();

  })
  .controller('login', function($scope, $http, $location) {
		// Toggle Login/Register Pages
		$scope.toggleLogin = function(e) {
			var _this = $(e.currentTarget);
			if(!$(_this).hasClass('active')) {
				if($(_this).prop('id') == 'loginCreate') { // register clicked
					$('.form-register input').removeClass('error');
					$('.form-register div.error').remove();
					$('.loginTabs li').removeClass('active');
					$('#loginCreate').addClass('active');
					$('.form-signin').stop().hide();
					$('.form-register').stop().slideDown(500);
					$('#loginRegister').prop('disabled',true);
					$('#tcCheck').prop('checked',false);
				} else { // login clicked
					$('.form-signin input').removeClass('error');
					$('.form-signin div.error').remove();
					$('.loginTabs li').removeClass('active');
					$('#loginUser').addClass('active');
					$('.form-register').stop().slideUp(500, function() {
						$('.form-signin').stop().fadeIn(500);
					});
				}
			}
		}
		
		// Toggle Register Button
		$scope.toggleRegister = function() {
			var tcCheck = document.getElementById('tcCheck');
			if(tcCheck.checked == true) {
				$('#loginRegister').prop('disabled',false);
			} else {
				$('#loginRegister').prop('disabled',true);
			}
		}
		
		// Submit Login Form
		$scope.submitLogin = function() {
			if($('#form-signin').valid()) {
			var auth = make_base_auth($('#loginUsername').val(), $('#loginPassword').val());
			$.ajax({
	  		type: "GET",
	    	url: 'http://edafeks.dyndns.biz:9090/api/v1/token',
				beforeSend: function (xhr){ 
					xhr.setRequestHeader('Authorization', auth);
				},
	    	success: function(d) {
					var userToken = d.result.token;
					//set token cookie with 24 ttl
					setCookie("token", userToken, 1);
					$location.path('/dashboard').replace();
					$scope.$apply();
				},
				error: function(d) {
					if(d.responseJSON) {
						displayMessage($('div.form-signin'),'errorCustom', true, d.responseJSON.messages[0].message);
					} else {
						displayMessage($('div.form-signin'), 'error', true);
					}
				}
			});
		}
			return false;
		}
		
		// Submit Registration
		$scope.submitRegistration = function() {
			var _scope = $scope;
			if($('#form-register').valid()) {
				if($('#form-register').valid()) {
					var regObj = {
						firstName: $('#loginFirst').val(),
						lastName: $('#loginLast').val(),
						email: $('#loginEmail').val(),
						password: $('#signupPassword').val(),
						termsOfService: $('#tcCheck').is(':checked'),
						macAddress: "e9:a2:13:c5"
					}
					$.ajax({
			  		type: "POST",
			    	url: 'http://edafeks.dyndns.biz:9090/api/v1/auth/signup',
						contentType: "application/json; charset=UTF-8",
						dataType: "json",
		      	crossDomain: true,
		      	data: JSON.stringify(regObj),
						beforeSend: function(req) {
							req.setRequestHeader("Accept", "application/json");
		        	//req.setRequestHeader("Accept-encoding", "application/json");
						},
			    	success: function(d) {
							displayMessage($('div.form-register'), 'regSuccess', true);
							deleteCookie("token"); // if another user was logged in
							document.getElementById('form-register').reset(); // reset form
							_scope.toggleRegister(); // re-disable register button
						},
						error: function(d) {
							if(d.responseJSON) {
								displayMessage($('div.form-register'),'errorCustom', true, d.responseJSON.messages[0].message);
							} else {
								displayMessage($('div.form-register'), 'error', true);
							}
						}
					});
				}
				return false;
			}
		}
		
		// Forgot Password Submit
		$scope.forgotPasswordSubmit = function() {
			var _scope = $scope;
			if($('#forgotPasswordForm').valid()) {
				$.ajax({
					type: 'GET',
					url:'http://edafeks.dyndns.biz:9090/api/v1/users/forgot/?email=' + $('#forgotPasswordEmail').val(),
					success: function(d) {
						_scope.closeLightbox();
						displayMessage($('div.form-signin'),'passwordReset', true);
					},
					error: function(e) {
						_scope.closeLightbox();
						if(d.responseJSON) {
							displayMessage($('div.form-signin'),'errorCustom', true, d.responseJSON.messages[0].message);
						} else {
							displayMessage($('div.form-signin'), 'error', true);
						}
					}
				});
			}
			return false;
		}
		
		$scope.checkPwStrength = function(e) {
			var _pw = $(e.currentTarget).val();
			if(_pw.length < 8) {
				$('.pwStrength').hide();
				$('#pwShort').show();
			} else {
				var _pwStrength = 0;
				var _pwLower = /^(?=.*[a-z])/;
				var _pwUpper = /^(?=.*[A-Z])/;
				var _pwSpecial = /^(?=.*[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/])/;
				if(_pwUpper.test(_pw)) { // uppercase
					_pwStrength++;
				}
				if(_pwLower.test(_pw)) { // lowercase
					_pwStrength++;
				}
				if(_pwSpecial.test(_pw)) { // special character
					_pwStrength++;
				}
				$('.pwStrength').hide();
				if(_pwStrength == 0 || _pwStrength == 1) {
					$('#pwWeak').show();
				} else if(_pwStrength == 2) {
					$('#pwGood').show();
				} else {
					if(_pwStrength == 3) {
						$('#pwStrong').show();
					}
				}
			}
			$('#pwStrength').show();
		}
		
		// Forgot Password Lightbox
		$scope.lightbox = function(e) {
			var _target = $(e.currentTarget).data('target');
			var _desc = $(e.currentTarget).data('desc');
			showLightbox(_target, _desc);
		}
		
		$scope.closeLightbox = function() {
			$('.lightbox').fadeOut(250);
			$('#overlay').fadeOut(500);	
		}
		
		// If logged in, redirect to dashboard
		$scope.checkLogin = function() {
			var token = getCookie("token");
			if(token) {
				$location.path('/dashboard').replace();	
				$scope.$apply();
			} else {
				// Setup jquery validate
				bindLoginValidation();
			}
		}

		// Verify login
		$scope.checkLogin();

  })
	.controller('reset', function($scope, $http, $location) {
		
		$scope.resetSubmit = function() {
			if($('#form-reset').valid()) { // password valid

				var uuid = getParam( 'uuid' );
				if(uuid != '') { // uuid exists in the url

						var resetData = {
						  "validationToken": uuid,
						  "oldPassword":$('#resetPassword').val(),
							"newPassword":$('#resetPassword').val()
						}
						$.ajax({
							beforeSend: function(xhr) {
						  	xhr.setRequestHeader("Accept", "application/json");
						    xhr.setRequestHeader("Content-Type", "application/json");
						  },
						  type: "PUT",
						  contentType: "application/json; charset=UTF-8",
						  dataType: "json",
						  url: 'http://edafeks.dyndns.biz:9090/api/v1/users/reset',
						  data: JSON.stringify(resetData),
						  success: function(d) {
								// pass success flag via local storage, query strings aren't supported in angular.js
								var success = $storage('success').get();
								success.login = true;
								$storage('success').set(success);
								// Redirect user to login page
								$location.path('/login?reset=true').replace();
								$scope.$apply();
						  },
						  error: function (d) {
								if(d.responseJSON) {
									displayMessage($('.form-reset'),'errorCustom', true, d.responseJSON.messages[0].message);
								} else {
									displayMessage($('.form-reset'), 'error', true);
								}
						  }
						});
					} else { // no uuid found
						displayMessage($('.form-reset'), 'nouuid', true);
					}
				}
			return false;
		}
		
		bindResetValidation();
		
  });