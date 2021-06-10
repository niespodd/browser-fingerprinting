import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Box, Heading, Text, Spinner, Alert, AlertIcon} from "@chakra-ui/react";
import {statusSet} from "../state/actions";

import mixpanel from 'mixpanel-browser';

const TesterStatus = {
    LOADING: 1,
    ERROR: 2,
    LOADED: 3
}

export default (cls, config) => () => {
    const { key, title, explainer } = config;
    const usePersisted = useSelector((state) => state.persisted);
    const storedValue = useSelector((state) => state.status[config.key]);
    const [status, setStatus] = React.useState(true);
    const dispatch = useDispatch();
    const assocTestFn = (fn) => React.useEffect(async () => {
        setStatus(TesterStatus.LOADING);
        if (!usePersisted) {
            try {
                dispatch(statusSet(key, await fn()));
                setTimeout(function() {
                   setStatus(TesterStatus.LOADED);
                }, 500);
            } catch (e) {
                setStatus(TesterStatus.ERROR);
                mixpanel.track('failed:' + key);
            }
        } else {
           setStatus(TesterStatus.LOADED);
        }
    }, [usePersisted]);
    const instance = React.createElement(cls, { fn: assocTestFn, value: storedValue });
    return (
        <Box title={title} borderRadius="lg" borderWidth={1} py={4} px={6} shadow="sm" mb={4} className="bia">
            {title && (
                <Heading as="h2" size="md">
                    {title} {status === TesterStatus.LOADING && <Spinner size="sm" ml={2} />}
                </Heading>
            )}

            {status === TesterStatus.ERROR && (
                <Alert status="error" mt={3}>
                    <AlertIcon />
                    There was a problem running test.
                </Alert>
            )}

            {explainer && (
                <Text color="gray.500" mt={2}>
                    {explainer}
                </Text>
            )}

            <Box mt={4}>
                {instance}
            </Box>
        </Box>
    );
};
