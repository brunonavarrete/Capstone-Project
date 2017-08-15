!(function(){
	var module = angular.module('quotes', []);

	module.service('quoteService',function($http){
		this.getCode = function(callback){
			$http.get('http://quotes.stormconsultancy.co.uk/random.json').then(callback);
		}

		this.getTrump = function(callback) {
			$http.get('https://api.whatdoestrumpthink.com/api/v1/quotes/random').then(callback);
		}

		this.getMisc = function(callback){
			$http.get('http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1').then(callback);
		}

	});

	module.controller('quotesCtrl',function($scope,$http,quoteService){
		$scope.newQuote = '';
		$scope.getCode = function(){
			quoteService.getCode(function(data){
				$scope.currentCat = 'code';
				$scope.newQuote = {
					quote: data.data.quote,
					author: data.data.author
				};
			});
		}

		$scope.getTrump = function(){
			quoteService.getTrump(function(data){
				$scope.currentCat = 'trump';
				$scope.newQuote = {
					quote: data.data.message,
					author: 'Donald J. Trump'
				};
			});
		}

		$scope.getMisc = function(){
			quoteService.getMisc(function(data){
				$scope.currentCat = 'misc';
				var strippedQuote = data.data[0].content.replace(/<p>|<\/p>/gi,'');
				$scope.newQuote = {
					quote: strippedQuote,
					author: data.data[0].title
				};
			});
		}

		$scope.saveQuote = function(quote){
			quote = $scope.newQuote;
			console.log(quote);
			$http.post('/quote', quote, function(){
				console.log('hello from controller');
			});
		}
	});

	module.directive('quotes',function(){
		return {
			templateUrl: 'templates/quotes.html',
			replace: true,
			controller: 'quotesCtrl'
		  }
	});

	module.directive('register',function(){
		return {
			templateUrl: 'templates/register.html',
			replace: true,
			controller: 'quotesCtrl'
		  }
	});

}());