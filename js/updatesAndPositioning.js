/* jshint browser: true, devel: true */
/* global $, f, g, $cell, cellClickedPosY:true, $explore */

var hasShuffled = false;
var animSpeed = 300;




// ========================================
// AFTER WINDOW RESIZE, CALL RELEVANT FUNCS
// ========================================

f.updateLayout = function () {
	console.log('updateLayout');
	f.scrollerAddOrRemove();
	f.checkForMultiRowTabs();
	f.checkSearchLayout();
};



// =========================================================
// TITLES: ARRANGE TABS AND PANELS ACCORDING TO WINDOW SIZE
// =========================================================

f.scrollerAddOrRemove = function () {
//   	console.log('scrollerAddOrRemove ' + g.scrollerContainsPanelsOnly);
	
	var $tabs;

	// REMOVE TABS FROM SCROLLER, ie when iPad landscape or greater
	
	if (window.innerWidth >= 1024 && !g.scrollerContainsPanelsOnly) {

		$tabs = g.$titlesScroller.children('.TAB');
		console.log(g.$titlesScroller.children('.TAB'));
		g.$titlesScroller.parent().prepend($tabs);
		f.positionTitlePanel();
		g.$titlesScroller.on('scroll', f.scrollTitles);
		g.scrollerContainsPanelsOnly = true;

	} else if (window.innerWidth < 1024 && g.scrollerContainsPanelsOnly) {

	// ADD TABS TO SCROLLER, ie when less than iPad landscape
		
		g.$titlesScroller.off('scroll', f.scrollTitles);
		g.$titlesPanelShown.addClass('padded');
		$tabs = g.$TITLESpanel.children('.TAB');
		g.$titlesPanelShown.css({
			'height' : 'auto'
		});

		$tabs.each(function (i, tab) {
			var $tab = $(tab);
			g.$titlesScroller.children('.PANEL').eq(i).before($tab);
		});
		
		g.scrollerContainsPanelsOnly = false;
	}
};




// =================================================
// SEARCH: CHECK LAYOUT OF PANELS, GROUPS and CELLS
// =================================================

f.checkSearchLayout = function () {
	console.log('checkSearchLayout');
	var $searches = g.$searchPANELbox.children('.PANEL.level1');
	console.log($searches);
	if ($searches) {
		$searches.each(function (i, search) {
			var $search = $(search);
			var $searchGroupPanels = $search.find('.searchGroupPanel');

			f.checkContractedHeight($searchGroupPanels);
			f.countHiddenCells($searchGroupPanels);

			var $exploringToCheck = $search.find('.PANEL.exploring.contracted');
			
			if ($exploringToCheck.length > 0) {
				f.checkForShuffle($exploringToCheck);
			}
			if (!$search.hasClass('filterStateSetByUser')) {
				f.autoHideFilters($search);
			}
		});
		f.positionExploreTable($explore, $cell, 200);
	}
};




// =================================
// SEARCH: CHECK FOR MULTI ROW TABS
// =================================

f.checkForMultiRowTabs = function () {
	var $clickedTab = g.$searchTABbox.children('.clicked');
	var $searchTabs = g.$searchTABbox.children();
	var searchTABboxWidth = g.$searchTABbox.width();
	var allTabsWidth = 0;

	// check if the tabs can fit in one row...
	$searchTabs.each(function (i, tab) {
		var $tab = $(tab);
		var tabWidth = $tab.outerWidth(true);
		allTabsWidth += tabWidth;
	});

// 	console.log('checkForMultiRowTabs ' + allTabsWidth, searchTABboxWidth);

	// do stuff accordingly
	if (allTabsWidth > searchTABboxWidth) {
		g.$searchPanel.addClass('multiRowTabs');
		g.$searchTABbox.append($clickedTab);
	} else {
		g.$searchPanel.removeClass('multiRowTabs');
	}
};




// ===========================
// SEARCH: COUNT HIDDEN CELLS
// ===========================

f.countHiddenCells = function ($panels) {
	  console.log('countHiddenCells ' + $panels.length);

	$panels.each(function (i, panel) {
		var hiddenCount = 0,
			shownCount = 0,
			prevCount,
			$panel = $(panel),
			$tab = $panel.prev('.TAB'),
			$showMore = $tab.children('.showMore'),
			$gauge = $panel.children('.heightGauge'),
			$cells = $gauge.children('.searchCell'),
			totalResults = $cells.length,
			passiveCellHeight = $panel.find('.searchCell').not('.active').eq(0).outerHeight();

		$cells.each(function (i, cell) {
			var $cell = $(cell);
			if ($cell.position().top >= $panel.height()) {
				hiddenCount++;
			}
			if ($cell.position().top >= passiveCellHeight && !$panel.hasClass('contracted')) {
				shownCount++;
			}
		});

		// update the number box

		var $moreCellsNumber = $gauge.siblings('.hideMoreResults').children('.moreCellsNumber');
		$moreCellsNumber.html('+' + hiddenCount);

		$showMore.children('div').eq(0).html('Show <span>' + hiddenCount + '</span> more');

		var $resultsTotal = $showMore.siblings('.resultsTotal');
		var resultText = totalResults === 1 ? 'result' : 'results';

		$resultsTotal.html('<span>' + totalResults + '</span> ' + resultText + '');

		if (hiddenCount > 0) {
			$tab.addClass('hasHiddenCells').removeClass('noneHidden');
			$panel.addClass('hasHiddenCells').removeClass('noneHidden');
		} else {
			$tab.removeClass('hasHiddenCells').addClass('noneHidden');
			$panel.removeClass('hasHiddenCells').addClass('noneHidden');
			if ($showMore.hasClass('active')) {
				var resultTextPrev = shownCount == 1 ? 'result' : 'results';
				$showMore.children('div').eq(0).html('Hide <span>' + shownCount + '</span> ' + resultTextPrev);
			}
		}

		if (!$panel.hasClass('contracted')) {
			f.checkForCollapse($tab, $showMore, $panel);
		}
		hiddenCount = 0;
	});
};




