import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from 'react-chartjs-2';
import React from "react";
import {
    Text,
    Divider,
    HStack,
    Link,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalContent
} from "@chakra-ui/react";
import tester from "./tester";
import {YesNoList} from "./utils";

const CHART_RECORD_LENGTH = 15; // recent 30 readings
const CHART_LABELS = [];
for (let i=CHART_RECORD_LENGTH; i>0; i--) {
    CHART_LABELS.push(`-${i.toString()}`);
}

const useTsMemo = (input) => {
    const [ts, setTs] = React.useState([]);
    React.useEffect(() => {
        if (!input) return;
        if (ts.length < CHART_RECORD_LENGTH) {
            setTs([...ts, input]);
        } else {
            setTs([...ts.slice(1, ts.length - 1), input]);
        }
    }, [input]);
    return ts;
}

const DeviceSensors = ({ fn, value }) => {
    const deviceMesh = React.useRef();
    const [orientation, setOrientation] = React.useState(undefined);
    const [acceleration, setAcceleration] = React.useState(undefined);
    const [chartModalOpen, setChartModalOpen] = React.useState(false);

    const orientationTs = useTsMemo(orientation);
    const accelerationTs = useTsMemo(acceleration);

    const sensorChartData = React.useMemo(() => {
        return [{
            labels: CHART_LABELS,
            datasets: [
                { label: "A0", data: accelerationTs.map((a) => a[0]), fill: false, backgroundColor: '#1d3557', borderColor: '#1d3557',},
                { label: "A1", data: accelerationTs.map((a) => a[1]), fill: false, backgroundColor: '#2a9d8f', borderColor: '#2a9d8f',},
                { label: "A2", data: accelerationTs.map((a) => a[2]), fill: false, backgroundColor: '#e9c46a', borderColor: '#e9c46a',},
                { label: "A3", data: accelerationTs.map((a) => a[3]), fill: false, backgroundColor: '#e76f51', borderColor: '#e76f51',},
            ],
        }, {
            labels: CHART_LABELS,
            datasets: [
                { label: "O0", data: orientationTs.map((a) => a[0]), fill: false, backgroundColor: '#e63946', borderColor: '#e63946',},
                { label: "O1", data: orientationTs.map((a) => a[1]), fill: false, backgroundColor: '#457b9d', borderColor: '#457b9d',},
                { label: "O2", data: orientationTs.map((a) => a[2]), fill: false, backgroundColor: '#0096c7', borderColor: '#0096c7',},
                { label: "O3", data: orientationTs.map((a) => a[3]), fill: false, backgroundColor: '#aaa', borderColor: '#aaa',},
            ],
        }];
    }, [orientationTs, accelerationTs]);

    React.useEffect(() => {
        try {
            const options = { frequency: 60, referenceFrame: 'device' };
            const aSensor =  new LinearAccelerationSensor({frequency: 60});
            const oSensor = new AbsoluteOrientationSensor(options);
            oSensor.onreading = (e) => {
                const { quaternion } = e.currentTarget;
                deviceMesh.current.quaternion.fromArray(quaternion);
                setOrientation([...quaternion]);
            }
            aSensor.addEventListener('reading', function(e) {
                setAcceleration([aSensor.x, aSensor.y, aSensor.z]);
            });
            oSensor.start();
            aSensor.start();
            return () => {
                oSensor.stop();
                aSensor.stop();
            }
        } catch (err) {
            // noop
        }
    }, []);

    fn(async () => {
        let aclReporting = false;
        if ('Accelerometer' in window) {
            let acl = new window.Accelerometer({ frequency: 60 });
            acl.onreading = (e) => {
                aclReporting = true;
                acl.stop();
            };
            acl.start();
        }
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return [
            ["Accelerometer in window", 'Accelerometer' in window],
            ["Support DeviceOrientationEvent?", !!window.DeviceOrientationEvent],
            ["Accelerometer reporting?", aclReporting]
        ];
    });

    if (!value) return null;

    const boxDimensions = window.outerWidth < window.outerHeight ? [2.5, 4, 1] : [4, 2.5, 1];

    return (
        <>
            <YesNoList list={value} />
            <Divider my={2} />
            <Canvas>
                <perspectiveCamera makeDefault
                                   args={[60, 2, 0.1, 500]}
                                   position={[-1, -1, -1.5]}>
                    <axesHelper args={[10]} />
                    <mesh ref={deviceMesh}>
                        <boxGeometry args={boxDimensions} />
                        <meshBasicMaterial color="royalblue" />
                    </mesh>
                </perspectiveCamera>
            </Canvas>
            {orientation && (
                <>
                    <Divider my={2} />
                    <Text fontSize="sm" fontWeight="500">Orientation</Text>
                    <Text fontSize="xs">
                        {orientation.map((o) => o.toFixed(4)).join(" ")}
                    </Text>
                </>
            )}
            {acceleration && (
                <>
                    <Divider my={2} />
                    <Text fontSize="sm" fontWeight="500">Acceleration</Text>
                    <Text fontSize="xs">
                        {acceleration.map((o) => o.toFixed(4)).join(" ")}
                    </Text>
                </>
            )}
            {(orientation || acceleration) && (
                <Link href="javascript:void(0)" color="teal.500" onClick={() => setChartModalOpen(true)}>Display as timeseries charts</Link>
            )}

            {(orientation || acceleration) && chartModalOpen && (
                <Modal isOpen onClose={() => setChartModalOpen(false)}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalBody>
                            <ModalHeader>
                                Sensor reading visualisation
                            </ModalHeader>
                            <ModalCloseButton />

                            <Text mt={4} mb={2}>Acceleration</Text>
                            <Line
                                animation={false}
                                data={sensorChartData[0]}
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

                            <Text mt={4} mb={2}>Acceleration</Text>
                            <Line
                                animation={false}
                                data={sensorChartData[1]}
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
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
}

export default tester(DeviceSensors, {
    key: 'sensors',
    title: "Device sensors",
    explainer: (
        <>
            Accelerometer, gyroscope and others with visualized readings.
            <Text fontSize="sm">Please note that current reading is not part of the fingerprint</Text>
        </>
    )
});