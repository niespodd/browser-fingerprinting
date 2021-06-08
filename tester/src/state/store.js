import {combineReducers, createStore} from "redux";

import { statusReducer, persistedReducer } from "./reducers";

const rootReducer = combineReducers({
    status: statusReducer,
    persisted: persistedReducer
});

const store = createStore(rootReducer, {});

export default store;