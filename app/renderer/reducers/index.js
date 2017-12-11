import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import inspector from './Inspector';

// create our root reducer
const rootReducer = combineReducers({
  routing,
  inspector,
});

export default rootReducer;
