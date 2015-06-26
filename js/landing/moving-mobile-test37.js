var App = function(){
	return (function($){
		//Globals
		var	sectionNum = 0,
			$button = $("#callme"), //disable when pushed to production
			slides = document.getElementsByTagName('section'),
			$zip = $(".zipfinder"),
			curr = '#' + slides[sectionNum].id;

		//All the functionality including validations for step 1
		var stepOne = function(){
			var $form = $("#form-1");
			
			$zip.submit(function(e){
				e.preventDefault();
			});

			helpers.sanitize();
			helpers.burger();
			helpers.moveSizePicker(); 
			helpers.moveDatePicker();

			//Validate the form
			$('#form-1').validate({
				rules: {
					zip_from: {
						required: true,
						digits: true,
						minlength: 5,
						maxlength: 5,
						remote: {
							type: 'post',
							url: '/validate/validate/from-zipcode'
						}
					},
					zip_to: {
						required: true,
						digits: true,
						minlength: 5,
						maxlength: 5,
						remote: {
							type: 'post',
							url: '/validate/validate/to-zipcode'
						}
					},
					number_of_rooms: {
						required: true,
						remote: {
							type: 'post',
							url: '/validate/validate/rooms'
						}
					},
					move_date: {
						required: true,
						date: true,
						remote: {
							type: 'post',
							url: '/validate/validate/movedate'
						}
					}
				},
				messages: {
				},
				ignore:"",
				errorElement: 'div',
				wrapper: 'div',
				errorPlacement: function(error,element){
				},
				invalidHandler:function(event, validator){
					helpers.scrollPage(80,200);
				},
				focusInvalid:true,
				submitHandler: function(){
					//Turn into a helper func
					try{
						_gaq.push(['_trackEvent', 'mobile', '999moving', 'step1-test37']);
					}catch(e){}

					helpers.changeDiv();
				}
			});
		};

		var loader = function(){
			var date = new Date();
			$("#slide-2 .loader").attr('src', 'img/new_bvl_loader-o.gif?'+date+'');
			
			var loaderPercent = 0;

			countNumber();

			function countNumber(){
				var speed1 = 55;
				var speed2 = 68;
				
				count();
			
				function count(){
					setTimeout(function(){
						loaderPercent++;
						$("#slide-2 .counter").html(loaderPercent + "%");
						if ( loaderPercent < 50){
							count();							
						} else if (loaderPercent >= 50 && loaderPercent < 100){
							speed1 = speed2;
							count();
							$("#slide-2 #message").text("Searching For Movers ...");
						} else if (loaderPercent >= 100){
							$("#slide-2 #message").text("Matching Movers Were Found!");
							helpers.changeDiv();
						}
					}, speed1);
				}	
			}
		};

		//All the functionality including validations for step 2
		var stepTwo = function(){
			$('#second_step').validate(
			{
				rules: {
					first_name: {
						required: true,
						lettersspaces: true,
						minlength: 2,
						remote: {
							type: 'post',
							url: '/validate/validate/firstname'
						}
					},
					last_name: {
						required: true,
						lettersspaces: true,
						minlength: 2,
						remote: {
							type: 'post',
							url: '/validate/validate/lastname'
						}
					},
					email_address: {
						required: true,
						email: true,
						remote: {
							type: 'post',
							url: '/validate/validate/email'
						}
					},
					phone_number: {
						required: true,
						phoneUS: true,
						remote: {
							type: 'post',
							url: '/validate/validate/phone'
						}
					}
				},
				messages: {
				},
				focusInvalid:true,
				errorElement: 'div',
				wrapper: 'div',
				errorPlacement: function(error,element){
				},
				invalidHandler: function(event, validator){				
				},
				submitHandler: function(){
					helpers.queue_submission();				
				}
			});
		};

		var helpers = {
			animateDots:function(){
				var $dots = $(".quote-dots");
				var numOfDots = 1;
				
				animateThis();
				
				function animateThis(){
					switch(numOfDots){
						case 1:
							numOfDots++;
							$dots.text("..");
							setTimeout(function(){
								animateThis();
							},500);
						break;
						case 2:
							numOfDots++;
							$dots.text("...");
							setTimeout(function(){
								animateThis();
							},500);
						break;
						case 3:
							numOfDots =1;
							$dots.text(".");
							setTimeout(function(){
								animateThis();
							},500);
						break;
					}
				}
			},
			browserChecks:function(){
				var Browser = {
				  Version: function() {
					var version = 999; // we assume a sane browser , but why?!?!
					if (navigator.appVersion.indexOf("MSIE") != -1)
					  // bah, IE again, lets downgrade version number
					  version = parseFloat(navigator.appVersion.split("MSIE")[1]);
					return version;
				  }
				}

				if (Browser.Version() < 10) {
					$('input[placeholder], textarea[placeholder]').placeholder();
				}

				var is_firefox_3 = navigator.userAgent.toLowerCase().indexOf('firefox/3.');
				var is_firefox_2 = navigator.userAgent.toLowerCase().indexOf('firefox/2.');
				var is_firefox_1 = navigator.userAgent.toLowerCase().indexOf('firefox/1.');

				if (is_firefox_3 != -1){
					$('input[placeholder], textarea[placeholder]').placeholder();
				} else if (is_firefox_2 != -1){
					$('input[placeholder], textarea[placeholder]').placeholder();
				} else if (is_firefox_1 != -1){
					$('input[placeholder], textarea[placeholder]').placeholder();
				}
				//Add phone numbers to Samsung browsers
				var isSamsung = navigator.userAgent.toLowerCase().indexOf("samsung");
				if (isSamsung == -1){
					$('input[name="phone_number"]').mask("(999) 999 - 9999",{placeholder:""});
				} else {
					$("input[name='phone_number']").attr("maxlength","10");
					//so samsung needs to use maxlength instead of placeholder
				}
				try{
					var pathname = window.location.pathname;
					_gaq.push(['_trackEvent', 'mobile', pathname, 'start-test37']);
				}catch(e){
					//console.log(e);
				}
			},
			burger:function(){
				var $burger = $("#burger");
				$burger.click(function(){
					$(".shelf").slideToggle();
				});
			},
			changeDiv:function(){
				sectionNum++;		
				if(sectionNum < slides.length){
					curr = '#' + slides[sectionNum].id;
					$(slides).hide();
					$(curr).fadeIn(1000);
					if(curr==="#slide-2"){
						loader();
					}

				} else {
					sectionNum = 0;
					curr = '#' + slides[sectionNum].id;
					$(slides).hide();
					$(curr).fadeIn(1000);
				}
			},
			conversion:function(google_conversion_id,google_conversion_label){
				try{
				_gaq.push(['_trackEvent', 'mobile', '999moving', 'step2-test37']);
				setTimeout(
					function(){
						_gaq.push(['_trackEvent', 'Conversion', 'Landing-test37-mobile', 'Validate']);
					}, 100
				);
				__adroll.record_user({"adroll_segments": "quote_complete"});
				}catch(e){
					//console.log(e);
				}
				//google conversion script
				var image = new Image(1,1); 
				image.src = "http://www.googleadservices.com/pagead/conversion/"+google_conversion_id+"/?label="+google_conversion_label + "&script=0";
			},
			moveDatePicker:function(){
				return (function(){
					var iphone6 = navigator.userAgent.toLowerCase().indexOf('os 8_') ;
					var isIphone6 = false;
					if (iphone6 != -1) {
						isIphone6 = true;	
					}

					var picker = new Pikaday({
						field:document.getElementById("move_date"),
						format:"MM/DD/YYYY",
						bound:true,
						defaultDate: new Date(moment().add(14,"days").calendar()),
						container: document.getElementById("calendar-holder"),
						minDate:moment().toDate(),
						maxDate:new Date(moment().add(90,"days").calendar()),
						onOpen:function(){
							$(".calendar-holder-wrap").show();
						},
						onClose:function(){
							$(".calendar-holder-wrap").hide();
						}
					});
				
				})();
			},
			moveSizePicker:function(){
				return (function(){
					//allows us to get correct context of this, instead of default window
					var $this = $(".move-size-picker");
					var $field = $("#number_of_rooms");

					//Open the window
					$field.on("touchstart taphold", function(event){
						$this.show();
						$field.blur();
						$("body,html").scrollTop(0);
					});

					//Get Text
					$this.on("taphold touchstart", ".one-option-wrap", function(event){
						//alert(event.type);
						var $thisEle = $(this);
						var text = $thisEle.find(".text").text();		
						$thisEle.addClass("selected");
						$field.val(text).removeClass("error");
						setTimeout(function(){
							$thisEle.removeClass("selected");
							$this.hide();
						},100);
					});
					
					//Close the Window
					$this.on("click taphold", ".close-btn, .background", function(){
						$this.hide();
					});
				
				}());
			},
			queueSubmission: function(){
				$.post('/validate/validate/send', { source: $('#source').val() }, function(data){
				 	$('#full_name').html($('#first_name').val() + ' ' + $('#last_name').val());

					$.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAOAFjKE8xQUWxlVds1COiroKVmYjH8SoM&sensor=true&callback=calculateDistances', function(data){
						console.log(data);
					});
					this.animateDots();
					this.conversion(1070276245,"Ls4OCOWhRhCVvaz-Aw");
					this.changeDiv();
				});	
			},
			sanitize: function(){
				$('#zip_from, #zip_to').on('change keyup', function() {
					var sanitized = $(this).val().replace(/[^0-9]/g, ''); 
					$(this).val(sanitized);
				});
			},
			scrollDiv:function(){
				$(curr).show();
				$button.click(this.changeDiv);
			},
			scrollPage:function(height, duration){
				$("html,body").stop().animate({
					scrollTop: height+"px"
				},duration);
			},
			tracking:function(){
				var pathname = window.location.pathname;
				$.post('/validate/stats/track',
					{
						'name':name,
						'page':pathname,
						'event':event
					}
				);
			},
			zipFinder:function(){
				return (function(){
					//var $this = $(".zipfinder");
					var $fromField = $("#zip_from");
					var $toField = $("#zip_to");
					// btn are .zipfinder
					// var $fromBtn = $("#from-ziphelp-link input");
					// var $toBtn = $("#to-ziphelp-link input");
					
					var $statePage = $("#zipfinder .zf-state");
					var $cityPage = $("#zipfinder .zf-city");
					
					var $loader = $(".zf-loader");  
					
					var isClickable = true;
					var isScrolling = false;
					
					var $cityHolder = $this.find(".zf-city-holder"); 
					
					var iphone6 = navigator.userAgent.toLowerCase().indexOf('os 8_') ;
					var isIphone6 = false;
					
					var $tappedEle;
					
					if (iphone6 != -1) {
						isIphone6 = true;	
					}
					
					initiate();
					
					function initiate(){
						$fromBtn.on("click taphold", function(){
							//change the page using jQuery mobile
							$.mobile.changePage('#zipfinder');
							reset();
							$fromField.addClass("active");
							$toField.removeClass("active");
							
							if (isIphone6){
								setTimeout(function(){
									$(this).blur();
								},5);
							}
						});
						
						$toBtn.on("click taphold", function(){
							$.mobile.changePage("#zipfinder");
							reset();
							$toField.addClass("active");
							$fromField.removeClass("active");
							if (isIphone6){
								setTimeout(function(){
									$(this).blur();
								},5);
							}
						});
						
						$statePage.on("tap", ".state", function(){
							if (isClickable){
								if (isScrolling == false){
									var statename = $(this).data("state");
									var statefullname = $(this).data("abbr");
									
									$this.find(".zf-city-statename").text("( " + statefullname + ")");
									
									isClickable = false;
									$loader.show();
									
									getCity(statename);
									$(this).addClass("tapped");
									$tappedEle = $(this);
				
								} else{
									$(".zf-state-holder").mCustomScrollbar("stop");
									isScrolling = false;
								}
							}
						});
						
						$cityPage.on("click", ".city", function(){

							if (isClickable){
								if (isScrolling == false){
									var zipcode = $(this).data("zipcode");
									$(".m-input.active").val(zipcode).removeClass("error");
									
									$.mobile.changePage("#pageone");
									$(this).addClass("tapped");
									$tappedEle.removeClass("tapped");
									
								}	else {
									$(".zf-city-holder").mCustomScrollbar("stop");
									isScrolling = false;
								}	
							}
						});
						
						$this.find(".zf-close").on("click", function(){
							$.mobile.changePage("#pageone",{transition:"fade"});
							$tappedEle.removeClass("tapped");
						});
						
						$this.find(".zf-go-back").on("click", function(){
							transition("right");
							$this.find(".scrollToSelected").removeClass("selected").first().addClass("selected");
							$tappedEle.removeClass("tapped");
						});
						
						
						
						$this.find(".zf-state-holder").mCustomScrollbar({
							theme:"dark",
							callbacks:{
								onScrollStart:function(){ 
									isScrolling = true;
								},
								onScroll:function(){ 		
									isScrolling = false;						
								},
								whileScrolling:function(){
									isScrolling = true;
								},
								
							}
						});
						
						$this.find(".zf-city-holder").mCustomScrollbar({
							theme:"dark",
							callbacks:{
								onScrollStart:function(){ 
									isScrolling = true;
								},
								onScroll:function(){ 		
									isScrolling = false;
									
								},
								whileScrolling:function(){
									isScrolling = true;

								},
								
							}
						});
						
						$this.find(".zf-alphabet").on("click", ".scrollToSelected", function(){
							$this.find(".scrollToSelected").removeClass("selected");
							$(this).addClass("selected");
							
							var index = $(this).find("strong").text();
							
							var $thisCity = $(".city[data-index='" +index+ "']").first();
							$(".zf-city-finder").mCustomScrollbar("scrollTo",$thisCity);
						});
					
					};
					
					
					function getCity(statename){
						$.post(
							"validate/city-state/zipcode-by-city-state",
							{
								state:statename,
							},
							function(data){
								info = $.parseJSON(data);
								$cityHolder.find("#mCSB_2_container").empty();
								function capitaliseFirstLetter(str){
									return str.charAt(0).toUpperCase() + str.slice(1);
								};
								$.each(info, function(index, value){
									var x = value.city_name.charAt(0);
									
									var temp ="<div class='city'  data-zipcode= "+ value.zipcode+" data-index=" +x+ ">" +capitaliseFirstLetter(value.city_name.toLowerCase())+"</div>";
									 $cityHolder.find("#mCSB_2_container").append(temp);
									 
								});
							}
						).done(function(){
							transition("left");
							isClickable = true;
							$loader.hide();
						}).fail(function(){
							isClickable = true;
							$loader.hide();
						});
					}
					
					function transition(dir){
						if (dir == "left"){
							$statePage.hide();
							$cityPage.show();
						}
						
						if (dir == "right") {
							$statePage.show();
							$cityPage.hide();
						}
					};
					
					function reset(){
						$statePage.show();
						$cityPage.hide();
						$loader.hide();
						$this.find(".scrollToSelected").removeClass("selected").first().addClass("selected");	
					};	
				})();
			}
		};

		//Our main function 
		var init = function(){
			helpers.browserChecks();
			helpers.scrollDiv();
			stepOne();
			//$(".calendar-holder-wrap").hide();
		};

		init();

		return helpers;	//don't return if you don't want to test

	}(jQuery));
};

