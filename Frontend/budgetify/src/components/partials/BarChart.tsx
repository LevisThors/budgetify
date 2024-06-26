"use client";

import {
    Chart,
    ChartConfiguration,
    LinearScale,
    BarController,
    CategoryScale,
    BarElement,
} from "chart.js";
import { useEffect, useRef } from "react";

export default function BarChart({
    categoryStatistics,
}: {
    categoryStatistics: { [key: string]: number };
}) {
    const chart = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
    const labels = Object.keys(categoryStatistics);
    const values = Object.values(categoryStatistics);
    Chart.register(LinearScale, BarController, CategoryScale, BarElement);

    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b}, 0.6)`;
    };

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
            chartInstance.current = null;
        }

        const config: ChartConfiguration = {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "# of Votes",
                        data: values,
                        backgroundColor: values.map(() => getRandomColor()),
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 100,
                        },
                        grid: {
                            display: false,
                        },
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                },
            },
        };

        if (chart.current) {
            chartInstance.current = new Chart(chart.current, config);
        }
    }, []);

    return (
        <div>
            <canvas ref={chart} className="w-[445px] h-[335px]"></canvas>
        </div>
    );
}
