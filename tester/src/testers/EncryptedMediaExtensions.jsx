import tester from "./tester";
import React from "react";
import {Code, Text} from "@chakra-ui/react";

const EncryptedMediaExtensions = ({ fn, value }) => {
    // TODO WIP
    fn(async () => {
        return {};
    });
    if (!value) {
        return null;
    }
    return (
        <>
        </>
    );
}

export default tester(EncryptedMediaExtensions, {
    key: 'eme',
    title: "Encrypted Media Extensions",
});


