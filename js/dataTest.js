/* jshint browser: true, devel: true */
/* global $, f,  g, _ */


var source = 'data/regions_lowerlimb.json';
var levelNum = 2;
var $container = $('<div id="TEMP"></div>');

// USE PAUL'S DATA
var panel;

function usePaulData() {
	
	console.log('usePaulData');
	
	// GET DATA, DO STUFF WITH IT
	var source = 'data/regions_lowerlimb.json';
	$.getJSON(source, function (tree) {
		buildTree(tree, $container);
		panelsAfterTabs($container);
//		$('#MENU').append($container);
		attachToDom($container);
	});

	
	// MAKE TABS AND PANELS FROM DATA    (tab-panel-tab-panel arrangement) 
	var buildTree = function (tree, $container) {
		
		console.log('buildTree');

		if ($.type(tree) === "object") {
			getChildren(tree, $container);
		}

		function getChildren(tree, $container) {
			
			console.log('getChildren');

			var parentDiv,
				classString,
				tab;

			for (var child in tree) {

				parentDiv = panel;

				if (child !== 'content') {

					classString = child.split(' ').join('_');
					tab = document.createElement('div');
					tab.className = 'TAB';
					tab.classList.add(classString);
					tab.innerHTML = '<div>' + child + '</div>';
					panel = document.createElement('div');
					panel.className = 'PANEL';
					panel.classList.add(classString);
					panel.innerHTML = '<h2>' + child + '</h2>';

					if (child === 'code') {
						var codeData = (tree[child]);
						var module = parentDiv;
						panel.innerHTML = codeData;
						panel.setAttribute('class', 'codeBox');
						module.setAttribute('data-code', codeData);
						module.parentNode.classList.add('END');
					}
//
//					if (child !== 'code') {
//						$container.append(tab);
//						$container.append(panel);
//					}
					
					$container.append(tab);
					$container.append(panel);


					buildTree(tree[child], panel);

				} else {

					buildTree(tree[child], $container);
				}
			}

		}
	};
	
	
	// ORGANISE AND CLASSIFY TABS AND PANELS, MAKE MODULES FROM LEAVES
	var panelsAfterTabs = function($container) {
		
		console.log('panelsAfterTabs');
		console.log($container);

		// TABS...
		// EXTRACT TABS AND PUT THEM BEFORE PANELS (RECURSIVE)
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

				// REMOVE NOT-NEEDED TABS
				var $tabsToRemove = $container.find('.TAB.code');
				$tabsToRemove.remove();

				// RE-CLASS END PANELS TO BECOME MODULES
				var $panelsToRename = $container.children('.PANEL');
				$panelsToRename.each(function (i, panel) {
					var $panel = $(panel);
					$panel.removeClass('PANEL');
					var existingClasses = $panel.attr('class');
					$panel.siblings('.TAB.' + existingClasses).addClass('LAST');
					$panel.attr('class', '');
					$panel.addClass('MODULE').addClass(existingClasses);
					
				});
			}
			panelsAfterTabs($container);
		});
	};
	
	
	// ATTACH TO CORRECT PLACE IN DOM
	var attachToDom = function($container) {
		
		var $attachDiv = $('.PANEL.level1.regions');
		var $tab = $container.children('.TAB');
		var $panel = $container.children('.PANEL');
		
		$attachDiv.children('.TAB').last().after($tab);
		$attachDiv.children('.PANEL').last().after($panel);
	};
}















































//		var keys = Object.keys(tree);
//		console.log(typeof(keys), keys);
//		
//		keys.forEach(function(elem, i){
//			var childObj = tree[keys[i]];
//			console.log(i, childObj);
//			if (typeof childObj === 'object') {
//				buildTree(childObj);
//			}
//		});

//		$.each(tree, function(item){
//			
////			document.body.innerHTML += item.name;
////			if(item.tree) buildTree(item.tree);
//		});

// USE PAUL'S DATA
//function usePaulData() {
//	var source = 'data/regions_lowerlimb.json';
//	$.getJSON(source, function(result) {
////		const code = result['content'];
//		const code = ((result || {})["content"] || {})["content"];
//		console.log('*** ' + code);
//		var array = ["<ul>"];
//		function printList(items) {
//			switch ($.type(items)) {
//				case "object":
//					getChildren(items);
//					break;
//				case "string":
//					array.push("<li>" + items + "</li>");
//					//console.log(items);
//					break;
//			}
//
//		}
//
//		function getChildren(parent) {
//			for (var child in parent) {
//				//console.log(child);
//				array.push("<li>" + child + "<ul>");
//				printList(parent[child]);
//				array.push("</ul></li>");
//			}
//		}
//
//		printList(result);
//		array.push("<ul>");
//		$("#list").html(array.join(""));
//	});
//};
//usePaulData();

//		$.getJSON(source, function(json) {
//			var result = {};
//			countKeysPerLevel(result, 0, 0, json);
//			thing(json);
//		});	

//		function countKeysPerLevel(store, level, divLevel, obj) {
//			var keys = Object.keys(obj);
//			var count = keys.length;
//			
////			if (keys[0] !== "content") {
////				divLevel ++;
////			}
//			
//			divLevel =  level - 1;
//
//			store[level] = (store[level] || 0) + count;
//
//			for (var i = 0; i < count; i++) {
//				console.log(level, count, keys, divLevel);
//				var childObj = obj[keys[i]];
//				if (typeof childObj === 'object') {
//					countKeysPerLevel(store, level + 1, divLevel, childObj);
//				}
//			}
//		}


//		function thing(obj) {
//			var keys = Object.keys(obj);
//			var count = keys.length;
//			console.log(keys);
//			keys.forEach(function(elem, i){
//				console.log(elem, i);
//				if (elem === 'content') {
//					var $panel = $('<div>PARENT</div>');
//					$parent.append($panel);
//					$parent = $panel;
//				}
//				else {
//					var $div = $('<div class="' + elem + '">' + elem + '</div>');
//					$parent.append($div);
//				} 
//				
//			})
//			
//			for (var i = 0; i < count; i++) {
//				var childObj = obj[keys[i]];
////				console.log(i, childObj);
//				if (typeof childObj === 'object') {
//					thing(childObj);
//				}
//			}
//		}

//		 Build the tree :


//		// USE PAUL'S DATA
//		function usePaulData() {
//			var source = 'data/regions_lowerlimb.json';
//			$.getJSON(source, function(json) {
//				console.log(json);
//				obj = JSON.parse(json);
//				console.log(obj);
//			});
//		}
//		usePaulData();
