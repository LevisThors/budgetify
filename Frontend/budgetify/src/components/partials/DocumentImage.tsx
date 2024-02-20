"use client";

import Image from "next/image";

export default function DocumentImage({
    imagePath,
    closeDocument,
}: {
    imagePath: string;
    closeDocument: () => void;
}) {
    return (
        <>
            <div
                className="fixed w-full h-full top-0 left-0 bg-neutral-800 opacity-50"
                onClick={closeDocument}
            ></div>
            <div className="fixed w-1/3 max-h-[90vh] h-auto top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
                <Image
                    src={imagePath}
                    height={1000}
                    width={600}
                    alt="document"
                    className="h-full w-full"
                />
            </div>
        </>
    );
}
