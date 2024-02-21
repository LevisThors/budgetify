"use client";

import React, { useState, useRef, useEffect } from "react";
import { CategoryType } from "@/type/CategoryType";
import { motion } from "framer-motion";
import Image from "next/image";

interface DataSliderProps {
    categories: CategoryType[] | null;
    toggleActiveFilter?: any;
    activeFilters?: string[];
    size?: "small" | "large";
    remove?: (id: string) => void;
}

export default function DataSlider({
    categories,
    toggleActiveFilter,
    activeFilters,
    size,
    remove,
}: DataSliderProps) {
    const [width, setWidth] = useState(0);
    const slider = useRef<any>();

    useEffect(() => {
        setWidth(slider.current.scrollWidth - slider.current.offsetWidth);
    }, [categories]);

    if (!categories) return;

    return (
        <section
            className="w-full"
            style={size === "small" ? { justifyContent: "start" } : {}}
        >
            <motion.div
                ref={slider}
                className="category-slider"
                style={size === "small" ? { maxWidth: "100%" } : {}}
            >
                <motion.div
                    drag="x"
                    dragConstraints={
                        remove
                            ? { right: 0, left: -width - 40 }
                            : { right: 0, left: -width }
                    }
                    className="flex gap-2 items-center px-3"
                    style={size === "small" ? { gap: "16px" } : {}}
                >
                    {categories.map((category, index) => (
                        <button
                            key={category.id}
                            name={category?.id?.toString()}
                            className="flex gap-2 items-center px-2 py-1 border border-authBlack rounded-lg cursor-pointer"
                        >
                            {category.title}
                            {remove && (
                                <Image
                                    src="/icons/close.svg"
                                    alt="remove-category"
                                    onClick={() =>
                                        remove(category?.id?.toString() || "")
                                    }
                                    width={16}
                                    height={16}
                                />
                            )}
                        </button>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
