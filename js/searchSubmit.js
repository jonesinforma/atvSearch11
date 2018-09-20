/* jshint browser: true, devel: true */
/* global $, f, g, includedArray, makeFilters */


// SEARCH SUBMITTED
var searchText,
	searchString,
	searchId,
	testSearchString = 'brachial',
	testSearchString = 'oralcavity',
	searchTextLink,
	$resultsTab,
	tabArray = [],
	panelArray = [],
	searchIndex = 0,
	anotherSearch = false;

g.$resultsPanel = undefined;
g.searchInput = undefined;
g.$searchInputBox = undefined;
g.$searchClear = undefined;
g.$searchButton = undefined;
g.allSearches = {};
g.activeSearchId = undefined;

f.enterSearchText = undefined;
f.clearSearchInput = undefined;




// PREPARE BUTTONS & INPUT
f.prepareSearchButtons = function() {
	

	// Input
	g.$searchInputBox = $('#searchText');
	g.$searchInputBox.on('keydown', function(e) {
		f.enterSearchText(e.target.value, e);
	});
	g.$searchInputBox.on('input', checkForEmptyInput);
	
	// Clear input
	g.$searchClear = $('.searchBox .searchClear');
	g.$searchClear.on('click', f.clearSearchInput);
	
	// Submit via search button
	g.$searchButton = $('.searchBox .searchButton');
	g.$searchButton.on('click', function() {
		var $searchText = $('#searchText');
		if ($searchText.val()) {
			f.enterSearchText($searchText.val(), null);
		}
	});
};


// SEARCH ENTER
f.enterSearchText = function(inputText, e){
	
	// Search submitted by return key
	if (e && e.keyCode == 13) {
		searchText = e.target.value;
//		searchText = testSearchString;
		console.log(searchText);
		if (searchText) {
			f.searchSubmitted(searchText);
		}
	}
	
	// Search submitted via button
	if (e === null) {
		f.searchSubmitted(inputText);
	}
};


// IF INPUT TEXT IS DELETED
function checkForEmptyInput(e) {
	console.log(g.$searchInputBox.val().length, e.target.value);
	if (g.$searchInputBox.val().length < 1) {
		g.$searchClear.fadeOut();
		g.$searchButton.removeClass('clickable');
	} else {
		g.$searchClear.fadeIn();
		g.$searchButton.addClass('clickable');
	}
}

// CLEAR SEARCH INPUT
f.clearSearchInput = function(e) {
	console.log('f.clearSearchInput');
	g.$searchClear.css('display', '');
	g.$searchInputBox.val('');
	g.$searchButton.removeClass('clickable');
	g.$searchInputBox.focus();
	
};

// INITIALISE SEARCH
f.searchSubmitted = function (input, browseArray) {
	
	console.log('input is ' + input);

	g.searchInput = input;
	searchString = g.searchInput.split(' ').join('');
	
	searchTextLink = 'search' + searchString;
	var source = 'data/' + searchTextLink + '.json'; // pre-prepared search results
	
//	var source = 'http://webx:8082/openSearch/' + g.searchInput;
	
	console.log('$$$$ ' + source);
	
	searchId = searchString + searchIndex;

	g.$resultsPanel = g.$TEMPLATES.children('.PANEL.level1#SEARCH').clone();
	g.$resultsPanel.addClass(searchId + ' shown');
	g.$resultsPanel.attr('id', searchId);
	g.$resultsPanel.attr('data-index', searchIndex);

	$resultsTab = g.$TEMPLATES.children('.TAB.level1#SEARCH').clone();
	$resultsTab.addClass(searchId);
	$resultsTab.attr('id', searchId);
	$resultsTab.children('.title').html(g.searchInput);

	getSearchData(source, browseArray);
	
};


// GET DATA
var count;
function getSearchData(source, browseArray) {
	$.getJSON(source, function (json) {})
	.done(function (json) {
		count = Object.keys(json).length;
//		console.log('count is ' + count);
		makeSearchResults(json);
	})
	.fail(function (jqXHR, textStatus, errorThrown) {
 		console.log('json fail ' + textStatus);
		usePlaceHolderTitle();
		if (browseArray) {
// 			console.log(browseArray);
			showBrowseModules(browseArray);
		}
	});
	
//	$.ajax({
//            "async": true,
//			"crossDomain": true,
//			"dataType": "JSONP",
//			"url": source,
//			"method": "GET",
//			"headers": {
//				"Access-Control-Allow-Credentials": true,
//				"Access-Control-Allow-Origin": "*",
//				"Access-Control-Allow-Methods": "GET",
//				"Access-Control-Allow-Headers": "Content-Type",
//			}
//        })
//        .done(function (json) {
// 			count = Object.keys(json).length;
//	//		console.log('count is ' + count);
//			makeSearchResults(json);
//        })
//        .fail(function(jqXHR, status, error) {
// 			console.log('json fail ' + status);
//			usePlaceHolderTitle();
//			if (browseArray) {
//	// 			console.log(browseArray);
//				showBrowseModules(browseArray);
//			}
//        });
	
	
//	const proxyurl = "https://cors-anywhere.herokuapp.com/";
//	const url = source; // site that doesn’t send Access-Control-*
//	fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
//	.then(response => response.text())
//	.then(contents => console.log(contents))
//	.catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"));
}


