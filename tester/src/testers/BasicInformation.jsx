import tester from "./tester";
import React from "react";
import {Code, Divider, Text, Link, HStack, Box, SimpleGrid, GridItem} from "@chakra-ui/react";
import {DictToTable} from "./utils";

const devToolsOpened = () => {
    // based on: https://github.com/sindresorhus/devtools-detect/blob/main/index.js
    let devtools = {};
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    const orientation = widthThreshold ? 'vertical' : 'horizontal';
    if (
        !(heightThreshold && widthThreshold) &&
        ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)
    ) {
        devtools.isOpen = true;
        devtools.orientation = orientation;
    } else {
        devtools.isOpen = false;
        devtools.orientation = undefined;
    }
    return devtools;
}

const probeStackLimit = async () => {
    let accessor = 'window.parent';
    let p = 0;
    while (true) {
        p += 500;
        try {
            eval(accessor);
        } catch (err) {
            break;
        }
        for (let i=0; i<500; i++) {
            accessor += '.parent';
        }
        await new Promise((resolve) => setTimeout(resolve, 50)); // helps to prevent early freeze/crash
    }
    return p;
}

const getConnectionInformation = async () => {
    const connection = await (navigator.connection || navigator.mozConnection || navigator.webkitConnection);
    if (!connection) return {};
    return {
        effectiveType: connection.effectiveType,
        saveData: connection.saveData,
        rtt: connection.rtt,
        downlink: connection.downlink,
    }
}

const BasicInformation = ({ fn, value }) => {
    fn(async () => {
        const devtools = devToolsOpened();
        const stackLimit = await probeStackLimit();
        const connection = await getConnectionInformation();
        return {
            navigator: {
                deviceMemory: navigator.deviceMemory,
                hardwareConcurrency: navigator.hardwareConcurrency,
            },
            performance: {
                "jsHeapSizeLimit": performance.memory.jsHeapSizeLimit,
            },
            stackLimit: stackLimit,
            window: {
                innerHeight: window.innerHeight,
                innerWidth: window.innerWidth,
                outerHeight: window.outerHeight,
                outerWidth: window.outerWidth,
            },
            devtools,
            connection,
        };
    });

    if (!value) return null;

    return (
        <>
            <SimpleGrid minChildWidth="265px" gap={8}>
                <GridItem>
                    <Box mb={4}>
                        <Text fontSize="sm" mb={2}>
                            Available hardware details:
                        </Text>
                        <DictToTable dict={value} limitKeys={["navigator", "stackLimit", "performance"]} />
                    </Box>
                </GridItem>
                <GridItem>
                    <Box mb={4}>
                        <Text fontSize="sm" mb={2}>
                            Window dimensions:
                        </Text>
                        <DictToTable dict={value} limitKeys={["window"]} />
                    </Box>
                    <Box>
                        <Text>
                            <Code>devTools</Code> opened? {value['devTools.isOpen'] ? "✔️" : "❌"} {value['devTools.orientation'] && `(${value['devTools.orientation']})`}
                        </Text>
                    </Box>
                </GridItem>
            </SimpleGrid>

            <Text fontSize="sm" mb={2} mt={2}>
                Connection information:
            </Text>
            <DictToTable dict={value.connection} limitKeys={["downlink", "rtt", "effectiveType", "saveData"]} />
            <Divider my={4} />
            <Text fontSize="xs">
                DevTools information are based on window sizing (borrowed from <Link color="teal.500" href="https://github.com/sindresorhus/devtools-detect/blob/main/index.js">sindresorhus/devtools-detect</Link>)
            </Text>
        </>
    );
}

export default tester(BasicInformation, {
    key: 'basic',
    title: "Basic Information",
    explainer: (
        <>
            Basic properties from global JS scope (e.g. <Code>window.navigator</Code>).
        </>
    )
});
