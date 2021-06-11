import tester from "./tester";
import React from "react";
import {Text, Code, Alert, Divider, Heading} from "@chakra-ui/react";
import {DictToTable} from "./utils";
import {Bar} from '@visx/shape';
import {Group} from "@visx/group";
import {Text as VText} from '@visx/text';

const TIMING_COLOR = {
    "resource": "#4834d4",
    "paint": "#eb4d4b",
    "mark": "#22a6b3",
    "navigation": "#6ab04c",
}

const TimelineVisualisation = ({ data }) => {
    const timelineWrapper = React.useRef(undefined);
    const [svgDimensions, setSvgDimensions] = React.useState(undefined);
    const [timings, setTimings] = React.useState({undefined});

    React.useEffect(() => {
        if (!timelineWrapper.current) return;
        const { clientWidth } = timelineWrapper.current;
        setSvgDimensions({ width: clientWidth, height: (10 * data.length) });
    }, [timelineWrapper]);

    const normalizedData = React.useMemo(() => {
        if (!svgDimensions) return [];
        const { width } = svgDimensions;
        const minW = Math.min(...data.map((d) => d.startTime));
        const maxW = Math.max(...data.map((d) => d.startTime + d.duration));
        const W = maxW - minW;

        setTimings({
            startTime: minW,
            endTime: maxW,
        });

        return data.map((e) => {
            return {
                x: ((e.startTime - minW)/W) * width,
                width: !!e.duration ? ((e.duration / W) * width) : W,
                fill: TIMING_COLOR[e.entryType],
                name: e.name,
            };
        });
    }, [svgDimensions, data]);

    return (
        <div ref={timelineWrapper} style={{ marginTop: '8px' }}>
            <Text mb={2}>Start time <Code>{timings.startTime}</Code>, end time <Code>{timings.endTime}</Code></Text>
            {svgDimensions && normalizedData && (
                <svg {...svgDimensions}>
                    <Group>
                        {normalizedData.map((e, idx) => (
                            <>
                                <Bar y={idx * 10} height={8} {...e} key={idx} />
                                <VText {...e} x={e.x + e.width + 6} fill="gray" y={idx * 10 + 6.5} height={12} fontSize={6} width={undefined}>{e.name}</VText>
                            </>
                        ))}
                    </Group>
                </svg>
            )}
        </div>
    )
}

const ResourceTiming = ({ fn, value }) => {
    fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
            const performanceEntries = window.performance.getEntries();
            const navigationTiming = performanceEntries.find((k) => k instanceof PerformanceNavigationTiming);
            return {
                navigationType: navigationTiming.type,
                encodedBodySize: navigationTiming.encodedBodySize,
                entriesCount: performanceEntries.length,
                domainLookupTime: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
            }
        } catch (err) {
            return {};
        }
    });

    const [timeline, setTimelineData] = React.useState([]);
    React.useEffect(() => {
        setTimeout(() => setTimelineData(window.performance.getEntries()), 3000);
    }, []);

    if (!value) return null;

    return (
        <>
            {value.navigationType ? (
                <Text my={4}>
                    You entered this page by <Code>{value.navigationType}</Code> action. Encoded body size of this page is <Code>{value.encodedBodySize}B</Code> (this can vary by encoding supported by your browser).
                </Text>
            ) : (
                <Text my={4}>
                    Likely <Code>PerformanceNavigationTiming</Code> is not supported by your browser.
                </Text>
            )}

            {value.domainLookupTime < 1 && (
                <Alert status="info" mb={4}>
                    <Text fontSize="sm" >
                        You have very likely <strong>already visited</strong> this page because domain lookup time was under 1ms.
                    </Text>
                </Alert>
            )}

            <DictToTable dict={value} limitKeys={["entriesCount", "domainLookupTime", "encodedBodySize", "navigationType"]} />

            {timeline.length > 0 && (
                <>
                    <Divider my={4} />
                    <Heading size="sm">
                        Loading timeline
                    </Heading>
                    <Text fontSize="sm" mb={2}>
                        This is visualisation of resource loading. It is not included in the fingerprint hash.
                    </Text>

                    <TimelineVisualisation data={timeline} />
                </>
            )}
        </>
    );
};

export default tester(ResourceTiming, {
    key: 'resourceTiming',
    title: "Resource Timing API",
    explainer: (
        <>
            Performance APIs can be useful to detect that proxy is in use by validating request timings. Data comes from <Code>window.performance</Code> scope.
        </>
    )
});