// MAKE RESULTS
function makeSearchResults(json) {

	var previousType,
		$searchGroupTab,
		$searchGroupPanel,
		$prevSearchTab,
		$prevSearchPanel,
		$cellParent,
		filterCategories = {
			"type": [],
			"product": [],
			"region": [],
			"system": []
		},
		thumbDir = 'http://primalpictures-stg.s3.amazonaws.com/primaldata/html5har2014/content/';

 	console.log('***makeSearchResults');
	console.log(json);
	g.allSearches[searchId] = json;
	console.log(g.allSearches);

	
	$.each(json, function (mediaType, result) {

		console.log(filterCategories.type);
		
		if (mediaType !== previousType) {
			filterCategories.type.push(mediaType);
			if ($searchGroupTab !== undefined) {
				g.$resultsPanel.find('.searchGroups').append($searchGroupTab).append($searchGroupPanel);
			}
			$searchGroupTab = g.$TEMPLATES.children('.searchGroupTab').clone();
			$searchGroupTab.find('.searchGroupTitle').html(mediaType);
			$searchGroupTab.attr('id', mediaType);
			previousType = mediaType;
			$searchGroupPanel = g.$TEMPLATES.children('.searchGroupPanel').clone();
			$searchGroupPanel.attr('id', mediaType);
		}		
		
		
		$.each(result, function(result, modules) {
//			console.log('RESULT is ' + result);
//			console.log('MODULES is ' + modules);
			
			$.each(modules, function(i, module) {
//				console.log('i is ' + i);
//				console.log('module.mediaID is ' + module.mediaID);
				
				var name = module.productCode;
				
				var thumbPath = 'images\\homepageimages\\' + name.split('_')[0] + '_' + name.split('_')[1] + '-01.png';
//				console.log(thumbPath);
				
				var thumbURLcomplete = thumbDir + name + '/thumbnails_112x112/' + module.thumbURL.split('/')[1];
				thumbURLcomplete = thumbURLcomplete.toLowerCase();
//				console.log(thumbURLcomplete);
				
				
				var otherTitle;
				var titleName = name.split('_')[1];
				switch(titleName) {
					case 'Foot' :
						otherTitle = "Leg, Ankle and Foot";
						break;
					default :
						otherTitle = titleName;
				}
				
				var exploreCategory;
				var productCategory = name.split('_')[0];
				switch(productCategory) {
					case 'HAR' :
						exploreCategory = '3D Atlas';
						break;
					case 'HAP' :
						exploreCategory = 'Anatomy & Physiology';
						break;
					case 'RT' :
						exploreCategory = '3D Real-time';
						break;
				}
				
				if (filterCategories.product.indexOf(exploreCategory) < 0) {
					filterCategories.product.push(exploreCategory);
				}
				
				var $newSearchCell = g.$TEMPLATES.children('.searchCell').clone();

				$newSearchCell.find('.type h2').html(mediaType);
				$newSearchCell.find('.titleHeading').html(result);
				$newSearchCell.find('.exploreTable > h1').html(result);
				$newSearchCell.find('.moduleShadow > .image img').attr('src', thumbURLcomplete);
				$newSearchCell.find('.exploreImageDiv img').attr('src', thumbURLcomplete);
				
				if (i === 0) {
					$cellParent = $newSearchCell;
					$searchGroupPanel.children('.heightGauge').append($cellParent);
				}
				
				var $optionCell = g.$TEMPLATES.children('.optionCell').clone();
				$optionCell.addClass(productCategory).addClass(name);
				$optionCell.find('.optionCellTitle span').html(exploreCategory);
				$optionCell.find('img').attr('src', thumbPath);
				$optionCell.find('.title').html(otherTitle);
				$cellParent.find('.exploreOptions').append($optionCell);
				
				// prepare for filters to be added
//				$.each(filterCategories, function(key, record){
//					console.log(key, record);
//					if (filterCategories[key].indexOf(result[key]) < 0) {
//						filterCategories[key].push(result[key]);
//					}
//				});
				
			});
		});

	});

	// add the last ones on after .each has run
	var $searchGroups = g.$resultsPanel.find('.searchGroups');
	$searchGroups.append($searchGroupTab);
	$searchGroups.append($searchGroupPanel);
	
	addSearchToDom();	

	f.countHiddenCells($searchGroups.children('.PANEL'));
	f.makeFilters(filterCategories, g.$resultsPanel.find('.filterScroller'));
	
}


// ADD ANOTHER SEARCH

