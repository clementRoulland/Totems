(function ()
{
    'use strict';

    angular
            .module('TotemsApp')
            .controller('TilesController', TilesController);

    TilesController.$inject = ['projectsPromise', 'ProjectFactory', '$interval'];

    function TilesController(projectsPromise, ProjectFactory, $interval)
    {
        var vm = this;
        vm.projects = projectsPromise;

        var rows = [];
        for (var i = 0; i < vm.projects.length; i++) {
            if (i % 6 == 0) rows.push([]);
            rows[rows.length - 1].push(vm.projects[i]);
        }
        vm.rows = rows;
        vm.take = take;
        vm.release = release;
        vm.userIsInStack = userIsInStack;
        $interval(refresh, 60000);

        function take(project)
        {
            var index = vm.projects.indexOf(project);
            ProjectFactory.take(project.id)
                    .then(function (data)
                    {
                        console.log(data);
                        vm.projects[index] = data;

                        var rows = [];
                        for (var i = 0; i < vm.projects.length; i++) {
                            if (i % 6 == 0) rows.push([]);
                            rows[rows.length - 1].push(vm.projects[i]);
                        }
                        vm.rows = rows;
                    })
                    .catch();
        };

        function release(project)
        {
            var index = vm.projects.indexOf(project);
            ProjectFactory.release(project.id)
                    .then(function (data)
                    {
                        console.log(data);
                        vm.projects[index] = data;

                        var rows = [];
                        for (var i = 0; i < vm.projects.length; i++) {
                            if (i % 6 == 0) rows.push([]);
                            rows[rows.length - 1].push(vm.projects[i]);
                        }
                        vm.rows = rows;
                    })
                    .catch();
        };

        function refresh()
        {
            ProjectFactory.getAll().then(function (data)
            {
                vm.projects = data;

                var rows = [];
                for (var i = 0; i < vm.projects.length; i++) {
                    if (i % 6 == 0) rows.push([]);
                    rows[rows.length - 1].push(vm.projects[i]);
                }
                vm.rows = rows;
            })
                    .catch();
        }

        function isUnlock(project)
        {
            return !project.user
        }

        vm.isUnlock = isUnlock;

        function isMine(project, user)
        {
            return project.user && (project.user.objectId === user.objectId);
        }

        function isSingle(project, user)
        {
            return project.user && project.stack.length === 0;
        }

        function isAwaiting(project, user)
        {
            return project.user && project.stack.length > 0;
        }

        vm.isMine = isMine;
        vm.isSingle = isSingle;
        vm.isAwaiting = isAwaiting;

        vm.getCompleteStack = function (project)
        {
            var result = "";
            if (project.user) {
                result += project.user.username;
                angular.forEach(project.stack, function (user)
                {
                    result += user.username;
                })
            }
            return result;
        }
        function userIsInStack(user, stack)
        {
            var isInStack = false;
            stack.forEach(function (it)
            {
                if (it.objectId == user.objectId) {
                    isInStack = true;
                    return;
                }
            });
            return isInStack;
        }
    };

})();
