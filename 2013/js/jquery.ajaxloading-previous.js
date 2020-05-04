
						
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
			initialLoad = true,
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
		document.title = 'Ego Studios' + ' - ' + ( hash.replace( /[_\-\#\!\.\/]/g, ' ' )
												  .replace( 'html', ' ' )
												  .replace( folderName, ' ' ));
	
		//Remove class from current project
		thumbContainer.find('div.folio-thumb-container.currentProject').children().removeClass('active');
		thumbContainer.find('div.folio-thumb-container.currentProject').removeClass( 'currentProject' )
		
		 
		
		//Three scenarios
		//Browsing from project to project - load requested
		if(initialLoad == false && hash.substr(0,rootLength) == root){


			$('html,body').stop().animate({scrollTop: $('#ajaxwrapper').offset().top-100},300,'easeInOutQuint', function(){ 
					
									
					contentContainer.slideUp('slow',function(){
				
						$(this).empty(); //clear previous content		
						loadContent();	 //load the requested
								
					 });
					
					contentNavigation.fadeOut('fast');
					exitProject.fadeOut('fast');
					
			});
			
		
		//Project url entered in address bar - load requested
		}else if(initialLoad == true && hash.substr(0,rootLength) ==  root){
			
			
				$('html,body').stop().animate({scrollTop: $('#ajaxwrapper').offset().top+350},400,'easeInOutQuint', function(){
																											  
					
					loadContent();										
					
																														  
				});
			
	
		//Going back to initial using browser back button - remove all projects.	
		}else if(hash=='' && initialLoad == false || hash.substr(0,rootLength) != root && initialLoad == false){
	
	
				$('html,body').stop().animate({scrollTop: scrollPostition},1000,function(){
																		   
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
								
								hideLoader();
								ajaxLoading = false;
								
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
			$('div#loader' ).fadeOut(showContent);
			 
		}	
		
		/*show content
		---------------------------------*/
		
		function showContent(){
			
			page =  $('div#ajaxpage')
			
			
			//init the necessary slider 
			if(page.hasClass('flex')) $('.flexslider').flexslider({
						
						animation: "face",
						slideDirection: "horizontal",
						slideshow: true,
						slideshowSpeed: 3500,
						animationDuration: 500,
						directionNav: true,
						controlNav: true 
				
			});
			
			
			contentContainer.slideDown('normal', function(){
			
				scrollPostition = $('html,body').scrollTop();
			
				contentNavigation.fadeIn('fast');
				exitProject.fadeIn();
						    
		   });
			

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
	
			
			contentContainer.slideUp('slow', function(){
							
					//remove page - switch to detach(), 
					//if data is to be kept
					$(this).empty();
					
														 
			});
		
	
			contentNavigation.fadeOut();
			exitProject.fadeOut();

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
		 $('#closeProject a, #closeProjectMobile a').on('click',function (event) {

			
			history.pushState('', document.title, window.location.pathname); // remove #name
			
			unloadContent(); //remove content
			
			thumbContainer.find('div.folio-thumb-container.currentProject').children().removeClass('active');

			event.preventDefault(); // prevent page jump

		
		});
		 

	  
		 // Since the event is only triggered when the hash changes, we need to trigger
		 // the event now, to handle the hash the page may have loaded with.
		 $(window).trigger( 'hashchange' );
		 
		 initialLoad = false;
	  
});
