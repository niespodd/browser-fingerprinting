import React from "react";
import {HStack, Box, Tag, Table, Thead, Tbody, Tr, Td, Th, Text, List, ListItem} from "@chakra-ui/react";
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons';

const getObjectValueFromPath = function(o, s) {
    s = s.replace(".*", "");
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    if (typeof o == "object") {
        return Object.entries(o);
    }
    return o;
}

const render = (v) => {
    if (v instanceof Array) {
        if (v[0] instanceof Array) {
            // list of kv (from Object.entries)
            return [true, (
                <List>
                    {v.map(([key, value], idx) => (
                        <ListItem key={idx}>
                            {key} = {value}
                        </ListItem>
                    ))}
                </List>
            )];
        } else {
            // list of values
            return [true, (
                <List>
                    {v.map((entry, idx) => (
                        <ListItem key={idx}>
                            {entry.toString()}
                        </ListItem>
                    ))}
                </List>
            )];
        }
    }

    switch (typeof v) {
        case "boolean":
            return [false, v ? "✔️" : "❌"];
        default:
            return [false, v];
    }
}

export const YesNoList = ({ list = [] }) => (
    <Box>
        {list.map(([k, v], idx) => (
            <Tag key={idx} fontSize="xs" mr={2} mb={1}>
                <HStack>
                    <Text>{k}</Text>
                    <Text>{!!v ? "✔️" : "❌"}</Text>
                </HStack>
            </Tag>
        ))}
    </Box>
);

const DictToTableRow = ({ dict, k }) => {
    const [isList, rendered] = render(getObjectValueFromPath(dict, k));
    if (isList) {
        return (
            <Tr>
                <Td colSpan={2}>
                    <Text fontSize="xs" fontWeight="500">{k}</Text>
                    <Text isTruncated ml={2}>
                        {rendered}
                    </Text>
                </Td>
            </Tr>
        )
    } else {
        return (
            <Tr>
                <Td>
                    {k}
                </Td>
                <Td>
                    {rendered}
                </Td>
            </Tr>
        )
    }
}

export const DictToTable = ({ dict = {}, limitKeys = [] }) => {
    const dictKeys = React.useMemo(() =>
        limitKeys ? Object.keys(dict).filter((k) => limitKeys.indexOf(k) >= 0) : Object.keys(dict),
        [dict, limitKeys]
    );
    if (!dict) return null;
    return (
        <Box border="1px" borderColor="gray.100" borderRadius="md">
            <Table size="sm" shadow="sm">
                <Tbody>
                    {dictKeys.map((k, idx) => (
                        <DictToTableRow dict={dict} k={k} idx={idx} />
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
}

