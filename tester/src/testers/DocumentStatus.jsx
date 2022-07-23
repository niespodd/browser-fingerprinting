import tester from "./tester";
import React from "react";
import {Code} from "@chakra-ui/react";
import {DictToTable} from "./utils";

const DocumentStatus = ({ fn, value }) => {
    fn(() => ({
        document: {
            hasFocus: document.hasFocus() ? "yes" : "no",
            hidden: document.hidden ? "yes" : "no",
            compatMode: document.compatMode,
            documentURI: document.documentURI,
            designMode: document.designMode,
        }
    }));
    return (
        <DictToTable dict={value} limitKeys={[
            "document"
        ]} />
    );
};

export default tester(DocumentStatus, {
    key: 'document',
    title: "Document",
    explainer: null
});