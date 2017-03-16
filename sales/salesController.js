angular.module('kuantum').controller('salesController', ['$scope', '$rootScope', '$location', 'commanService', 'loginService', 'salesService', '$timeout', '$filter',
    function($scope, $rootScope, $location, commanService, loginService, salesService, $timeout, $filter) {
        $scope.current_date = new Date();
        // Default Values for previous filters
        $scope.filter = {};
        $scope.old_filter = {};
        // Set Financial Years
        $scope.financial_years = commanService.getFinancialYears();
        $scope.otherFiltersActive = false;
        $scope.costIncluded = false;
        $scope.costExcluded = false;

        //Cost breaup data
          $scope.dynamicPopover = {
            templateUrl: 'app/components/sales/costPopover.html',
            title: 'Cost Components'
          };

        // Intialize Varibles
        $scope.init = function() {
            $scope.filter.category_id = undefined;
            $scope.filter.machine_id = undefined;
            $scope.filter.product_type_id = undefined;
            $scope.filter.territory_incharge_id = undefined;
            $scope.filter.dealer_id = undefined;
            $scope.filter.state_id = undefined;
            $scope.filter.gsm_id = undefined;
            $scope.filter.zone_id = undefined;
            $scope.filter.brand_id = undefined;
            $scope.filter.gsm_range_id = undefined;
            $scope.filter.nsrrange = undefined;
            $scope.filter.nsr_min_range = undefined;
            $scope.filter.nsr_max_range = undefined;
            $scope.filter.dealertype = undefined;

            $scope.filter.view_mode = '1';
            $scope.filter.proportionate = false;

            // Default Values for current filters
            var current = commanService.getCurrentYearMonth();
            $scope.filter.current_year = current.year;
            $scope.filter.current_month = current.month;
            $scope.filter.current_quater = commanService.getQuater($scope.current_date).toString();
            $scope.filter.current_half_year = commanService.getHalfYear($scope.current_date).toString();

            // Default Values for previous filters
            var prev = commanService.getPrevYearMonth($scope.filter.current_year, $scope.filter.current_month);
            $scope.filter.previous_year = prev.year.toString();
            $scope.filter.previous_month = prev.month.toString();
        };

        //Toggle Discount info
        $scope.expandClass = 'fa-plus-circle';
        $scope.expandDiscount = false;
        $scope.toggleDiscount = function() {
            $scope.expandDiscount = !$scope.expandDiscount;
            if ($scope.expandDiscount) {
                $scope.expandClass = 'fa-minus-circle';
            } else {
                $scope.expandClass = 'fa-plus-circle';
            }
        };

        $scope.onchange_date_filters = function() {
            if ($scope.filter.view_mode == '1') {
                var previous = commanService.getPrevYearMonth($scope.filter.current_year, $scope.filter.current_month);
                $scope.filter.previous_year = previous.year;
                $scope.filter.previous_month = previous.month;
            }

            if ($scope.filter.view_mode == '2') {

                var previous = commanService.getPrevYearQuater($scope.filter.current_year, $scope.filter.current_quater);
                $scope.filter.previous_year = previous.year;
                $scope.filter.previous_quater = previous.quater;
            }

            if ($scope.filter.view_mode == '3') {
                var previous = commanService.getPrevYearHalfYear($scope.filter.current_year, $scope.filter.current_half_year);
                $scope.filter.previous_year = previous.year;
                $scope.filter.previous_half_year = previous.half_year;
            }

            if ($scope.filter.view_mode == '4') {
                $scope.filter.previous_year = ($scope.filter.current_year - 1).toString();
            }

            $scope.onchange_filters();

        };

        $scope.onchange_filters = function() {
            //Setting selected filters in service  

            $scope.loader_sales = true;
            $scope.loader_vc = true;
            salesService.setFilters($scope.filter);

            // Filter by month
            if ($scope.filter.view_mode == '1') {
                var year = parseInt($scope.filter.previous_year);
                var month = parseInt($scope.filter.previous_month);
                year = (month < 4) ? year + 1 : year;
                var date = new Date(year, $scope.filter.previous_month - 1, 1);
                $scope.filter.previous_start_date = $filter('date')(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd');
                $scope.filter.previous_end_date = $filter('date')(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy-MM-dd');

                var year = parseInt($scope.filter.current_year);
                var month = parseInt($scope.filter.current_month);
                year = (month < 4) ? year + 1 : year;
                var date = new Date(year, $scope.filter.current_month - 1, 1);
                $scope.filter.current_start_date = $filter('date')(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd');
                $scope.filter.current_end_date = $filter('date')(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy-MM-dd');
            }

            // Filter by quater
            if ($scope.filter.view_mode == '2') {
                var filter_previous_year = $scope.filter.previous_year;
                if ($scope.filter.previous_quater == "1") {
                    var first_month = "4";
                    var last_month = "6";
                } else if ($scope.filter.previous_quater == "2") {
                    var first_month = "7";
                    var last_month = "9";
                } else if ($scope.filter.previous_quater == "3") {
                    var first_month = "10";
                    var last_month = "12";
                } else if ($scope.filter.previous_quater == "4") {
                    var first_month = "1";
                    var last_month = "3";
                    filter_previous_year = parseInt(filter_previous_year) + 1;
                }
                var date1 = new Date(filter_previous_year, first_month - 1, 1);
                var date2 = new Date(filter_previous_year, last_month - 1, 1);
                $scope.filter.previous_start_date = $filter('date')(new Date(date1.getFullYear(), date1.getMonth(), 1), 'yyyy-MM-dd');
                $scope.filter.previous_end_date = $filter('date')(new Date(date2.getFullYear(), date2.getMonth() + 1, 0), 'yyyy-MM-dd');

                var filter_current_year = $scope.filter.current_year;
                if ($scope.filter.current_quater == "1") {
                    var first_month = "4";
                    var last_month = "6";
                } else if ($scope.filter.current_quater == "2") {
                    var first_month = "7";
                    var last_month = "9";
                } else if ($scope.filter.current_quater == "3") {
                    var first_month = "10";
                    var last_month = "12";
                } else if ($scope.filter.current_quater == "4") {
                    var first_month = "1";
                    var last_month = "3";
                    filter_current_year = parseInt(filter_current_year) + 1;
                }
                var date1 = new Date(filter_current_year, first_month - 1, 1);
                var date2 = new Date(filter_current_year, last_month - 1, 1);
                $scope.filter.current_start_date = $filter('date')(new Date(date1.getFullYear(), date1.getMonth(), 1), 'yyyy-MM-dd');
                $scope.filter.current_end_date = $filter('date')(new Date(date2.getFullYear(), date2.getMonth() + 1, 0), 'yyyy-MM-dd');
            }

            // Filter by Half Year
            if ($scope.filter.view_mode == '3') {
                var first_year = $scope.filter.previous_year;
                var last_year = $scope.filter.previous_year;
                if ($scope.filter.previous_half_year == "1") {
                    var first_month = "4";
                    var last_month = "9";
                } else if ($scope.filter.previous_half_year == "2") {
                    var first_month = "10";
                    var last_month = "3";
                    last_year = parseInt(last_year) + 1;
                }

                var date1 = new Date(first_year, first_month - 1, 1);
                var date2 = new Date(last_year, last_month - 1, 1);
                $scope.filter.previous_start_date = $filter('date')(new Date(date1.getFullYear(), date1.getMonth(), 1), 'yyyy-MM-dd');
                $scope.filter.previous_end_date = $filter('date')(new Date(date2.getFullYear(), date2.getMonth() + 1, 0), 'yyyy-MM-dd');

                var first_year = $scope.filter.current_year;
                var last_year = $scope.filter.current_year;
                if ($scope.filter.current_half_year == "1") {
                    var first_month = "4";
                    var last_month = "9";
                } else if ($scope.filter.current_half_year == "2") {
                    var first_month = "10";
                    var last_month = "3";
                    last_year = parseInt(last_year) + 1;
                }

                var date1 = new Date(first_year, first_month - 1, 1);
                var date2 = new Date(last_year, last_month - 1, 1);
                $scope.filter.current_start_date = $filter('date')(new Date(date1.getFullYear(), date1.getMonth(), 1), 'yyyy-MM-dd');
                $scope.filter.current_end_date = $filter('date')(new Date(date2.getFullYear(), date2.getMonth() + 1, 0), 'yyyy-MM-dd');
            }

            // Filter by Year
            if ($scope.filter.view_mode == '4') {
                var first_month = "4";
                var last_month = "3";
                var first_year = $scope.filter.previous_year;
                var last_year = parseInt(first_year) + 1;
                var date1 = new Date(first_year, first_month - 1, 1);
                var date2 = new Date(last_year, last_month - 1, 1);
                $scope.filter.previous_start_date = $filter('date')(new Date(date1.getFullYear(), date1.getMonth(), 1), 'yyyy-MM-dd');
                $scope.filter.previous_end_date = $filter('date')(new Date(date2.getFullYear(), date2.getMonth() + 1, 0), 'yyyy-MM-dd');

                var first_year = $scope.filter.current_year;
                var last_year = parseInt(first_year) + 1;
                var date1 = new Date(first_year, first_month - 1, 1);
                var date2 = new Date(last_year, last_month - 1, 1);
                $scope.filter.current_start_date = $filter('date')(new Date(date1.getFullYear(), date1.getMonth(), 1), 'yyyy-MM-dd');
                $scope.filter.current_end_date = $filter('date')(new Date(date2.getFullYear(), date2.getMonth() + 1, 0), 'yyyy-MM-dd');
            }

            var previous = new Date($scope.filter.previous_start_date);
            var current = new Date($scope.filter.current_start_date);
            if (previous >= current) {
                swal("Invalid!", "Period on right should be later then left!", "warning");
                $scope.filter = angular.copy($scope.old_filter);
                //Setting selected filters in service    
                salesService.setFilters($scope.filter);
                $scope.loader_sales = false;
                return false;
            } else if (current > $scope.current_date) {
                swal("Invalid!", "Period on right should be less then current month!", "warning");
                $scope.filter = angular.copy($scope.old_filter);
                //Setting selected filters in service    
                salesService.setFilters($scope.filter);
                $scope.loader_sales = false;
                return false;
            } else {
                angular.copy($scope.filter, $scope.old_filter);
            }

            // Show hide previous next button
            $scope.showHidePrevNext();

            // Proportionate functionality logic
            if ($scope.filter.proportionate) {
                var current_end_date = new Date($scope.filter.current_end_date);
                var previous_end_date = new Date($scope.filter.previous_end_date);

                if (current_end_date > $scope.current_date) {
                    var diffDays = $rootScope.daysDiff($scope.current_date, current);
                    $scope.filter.previous_end_date = $filter('date')(previous.setDate(previous.getDate() + diffDays - 1), 'yyyy-MM-dd');
                }
            }

            console.log($scope.filter);

            //If NSR Range is selected
            if($scope.filter.nsrrange !== undefined){
                //$scope.filter.nsrrange = $scope.filter.nsrrange.split(",")[0];
                $scope.filter.nsr_min_range = $scope.filter.nsrrange.split(",")[1];
                $scope.filter.nsr_max_range = $scope.filter.nsrrange.split(",")[2];
            }else{
                $scope.filter.nsr_min_range = undefined;
                $scope.filter.nsr_max_range = undefined;
            }
            


            // get data of sales
            salesService.getSalesDashboardData($scope.filter).then(function(response) {

                $scope.sales = response.data.sales;
                $timeout(function() {
                    $('.filter .selectpicker').selectpicker('refresh');
                    $('table.table-striped').tableHeadFixer({ 'head': true });
                    $scope.loader_sales = false;
                }, '100');
            }, function(error) {
                $scope.loader_sales = false;
            });

            salesService.getSalesVariableCostData($scope.filter).then(function(response) {
                $scope.sales_vc = response.data.sales;
                $scope.loader_vc = false;
            });


        };

        $scope.reset_filters = function() {
            $scope.init();
            $timeout(function() {
                $('.filter .selectpicker').selectpicker('refresh');
            }, '100');
            $scope.onchange_filters();
        };

        // Call When view loaded
        $scope.$on('$viewContentLoaded', function(event) {
            var salesFilter = salesService.getFilters()[0];
            if (typeof salesFilter !== 'undefined') {
                $scope.filter = salesFilter;
                if($scope.filter.zone_id !== undefined || $scope.filter.gsm_id !== undefined || $scope.filter.brand_id !== undefined || $scope.filter.gsmrange !== undefined || $scope.filter.nsrrange !== undefined ){
                    $scope.otherFiltersActive = true;
                }

            } else {
                $scope.init();
            }
            // Load filters data
            loginService.Settings().then(function(response) {
                $scope.data = response.data;
                //console.log($scope.data);
                $timeout(function() {
                    $('.filter .selectpicker').selectpicker('refresh');
                }, '100');
            });

            // Load Default filter data of sales
            $scope.onchange_filters();
        });

        $scope.comparePage = function(type) {
            var current = {};
            var previous = {};
            if ($scope.filter.view_mode == '1') {
                if (type == "prev") {
                    current = commanService.getPrevYearMonth($scope.filter.current_year, $scope.filter.current_month);
                    previous = commanService.getPrevYearMonth($scope.filter.previous_year, $scope.filter.previous_month);
                } else {
                    current = commanService.getNextYearMonth($scope.filter.current_year, $scope.filter.current_month);
                    previous = commanService.getNextYearMonth($scope.filter.previous_year, $scope.filter.previous_month);
                }
                $scope.filter.current_month = current.month;
                $scope.filter.previous_month = previous.month;
            }

            if ($scope.filter.view_mode == '2') {
                if (type == "prev") {
                    current = commanService.getPrevYearQuater($scope.filter.current_year, $scope.filter.current_quater);
                    previous = commanService.getPrevYearQuater($scope.filter.previous_year, $scope.filter.previous_quater);
                } else {
                    current = commanService.getNextYearQuater($scope.filter.current_year, $scope.filter.current_quater);
                    previous = commanService.getNextYearQuater($scope.filter.previous_year, $scope.filter.previous_quater);
                }
                $scope.filter.current_quater = current.quater;
                $scope.filter.previous_quater = previous.quater;
            }

            if ($scope.filter.view_mode == '3') {
                if (type == "prev") {
                    current = commanService.getPrevYearHalfYear($scope.filter.current_year, $scope.filter.current_half_year);
                    previous = commanService.getPrevYearHalfYear($scope.filter.previous_year, $scope.filter.previous_half_year);
                } else {
                    current = commanService.getNextYearHalfYear($scope.filter.current_year, $scope.filter.current_half_year);
                    previous = commanService.getNextYearHalfYear($scope.filter.previous_year, $scope.filter.previous_half_year);
                }
                $scope.filter.current_half_year = current.half_year;
                $scope.filter.previous_half_year = previous.half_year;
            }

            if ($scope.filter.view_mode == '4') {
                if (type == "prev") {
                    current.year = ($scope.filter.current_year - 1).toString();
                    previous.year = ($scope.filter.previous_year - 1).toString();
                } else {
                    current.year = (parseInt($scope.filter.current_year) + 1).toString();
                    previous.year = (parseInt($scope.filter.previous_year) + 1).toString();
                }
            }

            $scope.filter.current_year = current.year;
            $scope.filter.previous_year = previous.year;

            $scope.onchange_filters();
        };

        $scope.showHidePrevNext = function() {
            // Hide or Show Previous Button
            var current_start_date = new Date($scope.filter.current_start_date);
            var previous_start_date = new Date($scope.filter.previous_start_date);
            var no_of_days = $rootScope.daysDiff(current_start_date, previous_start_date);
            $scope.prev_button_show = false;
            $scope.next_button_show = false;

            if ($scope.filter.view_mode == '1') {
                if (no_of_days >= 28 && no_of_days <= 31) {
                    if ($scope.filter.previous_year == "2014" && $scope.filter.previous_month == "4") {
                        $scope.prev_button_show = false;
                    } else {
                        $scope.prev_button_show = true;
                    }
                    var current = commanService.getCurrentYearMonth();
                    if ($scope.filter.current_year == current.year && $scope.filter.current_month == current.month) {
                        $scope.next_button_show = false;
                    } else {
                        $scope.next_button_show = true;
                    }
                }
            }
            if ($scope.filter.view_mode == '2') {
                // condition for consecutive quarter
                if (no_of_days > 0 && no_of_days < 93) {
                    if ($scope.filter.previous_year == "2014" && $scope.filter.previous_quater == "1") {
                        $scope.prev_button_show = false;
                    } else {
                        $scope.prev_button_show = true;
                    }
                    var current = commanService.getCurrentYearMonth();
                    if ($scope.filter.current_year == current.year && $scope.filter.current_quater == commanService.getQuater($scope.current_date).toString()) {
                        $scope.next_button_show = false;
                    } else {
                        $scope.next_button_show = true;
                    }
                }
            }
            if ($scope.filter.view_mode == '3') {
                // condition for consecutive half year
                if (no_of_days > 0 && no_of_days < 185) {
                    if ($scope.filter.previous_year == "2014" && $scope.filter.previous_half_year == "1") {
                        $scope.prev_button_show = false;
                    } else {
                        $scope.prev_button_show = true;
                    }

                    var current = commanService.getCurrentYearMonth();
                    if ($scope.filter.current_year == current.year && $scope.filter.current_half_year == commanService.getHalfYear($scope.current_date).toString()) {
                        $scope.next_button_show = false;
                    } else {
                        $scope.next_button_show = true;
                    }
                }
            }
            if ($scope.filter.view_mode == '4') {
                // condition for consecutive year
                if (no_of_days > 0 && no_of_days < 367) {
                    if ($scope.filter.previous_year == "2014") {
                        $scope.prev_button_show = false;
                    } else {
                        $scope.prev_button_show = true;
                    }
                    var current = commanService.getCurrentYearMonth();
                    if ($scope.filter.current_year == current.year) {
                        $scope.next_button_show = false;
                    } else {
                        $scope.next_button_show = true;
                    }
                }
            }
        };
    }
]);
