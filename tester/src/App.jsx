import React from "react";
import {ChakraProvider, Box, Container, Divider, Text, Link, Alert} from "@chakra-ui/react";
import {Provider, useDispatch, useSelector} from 'react-redux';

import Header from "./Header";
import store from "./state/store";
import {persistedReset, persistedSet} from "./state/actions";

import BasicInformation from "./testers/BasicInformation";
import ChromeExtensions from "./testers/ChromeExtensions";
import DocumentStatus from "./testers/DocumentStatus";
import FeaturePolicy from "./testers/FeaturePolicy";
import SpeechSynthesis from "./testers/SpeechSynthesis";
import DeviceSensors from "./testers/DeviceSensors";
import base64 from "./utils/base64";
import MediaDevices from "./testers/MediaDevices";
import EncryptedMediaExtensions from "./testers/EncryptedMediaExtensions";
import ResourceTiming from "./testers/ResourceTiming";

const AppPersisted = () => {
    const dispatch = useDispatch();
    const hasPersisted = useSelector((state) => state.persisted);
    React.useEffect(() => {
        const hashStatus = window.location.hash.replace("#", "");
        if (hashStatus.length > 0) {
            dispatch(persistedSet(JSON.parse(base64.decode(decodeURIComponent(hashStatus)))));
        } else {
            dispatch(persistedReset());
        }
    }, []);

    if (hasPersisted) {
        return (
            <Container maxW="container.xl" mt={4}>
                <Alert status="info" variant="left-accent" size="sm" fontSize="sm">
                    You are viewing a saved snapshot.
                    <Link href={window.location.href.split("#")[0]} color="teal.600" ml={2}>Click here to run a new test.</Link>
                </Alert>
            </Container>
        )
    }
    return null;
}

const App = () => {
    return (
        <Provider store={store}>
            <ChakraProvider>
                <Box bg="gray.800">
                    <Container maxW="container.xl" py={2}>
                        <Text fontSize="sm" color="gray.100">
                            Read more about browser fingerprinting ➜ <Link color="teal.500" href="https://github.com/niespodd/browser-fingerprinting">https://github.com/niespodd/browser-fingerprinting</Link>
                        </Text>
                    </Container>
                </Box>

                <AppPersisted />

                <Container maxW="container.xl">
                    <Box py={4}>
                        <Header />
                    </Box>
                </Container>

                <Divider mb={6} />

                <Container maxW="container.xl">
                    <Box w="100%" sx={{ columnCount: window.outerWidth > 500 ? 2 : 1, columnGap: "24px" }}>
                        {/*<EncryptedMediaExtensions />*/}
                        <BasicInformation />
                        <ResourceTiming />
                        <MediaDevices />

                        <DeviceSensors />
                        <ChromeExtensions />
                        <DocumentStatus />
                        <FeaturePolicy />
                        <SpeechSynthesis />
                    </Box>
                </Container>

                <Divider my={6} />
            </ChakraProvider>
        </Provider>
    )
};

export default App;