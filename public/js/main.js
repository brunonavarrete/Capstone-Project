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

		this.getUser = function(callback){
			$http.get('/user').then(callback);
		}

	});

	module.controller('quotesCtrl',function($scope,$http,quoteService){
		$scope.newQuote = '';
		
		quoteService.getUser(function(user){
			$scope.user = user.data;
		});

		$scope.getCode = function(){
			quoteService.getCode(function(data){
				$scope.currentCat = 'code';
				$scope.newQuote = {
					_quote_id: data.data.id,
					quote: data.data.quote,
					author: data.data.author,
					category: $scope.currentCat
				};
			});
		}

		$scope.getTrump = function(){
			quoteService.getTrump(function(data){
				$scope.currentCat = 'trump';
				$scope.newQuote = {
					_quote_id: null,
					quote: data.data.message,
					author: 'Donald J. Trump',
					category: $scope.currentCat
				};
			});
		}

		$scope.getMisc = function(){
			quoteService.getMisc(function(data){
				console.log(data);
				$scope.currentCat = 'misc';
				var strippedQuote = data.data[0].content.replace(/<p>|<\/p>/gi,'');
				$scope.newQuote = {
					_quote_id: data.data[0].ID,
					quote: strippedQuote,
					author: data.data[0].title,
					category: $scope.currentCat
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

	module.controller('listsCtrl',function($scope,$http,quoteService){
		quoteService.getUser(function(user){
			$scope.user = user.data;
		});
	});

	module.directive('quotes',function(){
		return {
			templateUrl: 'templates/quotes.html',
			replace: true,
			controller: 'quotesCtrl'
		  }
	});

	module.directive('lists',function(){
		return {
			templateUrl: 'templates/lists.html',
			replace: true,
			controller: 'listsCtrl'
		  }
	});

}());