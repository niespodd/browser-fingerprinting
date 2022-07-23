import tester from "./tester";
import React from "react";
import {Line} from 'react-chartjs-2';

import {Code, Divider} from "@chakra-ui/react";


const PefrormanceMemory = ({fn, value}) => {
    /**
     > performance.memory

     MemoryInfo {totalJSHeapSize: 54084038, usedJSHeapSize: 50643738, jsHeapSizeLimit: 4294705152}
     jsHeapSizeLimit: 4294705152
     totalJSHeapSize: 54084038
     usedJSHeapSize: 50643738
     [[Prototype]]: MemoryInfo
     */

    const [useChart, setUseChart] = React.useState([]);
    const [absoluteChart, setAbsoluteChart] = React.useState([]);

    function measureMemory() {
        setUseChart([...useChart.reverse().slice(0, 100).reverse(), (
            window.performance.memory.usedJSHeapSize /
            window.performance.memory.totalJSHeapSize
        )]);
        setAbsoluteChart([...absoluteChart.reverse().slice(0, 100).reverse(), [
            window.performance.memory.usedJSHeapSize,
            window.performance.memory.totalJSHeapSize,
        ]]);
    }

    React.useEffect(() => {
        let idx = setInterval(measureMemory, 100);
        return () => clearInterval(idx);
    });

    return (
        <>
            <Line
                data={{
                    labels: Array.from({length: 100}).map((_, idx) => idx.toString()),
                    datasets: [{
                        label: "Used/Total",
                        data: useChart,
                        fill: false,
                        backgroundColor: '#1d3557',
                        borderColor: '#1d3557',
                    }]
                }}
                options={{
                    animation: false,
                    elements: {
                        point: {
                            radius: 0 // default to disabled in all datasets
                        }
                    },
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                },
                            },
                        ],
                    },
                }}
            />

            <Divider my={2} />

            <Line
                data={{
                    labels: Array.from({length: 100}).map((_, idx) => idx.toString()),
                    datasets: [{
                        label: "usedJSHeapSize",
                        data: absoluteChart.map(p => p[0]),
                        fill: false,
                        backgroundColor: '#0096c7',
                        borderColor: '#0096c7',
                    }, {
                        label: "totalJSHeapSize",
                        data: absoluteChart.map(p => p[1]),
                        fill: false,
                        backgroundColor: '#e63946',
                        borderColor: '#e63946',
                    }]
                }}
                options={{
                    animation: false,
                    elements: {
                        point: {
                            radius: 0 // default to disabled in all datasets
                        }
                    },
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                },
                            },
                        ],
                    },
                }}
            />
        </>
    );
};

export default tester(PefrormanceMemory, {
    key: 'perf_memory',
    title: "Performance (Memory)",
    explainer: (
        <>
            This test evaluates <Code>performance.memory</Code> to detect automation with puppeteer or selenium.
        </>
    )
});