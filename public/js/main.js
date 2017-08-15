!(function(){
	var module = angular.module('quotes', []);

	module.service('quoteService',function($http){
		this.getQuote = function(url,callback){
			$http.get(url).then(callback);
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

		$scope.setNewQuote = function(id,quote,author,category){
			$scope.newQuote = {
				_quote_id: id,
				quote: quote,
				author: author,
				category: category
			};
		}

		$scope.getQuote = function(category){
			$scope.currentCat = category;
			var quoteData = [];
			if( category === 'code' ){
				quoteService.getQuote('http://quotes.stormconsultancy.co.uk/random.json',function(data){
					$scope.setNewQuote(data.data.id, data.data.quote, data.data.author,category);
				});	
			} else if( category === 'trump' ){
				quoteService.getQuote('https://api.whatdoestrumpthink.com/api/v1/quotes/random',function(data){
					$scope.setNewQuote(null, data.data.message, 'Donald J. Trump',category);
				});
			} else if( category === 'misc' ){
				quoteService.getQuote('http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',function(data){
					var strippedQuote = data.data[0].content.replace(/<p>|<\/p>/gi,'');
					$scope.setNewQuote(data.data[0].ID, strippedQuote, data.data[0].title,category);
				});
			}
		}

		$scope.saveQuote = function(quote){
			if( $scope.user ){
				quote = $scope.newQuote;
				$http.post('/quote', quote, function(){
					console.log('hello from controller');
				});
				$scope.warning = '';
				quoteService.getUser(function(user){
					$scope.user = user.data;
				});
			} else {
				$scope.warning = 'You must be logged in to save a quote';
			}
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