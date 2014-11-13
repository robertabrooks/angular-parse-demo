/*
    app.js
    code for our demo application
 */

"use strict";

//this is the base URL for all task objects managed by your application
//requesting this with a GET will get all tasks objects
//sending a POST to this will insert a new task object
//sending a PUT to this URL + '/' + task.objectId will update an existing task
//sending a DELETE to this URL + '/' + task.objectId will delete an existing task
var tasksUrl = 'https://api.parse.com/1/classes/tasks';

angular.module('ToDoApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        //Parse required two extra headers sent with every HTTP request: X-Parse-Application-Id, X-Parse-REST-API-Key
        //the first needs to be set to your application's ID value
        //the second needs to be set to your application's REST API key
        //both of these are generated by Parse when you create your application via their web site
        //the following lines will add these as default headers so that they are sent with every
        //HTTP request we make in this application
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'uDLoWWvG2BJnbvGEuln7eWSLNBZQGnL0hoH6SXft';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = '8MmLA19mZQ9D3CTa5tH18sVzten63290khd0DbM9';
    })
    .controller('TasksController', function($scope, $http) {
       $scope.refreshTasks = function() {
          $http.get(tasksUrl + '?where={"done":false}')
             .success(function(data) {
                $scope.tasks = data.results;
              });
       };
       $scope.refreshTasks();

       $scope.newTask = {done: false};

       $scope.addTask = function() {
          $scope.inserting = true;
          $http.post(tasksUrl, $scope.newTask)
             .success(function(responseData) {
                $scope.newTask.objectId = responseData.objectId;
                $scope.tasks.push($scope.newTask);
                $scope.newTask = {done: false};
             })
             .finally(function() {
                $scope.inserting = false;
             });
       };

       $scope.updateTask = function(task) {
          $http.put(tasksUrl + '/' + task.objectId, task)
             .success(function() {
                //we could give some feedback to the user
             });
       };

       $scope.incrementVotes = function(task, amount) {
           var postData = {
               votes: {
                   __op: "Increment",
                   amount: amount
               }
           };
           console.log(postData);
           $scope.updating = true;
           $http.put(tasksUrl + '/' + task.objectId, postData)
               .success(function (respData) {
                   task.votes = respData.votes;
               })
               .error(function (err) {
                   console.log(err);
               })
               .finally(function () {
                   $scope.updating = false;
               });
       };
    });
