"use client";

import { useEffect } from "react";
import { useLoading } from "../../context/Loading";
import { LoadingSpinner } from "./LoadingSpinner";

export default function ItemLoading({ item }: { item: any }) {
    const { loadingStates, setLoadingStates } = useLoading();

    useEffect(() => {
        const changeLoadingState = (id: string | number) => {
            setLoadingStates((prevLoadingStates: any) => ({
                ...prevLoadingStates,
                [id]: false,
            }));
        };

        changeLoadingState(item.id);
    }, [item, setLoadingStates]);

    if (loadingStates[item.id]) {
        return (
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-70 flex justify-center items-center rounded-md">
                <LoadingSpinner size={32} />
            </div>
        );
    } else {
        return;
    }
}
