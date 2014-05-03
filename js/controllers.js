'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.service( 'userInfo', [ '$rootScope', function( $rootScope ) {
		
		var user = '';

		return {

			getUserInfo: function() {
				if(user == '') { // local obj blank, load from server
					var _token = getCookie("token");
					$.ajax({
						beforeSend: function (xhr){
			       	xhr.setRequestHeader("Accept", "application/json");
			       	xhr.setRequestHeader("Content-Type", "application/json");
		        	xhr.setRequestHeader('token', _token);
			      },
						type: "GET",
						contentType: "application/json; charset=UTF-8",
						dataType: "json",
						url: 'http://edafeks.dyndns.biz:9090/api/v1/users/myinfo',
						async: false,
						success: function(d) {
							user = d.result.users;
							$('#loggedUser').html(user.firstName + ' ' + user.lastName);
					  },
					  error: function (d) {
							if(d.responseJSON) {
								displayMessage($('.form-profile'),'errorCustom', true, d.responseJSON.messages[0].message);
							} else {
								displayMessage($('.form-profile'), 'error', true);
							}
							return false;
					  }
					});
				} else {
					$('#loggedUser').html(user.firstName + ' ' + user.lastName);
				}
				return user;
			},
			
			addUserInfo: function(type, obj, id) {
				// add new profile item
				switch(type) {
					case 'address':
						user.addresses.push(obj);
					break;
					case 'business':
						user.businesses.push(obj);
					break;
					case 'contact':
						user.contactinfos.push(obj);
					break;
				}
			},
			
			updateUserInfo: function(type, obj, id) {
				switch(type) {
					case 'address':
						for(var i=0; i<user.addresses.length; i++) {
							if(id == user.addresses[i].id) {
								user.addresses[i] = obj;
							}
						}
					break;
					case 'business':
						for(var i=0; i<user.businesses.length; i++) {
							if(id == user.businesses[i].id) {
								user.businesses[i] = obj;
							}
						}
					break;
					case 'contact':
						for(var i=0; i<user.contactinfos.length; i++) {
							if(id == user.contactinfos[i].id) {
								user.contactinfos[i] = obj;
							}
						}
					break;
					case 'user':
						user = obj;
						$('#loggedUser').html(user.firstName + ' ' + user.lastName);
					break;
				}
			},
			
			deleteUserInfo: function(type, id) {
				var updateStorage = new Array();
				switch(type) {
					case 'address':
						for(var i=0; i<user.addresses.length; i++) {
							if(id != user.addresses[i].id) {
								updateStorage.push(user.addresses[i]);
							}
						}
						user.addresses = updateStorage;
					break;
					case 'business':
						for(var i=0; i<user.businesses.length; i++) {
							if(id != user.businesses[i].id) {
								updateStorage.push(user.businesses[i]);
							}
						}
						user.businesses = updateStorage;
					break;
					case 'contact':
						for(var i=0; i<user.contactinfos.length; i++) {
							if(id != user.contactinfos[i].id) {
								updateStorage.push(user.contactinfos[i]);
							}
						}
						user.contactinfos = updateStorage;
					break;
				}
			}

		}

	}])
	.service( 'lightbox', [ '$rootScope', function( $rootScope ) {

		return {

			showLightbox: function(type, data) {
				switch(type) {
					case 'patient':
					if(data) {
						console.log('existing patient, populate form data');
					} else {
						console.log('new patient, show blank form');
					}
					break;
				}
			},
			
			closeLightbox: function() {
				
			}

		}

	}])
	.controller('activate', [ '$rootScope', '$scope', '$http', '$location', '$timeout', function( $rootScope, $scope, $http, $location, $timeout) {
		
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
					$('#accountActivation').html('<div class="alert alert-success"><p>Your account has been activated, you will be redirected in 5 seconds to the login screen.  If you do not automatically redirect, please <a href="/#/login">click here</a>.</div>');
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
	}])
	.controller('global', [ '$rootScope', '$scope', '$http', '$location', function( $scope, $http, $location) {
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
	}])
	.controller('dashboard', [ '$rootScope', '$scope', '$http', '$location', 'userInfo', function ($rootScope, $scope, $http, $location, userInfo) {

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

  }])
	.controller('profile', [ '$rootScope', '$scope', '$http', '$location', '$compile', 'userInfo', function ($rootScope, $scope, $http, $location, $compile, userInfo) {
		
		var selectStates = new Array();
		var selectLanguages = new Array();
		var selectEthnicities = new Array();
		var selectAuthorities = null;
		var selectCities = new Array();
		var selectBusinessentitytypes = new Array();
		var selectContactTypes = new Array();
		var selectTimezones = null;
		var selectCountries = null;
		var selectActivityTypes = null;
		var baseUrl = 'http://edafeks.dyndns.biz:9090/api/v1/users/';
		
		// Return correct values when building select menus
		$scope.lookupObj = function(type) {
			switch(type) {
				case 'states':
					return selectStates;
					break;
				case 'languages':
					return selectLanguages;
					break;
				case 'ethnicities':
					return selectEthnicities;
					break;
				case 'authorities':
					return selectAuthorities;
					break;
				case 'cities':
					return selectCities;
					break;
				case 'businessentitytypes':
					return selectBusinessentitytypes;
					break;
				case 'contactTypes':
					return selectContactTypes;
					break;
				case 'timezones':
					return selectTimezones;
					break;
				case 'countries':
					return selectCountries;
					break;
				case 'activityTypes':
					return selectActivityTypes;
					break;
			}
		}
		
		toggleNavFooter(false, true, false);
		
		// Remove null values for display
		$scope.nullCheck = function(d) {
			if(d) {
				return d;
			} else {
				return '';
			}
		}
		
		// Build select menu from obj
		$scope.buildSelectObj = function(parent, type, value) {
			var _this = $scope.lookupObj(type);
			$('#' + parent).html('');
			for(var i=0; i<_this.length; i++) {
				var objVal = new Array();
				for(var j in _this[i]) {
					objVal.push(_this[i][j]);
				}
				$('#' + parent).append('<option value="' + objVal[0] +'">' + objVal[1] + '</option>');
			}
			$('#' + parent).val(value);
		}
		
		// Build select menu from array
		$scope.buildSelectArr = function(parent, type, value) {
			var _this = $scope.lookupObj(type);
			$('#' + parent).html('');
			for(var i=0; i<_this.length; i++) {
				$('#' + parent).append('<option value="' + _this[i] +'">' + _this[i] + '</option>');
			}
			$('#' + parent).val(value);
		}
		
		// Bind addresses validation
		$scope.bindValidationAddress = function() {
			console.log('bind validation address');
			$('#profileAddresses form').each(function() {
				$(this).validate({
					onkeyup: false,
					errorClass: 'error',
					errorElement: 'div',
					onfocusout: false,
					errorPlacement: function(error, element) {
						error.insertBefore(element);
					}
				});
				$(this).find('input').each(function() {
					if($(this).hasClass('profileAddressZip')) {
						$(this).rules('add', {
							required: true,
							minlength:5,
							maxlength:5,
							messages: {
								required: 'Please enter a zip code.',
								minlength: 'Please enter a valid zip code.',
								maxlength: 'Please enter a valid zip code.'
							}
						});
					} else if($(this).hasClass('profileAddressLine1')) {
						$(this).rules('add', {
							required: true,
							messages: {
								required: 'Please enter a valid street address.'
							}
						});
					}
				});
				$(this).find('select').each(function() {
					$(this).rules('add', {
						notDefault: true
					});
				});
			});
		}
		
		// Bind businesses validation
		$scope.bindValidationBusiness = function() {
			console.log('bind validation business');
			$('#profileBusinesses form').each(function() {
				$(this).validate({
					onkeyup: false,
					errorClass: 'error',
					errorElement: 'div',
					onfocusout: false,
					errorPlacement: function(error, element) {
						error.insertBefore(element);
					}
				});
				$(this).find('input').each(function() {
					if($(this).hasClass('profileBusName')) {
						$(this).rules('add', {
							required: true,
							messages: {
								required: 'Please enter a business name.'
							}
						});
					} else {
						$(this).rules('add', {
							required: true,
							messages: {
								required: 'Please enter a business description.'
							}
						});
					}
				});
				$(this).find('select').each(function() {
					$(this).rules('add', {
						notDefault: true
					});
				});
			});
			// business search abbr
			//$scope.bindAutocompleteBusiness();
		}
		
		// Bind contacts validation
		$scope.bindValidationContact = function() {
			console.log('bind validation contact');
			$('#profileContacts form').each(function() {
				$(this).validate({
					onkeyup: false,
					errorClass: 'error',
					errorElement: 'div',
					onfocusout: false,
					errorPlacement: function(error, element) {
						error.insertBefore(element);
					}
				});
				$(this).find('input').each(function() {
					$(this).rules('add', {
						required: true,
						messages: {
							required: 'Please enter a contact name.'
						}
					});
				});
				$(this).find('select').each(function() {
					$(this).rules('add', {
						notDefault: true
					});
				});
			});
		}
		
		// Bind initial validation
		$scope.bindValidation = function() {
			// Bind user info
			$('#profileUserForm').validate({
				onkeyup: false,
				errorClass: 'error',
				errorElement: 'div',
				onfocusout: false,
				errorPlacement: function(error, element) {
					error.insertBefore(element);
				},
				rules: {
					profileFirstName: {
						required: true
					},
					profileLastName: {
						required: true
					},
					profileEmail: {
						required: true,
						email: true
					},
					profileDOBMonth: {
						required: true
					},
					profileDOBDay: {
						required: true
					},
					profileDOBYear: {
						required: true
					}
				},
				messages: {
					profileFirstName: {
						required: 'Please enter a first name.'
					},
					profileLastName: {
						required: 'Please enter a last name.'
					},
					profileEmail: {
						required: 'Please enter an email address.',
						email: 'Please enter a valid email address.'
					},
					profileDOBMonth: {
						required: 'Please enter a birth month.'
					},
					profileDOBDay: {
						required: 'Please enter a birth day.'
					},
					profileDOBYear: {
						required: 'Please enter a birth year.'
					},
				}
			});
			// validation
			$scope.bindValidationAddress();
			$scope.bindValidationBusiness();
			$scope.bindValidationContact();
		}
		
		$scope.bindAutocompleteBusiness = function() {
			$('.profileBusName').autocomplete({
			      source: function( request, response ) {
			        $.ajax({
								beforeSend: function (xhr){
					       	xhr.setRequestHeader("Accept", "application/json");
					       	xhr.setRequestHeader("Content-Type", "application/json");
					       	xhr.setRequestHeader('token', getCookie("token"));
					       },
			          url: "http://edafeks.dyndns.biz:9090/api/v1/businesses/search?searchString=" + request.term,
			          dataType: "json",
			          /*data: {
			            featureClass: "P",
			            style: "full",
			            maxRows: 12,
			            name_startsWith: request.term
			          },*/
			          success: function( data ) {
									console.log(data);
			            response( $.map( data.result, function( item ) {
			              return {
			                label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
			                value: item.name
			              }
			            }));
			          }
			        });
			      },
			      minLength: 1,
			      select: function( event, ui ) {
			        console.log( ui.item ?
			          "Selected: " + ui.item.label :
			          "Nothing selected, input was " + this.value);
			      },
			      open: function() {
			        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
			      },
			      close: function() {
			        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
			      }
			    });
		}
		
		// Populate addresses
		$scope.populateProfileAddress = function(i, d) {
			var _address = '';
			var line1 = '';
			var line2 = '';
			var city = '';
			var state = '';
			var zip = '';
			var country = '';
			var id = '';
			if(d) {
				line1 = d.line1;
				line2 = d.line2;
				city = d.city;
				state = d.state;
				zip = d.zipCode;
				country = d.country;
				id = d.id;
			}
			_address += '<div class="profileAddress pRel" id="profileAddress-' + i + '">';
			_address += '<form id="profileAddress-' + i + '-Form" name="profileAddress-' + i + '-Form">';
			_address += '<div class="profileClose" id="profileAddressesClose-' + id + '" ng-click="removeUserDataAddress($event)">&times;</div>';
			_address += '<hr />';
			_address += '<div class="left w438">';
			_address += '<label for="profile' + i + 'Line1">Address Line 1:</label>';
			_address += '<input type="text" id="profile' + i + 'Line1" name="profile' + i + 'Line1" value="' + line1 + '" class="profileAddressLine1" />';
			_address += '<p id="profile' + i + 'Line1P">' + line1 + '</p>';
			_address += '</div>';
			_address += '<div class="right w438">';
			_address += '<label for="profile' + i + 'Line2">Address Line 2:</label>';
			_address += '<input type="text" id="profile' + i + 'Line2" value="' + line2 + '" />';
			_address += '<p id="profile' + i + 'Line2P">' + line2 + '</p>';
			_address += '</div>';
			_address += '<div class="clear"></div>';
			_address += '<div class="left w438">';
			_address += '<label for="profile' + i + 'City">City:</label>';
			_address += '<select id="profile' + i + 'City" class="profileCity" name="profile' + i + 'City" value="' + city + '"></select>';
			_address += '<p id="profile' + i + 'CityP">' + city + '</p>';
			_address += '</div>';
			_address += '<div class="right w438">';
			_address += '<label for="profile' + i + 'State">State:</label>';
			_address += '<select id="profile' + i + 'State" name="profile' + i + 'State" class="w200 profileState">';
			_address += '</select>';
			_address += '<p id="profile' + i + 'StateP">' + state + '</p>';
			_address += '</div>';
			_address += '<div class="clear"></div>';
			_address += '<div class="left w438">';
			_address += '<label for="profile' + i + 'Zip">Zip Code:</label>';
			_address += '<input type="text" id="profile' + i + 'Zip" name="profile' + i + 'Zip" value="' + zip + '" class="w200 profileAddressZip" />';
			_address += '<p id="profile' + i + 'ZipP">' + zip + '</p>';
			_address += '</div>';
			_address += '<div class="right w438">';
			_address += '<label for="profile' + i + 'Country">Country:</label>';
			_address += '<select id="profile' + i + 'Country" name="profile' + i + 'Country" class="w200 profileCountry">';
			_address += '</select>';
			_address += '<p id="profile' + i + 'CountryP">' + country + '</p>';
			_address += '</div>';
			_address += '<div class="clear"></div>';
			_address += '<button class="btn btn-primary pAb profileEdit" ng-click="editUserData($event)">Edit</button>';
			_address += '<button class="btn btn-primary pAb profileCancel dNone" ng-click="cancelUserData($event)" data-type="Address">Cancel</button>';
			if(d) {
				_address += '<button class="btn btn-primary pAb profileUpdate" disabled ng-click="updateProfileInfo($event)" id="profileAddressesSave-' + id + '" data-type="address">Save</button>'; 
			} else { 
				_address += '<button class="btn btn-primary pAb profileSave" ng-click="saveProfileInfo($event)" data-type="address">Save</button>'; 
				_address += '<button class="btn btn-primary pAb profileUpdate dNone" disabled ng-click="updateProfileInfo($event)" data-type="address">Save</button>';
			}
			_address += '</form>';
			_address += '</div>';
			if(d) {
				$('#profileAddresses').append($compile(_address)($scope));
				$scope.buildSelectArr('profile' + i + 'City', 'cities', city);
				$scope.buildSelectArr('profile' + i + 'State', 'states', state);
				$scope.buildSelectObj('profile' + i + 'Country', 'countries', country);
			}
			else { 
				$('#profileAddresses').prepend($compile(_address)($scope));
				$scope.buildSelectArr('profile' + i + 'City', 'cities');
				$scope.buildSelectArr('profile' + i + 'State', 'states');
				$scope.buildSelectObj('profile' + i + 'Country', 'countries');
			}
		}
		
		// Populate businesses
		$scope.populateProfileBusinesses = function(i, d) {
			var name = '';
			var description = '';
			var type = '';
			var id = '';
			if(d) {
				name = d.name;
				description = d.description;
				type = d.providerType;
				id = d.id;
			}
			var _business = '';
			_business += '<div class="profileBusiness pRel" id="profileBusiness-' + i + '">';
			_business += '<form id="profileBusiness-' + i + '-Form">';
			_business += '<div class="profileClose" id="profileBusinessesClose-' + id + '" ng-click="removeUserDataBusiness($event)">&times;</div>';
			_business += '<hr />';
			_business += '<div class="left w438">';
			_business += '<label for="businessName' + i + '">Business Name</label>';
			_business += '<input id="businessName' + i + '" value="' + name + '" type="text" class="profileBusName" />';
			_business += '<p id="businessName' + i + 'P">' + name + '</p>';
			_business += '</div>';
			_business += '<div class="right w438">';
			_business += '<label for="businessDesc' + i + '">Business Description</label>';
			_business += '<input id="businessDesc' + i + '" value="' + description + '" type="text" class="profileBusDesc" />';
			_business += '<p id="businessDesc' + i + 'P">' + description + '</p>';
			_business += '</div>';
			_business += '<div class="clear"></div>';
			_business += '<label for="businessProviderType' + i + '">Provider Type</label>';
			_business += '<select id="businessProviderType' + i + '" value="">';
			_business += '</select>';
			_business += '<p id="businessProviderType' + i + 'P">' + type + '</p>';
			_business += '<button class="btn btn-primary pAb profileEdit" ng-click="editUserData($event)">Edit</button>';
			_business += '<button class="btn btn-primary pAb profileCancel dNone" data-type="Business" ng-click="cancelUserData($event)">Cancel</button>';
			if(d) {
				_business += '<button class="btn btn-primary pAb profileUpdate" disabled ng-click="updateProfileInfo($event)" id="profileBusinessesSave-' + id + '" data-type="business">Save</button>';
			} else {
				_business += '<button class="btn btn-primary pAb profileUpdate dNone" disabled ng-click="updateProfileInfo($event)" data-type="business">Save</button>';
				_business += '<button class="btn btn-primary pAb profileSave" ng-click="saveProfileInfo($event)" data-type="business">Save</button>';
			}
			_business += '</form>';
			_business += '</div>';
			if(d) {
				$('#profileBusinesses').append($compile(_business)($scope));
			}
			else { 
				$('#profileBusinesses').prepend($compile(_business)($scope));
			}
			$scope.buildSelectArr('businessProviderType' + i, 'businessentitytypes', type);
		}
		
		// Populate contact info
		$scope.populateProfileContact = function(i, d) {
			var _name = '';
			var _type = '';
			var _contact = '';
			var id = '';
			if(d) {
				_name = d.contactValue;
				_type = d.contactType;
				id = d.id;
			}
			_contact += '<div class="profileContact pRel" id="profileContact-' + i +'">';
			_contact += '<form id="profileContact-' + i + '-Form">';
			_contact += '<div class="profileClose" id="profileContactClose-' + id + '" ng-click="removeUserDataContact($event)">&times;</div>';
			_contact += '<hr />';
			_contact += '<div class="left w438">';
			_contact += '<label for="contactName' + i + '">Contact Name</label>';
			_contact += '<input id="contactName' + i + '" value="' + _name + '" type="text" />';
			_contact += '<p id="contactName' + i + 'P">' + _name + '</p>';
			_contact += '</div>';
			_contact += '<div class="left w438">';
			_contact += '<label for="contactType' + i + '">Contact Type</label>';
			_contact += '<select id="contactType' + i + '" value="' + _name + '" class="w200">';
			_contact += '</select>';
			_contact += '<p id="contactType' + i + 'P">' + _type + '</p>';
			_contact += '</div>';
			_contact += '<div class="clear"></div>';
			_contact += '<button class="btn btn-primary pAb profileEdit" ng-click="editUserData($event)">Edit</button>';
			_contact += '<button class="btn btn-primary pAb profileCancel dNone" ng-click="cancelUserData($event)" data-type="Contact">Cancel</button>';
			if(d) {
				_contact += '<button class="btn btn-primary pAb profileUpdate" disabled ng-click="updateProfileInfo($event)" data-id="' + d.id + '" data-type="contact" id="profileConcactinfosSave-' + d.id + '">Save</button>';
			} else {
				_contact += '<button class="btn btn-primary pAb profileUpdate dNone" disabled ng-click="updateProfileInfo($event)" data-type="contact" id="">Save</button>';
				_contact += '<button class="btn btn-primary pAb profileSave" ng-click="saveProfileInfo($event)" data-id="" data-type="contact" id="">Save</button>';
			}
			_contact += '</form>';
			_contact += '</div>';
			if(d) {
				$('#profileContacts').append($compile(_contact)($scope));
				$scope.buildSelectArr('contactType' + i, 'contactTypes',_type);
			} else {
				$('#profileContacts').prepend($compile(_contact)($scope));
				$scope.buildSelectArr('contactType' + i, 'contactTypes');
			}
		}
		
		$scope.bindAuthorityChange = function() { // change to ng-change eventually
			$('#authoritiesSelect').on('change', function() {
				var authorityId = $('#authoritiesSelect').val();
				var authoritiesArr = $scope.lookupObj('authorities');
				for(var i = 0; i<authoritiesArr.length; i++) {
					if(authoritiesArr[i].id == authorityId);
					var authority = {
						authorities: [{
							id: authorityId,
							role: authoritiesArr[i].role
						}]
					};
				}
				$.ajax({
					beforeSend: function (xhr){
	        	xhr.setRequestHeader("Accept", "application/json");
	        	xhr.setRequestHeader("Content-Type", "application/json");
	        	xhr.setRequestHeader('token', getCookie("token"));
	        },
				  type: "POST",
				  contentType: "application/json; charset=UTF-8",
				  dataType: "json",
				  url: baseUrl + $scope.getUserId() + '/authorities',
					data: JSON.stringify(authority),
				  success: function(d) {
						console.log('success');
					},
					error: function(d) {
						console.log('error');
					}
				});
			});
		}
		
		// Format DOB for display
		$scope.displayDOB = function(dob, age) {
			var dobSplit = dob.split('-');
			$('#profileDOBYear').val(dobSplit[0]);
			$('#profileDOBMonth').val(dobSplit[1]);
			$('#profileDOBDay').val(dobSplit[2]);
			$('#profileAge span').html(age);
			$('#profileDOBP').html(dobSplit[1] + '-' + dobSplit[2] + '-' + dobSplit[0]);
		}
		
		// Display profile completeness
		$scope.profileCompleteness = function(percent) {
			var percent = 40; // demo only
			$('#profileCompleteness span').html(percent);
			$('#profileCompleteBar').css({'width':percent * 2 + 'px'});
			$('#profileCompleteness').show();
		}
		
		// Populate user profile info
		$scope.populateProfile = function(d) {
			// populate page
			$('#profileAddresses').html(''); // clear previous if cached
			$('#profileBusinesses').html(''); // clear previous if cached
			$('#profileContact').html(''); // clear previous if cached
			if(d.dob) {
				$scope.displayDOB(d.dob, d.age);
			} else {
				var dob = '';
				$('#profileDOBYear').val('');
				$('#profileDOBMonth').val('');
				$('#profileDOBDay').val('');
				$('#profileAge span').html('');
			}
			var firstName = $scope.nullCheck(d.firstName);
			var lastName = $scope.nullCheck(d.lastName);
			var email = $scope.nullCheck(d.email);
			var ethnicity = $scope.nullCheck(d.ethnicity);
			var primaryLanguage = $scope.nullCheck(d.primaryLanguage);
			$('#profileFirstName').val(firstName);
			$('#profileFirstNameP').html(firstName);
			$('#profileLastName').val(lastName);
			$('#profileLastNameP').html(lastName);
			$('#profileEmail').val(email);
			$('#profileEmailP').html(email);
			$scope.buildSelectArr('profileEthnicity','ethnicities', ethnicity);
			$('#profileEthnicityP').html(ethnicity);
			$scope.buildSelectArr('profilePrimaryLanguage','languages', primaryLanguage);
			$('#profilePrimaryLanguageP').html(primaryLanguage);
			$('.profileContent').prop('id','profileContent-' + d.id);
			for(var i=0; i<d.addresses.length; i++) {
				$scope.populateProfileAddress(i, d.addresses[i]);
			}
			for(var i=0; i<d.contactinfos.length; i++) {
				$scope.populateProfileContact(i, d.contactinfos[i]);
			}
			var business = d.businesses;
			for(var i=0; i<d.businesses.length; i++) {
				$scope.populateProfileBusinesses(i, d.businesses[i]);
			}
			$scope.buildAuthoritiesCheck(d.authorities);
			$('#contentLoader').hide();
			// bind validation
			$scope.bindValidation();
			// show content
			$('.profileContent').fadeIn(500);
		}
		
		$scope.changeAuthority = function(e) {
			var _url = '/authorities/';
			var _method = "POST";
			var _data = null;
			if($(e.currentTarget).prop('checked')) {
				var authoritiesArr = new Array();
				$('#authorities input').each(function() {
					if($(this).prop('checked')) {
						var _id = $(this).prop('id');
						var _idSplit = _id.split('-');
						authoritiesArr.push(parseInt(_idSplit[1]));
					}
				});
				_data = {
					"authorityIds": authoritiesArr
				};
			} else {
				var _id = $(e.currentTarget).prop('id');
				var _idSplit = _id.split('-');
				_url = '/authorities/' + _idSplit[1];
				_method = "DELETE";
			}
			$.ajax({
				type: _method,
				url: baseUrl + $scope.getUserId() + _url,
				data: JSON.stringify(_data),
				beforeSend: function (xhr){
					xhr.setRequestHeader("Accept", "application/json");
			    xhr.setRequestHeader("Content-Type", "application/json");
					xhr.setRequestHeader('token', getCookie("token"));
				},
				success: function(d) {
					console.log('success');
					// sync local storage
				},
				error: function(d) {
					console.log('error');
				}
			});
		}
		
		$scope.buildAuthoritiesCheck = function(authoritiesChecked) {
			$('#authorities').html('');
			var authorities = $scope.lookupObj('authorities');
			for(var i=0; i<authorities.length; i++) { // build list of all authorities returned in lookup
				var _check = '';
				_check += '<div class="left w438">';
				_check += '<label for="authority-' + authorities[i].id + '" class="ml12">';
				_check += '<input type="checkbox" id="authority-' + authorities[i].id + '" class="authCheck" ng-click="changeAuthority($event)" />';
				_check +=  authorities[i].role;
				_check += '</label>';
				_check += '</div>';
				$('#authorities').append($compile(_check)($scope));
			}
			$('#authorities').append('<div class="clear"></div>');
			for(var j=0; j<authoritiesChecked.length; j++) { // check all authorities returned in myinfo
				document.getElementById('authority-' + authoritiesChecked[j].id).checked = true;
			}
		}
		
		// Add profile item
		$scope.addProfileItem = function(type) {
			$('#profile' + type + 'Wrap .profileAdd').prop('disabled',true);
			switch(type) {
				case 'Address':
					var _id = $('.profileAddress').length;
					$scope.populateProfileAddress(_id);
					$scope.bindValidationAddress(); // bind validation to new item
				break;
				case 'Business':
					var _id = $('.profileBusiness').length;
					$scope.populateProfileBusinesses(_id);
					$scope.bindValidationBusiness(); // bind validation to new item
				break;
				case 'Contact':
					var _id = $('.profileContact').length;
					$scope.populateProfileContact(_id);
					$scope.bindValidationContact(); // bind validation to new item
				break;
			}
			$('#profile' + type + '-'+ _id).addClass('new' + type);
			$('#profile' + type + '-'+ _id + ' p').hide();
			$('#profile' + type + '-'+ _id + ' input').show();
			$('#profile' + type + '-'+ _id + ' select').show();
			$('#profile' + type + '-'+ _id + ' .profileEdit').hide();
			$('#profile' + type + '-'+ _id + ' .profileCancel').show();
			$('#profile' + type + '-'+ _id + ' .profileSave').prop('disabled',false);
		}
		
		// Calculate age from DOB
		$scope.calculateAge = function() {
			var _date = new Date();
			var _currentYear = _date.getUTCFullYear();
			var _currentMonth = _date.getMonth() + 1;
			var _currentDay = _date.getDate();
			var _dobYear = $('#profileDOBYear').val();
			var _dobMonth = $('#profileDOBMonth').val();
			var _dobDate = $('#profileDOBDay').val();
			var _age = _currentYear - _dobYear;
			if(_dobMonth > _currentMonth) {
				_age = parseInt(_age) - 1;
			}
			if(_currentMonth == _dobMonth && _currentDay > _dobDate) {
				_age = parseInt(_age) + 1;
			}
			return _age;
		}
		
		// Build address object for put/post
		$scope.buildAddressObject = function(_parent) {
			var _id = _parent.split('-');
			var profileAddress = {
				"primary":false,
				"line1":$('#profile' + _id[1] + 'Line1').val(),
				"line2":$('#profile' + _id[1] + 'Line2').val(),
				"city":$('#profile' + _id[1] + 'City').val(),
				"state":$('#profile' + _id[1] + 'State').val(),
				"zip":$('#profile' + _id[1] + 'Zip').val(),
				"country":$('#profile' + _id[1] + 'Country').val()
			}
			return profileAddress;
		}
		
		// Build user object for put/post
		$scope.buildUserObject = function(_id) {
			if(!$('#profileDOBYear').val() || !$('#profileDOBDay').val() || !$('#profileDOBMonth').val()) {
				var profileUser = {
					"dob": null,
					"age": null,
					"ethnicity":$('#profileEthnicity').val(),
					"firstName":$('#profileFirstName').val(),
					"lastName":$('#profileLastName').val(),
					"primaryLanguage":"English"
				}
			} else {
				var _dob = $('#profileDOBYear').val() + '-' + $('#profileDOBMonth').val() + '-' + $('#profileDOBDay').val();
				var _age = $scope.calculateAge();
				var profileUser = {
					"dob": _dob,
					"age": _age.toString(),
					"ethnicity":$('#profileEthnicity').val(),
					"firstName":$('#profileFirstName').val(),
					"lastName":$('#profileLastName').val(),
					"primaryLanguage":"English"
				}
				$('#profileDOBP').html($('#profileDOBMonth').val() + '-' + $('#profileDOBDay').val() + '-' + $('#profileDOBYear').val());
				$('#profileAge').html(_age);
			}
			return profileUser;
		}
		
		// Build business object for put/post
		$scope.buildBusinessObject = function(_parent) {
			var _parentSplit = _parent.split('-');
			var profileBusiness = {
				"description": $('#businessDesc' + _parentSplit[1]).val(),
				"name": $('#businessName' + _parentSplit[1]).val(),
				"providerType": $('#businessProviderType' + _parentSplit[1]).val()
			}
			return profileBusiness;
		}
		
		// Build contact object for put/post
		$scope.buildContactObject = function(_parent) {
			var _parentSplit = _parent.split('-');
			var profileContact = {
				"primary": false,
				"value": $('#contactName' + _parentSplit[1]).val(),
				"contactType": $('#contactType' + _parentSplit[1]).val()
			}
			return profileContact;
		}
		
		$scope.updateProfileInfo = function(e) {
			var _scope = $scope;
			var _parent = $(e.currentTarget).parent().prop('id');
			if($('#' + _parent).valid()) {
				var _type = $(e.currentTarget).data('type');
				var _user = $('.profileContent').prop('id');
				var _userSplit = _user.split('-');
				var _userId = _userSplit[1];
				var _id = $(e.currentTarget).prop('id');
				var _idSplit = _id.split('-');
				switch(_type) {
					case 'address':
						var _url = baseUrl + _userId + '/addresses/' + _idSplit[1];
						var profileObj = $scope.buildAddressObject(_parent);
					break;
						case 'user':
						var _url = baseUrl + _userId;
						var profileObj = $scope.buildUserObject(_idSplit);
					break;
					case 'business':
						var _url = baseUrl + _userId + '/businesses/' + _idSplit[1];
						var profileObj = $scope.buildBusinessObject(_parent);
					break;
						case 'contact':
						var _url = baseUrl + _userId + '/contactinfos/' + _idSplit[1];
						var profileObj = $scope.buildContactObject(_parent);
					break;
				}
				$.ajax({
					beforeSend: function (xhr){
	        	xhr.setRequestHeader("Accept", "application/json");
	        	xhr.setRequestHeader("Content-Type", "application/json");
	        	xhr.setRequestHeader('token', getCookie("token"));
	        },
				  type: "PUT",
				  contentType: "application/json; charset=UTF-8",
				  dataType: "json",
				  url: _url,
					data: JSON.stringify(profileObj),
				  success: function(d) {
						_scope.syncUserData(_parent, true);
						_scope.toggleUserData(_parent, true, true);
						switch(_type) {
							case 'address':
								$('#profileAddressWrap .profileAdd').prop('disabled',false);
								$('#' + _parent).removeClass('newAddress'); // remove class if new
								userInfo.updateUserInfo('address', profileObj, _id);
							break;
							case 'business':
								$('#profileBusinessWrap .profileAdd').prop('disabled',false);
								$('#' + _parent).removeClass('newBusiness'); // remove class if new
								userInfo.updateUserInfo('business', profileObj, _id);
							break;
							case 'contact':
								$('#profileContactWrap .profileAdd').prop('disabled',true);
								userInfo.updateUserInfo('contact', profileObj, _id);
							break;
							case 'user':
								userInfo.updateUserInfo('user', d.result.users);
							break;
						}
				  },
				  error: function (d) {
						if(d.responseJSON) {
							displayMessage($('.form-profile'),'errorCustom', true, d.responseJSON.messages[0].message);
						} else {
							displayMessage($('.form-profile'), 'error', true);
						}
				  }
				});
			}
		}
		
		// Save new profile address
		$scope.saveProfileInfo = function(e, update) {
			var _scope = $scope;
			var _parent = $(e.currentTarget).parent().prop('id');
			if($('#' + _parent).valid()) {
				var _type = $(e.currentTarget).data('type');
				var _user = $('.profileContent').prop('id');
				var _userSplit = _user.split('-');
				var _userId = _userSplit[1];
				switch(_type) {
					case 'address':
						var _url = baseUrl + _userId + '/addresses';
						var profileObj = $scope.buildAddressObject(_parent, update);
					break;
					case 'business':
						var _url = baseUrl + _userId + '/businesses';
					var profileObj = $scope.buildBusinessObject(_parent, update);
					break;
					case 'contact':
						var _url = baseUrl + _userId + '/contactinfos';
						var profileObj = $scope.buildContactObject(_parent, update);
					break;
				}	
				$.ajax({
					beforeSend: function (xhr){
	        	xhr.setRequestHeader("Accept", "application/json");
	        	xhr.setRequestHeader("Content-Type", "application/json");
	        	xhr.setRequestHeader('token', getCookie("token"));
	        },
				  type: "POST",
				  contentType: "application/json; charset=UTF-8",
				  dataType: "json",
				  url: _url,
					data: JSON.stringify(profileObj),
				  success: function(d) {
						_scope.syncUserData(_parent, true);
						_scope.toggleUserData(_parent, true, true);
						$('#' + _parent).find('.profileSave').hide();
						$('#' + _parent).find('.profileUpdate').show();
						switch(_type) {
							case 'address':
								var _id = d.result.addresses.id;
								profileObj.id = _id;
								$('#profileAddressWrap .profileAdd').prop('disabled',false);
								$('#' + _parent).removeClass('newAddress'); // remove class if new
								userInfo.addUserInfo('address', profileObj);
								$('#' + _parent + ' .profileClose').prop('id', 'profileAddressesClose-' + _id);
								$('#' + _parent + ' .profileUpdate').prop('id', 'profileAddressesSave-' + _id);
							break;
							case 'business':
								var _id = d.result.businesses.id;
								profileObj.id = _id;
								$('#profileBusinessWrap .profileAdd').prop('disabled',false);
								$('#' + _parent).removeClass('newBusiness'); // remove class if new
								userInfo.addUserInfo('business', profileObj);
								$('#' + _parent + ' .profileClose').prop('id', 'profileBusinessesClose-' + _id);
								$('#' + _parent + ' .profileUpdate').prop('id', 'profileBusinessesSave-' + _id);
							break;
							case 'contact':
								var _id = d.result.contactinfos.id;
								profileObj.id = _id;
								$('#profileContactWrap .profileAdd').prop('disabled',false);
								userInfo.addUserInfo('contact', profileObj);
								$('#' + _parent + ' .profileClose').prop('id', 'profileContactinfosClose-' + _id);
								$('#' + _parent + ' .profileUpdate').prop('id', 'profileConcactinfosSave-' + _id);
							break;
						}
				  },
				  error: function (d) {
						if(d.responseJSON) {
							displayMessage($('.form-profile'),'errorCustom', true, d.responseJSON.messages[0].message);
						} else {
							displayMessage($('.form-profile'), 'error', true);
						}
				  }
				});
			}
		}
		
		// Sync edited profile information
		$scope.syncUserData = function(e, save) {
			var _parent = e;
			if(save) { // save success
				$('#' + _parent + ' input').each(function(i) {
					var _val = $(this).val();
					var _id = $(this).prop('id');
					$('#' + _id + 'P').html(_val);
				});
				$('#' + _parent + ' select').each(function(i) {
					var _val = $(this).val();
					var _id = $(this).prop('id');
					$('#' + _id + 'P').html(_val);
				});
			} else { // cancel
				$('#' + _parent + ' p').each(function(i) {
					var _val = $(this).html();
					var _id = $(this).prop('id');
					var _updateId = _id.substring(0, _id.length - 1);
					$('#' + _updateId).val(_val);
				});
			}
		}
		
		// Inline editing, show hide input/p tags
		$scope.toggleUserData = function(e, x, save) {
			if(save) {
				var _parent = e;
			} else {
				var _parent = $(e.currentTarget).parent().prop('id');
			}
			if(x) {
				$('#' + _parent + ' p').show();
				$('#' + _parent + ' input').hide();
				$('#' + _parent + ' select').hide();
				$('#' + _parent + ' .profileUpdate').prop('disabled',true);
				$('#' + _parent + ' .profileCancel').hide();
				$('#' + _parent + ' .profileEdit').show();
			} else {
				$('#' + _parent + ' p').hide();
				$('#' + _parent + ' input').show();
				$('#' + _parent + ' select').show();
				$('#' + _parent + ' .profileUpdate').prop('disabled',false);
				$('#' + _parent + ' .profileCancel').show();
				$('#' + _parent + ' .profileEdit').hide();
			}
		}
		
		$scope.removeUserData = function(_url, _parent, type, id) {
			$.ajax({
				beforeSend: function (xhr){
        	xhr.setRequestHeader("Accept", "application/json");
        	xhr.setRequestHeader("Content-Type", "application/json");
        	xhr.setRequestHeader('token', getCookie("token"));
        },
			  type: 'DELETE',
			  contentType: "application/json; charset=UTF-8",
			  dataType: "json",
			  url: _url,
			  success: function(d) {
					$('#' + _parent).remove();
					userInfo.deleteUserInfo(type, id);
					$('#profile' + type + 'Wrap .profileAdd').prop('disabled',false);
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
		}
		
		$scope.getUserId = function() {
			var _user = $('.profileContent').prop('id');
			var _userSplit = _user.split('-');
			var _userId = _userSplit[1];
			return _userId;
		}
		
		// Remove profile address
		$scope.removeUserDataAddress = function(e) {
			var _userId = $scope.getUserId();
			var _id = $(e.currentTarget).prop('id');
			var _idSplit = _id.split('-');
			var _url = baseUrl + _userId + '/addresses/' + _idSplit[1];
			$scope.removeUserData(_url, $(e.currentTarget).parent().prop('id'), 'address', _idSplit[1]);
		}
		
		// Remove business address
		$scope.removeUserDataBusiness = function(e) {
			var _userId = $scope.getUserId();
			var _id = $(e.currentTarget).prop('id');
			var _idSplit = _id.split('-');
			var _url = baseUrl + _userId + '/businesses/' + _idSplit[1];
			$scope.removeUserData(_url, $(e.currentTarget).parent().prop('id'), 'business', _idSplit[1]);
		}
		
		// Remove profile address
		$scope.removeUserDataContact = function(e) {
			var _userId = $scope.getUserId();
			var _id = $(e.currentTarget).prop('id');
			var _idSplit = _id.split('-');
			var _url = baseUrl + _userId + '/contactinfos/' + _idSplit[1];
			$scope.removeUserData(_url, $(e.currentTarget).parent().prop('id'), 'contact', _idSplit[1]);
		}
		
		// Cancel inline editing
		$scope.cancelUserData = function(e) {
			if($(e.currentTarget).parent().parent().hasClass('newAddress')
			|| $(e.currentTarget).parent().parent().hasClass('newBusiness')
			|| $(e.currentTarget).parent().parent().hasClass('newContact')) {
				$(e.currentTarget).parent().parent().remove();
				var _type = $(e.currentTarget).data('type');
				$('#profile' + _type + 'Wrap .profileAdd').prop('disabled',false);
			} else {
				$scope.toggleUserData(e, true);
				var _parent = $(e.currentTarget).parent().parent().prop('id');
				$scope.syncUserData(_parent, false);
			}
		}
		
		// Inline editing
		$scope.editUserData = function(e) {
			$scope.toggleUserData(e, false);
			return false;
		}

		// Get user data and build page
		$scope.checkUserData = function() {
			var _date = new Date();
			var _currentYear = _date.getUTCFullYear();
			// build year select menu
			for(var i=1900; i<=_currentYear; i++) {
				$('#profileDOBYear').append('<option value="' + i + '">' + i + '</option>');
			}
			var userData = userInfo.getUserInfo();
			if(!userData.isProfileComplete) { // profile incomplete
				$scope.profileCompleteness(userData.profileScore);
			}
			$scope.populateProfile(userData); // populate page based off local storage
		}
		
		// Get dynamic select menu data and save into arrays
		$scope.getSelectData = function() {
			var token = getCookie("token");
			var userProfile = $storage('userProfile').get();
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
			  url: 'http://edafeks.dyndns.biz:9090/api/v1/lookups',
				async: false,
			  success: function(d) {
					var _response = d.result.lookups;
					// update arrays/obj
					selectStates = _response.states;
					selectLanguages = _response.languages;
					selectEthnicities = _response.ethnicities;
					selectAuthorities = _response.authorities;
					selectCities = _response.cities;
					selectBusinessentitytypes = _response.businessentitytypes;
					selectContactTypes = _response.contacttypes;
					selectTimezones = _response.timezones;
					selectCountries = _response.countries;
					selectActivityTypes = _response.activityTypes;
					// get user data and populate profile
					_scope.checkUserData();
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
		}

		// Verify login
		$scope.checkLogin = function() {
			var token = getCookie("token");
			if(!token) {
				$location.path('/login').replace();	
				$scope.$apply();
			} else { // user logged in
				$scope.getSelectData();
			}
		}

		// Verify login
		$scope.checkLogin();

  }])
  .controller('login', [ '$rootScope', '$scope', '$http', '$location', 'userInfo', function($rootScope, $scope, $http, $location, userInfo) {
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
		
		// Get user data
		$scope.getUserData = function() {
			userInfo.getUserInfo();
			$location.path('/dashboard').replace();
			$scope.$apply();
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
					$scope.getUserData();
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
				$scope.getUserData();
				$location.path('/dashboard').replace();	
				$scope.$apply();
			} else {
				// Setup jquery validate
				bindLoginValidation();
			}
		}

		// Verify login
		$scope.checkLogin();

  }])
	.controller('patients', [ '$rootScope', '$scope', '$http', '$location', '$timeout', '$compile', 'lightbox', function( $rootScope, $scope, $http, $location, $timeout, $compile, lightbox) {
		
		$scope.showPatientDetail = function(e) {
			$('.patientDetail').hide(); // hide any, if open
			$('.patientDetailBasic').removeClass('pageTableActive');
			$(e.currentTarget).addClass('pageTableActive');
			console.log(e);
			var _patient = $(e.currentTarget).data('patient');
			$('#patient-' + _patient).slideDown(250);
			console.log(_patient);
		}
		
		$scope.addNewPatient = function() {
			// Display lightbox to add patient
			lightbox.showLightbox('patient');
		}
		
		$scope.editPatientDetail = function(e) {
			console.log('edit patient detail');
			var _patient = $(e.currentTarget).data('patient');
			console.log(_patient);
			// reference local storage for patient data
			var _patientData = 'test';
			// Display lightbox to edit patient data
			lightbox.showLightbox('patient', _patientData);
		}
		
		toggleNavFooter(false, true, false);
		
		// Verify login
		$scope.checkLogin = function() {
			var token = getCookie("token");
			if(!token) {
				$location.path('/login').replace();	
				$scope.$apply();
			} else { // user logged in
				$('#contentLoader').hide();
				$('.form-patients').show();
			}
		}

		// Verify login
		$scope.checkLogin();

	}])
	.controller('reset', [ '$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {
		
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
		
  }]);