angular.module('authenticationApp', ['ngRoute'])
.factory('userSession', function(){
	//this is not secure! you'd want to use a closure with getter/setter
	//methods here to make the loggedIn value private
	return {
		loggedIn: false
	};
})
.factory('authenicationInterceptor', function(userSession, $location){
	//each time HTTP request is executed, before request is made, the 
	//interceptor checks to see if user is logged in, if not, user
	//will be redirected to the login page
	return {
		request: function(request) {
			//for this app we only want users to be re-routed to login when they
			//try to access a page that makes an Ajax request to Github API
			//to do this we need to make a slight mod to interceptor to tell it
			//to only redirect users if they are not logged in and is trying to 
			//access resources that a URL w/ "api" in it (in this case, the 
			//Github API URL has "api" in it) so we would need to add:
			//request.url.match(/api/) in if statement

			//only redirect if attempting access url with "api" in it
			if(request.url.match(/api/) && !userSession.loggedIn) {
				$location.path('/login');
			}
			return request;
		}
	};
})
.config(function($httpProvider){
	//above facotry will not work which is why we need to tell angular
	//to use the interceptor in this config block
	$httpProvider.interceptors.push('authenicationInterceptor');
});