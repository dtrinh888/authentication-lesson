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
				//when users reach the login page we'll use $location.search()
				//to get the previous page and upon successful login they get
				//redirected to previous page
				var previousPage = $location.path();
				//used the $location.search() method to set a key value pair of
				//"previous" along with previous page's URL. This info will be
				//accessible in the LoginController
				$location.path('/login').search({
					previous: previousPage
				});
			}
			return request;
		}
	};
})
.config(function($httpProvider){
	//above facotry will not work which is why we need to tell angular
	//to use the interceptor in this config block
	$httpProvider.interceptors.push('authenicationInterceptor');
})


//.controller("LoginController", function(userSession) {
//    this.login = function(username, password) {
//        if(username == 'user' && password == 'password') {
//            userSession.loggedIn = true;
//        }
//    }
//});
//code commented out above will log users in but then they will have to 
//manually access the page they were previously trying to access
//users should be automatically redirected to the page they trying to visit
//before they are asked to login so we would have to mod the controller and 
//interceptor to track and redirect to the previous page
.controller('LoginController', function(userSession, $route, $location){
	var ctrl = this;
	ctrl.previousPage = $location.search().previous;
	ctrl.login = function(username, password){
		if(username == 'user' && password == 'password'){
			userSession.loggedIn = true;
			$location.path(previousPage);
		} else {
			this.loginFailed = true;
		}
	};
});