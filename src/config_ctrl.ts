///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import {WifiPlugQueryCtrl} from "./query_ctrl";

export class WifiPlugConfigCtrl {
  static templateUrl = 'partials/config.html';
  current: any;

  constructor($scope) {
  }
}
