/* jshint browser: true, devel: true */
/* global $, g, f, _, $productTabs, $panelShown:true */ 



// ============================
// PRODUCT PANEL SCROLL HANDLER
// ============================

var currentScrollY;

f.scrollTitles = function() {	
	
	var previousScrollY,
		nextPosTop;
	
	setTimeout(function(){
		if (window.innerWidth >= 1024) {
//			console.log('SCROLL!');
			previousScrollY = currentScrollY;
			currentScrollY = g.$titlesScroller.scrollTop();
		//	console.log(currentScrollY, previousScrollY);

			// SCROLL DOWN	
			if (currentScrollY > previousScrollY){
				g.$nextToShow = g.$titlesPanelShown.next();
				if (g.$nextToShow.length > 0) {
					nextPosTop = g.$nextToShow.position().top;
					if (nextPosTop <= 100) {
// 						console.log('CHANGE DOWN');
						g.$titlesPanelShown.removeClass('shown');
						g.$titlesPanelShown = g.$titlesPanelShown.next();
						g.$titlesPanelShown.addClass('shown');
						f.updateProductTabs();
					}
				}
			}  

			// SCROLL UP	
			if (currentScrollY < previousScrollY) {
				g.$nextToShow = g.$titlesPanelShown.prev();
				if (g.$nextToShow.length > 0) {
					nextPosTop = g.$nextToShow.position().top;
					if (nextPosTop >= -20) {
// 						console.log('CHANGE UP');
						g.$titlesPanelShown.removeClass('shown');
						g.$titlesPanelShown = g.$titlesPanelShown.prev();
						g.$titlesPanelShown.addClass('shown');
						f.updateProductTabs();
					}
				}
			}
			g.$prevTitlesPanel = g.$titlesPanelShown;
		}
	}, 50);
};



// =========================
// UPDATE TABS DURING SCROLL
// =========================

f.updateProductTabs = function(){
// 	console.log('updateProductTabs');

	g.$titlesTABS.each(function(){
		$(this).removeClass('active').removeClass('clicked');
	});
	var panelName = g.$titlesPanelShown.attr('id');
	var $tabToClick = g.$titlesScroller.siblings('.TAB#' + panelName);
	$tabToClick.addClass('active clicked');
};



//	TRYING TO GET scrollerAddOrRemove WORK WITH THROTTLE!

//	g.$titlesScroller.on('scroll', scrollTest);
//	g.$titlesScroller.on('scroll', _.throttle(f.scrollTest, 200, { trailing: false, leading: true }));
//	productsScrolling =  true;