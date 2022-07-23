import tester from "./tester";
import React from "react";
import {Code, Text} from "@chakra-ui/react";
import {DictToTable, YesNoList} from "./utils";

async function probeEme() {
    const keySystems = {
        widevine: ['com.widevine.alpha'],
        playready: ['com.microsoft.playready', 'com.youtube.playready'],
        clearkey: ['webkit-org.w3.clearkey', 'org.w3.clearkey'],
        primetime: ['com.adobe.primetime', 'com.adobe.access'],
        fairplay: ['com.apple.fairplay']
    };

    if (!('requestMediaKeySystemAccess' in window.navigator)) {
        throw new Error("error");
    }

    let result = [];
    for (const [name, keySystemKeys] of Object.entries(keySystems)) {
        for (const keySystemKey of keySystemKeys) {
            try {
                await window.navigator.requestMediaKeySystemAccess(keySystemKey, [{
                    initDataTypes: ['keyids', 'webm']
                }, {
                    audioCapabilities: [{
                        contentType: 'audio/webm; codecs="opus"'
                    }],
                }]);
                result.push({name, keySystemKey, supported: true});
            } catch (err) {
                result.push({name, keySystemKey, supported: false});
            }
        }
    }
    return result;
}

const EncryptedMediaExtensions = ({fn, value}) => {
    const [eme, setEme] = React.useState(undefined);

    fn(async () => {
        const data = await probeEme();
        setEme(data.reduce((a, c) => {
            a[c.keySystemKey.replaceAll(".", ":")] = c.supported;
            return a;
        }, {}));
        return data;
    });

    if (!value) {
        return null;
    }

    return (
        <>
            <DictToTable
                dict={eme}
                limitKeys={false}
            />
        </>
    );
}

export default tester(EncryptedMediaExtensions, {
    key: 'eme',
    title: "Encrypted Media Extensions",
    explainer: "This checks availability of known DRM modules."
});


