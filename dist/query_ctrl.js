///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['lodash', 'app/plugins/sdk', './css/query_editor.css!'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var lodash_1, sdk_1;
    var WifiPlugQueryCtrl;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (_1) {}],
        execute: function() {
            WifiPlugQueryCtrl = (function (_super) {
                __extends(WifiPlugQueryCtrl, _super);
                /** @ngInject **/
                function WifiPlugQueryCtrl($scope, $injector, templateSrv, $q) {
                    _super.call(this, $scope, $injector);
                    this.templateSrv = templateSrv;
                    this.$q = $q;
                    this.defaults = {};
                    lodash_1.default.defaultsDeep(this.target, this.defaults);
                    this.target.target = this.target.target || 'Select Device';
                    this.target.type = this.target.type || 'timeserie';
                    this.target.device_requirement = this.target.device_requirement || 'Select Requirement';
                }
                WifiPlugQueryCtrl.prototype.getOptions = function (query) {
                    return this.datasource.metricFindQuery(query || '');
                };
                WifiPlugQueryCtrl.prototype.getDeviceReqOptions = function (query) {
                    return this.$q.when([
                        {
                            "value": "consumption",
                            "text": "Consumption (WH)"
                        },
                        {
                            "value": "power",
                            "text": "Power"
                        },
                        {
                            "value": "current",
                            "text": "Current"
                        },
                        {
                            "value": "voltage",
                            "text": "Voltage"
                        }
                    ]);
                };
                WifiPlugQueryCtrl.prototype.onDeviceReqChangeInternal = function () {
                    this.panelCtrl.refresh(); // Asks the panel to refresh data.
                };
                WifiPlugQueryCtrl.prototype.onChangeInternal = function () {
                    this.panelCtrl.refresh(); // Asks the panel to refresh data.
                };
                WifiPlugQueryCtrl.templateUrl = 'partials/query.editor.html';
                return WifiPlugQueryCtrl;
            })(sdk_1.QueryCtrl);
            exports_1("WifiPlugQueryCtrl", WifiPlugQueryCtrl);
        }
    }
});
//# sourceMappingURL=query_ctrl.js.map