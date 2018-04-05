angular.module('emailController',['userService'])

// Activating user account through email link
.controller('emailCtrl', function($stateParams, userFactory, $location, $state){
    app = this;

    // Check function that grabs token from URL and checks database runs on page load
    this.activate = function(){
        userFactory.activateaccount($stateParams.token).then(function(data) {
            // Check if activation was successful or not
            if (data.data.success) {
                app.successMsg = data.data.message + '...Redirecting'; // If successful, grab message from JSON object and redirect to login page
                $state.go('app.login');
            } else {
                app.errorMsg = data.data.message + '...Redirecting'; // If not successful, grab message from JSON object and redirect to login page
            }
        });
    }
    

    // Similar function to reset password
    this.resetpassword = function(resetData, valid){
        console.log(resetData)
        if(!valid) {
            app.loading = false;
            app.errorMsg += "\nPlease make sure the form is complete and all fields are valid before submitting...";
        } else {
            userFactory.resetpassword($stateParams.token, resetData).then(function(data) {
                console.log($stateParams.token)
                // Check if activation was successful or not
                if (data.data.success) {
                    app.successMsg = data.data.message + 'Success!...Redirecting'; // If successful, grab message from JSON object and redirect to login page
                    $state.go('app.login')
                } else {
                    app.errorMsg = data.data.message + 'Failed!...Redirecting'; // If not successful, grab message from JSON object and redirect to login page
                    // $state.go('app.login')
                }
            });
        }
        
    }
    

    
       
})
.directive('resetMatchPw', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = resetForm.password;
        $(elem).add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
            var v = elem.val()===$(firstPassword).val();
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }
  }])
