import {createActions} from "redux-actions";

export const {
    statusSet,
    statusReset
} = createActions({
    STATUS_SET: (key, value) => ({ key, value }),
    STATUS_RESET: (key) => ({ key })
});

export const {
    persistedSet,
    persistedReset
} = createActions({
    PERSISTED_SET: (status) => ({ status }),
    PERSISTED_RESET: () => null,
});

