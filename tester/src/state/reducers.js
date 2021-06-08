import update from "immutability-helper";
import {handleActions} from "redux-actions";
import {persistedReset, persistedSet, statusReset, statusSet} from "./actions";

export const statusReducer = handleActions({
    [statusSet.toString()]: (state, { payload: { key, value }}) => update(state, {
        [key]: { $set: value }
    }),
    [statusReset.toString()]: (state, { payload: { key }}) => update(state, {
        [key]: { $set: undefined }
    }),
    [persistedSet.toString()]: (state, { payload: { status }}) => update(state, { $set: status })
}, {});

export const persistedReducer = handleActions({
    [persistedReset.toString()]: (state) => update(state, { $set: false }),
    [persistedSet.toString()]: (state) => update(state, { $set: true })
}, true);
