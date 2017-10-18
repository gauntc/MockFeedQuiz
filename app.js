angular.module('News', ['ui.router'])
  .config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home',
    {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    }).state('posts',
    {
      url: '/quiz/{src}',
      templateUrl: '/quiz.html',
      controller: 'QuizCtrl'
    });
    $urlRouterProvider.otherwise('home');
  }])
  //From here on out it's from the old assignment
  .factory('postFactory', [
    function(){
      var o = { posts: [] };
      return o;
  }])
  .controller('MainCtrl', [ '$scope', '$http', function($scope, $http){
    $scope.quizzes = [];

    $http.get('manifest.json').then(function(response) {
      console.log('data', data);
      var data = response.data;
      var quizList = data.quizLink;
      for( var i = 0; i < quizList.length; i++) {
       $scope.quizzes.push(quizList[i]);
      }
    });

    /*$scope.test = 'Hello world!';
    $scope.posts = postFactory.posts;
    $scope.addPost = function(){
      if($scope.formContent === '') { return; }
      $scope.posts.push({ title: $scope.formContent, upvotes: 0, comments: [ ] });
      $scope.formContent = '';
    };
    $scope.incrementUpvotes = function(post) {
      post.upvotes += 1;
    };*/
  }])
  .controller('PostsCtrl', [ '$scope', '$stateParams', 'postFactory', function($scope, $stateParams, postFactory){
    $scope.post = postFactory.posts[$stateParams.id];
    $scope.addComment = function(){
      if($scope.body === '') {
        return;
      }
      $scope.post.comments.push({ body: $scope.body, upvotes: 0 });
      $scope.body = '';
    };
    $scope.incrementUpvotes = function(comment){
      comment.upvotes += 1;
    };
  }]);
