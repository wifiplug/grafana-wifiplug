///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from 'lodash';
import {WifiPlugQueryCtrl} from "./query_ctrl";

export default class WifiPlugDatasource {
  id: number;
  name: string;
  url: string;

  /** @ngInject */
  constructor(instanceSettings, private backendSrv, private templateSrv, private $q) {
    this.name = instanceSettings.name;
    this.id = instanceSettings.id;
    this.url = instanceSettings.url;
  }

  query(options) {
    let url = `${this.url}`;

    // trim dates
    let dateFrom = options.range.from.format('YYYY-MM-DDTHH:mm:ss');
    let dateTo = options.range.to.format('YYYY-MM-DDTHH:mm:ss');

    // build promises array
    let promises = {};

    for (let target of options.targets) {
      let targetComponents = target.target.split('@');
      let deviceUuid = targetComponents[0];
      let serviceUuid = targetComponents[1];

      if (targetComponents.length == 0 || (target.device_requirement == null || target.device_requirement == ""))
          continue;

      if (target.device_requirement == "consumption") {
        promises[`${target.target}#consumption`] = this.backendSrv.datasourceRequest({
            url: `${url}/wifiplug-v1.0/device/${deviceUuid}/service/${serviceUuid}/energy/consumption/historic?date_from=${dateFrom}Z&date_to=${dateTo}Z&grouping=hour`,
            method: 'GET',
            withCredentials: true
        }).then(response => {
            if (response.status === 200) {
              return {
                rows: response.data.map(d => {
                  return {
                      "time": Date.parse(d["time"]),
                      "value": d["kwh"] * 1000
                  };
                }),
                target: "Consumption (WH)"
              }
            }
        });
      } else {
        let deviceRequirement = target.device_requirement;
        let targetStr = "Power";

        if (deviceRequirement == "current")
          targetStr = "Current (A)";
        else if (deviceRequirement == "voltage")
          targetStr = "Voltage (V)";

        ((a, b, c, e, f) => {
          promises[`${c}#${b}`] = this.backendSrv.datasourceRequest({
              url: `${url}/wifiplug-v1.0/device/${e}/service/${f}/energy/historic?date_from=${dateFrom}Z&date_to=${dateTo}Z&grouping=hour`,
              method: 'GET',
              withCredentials: true
              }).then(response => {
                  if (response.status === 200) {
                      return {
                          rows: response.data.map(d => {
                              return {
                                  "time": Date.parse(d["time"]),
                                  "value": d[b]
                              };
                          }),
                          target: a
                      }
                  }
              });
        })(targetStr, deviceRequirement, target.target, deviceUuid, serviceUuid);
      }
    }

    // return promise
    return this.$q.all(promises).then(d => {
      let results = [];

      for(let key in d) {
        results.push({
          "target": d[key].target,
          "datapoints": d[key].rows.map(r => [r.value, r.time])
        });
      }

      return {
        data: results
      };
    });
  }

  annotationQuery(options) {
    throw new Error("Annotation Support not implemented yet.");
  }

  metricFindQuery(query: string) {
    let url = `${this.url}`;

    return this.backendSrv.datasourceRequest({
        url: `${url}/wifiplug-v1.0/device`,
        method: 'GET',
        withCredentials: true
    }).then(response => {
        if (response.status === 200) {
          let kv = [];

          for (let device of response.data.devices) {
            // find energy service
            let energyServices = device.services
                .filter(s => s.type_uuid == "e4b8c402-e3f8-4ba3-8593-8565664a18bf");

            for(let energyService of energyServices) {
              if (energyServices.length > 1)
                kv.push({text: `${device.name} - ${energyService.caption}`, value: `${device.uuid}@${energyService.uuid}`});
              else
                kv.push({text: device.name, value: `${device.uuid}@${energyService.uuid}`});
            }
          }

          return kv;
        }
    });
  }

  testDatasource() {
    let url = `${this.url}`;

    return this.backendSrv.datasourceRequest({
        url: `${url}/wifiplug-v1.0/user`,
        method: 'GET',
        withCredentials: true
    }).then(response => {
      if (response.status === 200) {
        let user = response.data;
        return { status: "success", message: `Authenticated as ${user.username}`, title: "Success" };
      }
    });
  }
}
