// Queries: nicholas.bergquist@informa.com


// main control block, on DOM-ready..
$(function () {

	// add the Informa top ribbon behaviour
	if ($('#iribbon-container').length){
		showHideInformaTopRibbon();
	}

});



// METHODS

// Informa top ribbon show/hide behaviour
var showHideInformaTopRibbon = function(){
	
	// cache the DOM elements
	var $this = $('#iribbon-container');
	var $that = $('#iribbon-detail');
	
	// hide the ribbon and set the tabindex so that hidden links can't receive focus until visible
	//$that.addClass('ribbon-hide').find('a').attr('tabindex', -1);

	// add the control button
	$this.prepend('<button id="iribbon-title" title="show/hide">Informa</button>');
	var $ribbonButton = $this.find('#iribbon-title');
	
	$ribbonButton.on('click', function(){
		if ($that.hasClass('ribbon-hide')){
		    // open it
		    $that.removeClass('ribbon-hide').addClass('ribbon-show').find('a').attr('tabindex', 0);
		    
		    // if user tabs out of the last of the ribbon links then hide the ribbon
		    $that.find('a').last().keydown(function(e){ 
			    // if 'Shift + Tab' pressed = tabbing backwards
			    if (e.shiftKey && e.keyCode == 9) { 
				    return;
			    } else if (e.keyCode == 9) { // if 'Tab' only pressed = tabbing forwards
				    $that.removeClass('ribbon-show').addClass('ribbon-hide').find('a').attr('tabindex', -1);
		            $(this).removeClass('active');
			    }
		    });
		    
		    // if user shift-tabs back out of the ribbon controls then hide the ribbon
		    $ribbonButton.keydown(function(e){
		        // if 'Shift + Tab' pressed = tabbing backwards
			    if (e.shiftKey && e.keyCode == 9) { 
			        $that.removeClass('ribbon-show').addClass('ribbon-hide').find('a').attr('tabindex', -1);
		            $(this).removeClass('active');
			    }
		    });
		    
		    // toggle button image position
		    $(this).addClass('active');
		} else {
		    // shut it
		    $that.removeClass('ribbon-show').addClass('ribbon-hide').find('a').attr('tabindex', -1);
		    
		    // toggle button image position
		    $(this).removeClass('active');
		}
	});
}

