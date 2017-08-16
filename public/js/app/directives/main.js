!(function(){
	var module = angular.module('quotes');
	module.directive('quotes',function(){
		return {
			templateUrl: 'templates/quotes.html',
			replace: true,
			controller: 'quoteCtrl'
		  }
	});

	module.directive('lists',function(){
		return {
			templateUrl: 'templates/lists.html',
			replace: true,
			controller: 'listCtrl'
		  }
	});
}());