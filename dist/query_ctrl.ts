///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from 'lodash';
import {QueryCtrl} from 'app/plugins/sdk';
import './css/query_editor.css!';

export class WifiPlugQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';

  defaults = {
  };

  /** @ngInject **/
  constructor($scope, $injector, private templateSrv, private $q) {
    super($scope, $injector);

    _.defaultsDeep(this.target, this.defaults);

    this.target.target = this.target.target || 'Select Device';
    this.target.type = this.target.type || 'timeserie';
    this.target.device_requirement = this.target.device_requirement || 'Select Requirement';
  }

  getOptions(query) {
    return this.datasource.metricFindQuery(query || '');
  }

  getDeviceReqOptions(query) {
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
    ])
  }

  onDeviceReqChangeInternal() {
      this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }

  onChangeInternal() {
    this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }
}