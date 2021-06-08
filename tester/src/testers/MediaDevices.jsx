import tester from "./tester";
import React from "react";
import {HStack, Box, Code, Text, Tag, Divider} from "@chakra-ui/react";

const MediaDevices = ({ fn, value }) => {
    fn(async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return {
            audioInput: devices.filter((d) => d.kind === "audioinput").length,
            audioOutput: devices.filter((d) => d.kind === "audiooutput").length,
            videoInput: devices.filter((d) => d.kind === "videoinput").length,
            supportedConstraints: Object.entries(await navigator.mediaDevices.getSupportedConstraints())
                .map(([k, v]) => !!v ? k : false)
                .filter(Boolean)
        };
    });
    if (!value) {
        return null;
    }
    return (
        <>
            <HStack spacing={8}>
                <HStack borderWidth="1px" borderRadius={8} px={4} py={2} fontSize="sm">
                    <Text>Audio Input</Text>
                    <Text fontWeight="500">{value.audioInput}</Text>
                </HStack>
                <HStack borderWidth="1px" borderRadius={8} px={4} py={2} fontSize="sm">
                    <Text>Audio Output</Text>
                    <Text fontWeight="500">{value.audioOutput}</Text>
                </HStack>
                <HStack borderWidth="1px" borderRadius={8} px={4} py={2} fontSize="sm">
                    <Text>Video Input</Text>
                    <Text fontWeight="500">{value.videoInput}</Text>
                </HStack>
            </HStack>

            <Divider my={4} />

            <Text mb={4}>Supported constraints (total {value.supportedConstraints.length}):</Text>
            {value.supportedConstraints.map((k, idx) => (
                <Tag key={idx} mr={2} mb={1}>
                    {k}
                </Tag>
            ))}
        </>
    );
}

export default tester(MediaDevices, {
    key: 'mediaDevices',
    title: "Media Devices",
    explainer: (
        <>
            Type of input/output devices registered by the browser.
        </>
    )
});


