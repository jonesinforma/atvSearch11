/* jshint browser: true, devel: true */
/* global $, f,  g, _ */

g.$TITLESpanel = undefined;
g.$titlesTABS = undefined;

var groupTitles,
	groupClasses = [],
	displayOrder = 
	[	
		"3D Atlas",
		"3D Real-time",
		"Latin",
		"Spanish",
		"Portuguese",
		"German",
		"Chinese",
		"Japanese",
		"Anatomy and Physiology",
		"Functional Anatomy",
		"Palms",
		"Clinical Specialties",
		"Imaging",
		"Language Editions",
		"Quizzes and Activities",
		"Other Products"
	],
	rtProducts =
	[
		"English",
		"Latin",
		"Spanish",
		"Portuguese",
		"German",
		"Chinese",
		"Japanese"
	];


// MAKE TITLES PANELS
f.makeTitles = function(source) {
	
	g.$TITLESpanel = $('.PANEL.level0#TITLES');
	g.$titlesScroller = $('<div class="PANEL level1 SCROLLER"></div>');
	g.$titlesScroller.on('scroll', f.scrollTitles);
	
	
		
			$.getJSON(source, function (results) {
	//		groupTitles = Object.keys(results);
	// 		console.log(results);
				
			makeTabs(displayOrder, 1, g.$TITLESpanel);
//			makeTabs(rtProducts, 2, g.$TITLESpanel);
				
			function makeTabs(displayOrderArray, level, $attachTo) {
// 				console.log('makeTabs');

				$.each(displayOrderArray, function(i, name) {
					
// 					console.log(name);

					var modules = results[name];
					var groupClass = name;
					groupClass = groupClass.replace(/[\s.;,?%&-]/g, '');


					// MAKE TABS FOR TITLES

					var $tab = g.$tabTemplate.clone();
					$tab.addClass('level1');
					$tab.attr('id', groupClass);
					$tab.children().eq(0).html('<span>' + name + '</span>');
// 					console.log($attachTo);
					$attachTo.append($tab);

					makeTitlesPanels(modules, groupClass, name, level);

				});
			}
		
		
		
		// MAKE TITLES SCROLLER

		var $panels = g.$TITLESpanel.children('.PANEL');
		g.$TITLESpanel.append(g.$titlesScroller);
		$panels.appendTo(g.$titlesScroller);
		g.scrollerContainsPanelsOnly = true;
		
		
		// MAKE PANEL GROUPS FOR TITLES MODULES
		
		function makeTitlesPanels(modules, groupClass, name, level) {
			var $panelToMake = $('<div class="PANEL level' + level + '"></div>');
			$panelToMake.attr('id', groupClass);
			groupClasses.push(groupClass);
			var $h2 = $('<h2>' + name + '</h2>');
			$panelToMake.append($h2);
			makeModules($panelToMake, modules);
			g.$titlesScroller.append($panelToMake);
		}
		
// 		console.log(groupClasses);		
		
		
		// MAKE MODULES
		function makeModules($panelToMake, modules) {
//  		console.log('***makeModules$$$');
// 			console.log(modules);

			modules.map(function(item) {
				
				var module = document.createElement('div');
				module.className = 'module';
				module.setAttribute('data-titleid', item.titleID);
				module.setAttribute('data-name', item.name);
				module.addEventListener('click', f.elemClicked);
				var moduleTitle = item.name;
				moduleTitle = moduleTitle.replace('3D ', '');
				moduleTitle = moduleTitle.replace('Real-time: ', '');
				moduleTitle = moduleTitle.replace('Atlas: ', '');
				moduleTitle = moduleTitle.replace('Quiz: ', '');
		
				var moduleInner = '<div class="image">';
				moduleInner += '<img src="' + item.thumb_url + '"></div>';
				moduleInner += '<div class="title">' + moduleTitle;
				moduleInner += '</div>';
		
				module.innerHTML = moduleInner;
				$panelToMake.append(module);
			});
		}
		f.scrollerAddOrRemove();
		arrangeRT();
	});
	
	function arrangeRT() {
// 		console.log('ARRANGE RT');
		var $realTimePanel,
			$englishTab,
			$englishPanel,
			$productPanel;
			
		$realTimePanel = g.$titlesScroller.children('#3DRealtime');
		$englishPanel = $realTimePanel.clone();
		$englishPanel.attr('id', 'English');
		$englishPanel.children('h2').html('English');
		$realTimePanel.html('<h2>3D Real-time</h2>');
		
		$englishTab = $('.TAB#3DRealtime').clone();
		$englishTab.attr('id', 'English');
		$englishTab.find('span').html('English');
		$englishTab.removeClass('level1').addClass('level2 clicked');
		$realTimePanel.append($englishTab);
		for (var i = 1; i < rtProducts.length; i++) {
			var tabString = rtProducts[i];
// 			console.log('FOR ' + tabString);
			var $rtTab = $('.TAB.level1#' + tabString);
			$rtTab.removeClass('level1').addClass('level2');
			$realTimePanel.append($rtTab);
		}
		
		$realTimePanel.append($englishPanel);
		$.each(rtProducts, function(i, product) {
// 			console.log(i, product);
			var idString = '.PANEL.level1#' + product;
			$productPanel = $(idString);
			$productPanel.removeClass('level1').addClass('level2');
			if (i === 0) {
				$productPanel.addClass('shown');
			}
// 			console.log($productPanel);
			$realTimePanel.append($productPanel);
		});
		g.$titlesTABS = g.$TITLESpanel.children('.TAB.level1');
		g.$titlesTABS.eq(0).click();
	}
};
