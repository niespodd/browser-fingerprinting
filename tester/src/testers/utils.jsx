import React from "react";
import {HStack, Box, Tag, Table, Thead, Tbody, Tr, Td, Th, Text} from "@chakra-ui/react";

const render = (v) => {
    switch (typeof v) {
        case "boolean":
            return v ? "✔️" : "❌";
        default:
            return v;
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

export const DictToTable = ({ dict = {}, limitKeys = [] }) => (
    <Box border="1px" borderColor="gray.100" borderRadius="md">
        <Table size="sm" shadow="sm">
            <Thead>
                <Tr>
                    <Th>
                        Key
                    </Th>
                    <Th>
                        Value
                    </Th>
                </Tr>
            </Thead>
            <Tbody>
                {Object.entries(dict).map(([k, v], idx) => (limitKeys.length === 0 || limitKeys.indexOf(k) >= 0) ? (
                    <Tr key={idx}>
                        <Td>
                            <Text color="gray.700">{k}</Text>
                        </Td>
                        <Td>
                            <Text isTruncated>
                                {render(v)}
                            </Text>
                        </Td>
                    </Tr>
                ) : null)}
            </Tbody>
        </Table>
    </Box>
);

