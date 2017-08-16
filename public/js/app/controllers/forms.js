!(function(){
	var module = angular.module('quotes');
	module.controller('formCtrl',function($scope,$http,$window){
		$scope.submit = function(data){
			var url = ( data.confirmPassword ) ? '/register' : '/login';
			if( data.confirmPassword && (data.password.$viewValue !== data.confirmPassword.$viewValue) ) 
				return $scope.warning = 'Password\'s don\'t match';
			
			$http.post(url,{email:data.email.$viewValue,password:data.password.$viewValue})
			.then(
				function(response){ // success
					if(response.status === 200) return $window.location.href = '/';
				},
				function(err){ // error
					$scope.warning = err.data.message;
				}
			);
		};
	});
}());