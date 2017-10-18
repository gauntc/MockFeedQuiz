angular.module('MockFeed', ['ui.router'])
  .config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home',
    {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'HomeCtrl'
    }).state('quiz',
    {
      url: '/quiz/{src}',
      templateUrl: '/quiz.html',
      controller: 'QuizCtrl'
    }).state('result',
    {
      url: '/result',
      templateUrl: '/result.html',
      controller: 'ResultCtrl'
    });
    $urlRouterProvider.otherwise('home');
  }])
  .service('quizService', function () {
    return {
      quiz : {},
      answers : []
    };
  })
  .controller('HomeCtrl', [ '$scope', '$http', 'quizService', function($scope, $http, quizService) {
    $scope.quizzes = [];
    $http.get('manifest.json').then(function(data) {
      console.log('data', data);
      data = data.data;
      var quizList = data.quizLinks;
      for (var i = 0; i < quizList.length; i++) {
        $scope.quizzes.push(quizList[i]);
      }
    });
  }])
  .controller('QuizCtrl', [ '$scope', '$stateParams', '$http', '$location', 'quizService', function($scope, $stateParams, $http, $location, quizService) {
    $http.get($stateParams.src).then(function(data) {
      console.log('data', data);
      data = data.data;
      quizService.quiz = data;
      quizService.answers = new Array(data.questions[0].answers.length);
      for (var i = 0; i < quizService.answers.length; i++) {
        quizService.answers[i] = 0;
      }

      $scope.quizTitle = quizService.quiz.title;
      $scope.questions = quizService.quiz.questions;
    });

    $scope.currQuestionIndex = 0;
    $scope.submitAnswer = function(option) {
      var optionIndex = $scope.questions[$scope.currQuestionIndex].answers.indexOf(option);
      $scope.currQuestionIndex++;
      quizService.answers[optionIndex]++;
      if ($scope.currQuestionIndex == $scope.questions.length) {
        $location.path('/result');
      }
    };
    $scope.indexToChar = function(index) {
      return String.fromCharCode(65 + index);
    };
  }])
  .controller('ResultCtrl', [ '$scope', '$http', '$location', 'quizService', function($scope, $http, $location, quizService) {
    $scope.result = quizService.quiz.results[0].resultText;
    $scope.answers = quizService.answers;
    $scope.numberOfQuestions = quizService.quiz.questions.length;
    $scope.getProgressBarLabel = function(index, amount) {
      var percentage = 100 * amount / $scope.numberOfQuestions;
      if (percentage === 0) {
        percentage = "0";
      }
      return String.fromCharCode(65 + index) + " : " + percentage + "%";
    }
    $scope.returnToHome = function() {
      $location.path('/home');
      quizService.quiz = {};
      quizService.answers = [];
    }
  }]);
