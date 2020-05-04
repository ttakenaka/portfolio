$(function(){
  
 
	  var   current,
	  	    next, 
	    	prev,
	   	    target, 
			hash,
			url,
			page,
			title,
			errorMessage = '<p>Sorry, an error occurred <br/> Check the path of the page you are loading or your connection</p>',
			projectIndex,
			projectLength,
			ajaxLoading = false,
			contentH,
			initialLoad = true,
			contentState =false,
			thumbContainer = $('div#folio-grid'),
			contentContainer = $('div#ajax-content-inner'),
			contentNavigation = $('#folio-navigation ul'),
			exitProject = $('div#closeProject a'),
			easeing = 'easeInOutQuint',
			folderName ='folio',
			scrollPostition;
		
		
	  // Bind an event to window.onhashchange 
	  $(window).bind( 'hashchange', function() {


		//Project path
		var root = '#!'+ folderName +'/';
		var rootLength = root.length;


		//Get fragment
		hash = $(window.location).attr('hash'); 
		

		//Strip #! and get it as a string - what we'll use for loading
	    url = hash.replace(/[#\!]/g, '' ); 
		

		//Set doc title - strip symbols & some words
		document.title = 'Tetsu Takenaka Portfolio' + ( hash.replace( /[_\-\#\!\.\/]/g, ' ' )
												  .replace( 'html', ' ' )
												  .replace( folderName, ' ' ));
	
		//Remove class from current project
		thumbContainer.find('div.folio-thumb-container.currentProject').children().removeClass('active');
		thumbContainer.find('div.folio-thumb-container.currentProject').removeClass('currentProject' );
		
		//get menu height
		var correction = 50;
		if(isMobile==true) correction = 100;
		var headerH = $('.header').outerHeight()+correction;
		 
		
		//Three scenarios
		//Project url entered in address bar - position and load
		if(initialLoad == true && hash.substr(0,rootLength) ==  root){

	

				$('html,body').stop().animate({scrollTop: (contentContainer.offset().top+600)+'px'},800,'easeInOutQuint', function(){
		
						
					loadContent();
					
																									  
				});
				
		//Browsing from project to project - fade project out- delete it
		}else if(initialLoad == false && hash.substr(0,rootLength) == root){


				
					$('html,body').stop().animate({scrollTop: (contentContainer.offset().top-headerH)+'px'},800,'easeInOutQuint', function(){ 
		
		
					if(contentState == false){
						
							
							loadContent();
							
					}else{
		
		
							contentContainer.animate({opacity:0,height:contentH},function(){
									
								if(contentNavigation.is(':visible')) {
								
									contentNavigation.fadeOut('fast');
									exitProject.fadeOut('fast');	
								
								}	
									
								loadContent();	 //load the requested
								

							 });
					}
							
							
					});
			
		//Going back to initial using browser back button - remove all projects.	
		}else if(hash=='' && initialLoad == false || hash.substr(0,rootLength) != root && initialLoad == false){
	
	
				$('html,body').stop().animate({scrollTop: scrollPostition+'px'},1000,function(){
							
							
							unloadContent();	
							
							
				});
				

		}
		
		
		//Select current link
		 thumbContainer.find('div.folio-thumb-container .folio-thumb a[href="#!' + url + '"]' ).parent().parent().addClass( 'currentProject' );
		 thumbContainer.find('div.folio-thumb-container.currentProject').find('.folio-thumb').addClass('active');
	

		
	});
	  
	  
	  	/*load content
		---------------------------------*/
		
		function loadContent(){
			

		    //Show "loader" content while AJAX content loads.
			$('div#loader' ).fadeIn('fast').removeClass('errorMessage').html('');
			
			
			if(!ajaxLoading) {
				
	            ajaxLoading = true;
				
				//Load the requested page- get section & load status 
				contentContainer.load( url +' div#ajaxpage', function(xhr, statusText, request){
																   
						if(statusText == "success"){
								
								
								ajaxLoading = false;
								
									page =  $('div#ajaxpage')
			
			
									//init the necessary slider or other
									$('.flexslider').flexslider({
												
												animation: "face",
												slideDirection: "horizontal",
												slideshow: true,
												slideshowSpeed: 3500,
												animationDuration: 500,
												directionNav: true,
												controlNav: true
												
										});
			
														  
										//get container height
										contentH = contentContainer.children('div#ajaxpage').height()+'px';
										hideLoader();
											
								
						}
						
						if(statusText == "error"){
						
								$('div#loader').addClass('errorMessage').append(errorMessage);
								
								$('div#loader').find('p').slideDown();
								
								//alert("An error occurred: " + request.status + " - " + request.statusText);
						}
					 
					});
				
			}
			
		}
		
		/* hide loader
		---------------------------------*/
		
		function hideLoader(){
		
			//Hide loader
			$('div#loader' ).fadeOut('fast', function(){
													  
					showContent();
					
			});
			 
		}	
		
		/*show content
		---------------------------------*/
		
		function showContent(){


			if(contentState==false){

					contentContainer.animate({opacity:1,height:contentH},800, function(){
				
						scrollPostition = $('html,body').scrollTop();
						contentNavigation.fadeIn('fast');
						exitProject.fadeIn();
						contentState = true	
								
					});
					
			}else{

					contentContainer.animate({opacity:1,height:contentH}, function(){																		  
				
						scrollPostition = $('html,body').scrollTop();
						contentNavigation.fadeIn('fast');
						exitProject.fadeIn();
						
					});
					
			}
					
			
			projectIndex = 	thumbContainer.find('div.folio-thumb-container.currentProject').index();
			projectLength = $('div.folio-thumb-container .folio-thumb').length-1;
			
			
			if(projectIndex == projectLength){
				
				$('ul li#nextProject a').addClass('disabled');
				$('ul li#prevProject a').removeClass('disabled');
				
			}else if(projectIndex == 0){
				
				$('ul li#prevProject a').addClass('disabled');
				$('ul li#nextProject a').removeClass('disabled');
				
			}else{
				
				$('ul li#nextProject a,ul li#prevProject a ').removeClass('disabled');
				
			}

		
	  }
	  
	  
	  /*remove content
	  ---------------------------------*/
	  
	  function unloadContent(){
	
			
			contentContainer.animate({opacity:0,height:'0px'}, function (){
							
					//remove page - switch to detach(), 
					//if data is to be kept
					$(this).empty();
					contentState = false	
					
														 
			});
		
	
			if(contentNavigation.is(':visible')) {
								
				contentNavigation.fadeOut('fast');
				exitProject.fadeOut('fast');	
								
			}	
	

	  }
	  
	  
	   /*next project link
	  ---------------------------------*/
	  
	  //navigate to next project in line
	  $('#nextProject a').on('click',function () {
											   							   
					 
		    current = thumbContainer.find('.folio-thumb-container.currentProject');
		    next = current.next('.folio-thumb-container');
		    target = $(next).children('div').children('a').attr('href');
			$(this).attr('href', target);
			
		
		  if (next.length === 0) { 
		  
		  		//reached limit
			   return false;
			  
		   } 
		   
		   current.removeClass('currentProject'); 
		   current.children().removeClass('active');
		   next.addClass('currentProject');
		   next.children().addClass('active');
		   
		  
		   
		});
	  
	   /*prev project link
	   ---------------------------------*/
	  
	    //navigate to prev project in line
	    $('#prevProject a').on('click',function () {
			
			
		    current = thumbContainer.find('.folio-thumb-container.currentProject');
		    prev = current.prev('.folio-thumb-container');
			target = $(prev).children('div').children('a').attr('href');
			$(this).attr('href', target);
			
		   
		   if (prev.length === 0) { 

			  //reached limit
			  return false;
			
		   }
		   
		   current.removeClass('currentProject');  
		   current.children().removeClass('active');
		   prev.addClass('currentProject');
		   prev.children().addClass('active');
		   
		});
		
		
		/*close project
	    ---------------------------------*/

	  	//remove project and return to grid
		 $('#closeProject a, #closeProjectMobile a').on('click',function () {

			
			//history.pushState('', document.title, window.location.pathname); // remove #name
			//window.location.hash ='#folio'
			
			unloadContent(); //remove content
			
			thumbContainer.find('div.folio-thumb-container.currentProject').children().removeClass('active');
			
			$('div#loader' ).fadeOut();

			return false;
			
		});
		 

	  
		 // Since the event is only triggered when the hash changes, we need to trigger
		 // the event now, to handle the hash the page may have loaded with.
		 $(window).trigger( 'hashchange' );
		 
		 //Make content reposition if browser is resized
		 $(window).bind('resize',function(){
						
			$(contentContainer).css({height:'auto'});	
										 
		});
		 
		 initialLoad = false;
	  
});
