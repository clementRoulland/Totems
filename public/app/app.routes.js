(function ()
{
    'use strict';

    angular.module('TotemsApp').config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

    function Config($stateProvider, $urlRouterProvider, $locationProvider)
    {

        $urlRouterProvider.otherwise('/booked');
        $stateProvider
                .state('projects', {
                    url: '/projects',
                    templateUrl: '/app/components/project/project.view.html',
                    controller: 'ProjectController',
                    controllerAs: 'vm',
                    resolve: {
                        projectsPromise: projectPromise,
                        usersPromise: userPromise
                    }
                }).state('tiles', {
                    url: '/tiles',
                    templateUrl: '/app/components/tiles/view.html',
                    controller: 'TilesController',
                    controllerAs: 'vm',
                    resolve: {
                        projectsPromise: projectPromise,
                        usersPromise: userPromise
                    }
                }).state('booked', {
                    url: '/booked',
                    templateUrl: '/app/components/booked/view.html',
                    controller: 'TilesController',
                    controllerAs: 'vm',
                    resolve: {
                        projectsPromise: projectPromise,
                        usersPromise: userPromise
                    }
                });


        // use the HTML5 History API
//        $locationProvider.html5Mode(true);
    };

    projectPromise.$inject = ['ProjectFactory'];
    function projectPromise(ProjectFactory)
    {
        return ProjectFactory.getAll();
    }
    userPromise.$inject = ['ProjectFactory'];
    function userPromise(ProjectFactory)
    {
        return ProjectFactory.getUsers();
    }

})();
