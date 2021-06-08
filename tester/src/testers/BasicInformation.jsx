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
        p += 50;
        try {
            eval(accessor);
        } catch (err) {
            break;
        }
        for (let i=0; i<50; i++) {
            accessor += '.parent';
        }
        await new Promise((resolve) => setTimeout(resolve, 50)); // helps to prevent early freeze/crash
    }
    return p;
}

const BasicInformation = ({ fn, value }) => {
    fn(async () => {
        const devtools = devToolsOpened();
        const stackLimit = await probeStackLimit();
        return {
            "deviceMemory": navigator.deviceMemory,
            "hardwareConcurrency": navigator.hardwareConcurrency,
            "window.innerHeight": window.innerHeight,
            "window.innerWidth": window.innerWidth,
            "window.outerHeight": window.outerHeight,
            "window.outerWidth": window.outerWidth,
            "devTools.isOpen": devtools.isOpen,
            "devTools.orientation": devtools.orientation,
            "stackLimit": stackLimit,
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
                        <DictToTable dict={value} limitKeys={["deviceMemory", "hardwareConcurrency", "stackLimit"]} />
                    </Box>
                    <Box>
                        <Text>
                            <Code>devTools</Code> opened? {value['devTools.isOpen'] ? "✔️" : "❌"} {value['devTools.orientation'] && `(${value['devTools.orientation']})`}
                        </Text>
                    </Box>
                </GridItem>
                <GridItem>
                    <Text fontSize="sm" mb={2}>
                        Window dimensions:
                    </Text>
                    <DictToTable dict={value} limitKeys={[
                        "window.innerWidth",
                        "window.innerHeight",
                        "window.outerHeight",
                        "window.outerWidth",
                    ]} />

                </GridItem>
            </SimpleGrid>

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
