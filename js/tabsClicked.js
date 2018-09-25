/* jshint browser: true, devel: true */
/* global $, f, g, g.$titlesScroller, $panelShown:true, tabArray, panelArray, g.$searchPanel, $panelToShow */


g.$prevTitlesPanel = undefined;


// ===============================================
//  GENERAL: TAB CLICK HANDLER
// ===============================================

f.tabClicked = function(elem) {
	
	var $this = $(elem);
	var uniqueName = $this.attr('id');
	var $panelToShow = $this.siblings('.PANEL#' + uniqueName);
	
// 	console.log('tabClicked', uniqueName, $panelToShow);
	
	
	// COOKIE CRUMB
	if ($this.parent().hasClass('COOKIE')) {
		f.cookieClicked($this);
		return;
	}
		
 		
	// BROWSE TAB
	if ($this.closest('.level0').is('#BROWSE')) {
		f.browseClicked($this,$panelToShow,g.$prevPanel);
		return;
	} 
	
	
	// TITLES TAB
	if ($this.parent().is('#TITLES') || $this.parent().hasClass('SCROLLER')) {
		titlesTabClicked($this);
		return;
	}
	
	
	// Generic classes for styles
	$this.addClass('clicked');
	$this.siblings('.TAB').removeClass('clicked');
	$panelToShow.addClass('shown');
	$panelToShow.siblings('.PANEL').removeClass('shown');


	// SEARCH RESULTS TAB
	if ($this.parent().hasClass('searchResultsTAB')) {
		$panelToShow = g.$searchResultsPANEL.children('.PANEL#' + uniqueName);
		g.activeSearchId = uniqueName;
//  		console.log('TABCLICKED');
// 		console.log(g.allSearches[g.activeSearchId]);
// 		console.log('SEARCH TAB ' + $panelToShow.attr('class'));
		
		$this.siblings().addClass('persistant');
		g.$searchResultsPANEL.children().addClass('persistant');
		
		if (!$this.hasClass('alone')) {
			$this.removeClass('persistant');
			$panelToShow.removeClass('persistant');
		}
		
		f.updateSearchArrays($this,uniqueName,$panelToShow);
		
		// move the shown panel to the top
		$panelToShow.appendTo(g.$searchResultsPANEL);
		
		// if the tabs are multi-row, position clicked tab before shown panel
		if (g.$searchPanel.hasClass('multiRowTabs')) {
			$this.appendTo(g.$searchResultsTAB);
		}
		
		f.checkForMultiRowTabs();		
	}


	// INDEX TAB
	if ($this.parent().is('#INDEX')) {
		// to come
	}


	if ($this.hasClass('level0')) {
		g.$prevTab = $this;
		g.$prevPanel = $panelToShow;
	}

// 	console.log('tabClicked, g.$prevTab is ' + g.$prevTab.attr('class'));
};



// ==================================
// TITLES: TAB CLICK HANDLER for TITLES TABS
// ==================================

var newScrollTop,
	targetName,
	$previousAll,
	panelHeight,
	paddingAdj;

function titlesTabClicked($elem) {

//   	console.log('****titlesTabClicked ' + $elem.attr('id'));
	
	$elem.addClass('clicked').siblings('.clicked').removeClass('clicked');
	
	if (window.innerWidth < 1024) {
		var adjustForPadding = (window.innerWidth <= 440) ? paddingAdj = 0 : paddingAdj = 20;
		
	// LESS THAN IPAD LANDSCAPE
		// if there's a previously opened panel, slide it closed
		if (g.$prevTitlesPanel) {
			g.$prevTitlesPanel.removeClass('padded');
			g.$prevTitlesPanel.animate({
				'height' : '0',
			}, 600, function() {
//				alert('FINISHED');
				g.$prevTitlesPanel.removeClass('shown');
				g.$prevTitlesPanel.css('height', '');
				g.$prevTitlesPanel = undefined;
			});
		}
		
		// if the tab's panel is not already shown, slide it open
		if (!$elem.next('.PANEL').hasClass('shown')) {
			g.$titlesPanelShown = $elem.next('.PANEL');
			g.$titlesPanelShown.css('height', 'auto');
			panelHeight = g.$titlesPanelShown.outerHeight() + paddingAdj;
			g.$titlesPanelShown.css('height', '0px');
			g.$titlesPanelShown.addClass('shown padded').animate({
				'height' : panelHeight,
			}, 600, function() {
				g.$titlesPanelShown.css('height', 'auto');
				g.$prevTitlesPanel = g.$titlesPanelShown;
			});
		}
	
	// IPAD LANDSCAPE OR GREATER
	} else {
		
//		g.$titlesScroller.off('scroll', f.scrollTitles);
		targetName = $elem.attr('id');
// 		console.log('TARGETNAME is ' + targetName)
		g.$titlesPanelShown = g.$titlesScroller.children('#' + targetName);
		
		f.positionTitlePanel();
	}
}