var app = new App();

//Google Maps Callback
var calculateDistance = function(){
	var start = '90036';
	var end = '90210';
	if($('#zip_from').val() != ''){
		start = $('#zip_from').val();
	}
	if($('#zip_to').val() != ''){
		end = $('#zip_to').val();
	}
	var service = new google.maps.DistanceMatrixService();
	service.getDistanceMatrix(
	  {
		origins: [start],
		destinations: [end],
		travelMode: google.maps.TravelMode.DRIVING,
		unitSystem: google.maps.UnitSystem.IMPERIAL,
		avoidHighways: false,
		avoidTolls: false
	  }, callback);
	function callback(response, status) {
		if (status != google.maps.DistanceMatrixStatus.OK) {
		  //alert('Error was: ' + status);
		  alert('Error: Please try again at a later time.');
		} else {
		  var origins = response.originAddresses;
	      var destinations = response.destinationAddresses;
		  var test = '';
		  var str1 = origins.toString();
		  var str2 = destinations.toString();
		  if( str1.match(/\bUSA\b/) && str2.match(/\bUSA\b/)){
			try{
			  for (var i = 0; i < origins.length; i++) {
				var results = response.rows[i].elements;
				for (var j = 0; j < results.length; j++) {
				   test += results[j].distance.text;
				}
			  }

			//console.log($('#number_of_rooms').val());
			var roomTable =  {	'Studio' : 'studio',	
								'1 bedroom' : 'one bedrooms house',
								'2 bedrooms' : 'two bedrooms house',
								'3 bedrooms' : 'three bedrooms house',
								'4 bedrooms' : 'four bedrooms house',
								'5 bedrooms' : 'five bedrooms house',
								'Commercial Move' : 'six bedrooms and more house'
							};
				var rooms = roomTable[$('#number_of_rooms').val()];
				//console.log(rooms);
			  
				$.post(
					'/validate/calculator/calc',
					{
						rooms: rooms,
						miles: test
					},
					function(data){
						//console.log(data);
						var d = $.parseJSON(data);
						//console.log();
						setTimeout(
							function(){
								$('#range').html('$' + d.min + ' to $' + d.max);
								$('#range-loader').hide();
								$('#quote-range').fadeIn();
							}
						, 5000);
					}
				);	  
				}catch(e){
					setTimeout(
						function(){
							$('#quote-range').html('Unable to calculate price range, one or more of your locations may not be accessible by moving trucks');
							$('#range-loader').hide();
							$('#quote-range').fadeIn();
						}
					, 5000);
				}
			}
		  else {
			setTimeout(function(){
					$('#quote-range').html('Unable to calculate, Locations may not be in the USA');
					$('#range-loader').hide();
					$('#quote-range').fadeIn();
				}, 3000);
		  }
		}
	}
};