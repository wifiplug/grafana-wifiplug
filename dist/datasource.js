///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register([], function(exports_1) {
    var WifiPlugDatasource;
    return {
        setters:[],
        execute: function() {
            WifiPlugDatasource = (function () {
                /** @ngInject */
                function WifiPlugDatasource(instanceSettings, backendSrv, templateSrv, $q) {
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.$q = $q;
                    this.name = instanceSettings.name;
                    this.id = instanceSettings.id;
                    this.url = instanceSettings.url;
                }
                WifiPlugDatasource.prototype.query = function (options) {
                    var _this = this;
                    var url = "" + this.url;
                    // trim dates
                    var dateFrom = options.range.from.format('YYYY-MM-DDTHH:mm:ss');
                    var dateTo = options.range.to.format('YYYY-MM-DDTHH:mm:ss');
                    // build promises array
                    var promises = {};
                    for (var _i = 0, _a = options.targets; _i < _a.length; _i++) {
                        var target = _a[_i];
                        var targetComponents = target.target.split('@');
                        var deviceUuid = targetComponents[0];
                        var serviceUuid = targetComponents[1];
                        if (targetComponents.length == 0 || (target.device_requirement == null || target.device_requirement == ""))
                            continue;
                        if (target.device_requirement == "consumption") {
                            promises[(target.target + "#consumption")] = this.backendSrv.datasourceRequest({
                                url: url + "/wifiplug-v1.0/device/" + deviceUuid + "/service/" + serviceUuid + "/energy/consumption/historic?date_from=" + dateFrom + "Z&date_to=" + dateTo + "Z&grouping=hour",
                                method: 'GET',
                                withCredentials: true
                            }).then(function (response) {
                                if (response.status === 200) {
                                    return {
                                        rows: response.data.map(function (d) {
                                            return {
                                                "time": Date.parse(d["time"]),
                                                "value": d["kwh"] * 1000
                                            };
                                        }),
                                        target: "Consumption (WH)"
                                    };
                                }
                            });
                        }
                        else {
                            var deviceRequirement = target.device_requirement;
                            var targetStr = "Power";
                            if (deviceRequirement == "current")
                                targetStr = "Current (A)";
                            else if (deviceRequirement == "voltage")
                                targetStr = "Voltage (V)";
                            (function (a, b, c, e, f) {
                                promises[(c + "#" + b)] = _this.backendSrv.datasourceRequest({
                                    url: url + "/wifiplug-v1.0/device/" + e + "/service/" + f + "/energy/historic?date_from=" + dateFrom + "Z&date_to=" + dateTo + "Z&grouping=hour",
                                    method: 'GET',
                                    withCredentials: true
                                }).then(function (response) {
                                    if (response.status === 200) {
                                        return {
                                            rows: response.data.map(function (d) {
                                                return {
                                                    "time": Date.parse(d["time"]),
                                                    "value": d[b]
                                                };
                                            }),
                                            target: a
                                        };
                                    }
                                });
                            })(targetStr, deviceRequirement, target.target, deviceUuid, serviceUuid);
                        }
                    }
                    // return promise
                    return this.$q.all(promises).then(function (d) {
                        var results = [];
                        for (var key in d) {
                            results.push({
                                "target": d[key].target,
                                "datapoints": d[key].rows.map(function (r) { return [r.value, r.time]; })
                            });
                        }
                        return {
                            data: results
                        };
                    });
                };
                WifiPlugDatasource.prototype.annotationQuery = function (options) {
                    throw new Error("Annotation Support not implemented yet.");
                };
                WifiPlugDatasource.prototype.metricFindQuery = function (query) {
                    var url = "" + this.url;
                    return this.backendSrv.datasourceRequest({
                        url: url + "/wifiplug-v1.0/device",
                        method: 'GET',
                        withCredentials: true
                    }).then(function (response) {
                        if (response.status === 200) {
                            var kv = [];
                            for (var _i = 0, _a = response.data.devices; _i < _a.length; _i++) {
                                var device = _a[_i];
                                // find energy service
                                var energyServices = device.services
                                    .filter(function (s) { return s.type_uuid == "e4b8c402-e3f8-4ba3-8593-8565664a18bf"; });
                                for (var _b = 0; _b < energyServices.length; _b++) {
                                    var energyService = energyServices[_b];
                                    if (energyServices.length > 1)
                                        kv.push({ text: device.name + " - " + energyService.caption, value: device.uuid + "@" + energyService.uuid });
                                    else
                                        kv.push({ text: device.name, value: device.uuid + "@" + energyService.uuid });
                                }
                            }
                            return kv;
                        }
                    });
                };
                WifiPlugDatasource.prototype.testDatasource = function () {
                    var url = "" + this.url;
                    return this.backendSrv.datasourceRequest({
                        url: url + "/wifiplug-v1.0/user",
                        method: 'GET',
                        withCredentials: true
                    }).then(function (response) {
                        if (response.status === 200) {
                            var user = response.data;
                            return { status: "success", message: "Authenticated as " + user.username, title: "Success" };
                        }
                    });
                };
                return WifiPlugDatasource;
            })();
            exports_1("default", WifiPlugDatasource);
        }
    }
});
//# sourceMappingURL=datasource.js.map