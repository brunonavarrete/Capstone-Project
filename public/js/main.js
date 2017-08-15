!(function(){
	var module = angular.module('quotes', []);

	module.service('quoteService',function($http){
		this.getQuote = function(url,callback){
			$http.get(url).then(callback);
		}

		this.getUser = function(callback){
			$http.get('/user').then(callback);
		}

		this.removeQuote = function(lists,category,quoteId,quoteText,callback){
			var userLists = lists;
			for (var i = 0; i < userLists.length; i++) {
				if( userLists[i].category === category ){
					var currentList = i;
					var quoteArray = userLists[currentList].quotes;
					var newQuoteArray = quoteArray.filter(function(quote){
						if( category === 'trump' ){
							if( quote.quote !== quoteText ){
								return quote;
							}
						} else {
							if( quote._quote_id !== quoteId ){
								return quote;
							}
						}
					});

					var updatedList = {
						_id: userLists[currentList]._id,
						quotes: newQuoteArray
					}

					return $http.put('/lists', updatedList);
				}
			}
		};

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

		$scope.checkForQuote = function(id,quote,category){
			var userLists = $scope.user.lists;
			for (var i = 0; i < userLists.length; i++) {
				if( userLists[i].category === category ){
					var currentList = i;
					for (var i2 = 0; i2 < userLists[currentList].quotes.length; i2++) {
						if( category === 'trump' ){
							if( userLists[currentList].quotes[i2].quote === quote ){
								return $scope.saved = true;
							} else {
								$scope.saved = false;
							}
						} else {
							if( userLists[currentList].quotes[i2]._quote_id === id ){
								return $scope.saved = true;
							} else {
								$scope.saved = false;
							}
						}
					}
				}
			};
		}

		$scope.getQuote = function(category){
			if( category === 'code' ){
				quoteService.getQuote('http://quotes.stormconsultancy.co.uk/random.json',function(data){
					$scope.setNewQuote(data.data.id, data.data.quote, data.data.author,category);
					$scope.checkForQuote(data.data.id, data.data.quote, category);
				});	
			} else if( category === 'trump' ){
				quoteService.getQuote('https://api.whatdoestrumpthink.com/api/v1/quotes/random',function(data){
					$scope.setNewQuote(null, data.data.message, 'Donald J. Trump',category);
					$scope.checkForQuote(null, data.data.message, category);
				});
			} else if( category === 'misc' ){
				quoteService.getQuote('http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',function(data){
					var strippedQuote = data.data[0].content.replace(/<p>|<\/p>/gi,'');
					$scope.setNewQuote(data.data[0].ID, strippedQuote, data.data[0].title,category);
					$scope.checkForQuote(data.data[0].ID, strippedQuote, category);
				});
			}
		}

		$scope.updateQuote = function(quote){
			if( $scope.user ){
				if( !$scope.saved ){
					quote = $scope.newQuote;
					$http.post('/quote', quote);
					$scope.warning = '';
					$scope.saved = true;
					quoteService.getUser(function(user){
						$scope.user = user.data;
					});
				} else {
					var category = quote.category;
					var quoteText = quote.quote;
					var quoteId = quote._id;
					var userLists = $scope.user.lists;
					for (var i = 0; i < userLists.length; i++) {
						if( userLists[i].category === category ){
							var currentList = i;
							var quoteArray = userLists[currentList].quotes;
							var newQuoteArray = quoteArray.filter(function(quote){
								if( category === 'trump' ){
									if( quote.quote !== quoteText ){
										return quote;
									}
								} else {
									if( quote._quote_id !== quoteId ){
										return quote;
									}
								}
							});

							var updatedList = {
								_id: userLists[currentList]._id,
								quotes: newQuoteArray
							}

							$scope.user.lists[currentList].quotes = newQuoteArray;
							$scope.saved = false;
							return $http.put('/lists', updatedList);
						}
					}
				}
			} else {
				$scope.warning = 'You must be logged in to save a quote';
			}
		}
	});

	module.controller('listsCtrl',function($scope,$http,quoteService){
		quoteService.getUser(function(user){
			$scope.user = user.data;
		});

		$scope.removeQuote = function(category,quoteId,quoteText){
			var userLists = $scope.user.lists;
			for (var i = 0; i < userLists.length; i++) {
				if( userLists[i].category === category ){
					var currentList = i;
					var quoteArray = userLists[currentList].quotes;
					var newQuoteArray = quoteArray.filter(function(quote){
						if( category === 'trump' ){
							if( quote.quote !== quoteText ){
								return quote;
							}
						} else {
							if( quote._quote_id !== quoteId ){
								return quote;
							}
						}
					});

					var updatedList = {
						_id: userLists[currentList]._id,
						quotes: newQuoteArray
					}

					$scope.user.lists[currentList].quotes = newQuoteArray;

					return $http.put('/lists', updatedList);
				}
			}
		}

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