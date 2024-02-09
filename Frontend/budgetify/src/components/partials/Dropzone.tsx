"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function Dropzone({
    onFileUpload,
    onDelete,
}: {
    onFileUpload: (file: File | null) => void;
    onDelete: (index: number) => void;
}) {
    const [fileNames, setFileNames] = useState<string[] | null>([]);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        handleFile(file);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            handleFile(file);
            setError(null);
        } else {
        }
    };

    const handleFile = (file: File) => {
        setFileNames((prev) => (prev ? [...prev, file.name] : [file.name]));
        onFileUpload(file);
        setError(null);
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleDelete = (index: number) => {
        setFileNames((prev) =>
            prev ? prev.filter((_, i) => i !== index) : []
        );
        onDelete(index);
    };

    return (
        <div className="w-full flex gap-[15px] flex-wrap">
            {fileNames?.map((fileName, index) => (
                <div
                    className="flex flex-col text-center w-1/5 overflow-hidden"
                    key={fileName}
                >
                    <Image
                        src="/icons/image.svg"
                        alt="Uploaded image"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                    />
                    <span className="text-xs max-w-full overflow-ellipsis">
                        {fileName}
                    </span>
                </div>
            ))}
            <div
                className="flex flex-col text-center w-1/5 h-[71px] border border-dashed rounded-lg border-black justify-center items-center text-5xl cursor-pointer"
                onClick={handleClick}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
            >
                +
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
            />

            {error && (
                <span className="input-validation input-validation-fail">
                    {error}
                </span>
            )}
        </div>
    );
}
