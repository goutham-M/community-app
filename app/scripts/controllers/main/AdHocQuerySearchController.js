(function (module) {
    mifosX.controllers = _.extend(module, {
        AdHocQuerySearchController: function (scope, routeParams, dateFilter, resourceFactory, location, $rootScope) {
            scope.formData = {};
            scope.showResults = false;
            scope.adHocQuery = {};

            resourceFactory.globalSearchTemplateResource.get(function (data) {
                scope.searchTemplate = data;
                scope.formData.loanfromdate = new Date();
                scope.formData.loantodate = new Date();
                scope.formData.loandatetype = "approvalDate";
                scope.showDateFields = true;
                scope.formData.loans = "loans";
                scope.formData.includeOutStandingAmountPercentage = true;
                scope.formData.outStandingAmountPercentageCondition = 'between';
                scope.formData.includeOutstandingAmount = true;
                scope.formData.outstandingAmountCondition = 'between';
            });

            scope.updatePercentageType = function () {
                if (scope.formData.percentagetype == 'between') {
                    scope.formData.percentage = undefined;
                } else {
                    scope.formData.minpercentage = undefined;
                    scope.formData.maxpercentage = undefined;
                }
            };

            scope.updateOutstandingType = function () {
                if (scope.formData.outstandingType == 'between') {
                    scope.formData.outstandingamt = undefined;
                } else {
                    scope.formData.minoutstandingamt = undefined;
                    scope.formData.maxoutstandingamt = undefined;
                }
            };

            scope.updateLoanDateType = function () {
                if (scope.formData.loandatetype == "approvalDate" || scope.formData.loandatetype == "createdDate" || scope.formData.loandatetype == "disbursalDate") {
                    scope.showDateFields = true;
                } else {
                    scope.showDateFields = false;
                }
            };

            scope.listingType = function () {
               buildParamsData();
               $rootScope.adHocQuery = scope.adHocQuery;
               location.path('/fundmapping');
            };

            function buildParamsData() {
                scope.adHocQuery.locale = scope.optlang.code;
                scope.adHocQuery.dateFormat = "yyyy-MM-dd";
              
                if (scope.formData.allloans) {
                  scope.adHocQuery.loanStatus = scope.adHocQuery.loanStatus || [];
                  scope.adHocQuery.loanStatus.push(scope.formData.allloans);
                };
                if (scope.formData.activeloans) {
                  scope.adHocQuery.loanStatus = scope.adHocQuery.loanStatus || [];
                  scope.adHocQuery.loanStatus.push(scope.formData.activeloans);
                };
                if (scope.formData.overpaidloans) {
                  scope.adHocQuery.loanStatus = scope.adHocQuery.loanStatus || [];
                  scope.adHocQuery.loanStatus.push(scope.formData.overpaidloans);
                };
                if (scope.formData.arrearloans) {
                  scope.adHocQuery.loanStatus = scope.adHocQuery.loanStatus || [];
                  scope.adHocQuery.loanStatus.push(scope.formData.arrearloans);
                };
                if (scope.formData.closedloans) {
                  scope.adHocQuery.loanStatus = scope.adHocQuery.loanStatus || [];
                  scope.adHocQuery.loanStatus.push(scope.formData.closedloans);
                };
                if (scope.formData.writeoffloans) {
                  scope.adHocQuery.loanStatus = scope.adHocQuery.loanStatus || [];
                  scope.adHocQuery.loanStatus.push(scope.formData.writeoffloans);
                };
                if (scope.formData.loanProducts) {
                  scope.adHocQuery.loanProducts = scope.formData.loanProducts;
                };
                if (scope.formData.offices) {
                  scope.adHocQuery.offices = scope.formData.offices;
                };
                if (scope.formData.loandatetype) {
                  scope.adHocQuery.loanDateOption = scope.formData.loandatetype;
                  scope.adHocQuery.loanFromDate = dateFilter(scope.formData.loanfromdate,scope.adHocQuery.dateFormat);
                  scope.adHocQuery.loanToDate = dateFilter(scope.formData.loantodate,scope.adHocQuery.dateFormat);
                };
                if (scope.formData.includeOutStandingAmountPercentage) {
                  if (scope.formData.outStandingAmountPercentageCondition) {
                    scope.adHocQuery.outStandingAmountPercentageCondition = scope.formData.outStandingAmountPercentageCondition;
                    if (scope.adHocQuery.outStandingAmountPercentageCondition == 'between') {
                      scope.adHocQuery.minOutStandingAmountPercentage = scope.formData.minOutStandingAmountPercentage;
                      scope.adHocQuery.maxOutStandingAmountPercentage = scope.formData.maxOutStandingAmountPercentage;
                    } else{
                      scope.adHocQuery.outStandingAmountPercentage = scope.formData.outStandingAmountPercentage;
                    };
                  };
                } else {
                    scope.adHocQuery.includeOutStandingAmountPercentage = scope.formData.includeOutStandingAmountPercentage;
                    delete scope.adHocQuery.outStandingAmountPercentageCondition;
                }

                scope.adHocQuery.includeOutstandingAmount = scope.formData.includeOutstandingAmount;
                if (scope.formData.includeOutstandingAmount) {
                  if (scope.formData.outstandingAmountCondition) {
                    scope.adHocQuery.outstandingAmountCondition = scope.formData.outstandingAmountCondition;
                    if (scope.adHocQuery.outstandingAmountCondition == 'between') {
                      scope.adHocQuery.minOutstandingAmount = scope.formData.minOutstandingAmount;
                      scope.adHocQuery.maxOutstandingAmount = scope.formData.maxOutstandingAmount;
                    } else{
                      scope.adHocQuery.outstandingAmount = scope.formData.outstandingAmount;
                    };
                  };
                } else {
                    scope.adHocQuery.includeOutstandingAmount = scope.formData.includeOutstandingAmount;
                    delete scope.adHocQuery.outstandingAmountCondition;
                }
            }

            scope.submit = function () {
                buildParamsData();
                resourceFactory.globalAdHocSearchResource.search({queryType : 'summary'}, scope.adHocQuery, function (data) {
                    scope.searchResults = data;
                    scope.showResults = true;
                });
            };
        }
    });
    

  mifosX.ng.application.controller('AdHocQuerySearchController', ['$scope','$routeParams', 'dateFilter', 'ResourceFactory', '$location', '$rootScope', mifosX.controllers.AdHocQuerySearchController]).run(function($log) {
    $log.info("AdHocQuerySearchController initialized");
  });
}(mifosX.controllers || {}));
