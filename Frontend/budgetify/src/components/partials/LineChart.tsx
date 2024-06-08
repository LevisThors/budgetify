import {
    Chart,
    ChartConfiguration,
    LinearScale,
    PointElement,
    CategoryScale,
    LineElement,
    LineController,
} from "chart.js";
import { useEffect, useRef } from "react";

export default function LineChart({
    data,
}: {
    data: {
        month: string;
        income: number;
        expenses: number;
        economy: number;
        percentage_of_economy: number;
    }[];
}) {
    const chart = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
    Chart.register(LinearScale, LineElement, PointElement, LineController);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
            chartInstance.current = null;
        }

        var chartData = {
            labels: data.map((item) => item.month),
            datasets: [
                {
                    label: "Income",
                    data: data.map((item) => item.income),
                    borderColor: "rgba(75,192,192,1)",
                    fill: false,
                },
                {
                    label: "Expenses",
                    data: data.map((item) => item.expenses),
                    borderColor: "rgba(255,99,132,1)",
                    fill: false,
                },
                {
                    label: "Economy",
                    data: data.map((item) => item.economy),
                    borderColor: "rgba(255,206,86,1)",
                    fill: false,
                },
            ],
        };

        if (chart.current) {
            chartInstance.current = new Chart(chart.current, {
                type: "line",
                data: chartData,
            });
        }
    }, [data]);

    return (
        <div>
            <canvas ref={chart} className="w-[445px] h-[335px]"></canvas>
        </div>
    );
}
