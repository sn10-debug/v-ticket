import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Label } from "recharts";

type DataPoint = {
    time: string;
    size: number;
};

const CustomLineChart = (props: { id: string }) => {
    const { id } = props;
    const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/analytics/${id}/timeseries`);
            const data = await response.json();
            setDataPoints((prevData) => [...prevData, data]);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        setInterval(fetchData, 5 * 60 * 1000);
    }, []);
    return (
        <LineChart width={1200} height={600} data={dataPoints} className="py-2">
            <XAxis dataKey="time">
                <Label value="Time" offset={0} position="insideBottom" />
            </XAxis>
            <YAxis dataKey="size">
                <Label value="Students" offset={0} position="insideLeft" angle={-90} />
            </YAxis>
            <CartesianGrid stroke="#f5f5f5" />
            <Tooltip />
            <Line type="monotone" dataKey="size" stroke="black" />
        </LineChart>
    );
};

export default CustomLineChart;
