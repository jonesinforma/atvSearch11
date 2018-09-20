/* jshint browser: true, devel: true */
/* global $, f, g */

var clickLevel,
	prevClickLevel = 0,
	newWidth,
	$browseMenu,
	addLastCrumb = true,
	browseSubmit = false,
	spanSubmit = false;


// BROWSE SPAN CLICKED
f.browseSpanClicked = function (elem) {
//	console.log('browseSpanClicked', elem);
	spanSubmit = true;
	var elemToClick = this.closest('.TAB');
	elemToClick.click();
	return false;
};

// BROWSE CLICKED 
f.browseClicked = function ($this, $panelToShow) {

//   	console.log('browseClicked ' + $this.html());

	// BROWSE main tab
	if ($this.hasClass('level0')) {
		if ($this.hasClass('clicked')) {

			// turn off
			g.$prevTab.click();

		} else {

			// turn on
			$this.addClass('clicked');
			$this.siblings('.TAB').removeClass('clicked');
			$panelToShow.addClass('shown');
			$browseMenu = $this.siblings('.PANEL#BROWSE');
		}
		return false;
	}

	// Browse back button
	if ($this.hasClass('browseBackButton')) {
		var levelToFind = 'level' + clickLevel;
		console.log(levelToFind);
		var $tabToFind = $this.parent().find('.TAB.active.' + levelToFind);
		console.log($tabToFind);
		$tabToFind.removeClass('active');
		clickLevel--;
		f.updateBrowsePanel($this, $panelToShow);
		return;
	}

	// Browse sub-tabs...

	// ... last sub-tab, or clicking on the title span, launch search
	if ($this.hasClass('LAST') || spanSubmit) {
		$this.addClass('clicked');
		browseSubmit = true;
	} else {
		$this.addClass('active');
		$this.siblings('.TAB').removeClass('active');
	}
	

	f.updateBrowsePanel($this, $panelToShow, browseSubmit);


	if (browseSubmit) {
		f.browseSubmitted($this);
	}

	browseSubmit = false;
	spanSubmit = false;
};


// UPDATE SIZE AND POSITION OF BROWSE PANEL
f.updateBrowsePanel = function ($this, $panelToShow, browseSubmit) {
	
// 	console.log('updateBrowsePanel ' + browseSubmit);

	// if the click hasn't resulted in a submit, update the width and position of the browse menu panel
	if (!browseSubmit) {
		if ($this.hasClass('level1')) {
			clickLevel = 1;
		}
		if ($this.hasClass('level2')) {
			clickLevel = 2;
		}
		if ($this.hasClass('level3')) {
			clickLevel = 3;
		}
		if ($this.hasClass('level4')) {
			clickLevel = 4;
		}
	}

	$browseMenu.removeClass('width' + prevClickLevel);
	$browseMenu.addClass('width' + clickLevel);

// 	console.log(prevClickLevel, clickLevel);

	if (clickLevel <= prevClickLevel) {
		$this.siblings('.PANEL').find('.active').removeClass('active');
		$this.siblings('.PANEL').find('.clicked').removeClass('clicked');
	}

	$panelToShow.addClass('shown');
	$panelToShow.siblings('.PANEL').removeClass('shown');

	prevClickLevel = clickLevel;
};




// BROWSE SUBMITTED - make cookie and submit search
f.browseSubmitted = function ($this) {

	var $crumbToAdd,
		currentLevelNumber = 0,
		currentLevelClass,
		browseText,
		branchRootName,
		$branchRoot,
		$branch,
		$leaf,
		$leafToAdd,
		browseArray = [];

	
	browseText = $this.find('span').html();
	branchRootName = $this.attr('id');
	$branchRoot = $this.siblings('.PANEL#' + branchRootName);
	
	
	// BROWSE ARRAY
	
	if ($this.hasClass('paulData') || !$this.hasClass('LAST')) {
		makeBrowseArray($branchRoot);
	} else {
// 		console.log('LAST! ' + branchRootName);
		browseArray.push($branchRoot.attr('data-code'));
	}
	
	function makeBrowseArray($currentBranch) {
		var $branches = $currentBranch.children('.PANEL, .MODULE');
// 		console.log('BRANCHES length is ' + $branches.length);
		
		if ($branches.length > 0) {
			$branches.each(function (i, branch) {
				$branch = $(branch);			
				if ($branch.attr('data-code')) {
					var dataCode = $branch.attr('data-code');
					browseArray.push(dataCode);
				}
				makeBrowseArray($branch);
			});
		} 
// 		console.log(browseArray);
	}

	
	// COOKIE CRUMB
	
	var $activeTab = g.$browsePanel.children('.TAB.active');
	var $cookieCrumbBox = $('<div class="COOKIE"></div>');
	
	if (!$this.closest('.TAB').hasClass('level1')) {
		while ($activeTab.length > 0) {
			$crumbToAdd = $activeTab.clone();
			$crumbToAdd.removeClass('TAB active clicked').addClass('cookieCrumb');
			$cookieCrumbBox.append($crumbToAdd);
			currentLevelNumber++;
			currentLevelClass = '.level' + currentLevelNumber;
			$activeTab = $activeTab.siblings('.PANEL.shown').children('.TAB.active');
		}
	}
	
	if (addLastCrumb) {
		$cookieCrumbBox.append('<div class="cookieCrumb">' + browseText + '</div>');
	}
	
	f.searchSubmitted(browseText, browseArray);
	g.$resultsPanel.addClass('withCookie');
	g.$resultsPanel.prepend($cookieCrumbBox);
//	console.log(browseArray);
	
	if (!spanSubmit || $this.hasClass('LAST')) {
		$this.removeClass('active clicked');
	}
	
	addLastCrumb = true;
	
};


// COOKIE CRUMB CLICKED
f.cookieClicked = function ($this) {

	if (!$this.hasClass('level1')) {
		addLastCrumb = false;
	}
	
	var uniqueName = $this.attr('id');
	
	// find relevant tab in Browse menu and click it
	var $toClick = g.$browsePanel.find('.TAB#' + uniqueName);
	console.log('cookieClicked ' + $toClick.attr('class'));
	$toClick.click();
	$toClick.find('span').click();
};
