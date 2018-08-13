import WifiPlugDatasource from './datasource';
import {WifiPlugQueryCtrl} from './query_ctrl';
import {WifiPlugConfigCtrl} from './config_ctrl';

class WifiPlugAnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html';
}

export {
  WifiPlugDatasource as Datasource,
  WifiPlugQueryCtrl as QueryCtrl,
  WifiPlugConfigCtrl as ConfigCtrl,
  WifiPlugAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
