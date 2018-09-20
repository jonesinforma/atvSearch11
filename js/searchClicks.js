/* jshint browser: true, devel: true */
/* global $, f, g */


// SHOW-HIDE SEARCH CELLS and EXPLORECONTENT
var $cell,
	$explore,
	$prevElem,
	$prevCell,
	$prevExplore,
	$prevGroup,
	cellClickedPosY,
	newHeight,
	active = false;

f.searchClicks = function (elem) {
 	console.log('searchClicks ' + $(elem).attr('class'));
	var $elem,
		activeHeight,
		passiveHeight,
		passiveCellHeight,
		prevHeight,
		firstCellPosY,
		$group,
		$tab,
		$showMoreArrow,
		$hideMoreResults,
		slideSpeed = 500,
		sameGroup = false;

	$elem = $(elem);
	g.$searchPanel = $elem.closest('.PANEL.level1');
	
	

	// SHOW or HIDE
	
	if ($elem.hasClass('searchGroupTitle')) {
		$group = $elem.closest('.TAB').next('.PANEL');

		// close
		if (!$elem.hasClass('active')) {
			passiveHeight = $group.outerHeight();
			$group.attr('data-passive-height', passiveHeight);
			newHeight = 0;

			// open
		} else {
			newHeight = $group.attr('data-passive-height');
		}
		applyNewHeight($group, newHeight, slideSpeed, 'closed');
		$elem.toggleClass('active');
	}
	
	
	
	// HIDE MORE RESULTS BUTTON
	
	if ($elem.hasClass('hideMoreResults')) {
		var $toClick = $elem.parent().prev('.TAB').children('.showMore');
		$elem.addClass('hidden');
		$toClick.click();
	}
	
	
	
	
	// ONE LINE OR MULTI ROW
	
	if ($elem.hasClass('showMore')) {
		$tab = $elem.parent('.TAB');
		$group = $tab.next('.PANEL');
		$showMoreArrow = $elem.find('.showMoreArrow');
		$hideMoreResults = $group.children('.hideMoreResults');		

		// open to multi row
		
		if (!$elem.hasClass('active')) {
			$elem.addClass('active');
			newHeight = $group.children('.heightGauge').outerHeight();
			$tab.removeClass('hasHiddenCells');
			$hideMoreResults.removeClass('hidden');
			$group.removeClass('hasHiddenCells');
			$group.animate({
				'height': newHeight
			}, 500, function () {
				$tab.removeClass('contracted');
				$group.removeClass('contracted');
				$group.css('height', '');
				f.countHiddenCells($group);
				
			});

		// close
			
		} else {
			
			// If exploring is open...
			
			if ($group.hasClass('exploring')) {
				
				// is exploring cell is on first row ?

				if (cellClickedPosY === 0) {
					
					// yes, so close to explore height
					
					newHeight = $cell.outerHeight(true) + $cell.position().top;

				} else {
					
					// not on first row so close completely
					
					console.log('NOT FIRST ROW');
					$elem.removeClass('active');
					$cell.removeClass('clicked');
					$cell.find('.titleBox.active').removeClass('active');
					$group.removeClass('exploring');
					$tab.removeClass('exploring');
					$hideMoreResults.addClass('hidden');
					newHeight = $group.find('.searchCell').not('.clicked').eq(0).outerHeight(true);
					$explore.slideUp(slideSpeed, function () {
						f.countHiddenCells($group);
					});
					active = false;
					
				}
				
				// do animation to new height
				
				$group.animate({
					'height': newHeight
				}, 500, function () {
					$tab.addClass('contracted');
					$group.addClass('contracted');
					$elem.removeClass('active');
					f.countHiddenCells($group);
					setTimeout(function() {
//						$number.removeClass('active');
//						$square.removeClass('active');
					}, 50);
					
				});

			} else {
				
			// to single row
				newHeight = $group.find('.searchCell').not('.clicked').eq(0).outerHeight(true);
				$elem.removeClass('active');
				$hideMoreResults.addClass('hidden');
				console.log('showMore CLOSE ' + $hideMoreResults.attr('class'));
				$group.animate({
					'height': newHeight
				}, 500, function () {
					$tab.addClass('contracted');
					$group.addClass('contracted');
					$group.css('height', '');
					f.countHiddenCells($group);
					setTimeout(function() {
//						$number.removeClass('active');
//						$square.removeClass('active');
					}, 50);
				});
			}
		}
	}
	
	
	// POSITION EXPLORE CONTENT
	
	f.positionExplore = function($explore, $cell, $group) {
		var cellPosY = $cell.position().top,
			$searchCells = $group.find('.searchCell'),
			$searchCell,
			searchCellPosY,
			$placeAfter,
			$placeBefore;
		
		$searchCells.removeClass('placeBefore');
		$searchCells.each(function(i, searchCell){
			$searchCell = $(searchCell);
			searchCellPosY = $searchCell.position().top;
			if (searchCellPosY > cellPosY) {
				$placeAfter = $searchCell;
// 				$placeBefore.addClass('placeBefore');
				return false;
			}
		});
	};
	
	
	

	// EXPLORE PANEL OPEN OR CLOSE
	
	if ($elem.hasClass('titleBox')) {

		$group = $elem.closest('.PANEL');
		$tab = $group.prev('.TAB');
		$explore = $elem.closest('.module').find('.exploreContent');
		$cell = $explore.closest('.searchCell');
		cellClickedPosY = $cell.position().top;
		passiveCellHeight = $group.find('.searchCell').not('.clicked').eq(0).outerHeight(true);

		f.positionExploreTable($explore, $cell, 0);
		
		
		// MODAL EXPLORE
		
		if (window.innerWidth < 768) {
			var $modalExplore = $('<div class="modalExplore"></div>');
			$modalExplore.append($('<div class="closeCrossLarge onDark" onclick="f.closeParent(this)"></div>'));
			var $modalContents= $explore.clone();
			$modalContents.children('.exploreTable').css('margin-left', '');
			$modalExplore.append($modalContents);
			g.$searchPanel.append($modalExplore);
			return;
		}
		

		
		// SLIDE-DOWN EXPLORE
		
		// nothing clicked
		if (!active) {
			console.log('nothing clicked');

			$elem.addClass('active');
			$cell.addClass('clicked');

			if ($group.hasClass('contracted')) {
				newHeight = $group.outerHeight() + $explore.outerHeight(true);
				console.log('newHeight INITIAL is ' + newHeight);
				$group.animate({
					'height': newHeight
				}, 500, function () {
					$group.addClass('exploring');
					$tab.addClass('exploring');
				});
			}

			$explore.slideDown(slideSpeed);
			$group.addClass('exploring');
			$tab.addClass('exploring');
			$prevElem = $elem;
			active = true;
			return;
		}

		// already clicked
		if ($elem.hasClass('active')) {
			
			console.log('already clicked');

			$elem.removeClass('active');
			$cell.removeClass('clicked');

			if ($group.hasClass('contracted')) {
				newHeight = $group.outerHeight() - $explore.outerHeight(true);
				$group.animate({
					'height': newHeight
				}, 500, function () {
					$group.removeClass('exploring');
					$tab.removeClass('exploring');
				});
			}

			$group.removeClass('exploring');
			$tab.removeClass('exploring');
			$explore.slideUp(slideSpeed, function () {
				f.countHiddenCells($group);
				$explore.css('display', '');
			});
			active = false;
			return;
		}
		
		

		// not clicked, same group
		if ($group.hasClass('exploring')) { 
			
			console.log('not clicked, same group...');
			$prevCell = $prevElem.closest('.searchCell');
			$prevExplore = $prevCell.find('.exploreContent');

			$elem.addClass('active');
			$cell.addClass('clicked');

			$prevElem.removeClass('active');
			$prevCell.removeClass('clicked');
			if ($prevCell.position().top === $cell.position().top) {
				slideSpeed = 0;
			}

			$prevExplore.slideUp(slideSpeed);
			$explore.slideDown(slideSpeed);
			cellClickedPosY = $cell.position().top;
			$prevElem = $elem;
			
			if ($group.is('.contracted.extra')) {
				
				// extra panel showing
				console.log('... showing extra');
				$group.outerHeight($cell.outerHeight() - 8);
				
				
			} 
			
		} else {

		// not clicked, different group
		
			console.log('not clicked, different group');
			
			$prevCell = $prevElem.closest('.searchCell');
			$prevExplore = $prevCell.find('.exploreContent');
			$prevGroup = $prevElem.closest('.PANEL');
			g.$prevTab = $prevGroup.prev('.TAB');

			$elem.addClass('active');
			$cell.addClass('clicked');

			$prevElem.removeClass('active');
			$prevCell.removeClass('clicked');

			prevHeight = $prevCell.position().top + passiveCellHeight;
			newHeight = $cell.position().top + passiveCellHeight + $explore.outerHeight(true);

			$prevGroup.animate({
				'height': prevHeight
			}, 500, function () {
				$prevGroup.removeClass('exploring');
				g.$prevTab.removeClass('exploring');
			});
			$prevExplore.slideUp(slideSpeed, function () {
				f.countHiddenCells($group);
			});

			$group.animate({
				'height': newHeight
			}, 500, function () {
				$group.addClass('exploring');
				$tab.addClass('exploring');
			});
			$explore.slideDown(slideSpeed, function () {
				f.countHiddenCells($group);
			});
			$prevExplore.slideUp(slideSpeed);

			$explore.slideDown(slideSpeed);
			cellClickedPosY = $cell.position().top;
			$prevElem = $elem;
		}
	}
	
	
	
	
	// EXPLORE EXTRA: SHOW or HIDE EXTRA TITLES
	
	if ($elem.hasClass('optionTitle')) {
		console.log('SHOW EXTRA EXPLORE');
		var $exploreOptions,
			$exploreImageDiv,
			$exploreTable,
			$heightGauge,
			$endCell,
			$precedeEndCell,
			$passiveCell,
			passiveExploreHeight,
			$panel,
			startHeight,
			endExploreHeight,
			endPanelHeight,
			addHeight;
		
		$elem.toggleClass('open');
		$exploreOptions = $elem.closest('.exploreOptions');
		$exploreImageDiv = $exploreOptions.siblings('.exploreImageDiv').eq(0);
		$exploreTable = $exploreOptions.parent();
		$heightGauge = $elem.closest('.heightGauge');
		$panel = $heightGauge.parent();
		
		$elem.html("Hide other products");
		$exploreOptions.append($elem.closest('.optionCell'));
		
		if (window.innerWidth <= 475) {
			slideSpeed = 0;
		}
		
			
		// SHOW EXTRA titles
		if ($elem.hasClass('open')) {

			
			var imageSize = $exploreImageDiv.children('img').outerWidth();
			$exploreImageDiv.css({
				'width' :  imageSize,
				'height' : imageSize
			});
			$panel.addClass('extra');
			$exploreOptions.css('flex-grow', '1');
			$exploreTable.addClass('showingMoreOptions');

			startHeight = $exploreOptions.outerHeight();
			$endCell = $exploreOptions.children().last();
			$precedeEndCell = $exploreOptions.children().eq(-2);
			if ($endCell.position().left > $precedeEndCell.position().left) {
				$endCell = $precedeEndCell;
			}
			endExploreHeight = $endCell.position().top + $endCell.outerHeight(true);		

			$exploreOptions.animate({
				'height' : endExploreHeight
			}, slideSpeed, function() {
				$exploreOptions.css({
					'height' : '',
					'flex-grow' : ''
				});
				$exploreOptions.addClass('expanded');
			});


			// CONTRACTED panel

			if ($panel.hasClass('contracted')) {
				addHeight = endExploreHeight - startHeight;
				$panel.animate({
					'height' : $panel.outerHeight() + addHeight
				}, slideSpeed);
			}

		} else {

			// HIDE EXTRA titles

			console.log('CLOSE');
			console.log('newHeight is ' + newHeight);

			startHeight = $exploreOptions.outerHeight();
			$exploreOptions.css('height', startHeight);
			endExploreHeight = $exploreOptions.children('.optionCell').eq(0).outerHeight() + 4; // don't know why there's a little gap under the optionCells
			$exploreOptions.css('flex-grow', '');
			$exploreTable.removeClass('showingMoreOptions');

			$elem.html("Select in another product");
			$exploreOptions.animate({
				'height' : endExploreHeight
			}, slideSpeed, function() {
				$exploreOptions.css('height', '');
				$exploreOptions.removeClass('expanded');
				$exploreOptions.children('.best').last().after($elem.closest('.optionCell'));
				$exploreImageDiv.css({
					'width' :  '',
					'height' : ''
				});
			});
			

			// CONTRACTED panel
			
			if ($panel.hasClass('contracted')) {
				$passiveCell = $panel.parent().find('.searchCell').not('.clicked').eq(0);
				passiveCellHeight = $passiveCell.find('.moduleShadow').outerHeight(true);
				passiveExploreHeight = $passiveCell.find('.exploreContent').outerHeight(true);
				console.log('CONTRACTED ' + passiveCellHeight, passiveExploreHeight);
				$panel.animate({
					'height' : passiveCellHeight + passiveExploreHeight
				}, slideSpeed);
			}

		}		
	}




	function applyNewHeight($elem, newHeight, slideSpeed, endToggleClass) {
		// 		console.log($elem, newHeight, slideSpeed, endToggleClass);
		$elem.animate({
			'height': newHeight
		}, slideSpeed, function () {
			$elem.toggleClass(endToggleClass);
		});
	}
};
