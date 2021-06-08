import tester from "./tester";
import React from "react";
import {Code, Spinner, Wrap, WrapItem, Box, Text, HStack} from "@chakra-ui/react";
import Flag from 'react-flagkit';
import {DictToTable} from "./utils";

const fkc = (k) => {
    try {
        return k.split("#")[0].replace("_", "-").split("-")[1].toUpperCase();
    } catch (err) {
        return "";
    }
}

const SpeechSynthesis = ({ value, fn }) => {
    fn(async () => {
        let voicesList = [];
        for (let i=0; i<10; i++) {
            voicesList = window.speechSynthesis.getVoices();
            if (voicesList.length > 0) {
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        return voicesList.map((v) => ({ lang: v.lang, name: v.name.slice(0, 24) }));
    });
    if (!value) return null;
    return (
        <>
            <Text mb={4}>
                Detected: {value.length}
            </Text>
            <Wrap>
                {value.map((v, idx) => (
                    <WrapItem key={idx}>
                        <Box mr={2} px={2}>
                            <HStack>
                                <Flag country={fkc(v.lang)} style={{ display: 'inline-block', width: 16, height: 16, marginRight: 2 }} />
                                <Text fontSize="xs" color="gray.600" isTruncated style={{ maxWidth: '72px' }}>
                                    {v.name}
                                </Text>
                            </HStack>
                        </Box>
                    </WrapItem>
                ))}
            </Wrap>
        </>
    );
};

export default tester(SpeechSynthesis, {
    key: 'speechSynthesis',
    title: "Speech Synthesis API voices",
    explainer: (
        <>
            List of detected voices for speech synthesis.
        </>
    )
});