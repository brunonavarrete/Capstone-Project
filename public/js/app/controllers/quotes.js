!(function(){
	var module = angular.module('quotes');
	module.controller('quoteCtrl',function($scope,$http,$sce,quoteService){
		$scope.trustAsHtml = $sce.trustAsHtml;
		$scope.newQuote = '';
		
		quoteService.getUser(function(user){
			$scope.user = user.data;
		});

		$scope.setNewQuote = function(id,quote,author,category){
			$scope.newQuote = {_quote_id: id, quote:quote, author: author, category: category};
			($scope.user) ? $scope.checkForQuote(id, quote, category) : 0;
			$scope.fetching = false;
		};

		$scope.checkForQuote = function(id,quote,category){
			$scope.saved = false;
			var userLists = $scope.user.lists;
			for (var i = 0; i < userLists.length; i++) {
				if( userLists[i].category === category ){
					var currentList = i;
					for (var i2 = 0; i2 < userLists[currentList].quotes.length; i2++) {
						if( category === 'trump' || category === 'movies' ){
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
			}
		};

		$scope.getQuote = function(category){
			$scope.fetching = true;
			if( category === 'movies' ){
				var config = {
					method: 'GET',
					url: 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=movies&count=1',
					headers: {'X-Mashape-Authorization':'DHAHiCdCHUmshmR5MtOO3LPsXb7sp1lEbtYjsnudCRSEgzhfC3'}
				}
				quoteService.getQuote(config,function(data){
					$scope.setNewQuote(null, data.data.quote, data.data.author, category);
				});
			} else if( category === 'trump' ){
				quoteService.getQuote({url:'https://api.whatdoestrumpthink.com/api/v1/quotes/random'},function(data){
					$scope.setNewQuote(null, data.data.message, 'Donald J. Trump', category);
				});
			} else if( category === 'misc' ){
				quoteService.getQuote({url:'https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1'},function(data){
					$scope.setNewQuote(data.data[0].ID, data.data[0].content, data.data[0].title, category);
				});
			}
		};

		$scope.updateQuote = function(quote){
			if( $scope.user ){
				if( !$scope.saved ){
					$http.post('/quote', $scope.newQuote);
					$scope.warning = '';
					$scope.saved = true;
					quoteService.getUser(function(user){
						$scope.user = user.data;
					});
				} else {
					quoteService.removeQuote($scope, quote.category, quote._quote_id, quote.quote);
				}
			} else {
				$scope.warning = 'You must be logged in to save a quote';
			}
		};
	});
}());