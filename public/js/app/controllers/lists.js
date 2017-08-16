!(function(){
	var module = angular.module('quotes');
	module.controller('listCtrl',function($scope,$http,$sce,quoteService){
		$scope.trustAsHtml = $sce.trustAsHtml;

		quoteService.getUser(function(user){
			$scope.user = user.data;
		});

		$scope.removeQuote = function(category,quoteId,quoteText){
			quoteService.removeQuote($scope,category,quoteId,quoteText);
		};
	});
}());