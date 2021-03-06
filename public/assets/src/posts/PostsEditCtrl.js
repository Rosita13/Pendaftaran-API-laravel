app.controller('PostsEditCtrl', ['$state', '$scope', 'posts', 'SweetAlert', 'toaster', '$stateParams', function ($state, $scope, posts, SweetAlert, toaster, mdToast, $stateParams) {
    $scope.id = $scope.$stateParams.id;
    // Edit Posts
    // If Id s empty, then redirected
    if ($scope.id == null || $scope.id == '') {
        $state.go("app.posts")
    }

    $scope.isLoading = true;
    $scope.isLoaded = false;

    $scope.setLoader = function (status) {
        if (status == true) {
            $scope.isLoading = true;
            $scope.isLoaded = false;
        } else {
            $scope.isLoading = false;
            $scope.isLoaded = true;
        }
    };

    // Init Input Form Variable
    $scope.input = {};

    // Set Process Status To False
    $scope.process = false;

    // Init Alert Status
    $scope.alertset = {
        show: 'hide',
        class: 'green',
        msg: ''
    };
    // Get Lass Posts

    // Run Ajax
    posts.show($scope.id)
        .success(function (data) {
            $scope.setLoader(false);
            $scope.myModel = data;
        });

    $scope.showToast = function (warna, msg) {
        $mdToast.show({
            // controller: 'AkunToastCtrl',
            template: "<md-toast class='" + warna + "-500'><span flex> " + msg + "</span></md-toast> ",
            // templateUrl: 'views/ui/material/toast.tmpl.html',
            hideDelay: 6000,
            parent: '#toast',
            position: 'top right'
        });
    };
    // Submit Data
    $scope.updateData = function () {
    $scope.alerts = [];
        // Set Process Status
        $scope.process = true;

        // Close Alert
        // $scope.alertset.show = 'hide';

        // Check Validation Status
        if ($scope.Form.$valid) {
            // Run Ajax
            posts.update($scope.myModel)
                .success(function (data) {
                    if (data.updated == true) {
                        // If back to list after submitting
                        // Redirect to akun
                        $state.go('app.posts');
                        $scope.toaster = {
                            type: 'success',
                            title: 'Sukses',
                            text: 'Update Data Berhasil!'
                        };
                        toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
                    }
                })
                .error(function (data, status) {
                    // Unauthorized
                    if (status === 401) {
                        // Redirect To Login
                        $scope.redirect();
                    }
                    $scope.sup();
                    // Stop Loading
                    $scope.process = false;
                    $scope.alerts.push({
                        type: 'danger',
                        msg: data.validation
                    });
                    $scope.toaster = {
                        type: 'error',
                        title: 'Gagal',
                        text: 'Update Data Gagal!'
                    };
                    toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
                });
        }
    };

}]);
