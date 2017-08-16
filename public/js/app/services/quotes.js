!(function(){
	var module = angular.module('quotes');
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
})();	