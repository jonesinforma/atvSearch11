/* jshint browser: true, devel: true */
/* global $, _, $explore, $cell */ 

var f = {}, // functions
	g = {}; // global variables

var searchObject = [];

g.searchMobileLayoutWidth = 1130;
g.$browsePanel = undefined;
g.$searchPanel = undefined;
g.$panelShown = undefined;
g.$titlesPanelShown = undefined;
g.scrollerContainsPanelsOnly = undefined;

f.prepareSearchButtons = undefined;
	

window.onload = function () {
	g.$TEMPLATES = $('.TEMPLATES');
	
	f.prepareSearchButtons();
	f.tabsAndPanels('data/tabsAndPanels.json');
	
	
	if (window.innerWidth < 1024) {
		g.scrollerContainsPanelsOnly = true; 
		// though it doesn't exist really, it's just to call f.scrollerAddOrRemove to arrange tabs and panels
	}
	
	
	$(window).on('resizeend', function() {
		f.updateLayout();
	});
	
	
};


// ELEM CLICKED
f.elemClicked = function(elem) {
	var $this = $(elem);
	console.log('elemClicked ' + $this.attr('class') + event);
};


// DOT DOT DOT CLICKED
var $prevOptionsClicked;

function showMoreOptions(elem) {
	console.log('showMoreOptions');
	var $this = $(elem);
	
	if ($this.hasClass('active')) {
		$this.removeClass('active');
		$this.next().removeClass('active');
		$prevOptionsClicked = undefined;
		return false;
	}

	$this.toggleClass('active');
	$this.next().toggleClass('active');
	
	if ($prevOptionsClicked) {
		$prevOptionsClicked.removeClass('active');
		$prevOptionsClicked.next().removeClass('active');
	}	
	$prevOptionsClicked = $this;
}