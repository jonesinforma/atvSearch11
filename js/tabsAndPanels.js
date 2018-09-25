/* jshint browser: true, devel: true */
/* global $, f,  g, _ */

g.$prevTab = undefined;
g.$prevPanel = undefined;
g.$searchPanel = undefined;
g.$searchResultsTAB = undefined;
g.$searchResultsPANEL = undefined;
g.$tabTemplate = undefined;


// MAKE TABS AND PANELS
f.tabsAndPanels = function (source) {
// 	console.log('tabsAndPanels');
	var $tab,
		$panel,
		childCount = 0,
		insertIndex = 1,
		previousAttachTo,
		currentAttachTo;
	
	g.$tabTemplate = $('.TEMPLATES').children('.TAB').first();

	$.getJSON(source, function (result) {


		// MAKE PANELS
		$.each(result, function (i, field) {

			previousAttachTo = currentAttachTo;
			currentAttachTo = field.attachTo;
			var $attachTo = $('.PANEL#' + currentAttachTo);
			
			if (currentAttachTo != previousAttachTo) {
				childCount = 0;
			}

			if (field.contentFunction === "browseUsePaulData") {
				f.browseUsePaulData(field.uniqueName, $attachTo, field.level, childCount);
			} else {
				
				$tab = g.$tabTemplate.clone();
				$tab.addClass('level' + field.level);
				$tab.attr('id', field.uniqueName);
				$tab.children().eq(0).html('<span>' + field.name + '</span>');
				
				$panel = $('<div class="PANEL"></div>');
				$panel.addClass('level' + field.level);
				$panel.attr('id', field.uniqueName);
				$panel.attr('data-code', field.dataCode);
				$panel.htmal = '<h2>' + field.name + '</h2>';
				

				// CHECK FOR NEW LEVEL - TO MAKE THE STYLE OF FIRST TAB/PANEL ACTIVE/SHOWN
				if (currentAttachTo != previousAttachTo) {
					$tab.addClass('clicked');
					$panel.addClass('shown');
				}

				// ATTACH TO DOM
				
				
				var $attachedTabs = $attachTo.children('.TAB');
				
				if ($attachedTabs.length > 0) {
					$attachedTabs.last().after($tab);
				} else {
					$attachTo.append($tab);
				}
				
				$attachTo.append($panel);
				childCount ++;

			}

		});


		g.$prevTab = $('.level0.TAB#TITLES');
		g.$prevPanel = $('.level0.PANEL#TITLES');
		g.$browsePanel = $('.PANEL.level0#BROWSE');

		var $browseTabs = g.$browsePanel.find('.TAB');
		$browseTabs.removeClass('clicked');

		var $browseSpans = $browseTabs.find('span');
		$browseSpans.on('click', f.browseSpanClicked).hover(f.browseIn, f.browseOut);
		g.$browsePanel.find('.PANEL').removeClass('shown');
		g.$browsePanel.addClass('width0');

		var $browseBackButton = $('<div class="browseBackButton" onclick="f.tabClicked(this)"></div>');
		g.$browsePanel.prepend($browseBackButton);

		identifyLastTabForBrowse(g.$browsePanel);

		g.$searchPanel = $('.PANEL.level0#SEARCH');
		g.$searchResultsTAB = $('<div class="searchResultsTAB"></div>');
		g.$addSearchBtn = $('<div class="TAB level1 addSearchBtn persistant" title="Add another search" onclick="f.anotherSearch(this)"></div>');
		g.$addSearchBtn.appendTo(g.$searchResultsTAB);
		g.$searchPanel.append(g.$searchResultsTAB);
		g.$searchResultsPANEL = $('<div class="searchResultsPANEL"></div>');
		g.$searchPanel.append(g.$searchResultsPANEL);


		f.makeTitles('data/titles.json');

	});
};



// USE PAUL'S DATA
// This will be the Browse menu creation function once all the data comes from Paul