f.anotherSearch = function(elem) {
	
	var $elem = $(elem);
	$elem.toggleClass('noticeMe');
	$('.TAB.level0#BROWSE').toggleClass('noticeMe');
	g.$searchInputBox.toggleClass('noticeMe');
	
	$elem.siblings().addClass('persistant').removeClass('alone');
	g.$searchPANELbox.children().addClass('persistant');
	
	
	g.$searchInputBox.val('');
	
	// addding another search
	if ($elem.hasClass('noticeMe')) {
		anotherSearch = true;
		$elem.attr('title', 'Cancel');
		g.$searchInputBox.focus();
		g.$searchButton.removeClass('clickable');
	} else {
		// cancel adding another search
		anotherSearch = false;
		$elem.attr('title', 'Add another search');
		g.$searchInputBox.blur();
		g.$searchClear.css('display', '');
		$elem.siblings().last().removeClass('persistant');
		g.$searchPANELbox.children().last().removeClass('persistant');
	}
	console.log('anotherSearch is ' +  anotherSearch);
};


// ADD SEARCH RESULT TO DOM

function addSearchToDom() {
	
// 	console.log('addSearchToDom, anotherSearch is ' + anotherSearch);
	
	g.$searchPANELbox.children().not('.persistant').remove();
	g.$searchTABbox.children().not('.persistant').remove();
	
	if (!anotherSearch) {
		tabArray.shift();
		panelArray.shift();
	}
// 	console.log('HELLO ' + g.$searchTABbox.children('.TAB').not('.addSearchBtn').length, $resultsTab);
	if (g.$searchTABbox.children('.TAB').not('.addSearchBtn').length < 1) {
// 		console.log('alone');
		$resultsTab.addClass('alone');
	}
	
	$('.noticeMe').removeClass('noticeMe');
	
	var $appendToTab;
	$appendToTab = $('.TAB.level0#SEARCH');
	g.$resultsPanel.appendTo(g.$searchPANELbox);
	g.$searchTABbox.children('.addSearchBtn').before($resultsTab);
	
	

	// SHOW THE SEARCH PANEL
	$appendToTab.css('opacity', '1');
	$appendToTab.click();
	g.$prevTab = $appendToTab;
// 	console.log('addSearchToDom, g.$prevTab is ' + g.$prevTab.attr('class'));
	$resultsTab.click();
	f.checkForMultiRowTabs();
	searchIndex ++;
	
	anotherSearch = false;
	
}

// BROWSE: SHOW TEMP CODE MODULES
function showBrowseModules(browseArray) {
	var $browseContainer = $('<div class="browseContainer"></div>');
	$.each(browseArray, function(i, code) {
//		console.log(code);
		var $browseResult = $('<div class="browseResult"></div>');
		$browseResult.html(code);
		$browseContainer.append($browseResult);
	});
//	console.log($browseContainer.html());
	g.$resultsPanel.find('.searchGroups').append($browseContainer);
}


// TEMP - PLACEHOLDER FOR WHEN THERE'S NO DATA
function usePlaceHolderTitle() {
// 	console.log('usePlaceHolderTitle');
	g.$resultsPanel.addClass('filtersHidden withPlaceholderText').removeClass('filtersShown withCookie');
	var placeHolderText = $("<div class='placeHolderDiv'>There is no data for '" + g.searchInput + "' yet</div>");
	$resultsTab.children('.title').html(g.searchInput);
	g.$resultsPanel.find('.searchGroups').append(placeHolderText);
	addSearchToDom();
}




// SHOW TYPE TITLES ON SEARCH RESULTS - not needed with the new folder structure
f.showTypeTitle = function ($container) {
	//	console.log('showTypeTitle - ' + $container.closest('.level1.PANEL').attr('class'));
	// 	console.log('showTypeTitle - ' + $container.attr('class'));

	// for when window is resized
	$container.find('.type').removeClass('first').removeClass('shown').removeClass('last');

	var numChild = $container.children().length;
	// 	console.log('showTypeTitle - ' + $container.attr('class') + ' - ' + numChild);

	var previoustypeTitle,
		previousRowPosY,
		previoustypeTitleText,
		currenttypeTitle,
		currentRowPosY,
		currenttypeTitleText;

	for (var i = 0; i < numChild; i++) {

		previoustypeTitle = $container.children().eq(i - 1);
		previousRowPosY = previoustypeTitle.offset().top;
		previoustypeTitleText = previoustypeTitle.find('.type h2').html();

		currenttypeTitle = $container.children().eq(i);
		currentRowPosY = currenttypeTitle.offset().top;
		currenttypeTitleText = currenttypeTitle.find('.type h2').html();
		console.log(currenttypeTitleText);

		if (currentRowPosY != previousRowPosY) {
			$(currenttypeTitle).children('.type').addClass('first');
		}
		if (currentRowPosY != previousRowPosY || currenttypeTitleText != previoustypeTitleText) {
			$(currenttypeTitle).children('.type').addClass('shown');
			$(previoustypeTitle).children('.type').addClass('last');
		}
	}
	$(currenttypeTitle).children('.type').addClass('last');
};
