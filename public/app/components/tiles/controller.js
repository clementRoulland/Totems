(function ()
{
    'use strict';

    angular
            .module('TotemsApp')
            .controller('TilesController', TilesController)
            .directive('uiTooltip', TooltipDirective);

    TilesController.$inject = ['projectsPromise', 'usersPromise', 'ProjectFactory', '$interval', '$filter'];

    function TooltipDirective()
    {
        return {
            restrict: 'A',
            scope: {
                uiTooltip: "="
            },
            link: function (scope, element, attrs)
            {
                var user = scope.uiTooltip.user;
                var title = "<H3>" + user.username + "</H3><p>" + scope.uiTooltip.date + "</p>";
                element.tooltip({placement: 'right', trigger: 'hover focus', title: title, html: true})
            }
        };
    };

    function TilesController(projectsPromise, usersPromise, ProjectFactory, $interval, $filter)
    {
        var vm = this;
        vm.projects = projectsPromise;
        vm.users = {};

        usersPromise.forEach(function (user)
        {
            vm.users[user.id] = user;
        });

        function refreshMatrix()
        {
            vm.rows = [];
            vm.projects = $filter('orderBy')(vm.projects, ['type', 'name'], false);
            for (var i = 0; i < vm.projects.length; i++) {
                if (i % 6 == 0) vm.rows.push([]);
                vm.projects[i].currentUsers = getUsers(vm.projects[i]);
                vm.rows[vm.rows.length - 1].push(vm.projects[i]);
            }
        }

        vm.rows = [];
        refreshMatrix()
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
                        refreshMatrix();
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
                        refreshMatrix();
                    }).catch();
        };

        function refresh()
        {
            ProjectFactory.getAll().then(function (data)
            {
                vm.projects = data;
                refreshMatrix();

            }).catch();
        }

        function isAvailaible(project, user)
        {
            return !project.requests || project.requests.length === 0 ||
                   (project.current && (project.current.id !== user.objectId));
        }

        function isUnlock(project)
        {
            return !project.requests || project.requests.length === 0;
        }

        vm.isUnlock = isUnlock;

        function isMine(project, user)
        {
            return project.current && (project.current.id === user.objectId);
        }

        function iWait(project, user)
        {
            var wait = false;
            if (project.requests) {
                project.requests.forEach(function (entry)
                {
                    if (entry.user.objectId === user.objectId) {
                        wait = true;
                    }
                });
            }
            return wait;
        }

        vm.isAvailaible = isAvailaible;
        vm.isMine = isMine;
        vm.iWait = iWait;

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

        function getUsers(project)
        {
            var users = [];
            if (project.requests) {
                project.requests.forEach(function (entry)
                {
                    if (!project.current) {
                        project.current = vm.users[entry.user.objectId];
                    }

                    users.push({
                        user: vm.users[entry.user.objectId],
                        date: entry.date
                    });
                });
            }
            return users;
        }
    };

})();
