import tester from "./tester";
import React from "react";
import {Code, Text} from "@chakra-ui/react";

const FeaturePolicy = ({ fn, value }) => {
    fn(async () => document.featurePolicy.features());
    if (!value) {
        return null;
    }
    return (
        <>
            <Text mb={2}>
                Detected: {value.length}
            </Text>
            {value.map((policy, idx) => (
                <Code key={idx} mr={2} mb={1}>{policy}</Code>
            ))}
        </>
    );
}

export default tester(FeaturePolicy, {
    key: 'featurePolicy',
    title: "Feature policy",
    explainer: (
        <>
            Some of these are reflection of browser's trials.
        </>
    )
});


