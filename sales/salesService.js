angular.module('kuantum').factory('salesService', ['$http', '$cookieStore', '$rootScope', '$timeout', 'CONFIG',
    function ($http, $cookieStore, $rootScope, $timeout, CONFIG) {
        var service = {};
        var filters = [];
        service.getSalesDashboardData = function (data) {
            return  $http({
                method: 'POST',
                url: CONFIG.apiURL + 'sales',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: data
            })
            .success(function (response) {
                return response;
            })
            .error(function(e){
               swal("Error", "Server is not reachable", "error");
            });
        };
        
        service.getSalesVariableCostData = function (data) {
            return  $http({
                method: 'POST',
                url: CONFIG.apiURL + 'sales/sales_variablecost',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: data
            })
            .success(function (response) {
                return response;
            })
            .error(function(e){
               swal("Error", "Server is not reachable", "error");
            });
        };
        
        service.setFilters = function(filterObj) {
            filters = [];
            filters.push(filterObj);
        };

        service.getFilters = function(){
            return filters;
        };


        return service;
    }]);

       