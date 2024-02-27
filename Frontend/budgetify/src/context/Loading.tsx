"use client";

import { createContext, useContext, useState } from "react";

const LoadingContext = createContext<any>(undefined);

export const LoadingProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
        {}
    );

    return (
        <LoadingContext.Provider value={{ loadingStates, setLoadingStates }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
