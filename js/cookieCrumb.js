/* jshint browser: true, devel: true */
/* global $, f, g */


// MAKE and UPDATE COOKIE CRUMBS
f.makeCookieCrumbs = function($tabClicked) {

//	var $activeTab,
//		$crumbToAdd,
//		$cookieCrumbBox,
//		currentLevelNumber = 0,
//		currentLevelClass;
//
//	$activeTab = $('.level0.TAB.active');
//	$cookieCrumbBox = $('.cookieCrumbBox');
//	$cookieCrumbBox.children().remove();
//	
//	while ($activeTab.length > 0) {
//		$crumbToAdd = $activeTab.clone();
//		$crumbToAdd.removeClass('TAB').addClass('cookieCrumb');
//		$crumbToAdd.on('click', crumbClicked);
//		$cookieCrumbBox.append($crumbToAdd);
//		currentLevelNumber++;
//		currentLevelClass = '.level' + currentLevelNumber;
//		
//		if ($tabClicked.hasClass('RT') || $tabClicked.parent().hasClass('RT')) {
//			if (currentLevelNumber == 2) {
//				$activeTab = $activeTab.siblings('.SCROLLER').children('.RT').children(currentLevelClass + '.TAB.active');
//			} else {
//				$activeTab = $activeTab.next('.shown').children(currentLevelClass + '.TAB.active');
//			}
//		} else {
//			$activeTab = $activeTab.next('.shown').children(currentLevelClass + '.TAB.active');
//		}
//	}
};


