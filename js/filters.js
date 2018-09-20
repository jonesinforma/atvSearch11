/* jshint browser: true, devel: true */
/* global $, f, g, count, g.searchInput, animSpeed */ 
var $toSlide;

// MAKE FILTERS
f.makeFilters = function(filterCategories, $filterScroller) {	
	
	console.log($filterScroller.attr('class'));

	$.each(filterCategories, function (key, category) {
		var $filterTAB = g.$TEMPLATES.children('.filterTAB').clone();
		$filterTAB.attr('data-filterkey', key);
		$filterTAB.html('Filter by ' + key);	
		var $filterPANEL = g.$TEMPLATES.children('.filterPANEL').clone();
		
		$.each(category, function (i, title) {
			var $row = g.$TEMPLATES.find('.filterRow').clone();
			$row.children('.cell').html(title);	
			$filterPANEL.children('.filterTable').append($row);
		});
		
		$filterScroller.append($filterTAB);
		$filterScroller.append($filterPANEL);
	});
	
	$toSlide = $filterScroller.children('.filterPANEL');
	$toSlide.slideUp(0);
	
	$toSlide.each(function(i, panel) {
		var $panel = $(panel);
		if ($panel.children('.filterTable').children().length > 0) {
			$panel.addClass('shown').slideDown(0);
			$panel.prev().addClass('clicked');
		}
//		console.log($panel.html());
		
	});
	
	var $filterBAR = $filterScroller.parent();
	$filterBAR.find('.resultsTotal').html('<span>' + count + "</span> results for '" + g.searchInput + "'");
	$filterBAR.removeClass('displayNone');
	$filterBAR.siblings().removeClass('displayNone');
	
//	f.showHideFilterBar($filterScroller.parent());
	f.autoHideFilters($filterScroller.closest('.PANEL'));
};



// FILTER TAB CLICKED
f.filterTABClicked = function(elem) {
	console.log('f.filterTABClicked');
	var $currentClicked = $(elem);
	if ($currentClicked.hasClass('clicked')) {
		$currentClicked.removeClass('clicked');
		$currentClicked.next('.filterPANEL').removeClass('shown').slideToggle();
		return;
	}

	$currentClicked.addClass('clicked');
	$currentClicked.next('.filterPANEL').addClass('shown').slideToggle();
};



// HIDE FILTER BAR ON SMALL SCREENS (providing user hasn't set its state)
f.autoHideFilters = function($search) {
// 	console.log('autoHideFilters');
	if (window.innerWidth <= 1024 ) {
		$search.removeClass('filtersShown').addClass('filtersHidden');
	} else {
		$search.addClass('filtersShown').removeClass('filtersHidden');
	}
};


// SHOW AND HIDE FILTER BAR
f.showHideFilterBar = function(elem) {
	console.log('showHideFilterBar');
	var $elem = $(elem);
	var $parent = $elem.parent();
	$parent.toggleClass('filtersHidden').toggleClass('filtersShown');
	$parent.addClass('filterStateSetByUser');
	setTimeout(function() {
		f.updateLayout($parent);
	}, animSpeed);
		
};



// FILTER CLICKED 
f.filterRowClicked = function(elem) {
	
	var $this = $(elem);
	console.log($this);
	$this.toggleClass('active');
	applyFilter($this);
};

var includedArray = [],
    excludedArray = [];
//	excludedObject = {
//		type: [],
//		product: [],
//		region: [],
//      system: []
//	};


function applyFilter($that) {
	
    var $matchingContainer, 
		$matchingCell;

	// Get the VALUE from the filter which has been clicked on
	var filterValue = $that.children().html();

	// Get the KEY from the clicked filter's parent
	var $filterParent = $that.closest('.filterPANEL').prev();
	var filterKey = $filterParent.attr('data-filterKey');

	// Store the other parents
	var $otherParents = $filterParent.siblings('.filterTAB');

	console.log('filterValue is **' + filterValue + '**; filterKey is **' + filterKey + '**');
    
	// For each item in the search array, 
	// check if the KEY has a VALUE which matches matches the filterValue of the clicked filter
	$.each(searchObject, function (i, item) {

		// Turning OFF the filter
		if (!$that.hasClass('active')) {

			// If it matches, it's excluded
			if (item[filterKey] == filterValue) {

				// find the appropriate CELL and store it in a variable
				$matchingContainer = $that.closest('.filterBAR').next('.searchScroller').children('.searchGroups');
				$matchingCell = $matchingContainer.children().eq(i);
				$matchingCell.hide();
                
                excludedArray.push(i);
                includedArray = includedArray.filter(function(item){
                    return item !== i;
                });
			} 
		}

		// Turning ON the filter
		if ($that.hasClass('active')) {

			// If it matches, it's included
			if (item[filterKey] == filterValue) {

				// find the appropriate CELL and store it in a variable
				$matchingContainer = $that.closest('.filterBAR').next('.searchScroller').children('.searchGroups');
				$matchingCell = $matchingContainer.children().eq(i);
				$matchingCell.show();
                
                includedArray.push(i);
                excludedArray = excludedArray.filter(function(item){
                    return item !== i;
                });
			}
		}
	});
	
    excludedArray = excludedArray.sort(function (a, b) {  return a - b;  });
    includedArray = includedArray.sort(function (a, b) {  return a - b;  });
    turnOffFilters(excludedArray);
    console.log('includedArray is ' + includedArray);
    console.log('excludedArray is ' + excludedArray);
    $otherParents.each(function(i, item){
        console.log(item.getAttribute('data-filterkey'));
    });
    console.log($otherParents);
	console.log('APPLYFILTER - ' + $matchingContainer.attr('class'));
//	f.showTypeTitle($matchingContainer);
	
}

function turnOffFilters(excludedArray){
    var excludedObject = {};
    $.each(excludedArray, function (i, item) {
        excludedObject += searchObject[item];
    });
    console.log(excludedObject);
}


	