f.browseUsePaulData = function (uniqueName, $attachTo, levelNum, childCount) {
	
// 	console.log('usePaulData');

	var source = 'data/' + uniqueName + '.json',
		panel,
		$container = $('<div id="TEMP"></div>'),
		attachLevel = levelNum - 1;

	$.getJSON(source, function (json) {
		
		buildTree(json, $container);
		panelsAfterTabs($container);
		attachToDom($attachTo, $container);
		
	});
	

	
	// MAKE TABS PANEL TAB PANEL FROM DATA
	var $parentDiv,
		classString,
		codeData,
		$span,
		$div,
		$tab,
		$panel,
		$module;
	
	var buildTree = function (tree, $container) {
		
// 		console.log('buildTree', $container);

		if ($.type(tree) === "object") {
			getChildren(tree, $container);
		}
		
		function getChildren(tree, $container) {
			
			for (var child in tree) {

				$parentDiv = $panel;

				if (child !== 'content') {
					
// 					console.log('getChildren', $container.attr('class'));

					classString = child.split(' ').join('_');
					
					$span = $('<span>' + child + '</span>');
					$span.on('click', f.browseSpanClicked).hover(f.browseIn, f.browseOut);
					
					$div = $('<div></div>');
					$div.append($span);
					
					$tab = $('<div class="TAB"></div>');
					$tab.attr('id', classString);
					$tab.attr('onclick', "f.tabClicked(this)");
					$tab.append($div);
					
					$panel = $('<div class="PANEL"></div>');
					$panel.attr('id', classString);
					$panel.html('<h2>' + child + '</h2>');

					if (child === 'code') {
						codeData = (tree[child]);
						$module = $parentDiv;
						$panel.html(codeData);
						$module.attr('data-code', codeData);
						$module.addClass('MODULE');
						$module.parent().addClass('END');
					}
					
					$container.append($tab);
					$container.append($panel);

					buildTree(tree[child], $panel);

				} else {

					buildTree(tree[child], $container);
				}
			}
		}
	};
	
	

	// ORGANISE AND CLASSIFY TABS AND PANELS, MAKE MODULES FROM LEAVES
	var panelsAfterTabs = function ($container) {
		
//  		console.log('panelsAfterTabs');

		// TABS...
		// EXTRACT TABS AND PUT THEM BEFORE PANELS
		var $tabs = $container.children('.TAB');
		$tabs.each(function (i, tab) {
			var $tab = $(tab);
			$tab.removeClass('TAB');
			var leftOverClasses = $tab.attr('class');
			$tab.attr('class', 'TAB');
			$tab.addClass('level' + levelNum).addClass(leftOverClasses);
		});
		$container.children('h2').after($tabs);


		// PANELS...
		var $panels = $container.children('.PANEL');

		// RENAME PANELS TO MATCH MAIN PROJECT
		$panels.each(function (i, panel) {
			var $panel = $(panel);
			$panel.removeClass('PANEL');
			var leftOverClasses = $panel.attr('class');
			$panel.attr('class', 'PANEL');
			$panel.addClass('level' + levelNum).addClass(leftOverClasses);
		});

		// END OF BRANCHES...
		// COMBINE LEAFS WITH THEIR PARENT PANELS...
		$panels.each(function (i, panel) {
			levelNum ++;
			$container = $(panel);

			if ($container.hasClass('END')) {
				
				var tabToFindString = $container.attr('id');
				var $tabToFind = $container.siblings('.TAB#' + tabToFindString);
 				$tabToFind.addClass('LAST paulData');

				// REMOVE NOT-NEEDED TABS
				var $tabsToRemove = $container.find('.TAB');
				$tabsToRemove.remove();

				// RE-CLASS END PANELS TO BECOME MODULES
				var $panelsToRename = $container.children('.PANEL');
				$panelsToRename.each(function (i, panel) {
					var $panel = $(panel);
					$panel.removeClass('PANEL');
					var existingClasses = $panel.attr('class');
					$panel.attr('class', '');
					$panel.addClass('MODULE').addClass(existingClasses);
					
				});
			}
			panelsAfterTabs($container);
		});
	};
	
	
	
	// ATTACH TO CORRECT PLACE IN DOM
	var attachToDom = function($attachTo, $container) {
//  		console.log('attachToDom ' + childCount);

		var $tab = $container.children('.TAB');
		var $panel = $container.children('.PANEL');
		
		setTimeout(function() {
			if (childCount === 0) {
				$attachTo.children('.TAB').eq(childCount).before($tab);
				$attachTo.children('.PANEL').eq(childCount).before($panel);
			} else {
				$attachTo.children('.TAB').eq(childCount - 1).after($tab);
				$attachTo.children('.PANEL').eq(childCount - 1).after($panel);
			}
		}, 1500);
				
	};
};






// IDENTIFY AND ADD CLASS TO THE LAST ELEMENT OF DRILL-DOWN
function identifyLastTabForBrowse($element) {
	$element.children('.PANEL').each(function () {
		var $currentElement = $(this);
		if ($currentElement.children('.TAB').length < 1) {
			// 			console.info($currentElement);
			var uniquename = $currentElement.attr('id');
			var $tabLast = $currentElement.siblings('#' + uniquename);
			$tabLast.addClass('LAST');
			var $lastSpan = $tabLast.find('span');
			$lastSpan.addClass('xxx').off('click', f.browseSpanClicked);
		}
		identifyLastTabForBrowse($currentElement);
	});
}