// ===============================
// SEARCH: POSITION EXPLORE TABLE
// ===============================

var cellLeftPos;
f.positionExploreTable = function ($explore, $cell, animSpeed) {
	// 	console.log('positionExploreTable');
	if ($explore) {
		var $exploreContent = $explore.children('.exploreTable');
		cellLeftPos = $cell.position().left;
		var exploreLeftPos = parseInt($explore.css('left')) * -1;
		var newLeftPos = exploreLeftPos - cellLeftPos;
		$exploreContent.animate({
			'margin-left': newLeftPos
		}, animSpeed);
	}
};




// =================================================================
// SEARCH: ADJUST CONTRACTED PANEL HEIGHT FOR DIFFERENT RESOLUTIONS - ie, for when media queries make elements a different height
// =================================================================

f.checkContractedHeight = function ($searchGroupPanels) {
	// 	console.log('checkContractedHeight');
	$searchGroupPanels.each(function (i, panel) {
		var $panel = $(panel);
		if ($panel.hasClass('contracted')) {
			var newCutOffHeight;
//			var $passiveCell = $panel.find('.searchCell').not('.clicked').eq(0);
			var passiveCellHeight = $panel.find('.searchCell').eq(0).find('.moduleShadow').outerHeight(true);
			if ($panel.hasClass('exploring')) {
				var $cellToCheck = $panel.find('.searchCell.clicked');
				var $explore = $cellToCheck.find('.exploreContent');
				console.log($cellToCheck.position().top, passiveCellHeight, $explore.outerHeight(true));
				newCutOffHeight = $cellToCheck.position().top + passiveCellHeight + $explore.outerHeight(true);
			} else {
				newCutOffHeight = passiveCellHeight;
			}
			$panel.animate({
				'height': newCutOffHeight
			}, 500, function () {
				f.countHiddenCells($panel);
			});
		}
	});
};





// ===============================================================================
// SEARCH: ADJUST GROUP HEIGHT IF EXPLORE JUMPS ROWS (only if panel is contracted)
// ===============================================================================

f.checkForShuffle = function ($panel) {

	console.log('checkForShuffle ' + $panel.attr('class') + ' ' + cellClickedPosY);

	var lastCellPosY,
		$cellToCheck = $panel.find('.searchCell.clicked'),
		$hideMoreResults = $panel.children('.hideMoreResults');

	// no shuffle

	if ($cellToCheck.position().top === cellClickedPosY) {
		hasShuffled = false;
		return;
	}

	// yes shuffle

	console.log('has SHUFFLED');
	hasShuffled = true;
	cellClickedPosY = $cellToCheck.position().top;
	var $tab = $panel.prev('.TAB');

	// calculate new height and animate to it

	var passiveCellHeight = $panel.find('.searchCell').not('.active').eq(0).outerHeight();
	var $explore = $cellToCheck.find('.exploreContent');
	var newCutOffHeight = $cellToCheck.position().top + passiveCellHeight + $explore.outerHeight(true);
	$panel.animate({
		'height': newCutOffHeight
	}, 0, function () {
		f.countHiddenCells($panel);
	});

	// is exploring cell now on last row ?

	lastCellPosY = $panel.children('.heightGauge').children().last().position().top;
	cellClickedPosY = $panel.find('.searchCell.clicked').position().top;

	if (lastCellPosY === cellClickedPosY && cellClickedPosY !== 0) {

		// yes, on last row

		console.log('ON LAST ROW');
		$tab.removeClass('contracted');
		$tab.children('.showMore').addClass('active');
		$panel.removeClass('contracted');
		$panel.css('height', '');
		$hideMoreResults.removeClass('hidden');
		f.countHiddenCells($panel);

	} else {

		// not on last row

		console.log('NOT ON LAST ROW');
		$tab.addClass('contracted');
		$tab.children('.showMore').removeClass('active');
		$panel.addClass('contracted');
		$hideMoreResults.addClass('hidden');
		f.countHiddenCells($panel);
	}
};




// ====================================================================
// SEARCH: ADJUST HEIGHT IF SEARCH CELLS MOVE ONTO LESS LINES ON RESIZE
// ====================================================================

f.checkForCollapse = function ($tab, $showMore, $panel) {
	// 	console.log('checkForCollapse');
	// 	console.log($panel.closest('.level1.PANEL'));
	var passiveCellHeight = $panel.find('.searchCell').not('.active').eq(0).outerHeight();
	if ($panel.outerHeight() === passiveCellHeight) {
		// 		console.log('PASSIVE');
		$tab.addClass('contracted');
		$panel.addClass('contracted');
		$panel.children('.hideMoreResults').addClass('hidden');
		$showMore.removeClass('active');
		var $button = $panel.children('.hideMoreResults');
		$button.removeClass('active');
		$button.children().removeClass('active');
	}
};
