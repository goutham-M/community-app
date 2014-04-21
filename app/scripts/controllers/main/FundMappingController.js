(function(module) {
  mifosX.controllers = _.extend(module, {
    FundMappingController: function(scope, routeParams , resourceFactory, $rootScope, paginatorService, location, route, dateFilter) {
        var mapLoanIdArray = [];
        scope.formFundData = {};
        scope.formData = {};
        scope.date = {};
        scope.formData.disburseddatecheckbox = true;
        scope.showfundstartdate = false;

        resourceFactory.globalSearchTemplateResource.get({fundMapTemplate : true}, function (data) {
            scope.template = data;
            resourceFactory.globalAdHocSearchResource.search({queryType : 'summary'}, $rootScope.adHocQuery, function (data){
                scope.searchResults = data;
            });
            resourceFactory.globalAdHocSearchResource.save({queryType : 'details'}, $rootScope.adHocQuery, function (data){
                scope.listingDetails = data;
            });
        });

        scope.getAllFundsByFundType = function (fundTypeId) {
            resourceFactory.fundsResource.getAllFunds({'fundTypeId' : fundTypeId}, function(data){
                  scope.funds = data;
            });
        };

        scope.selectAll = function(selectAll, details) {
            scope.active = selectAll;
            if(selectAll == 'true') {
              for(var i in details) {
                mapLoanIdArray.push(details[i].loanId);
              }
            } else {
              for(var i in details) {
                mapLoanIdArray = _.without(mapLoanIdArray,details[i].loanId);
              }
            }
        };

        scope.mapLoanAccountsSelected = function (loanId, active) {
            if(active == 'true') {
              mapLoanIdArray.push(loanId);
            } else {
              mapLoanIdArray = _.without(mapLoanIdArray,loanId);
            }
        };

        scope.mapSubmit = function () {
            var formData = {};
            
            if (scope.formFundData.fundId) {
                formData.fundId = scope.formFundData.fundId;
            } else {
                formData.fundId = "";
            }
            
            if (scope.formFundData.fundTypeId) {
                formData.fundTypeId = scope.formFundData.fundTypeId;
            } else {
                formData.fundTypeId = "";
            }

            if (scope.formData.disburseddatecheckbox) {
                formData.fundingDate = "";
            } else {
                if (scope.date.fundingdate) {
                    formData.fundingDate = dateFilter(scope.date.fundingdate, scope.df);
                } else {
                    formData.fundingDate = "";
                }
            }

            formData.locale = scope.optlang.code;
            formData.dateFormat = scope.df;
            formData.loanIdArray = mapLoanIdArray;
            formData.disburseDateFlag = scope.formData.disburseddatecheckbox;
            resourceFactory.loanResource.put({resourceType : 'fundmapping'}, formData, function (data) {
                  route.reload();
            });
        }
    }
  });
  mifosX.ng.application.controller('FundMappingController', ['$scope', '$routeParams','ResourceFactory', '$rootScope', 'PaginatorService', '$location', '$route', 'dateFilter', mifosX.controllers.FundMappingController]).run(function($log) {
    $log.info("FundMappingController initialized");
  });
}(mifosX.controllers || {}));
