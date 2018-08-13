/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { QueryCtrl } from 'app/plugins/sdk';
export declare class WifiPlugQueryCtrl extends QueryCtrl {
    private templateSrv;
    private $q;
    static templateUrl: string;
    defaults: {};
    /** @ngInject **/
    constructor($scope: any, $injector: any, templateSrv: any, $q: any);
    getOptions(query: any): any;
    getDeviceReqOptions(query: any): any;
    onDeviceReqChangeInternal(): void;
    onChangeInternal(): void;
}
