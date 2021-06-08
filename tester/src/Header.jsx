import React from "react";
import copy from 'copy-to-clipboard';
import {HStack, Stack, Button, Box, Input, InputGroup, InputRightElement, Text, Modal, ModalOverlay, ModalBody, ModalContent, ModalHeader, ModalCloseButton, Link} from "@chakra-ui/react";
import 'react-json-pretty/themes/monikai.css';
import JSONPretty from 'react-json-pretty';
import {useSelector} from "react-redux";

import md5 from "./utils/md5";
import b64 from "./utils/base64";

const FingerprintInput = () => {
    const status = useSelector((state) => state.status);
    const value = React.useMemo(() => md5(JSON.stringify(status)), [status]);
    const handleCopy = React.useCallback(() => {
        copy(value);
        alert("Fingerprint hash copied to clipboard.")
    });
    return (
        <InputGroup size="md">
            <Input
                pr="4.5rem"
                type="text"
                value={value}
                id="fp"
                readOnly
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleCopy}>
                    Copy
                </Button>
            </InputRightElement>
        </InputGroup>
    )
};

const RawModal = ({ isOpen, onClose }) => {
    const status = useSelector((state) => state.status);
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Inspect RAW report values</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box borderRadius={4} style={{ overflow: 'hidden' }}>
                        <JSONPretty json={status} mainStyle="padding:1em; font-size: 12px"  />
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

const ShareModal = ({ isOpen, onClose }) => {
    const status = useSelector((state) => state.status);
    const shareLink = React.useMemo(() => {
        const b64status = b64.encode(JSON.stringify(status));
        return `${window.location.href.split("#")[0]}#${encodeURIComponent(b64status)}`;
    }, [status]);
    const handleCopy = React.useCallback(() => {
        copy(shareLink);
        alert("Copied to clipboard");
    }, []);
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Share current report</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack>
                        <Text>
                            Use the generated link to share current report:
                        </Text>
                        <InputGroup size="md">
                            <Input
                                type="text"
                                value={shareLink}
                                id="link"
                            />
                        </InputGroup>
                        <Link href="javascript:void(0)" fontSize="xs" color="teal.500" style={{ display: 'inline-block', textAlign: 'right' }} onClick={handleCopy}>
                            Copy link to clipboard
                        </Link>
                        <Text fontSize="sm" mb={4} pb={4}>
                            Please note that the report may contain some of your device data which may be in some cases
                            sensitive.
                        </Text>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default () => {
    const [rawModalOpened, setRawModalOpened] = React.useState(false);
    const [shareModalOpened, setShareModalOpened] = React.useState(false);
    return (
        <>
            <Stack align="stretch">
                <HStack spacing={6} w="100%">
                    <Box w="50%">
                        <FingerprintInput />
                    </Box>

                    <Button onClick={() => setRawModalOpened(true)} size="sm" ml="auto">
                        Inspect
                    </Button>

                    <Button onClick={() => setShareModalOpened(true)} colorScheme="blue" size="sm" ml="auto">
                        Share
                    </Button>
                </HStack>
            </Stack>

            <RawModal isOpen={rawModalOpened} onClose={() => setRawModalOpened(false)} />
            <ShareModal isOpen={shareModalOpened} onClose={() => setShareModalOpened(false)} />
        </>
    )
}