import { createStore, combineReducers } from 'redux';
import authReducer from './reducers/auth_reducer';

const rootReducer = combineReducers({
    auth: authReducer,
});

const store = createStore(rootReducer);

export default store;