// ================================================
//  TITLES: POSITION SHOWN TITLES PANEL AT TOP OF SCROLLER
// ================================================

f.positionTitlePanel = function() {
	var $previousAll,
		newScrollTop = 0;
	
	$previousAll = g.$titlesPanelShown.prevAll();
// 	console.log($previousAll);
	if ($previousAll.length > 0) {
		$previousAll.each(function (i, elem) {
			newScrollTop += $(elem).outerHeight();
		});
	}

	g.$titlesPanelShown.addClass('shown').siblings().removeClass('shown');

	g.$titlesScroller.animate({
		scrollTop: newScrollTop
	}, 0, 'linear');
	
	g.$prevTitlesPanel = g.$titlesPanelShown;
};




// ===============================================
//  SEARCH: UPDATE SEARCH TAB ARRAY
// ===============================================

f.updateSearchArrays = function($this,uniqueName,$panelToShow) {
	
// 	console.log('updateSearchArrays');
	
	// the array is to enable the previously looked at tab to be shown when a tab is closed
	$.each(tabArray, function(i, tab) {
		
		// remove tab and panel if they're already in array
		if ($(tab).hasClass(uniqueName)) {
			tabArray.splice(i, 1);
			panelArray.splice(i, 1);
		}
	});
	
	// add tab and panel to beginning
	tabArray.unshift($this);
	panelArray.unshift($panelToShow);
	

	if (tabArray.length === 1) {
		tabArray[0].addClass('alone').removeClass('persistant');
		panelArray[0].removeClass('persistant');
	}

};



// ===============================================
//  SEARCH: CLOSE CROSS CLICKED on search tab
// ===============================================

function closeSearch(cross) {
	var $cross = $(cross);
	var toCloseName = $cross.parent().attr('id');
	delete g.allSearches[toCloseName];
	console.log(g.allSearches);
	
	$.each(tabArray, function(i, tab) {
		if ($(tab).hasClass(toCloseName)) {
// 			console.log(i, tab);
			
			// remove from DOM
			tabArray[i].remove();
			panelArray[i].remove();
			
			// remove from arrays
			tabArray.splice(i, 1);
			panelArray.splice(i, 1);
			
// 			console.log(tabArray);
			if (tabArray.length === 1) {
				console.log('ALONE');
				tabArray[0].addClass('alone').removeClass('persistant');
				panelArray[0].removeClass('persistant');
			}
		}
	});
	
	console.table(tabArray);
	console.table(panelArray);
	
	// make previously clicked tab and panel active
	if (tabArray.length > 0) {
		tabArray[0].click();
		return false;
	}	
	f.checkForMultiRowTabs();		
}


f.closeParent = function(elem) {
	console.log('CLOSE');
	var $elem = $(elem);
	$elem.parent().remove();
};

var scrolledPanelsHeight;
f.scrollTest = function() {

	$panelShown = g.$titlesScroller.children('.shown');
	console.log(g.$titlesScroller.scrollTop() + ' ' + $panelShown.height());
};


f.browseIn = function() {
	var $parentTab = $(event.target).closest('.TAB');
	$parentTab.addClass('spanHovered');
// 	console.log('browseIn ' + $parentTab.attr('class'));
};

f.browseOut = function() {
	var $parentTab = $(event.target).closest('.TAB');
	$parentTab.removeClass('spanHovered');
// 	console.log('browseOut ' + $parentTab.attr('class'));
};