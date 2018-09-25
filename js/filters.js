/* jshint browser: true, devel: true */
/* global $, f, g, count, g.searchInput, animSpeed */
var $toSlide;

// MAKE FILTERS
f.makeFilters = function (filterCategories, $filterScroller) {

// 	console.log($filterScroller.attr('class'));

	$.each(filterCategories, function (category, filterParents) {
		console.log(category, filterParents);
		var $filterTAB = g.$TEMPLATES.children('.filterTAB').clone();
		var $filterPANEL = g.$TEMPLATES.children('.filterPANEL').clone();
		$filterTAB.html('Filter by ' + category);
		$filterTAB.attr('data-filterkey', category);
		$filterPANEL.attr('data-filterkey', category);

		$.each(filterParents, function (filterParent, filterChild) {
			console.log(filterParent, filterChild);
			var $row = g.$TEMPLATES.find('.filterRow').clone();
			$row.attr('id', filterParent.split(' ').join(''));
			$row.children('.cell').html(filterParent);
			$filterPANEL.children('.filterTable').append($row);
			if (filterChild.length > 1) {
				var $filterChildPANEL = g.$TEMPLATES.children('.filterPANEL').clone();
				$filterChildPANEL.slideUp(0);
				$row.after($filterChildPANEL);
				$row.addClass('withChildren');
				$row.on('click', toggleFilterOpen);
				$row.append('<span class="openFilterRow"></span>');
				$.each(filterChild, function(i, child) {
					var $row = g.$TEMPLATES.find('.filterRow').clone();
					$row.children('.cell').html(child);
					$filterChildPANEL.children('.filterTable').append($row);
				});
			}
		});

		$filterScroller.append($filterTAB);
		$filterScroller.append($filterPANEL);
		$('.withChildren').next().slideUp(0);
	});

	$toSlide = $filterScroller.children('.filterPANEL');
	$toSlide.slideUp(0);

	$toSlide.each(function (i, panel) {
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
f.filterTABClicked = function (elem) {
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
f.autoHideFilters = function ($search) {
	// 	console.log('autoHideFilters');
	if (window.innerWidth <= g.searchMobileLayoutWidth) {
		$search.removeClass('filtersShown').addClass('filtersHidden');
	} else {
		$search.addClass('filtersShown').removeClass('filtersHidden');
	}
};


// SHOW AND HIDE FILTER BAR
f.showHideFilterBar = function (elem) {
	console.log('showHideFilterBar');
	var $elem = $(elem);
	var $parent = $elem.parent();
	$parent.toggleClass('filtersHidden').toggleClass('filtersShown');
	$parent.addClass('filterStateSetByUser');
	if (window.innerWidth > g.searchMobileLayoutWidth) {
		setTimeout(function () {
			f.updateLayout($parent);
		}, animSpeed);
	}

};


// FILTER OVER
f.filterOver = function(e) {
	$(e.currentTarget).parent().addClass('spanHover');
}

f.filterOut = function(e) {
	$(e.currentTarget).parent().removeClass('spanHover');
}


// FILTER TICKED or UNTICKED

f.filterClicked = function(e) {
	e.stopPropagation();
// 	console.log(e);
	$this = $(e.currentTarget);
	var $thisRow = $this.parent();
	var $rowParentPanel = $thisRow.closest('.filterPANEL');
// 	console.log('filterClicked :', $(e.currentTarget).attr('class'));
	
// 	first filter click, remove 'showing' state etc;
	if ($thisRow.hasClass('showing')) {
		$thisRow.addClass('firstClick');
		$thisRow.removeClass('showing').addClass('checked');
		$thisRow.siblings().removeClass('showing').addClass('inactive');
		$thisRow.siblings('.filterPANEL').find('.filterRow').removeClass('showing').addClass('inactive');
		if ($thisRow.hasClass('withChildren')) {
			$thisRow.next().find('.filterRow').removeClass('inactive').addClass('checked');
		}
		if ($rowParentPanel.prev().hasClass('withChildren')) {
			$rowParentPanel.siblings().removeClass('showing').addClass('inactive');
			$rowParentPanel.siblings('.filterPANEL').find('.filterRow').removeClass('showing').addClass('inactive');
		}
	} 
	else
	if ($thisRow.hasClass('checked')) {
		$thisRow.removeClass('checked').addClass('inactive');
		$thisRow.next().find('.filterRow').removeClass('checked').addClass('inactive');
	} 
	else
	if ($thisRow.hasClass('inactive') || $thisRow.hasClass('partial')) {
		$thisRow.removeClass('inactive partial').addClass('checked');
		$thisRow.next().find('.filterRow').removeClass('inactive').addClass('checked');
	}
	
//	behaviour for child filters and their parents
	if ($rowParentPanel.prev().hasClass('withChildren')) {
		if ($thisRow.hasClass('inactive')) {
			if ($thisRow.siblings().hasClass('checked')) {
				$rowParentPanel.prev().removeClass('inactive showing checked').addClass('partial');
			} else {
				$rowParentPanel.prev().removeClass('partial').addClass('inactive');
			}		
		} else {
			if ($thisRow.siblings().hasClass('inactive')) {
				$rowParentPanel.prev().removeClass('inactive showing checked').addClass('partial');
			} else {
				$rowParentPanel.prev().removeClass('partial').addClass('checked');
			}
		}
	}
	applyFilter($thisRow);
};

function toggleFilterOpen(e) {
	$this = $(event.currentTarget);
	console.log('toggleFilterOpen :', $this.attr('class'));
	$this.toggleClass('opened');
	$this.next().slideToggle();
	return false;
}



var includedArray = [],
	excludedArray = [];
//	excludedObject = {
//		type: [],
//		product: [],
//		region: [],
//      system: []
//	};


function applyFilter($rowClicked) {

// 	console.log('applyFilter ' + $rowClicked);

	var filterValue,
		$filterParent,
		filterKey,
		$otherParents,
		$filtersToCheck,
		$child,
		childID,
		$matchingTab,
		$matchingPanel,
		$matchingContainer,
		$matchingCell,
		slideSpeed = 500;

	// Get the VALUE from the filter which has been clicked on
	filterValue = $rowClicked.children().html();

	// Get the KEY from the clicked filter's parent
	$filterParent = $rowClicked.closest('.filterPANEL');
	filterKey = $filterParent.attr('data-filterKey');
	
	console.log(filterKey);

	// Store the other parents
	$otherParents = $filterParent.siblings('.filterTAB');

// 	console.log('filterValue is **' + filterValue + '**; filterKey is **' + filterKey + '**');

	if ($rowClicked.hasClass('firstClick')) {
		$filtersToCheck = $rowClicked.parent().children();
	} else {
		$filtersToCheck = $rowClicked;
	}


	// media-type filter
	if (filterKey === 'type') {

		$filtersToCheck.each(function (i, child) {
			$child = $(child);
			childID = $child.attr('id');

			// find the result groups to show or hide
			$matchingTab = $rowClicked.closest('.filterBAR').next('.searchScroller').find('.TAB#' + childID);
			$matchingPanel = $matchingTab.next('.PANEL');

			// show group
			if ($child.hasClass('checked')) {
				$matchingTab.slideDown(slideSpeed).fadeIn(0).removeClass('filteredOut');
				f.checkContractedHeight($matchingPanel);
				$matchingPanel.removeClass('filteredOut');

				$matchingPanel.slideDown(slideSpeed).fadeIn(0);
				setTimeout(function () {
					f.positionExploreTable($explore, $cell, 200);
					f.countHiddenCells($matchingPanel);
				}, 100);
			} else {
				// hide group
				$matchingTab.slideUp(slideSpeed).fadeOut({
					queue: false,
					duration: slideSpeed
				}).addClass('filteredOut');
				$matchingPanel.slideUp(slideSpeed).fadeOut({
					queue: false,
					duration: slideSpeed
				}).addClass('filteredOut');
			}
		});
		//		f.checkSearchLayout();
	} 
	
	// other filter type
	else {
		
		searchObject = g.allSearches[g.activeSearchId];
		console.log(searchObject);

		// For each item in the search array, 
		// check if the KEY has a VALUE which matches matches the filterValue of the clicked filter
		$.each(searchObject, function (key, item) {
			
			console.log(key, item);

			// Turning OFF the filter
			if ($rowClicked.hasClass('inactive')) {



				// If it matches, it's excluded
				if (item[filterKey] == filterValue) {

					// find the appropriate CELL and store it in a variable
					$matchingContainer = $rowClicked.closest('.filterBAR').next('.searchScroller').children('.searchGroups');
					$matchingCell = $matchingContainer.children().eq(i);
					$matchingCell.hide();

					excludedArray.push(i);
					includedArray = includedArray.filter(function (item) {
						return item !== i;
					});
				}
			}

			// Turning ON the filter
			if ($rowClicked.hasClass('checked')) {

				// If it matches, it's included
				if (item[filterKey] == filterValue) {

					// find the appropriate CELL and store it in a variable
					$matchingContainer = $rowClicked.closest('.filterBAR').next('.searchScroller').children('.searchGroups');
					$matchingCell = $matchingContainer.children().eq(i);
					$matchingCell.show();

					includedArray.push(i);
					excludedArray = excludedArray.filter(function (item) {
						return item !== i;
					});
				}
			}
		});

		excludedArray = excludedArray.sort(function (a, b) {
			return a - b;
		});
		includedArray = includedArray.sort(function (a, b) {
			return a - b;
		});
		turnOffFilters(excludedArray);
		console.log('includedArray is ' + includedArray);
		console.log('excludedArray is ' + excludedArray);
		$otherParents.each(function (i, item) {
			console.log(item.getAttribute('data-filterkey'));
		});
		console.log($otherParents);
		//	console.log('APPLYFILTER - ' + $matchingContainer.attr('class'));
		//	f.showTypeTitle($matchingContainer);
	}

}

function turnOffFilters(excludedArray) {
	var excludedObject = {};
	$.each(excludedArray, function (i, item) {
		excludedObject += searchObject[item];
	});
	console.log(excludedObject);
}
