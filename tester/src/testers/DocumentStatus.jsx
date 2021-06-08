import tester from "./tester";
import React from "react";
import {Code} from "@chakra-ui/react";
import {DictToTable} from "./utils";

const DocumentStatus = ({ fn, value }) => {
    fn(() => ({
        hasFocus: document.hasFocus(),
        compatMode: document.compatMode,
        documentURI: document.documentURI,
        designMode: document.designMode,
    }));
    return (
        <DictToTable dict={value} />
    );
};

export default tester(DocumentStatus, {
    key: 'document',
    title: "Document",
    explainer: null
});