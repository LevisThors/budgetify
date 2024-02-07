interface InputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: "select" | "text" | "date" | "multiselect";
    name: string;
    label: string;
    required?: boolean;
    className?: string;
}

export default function Input({
    value,
    onChange,
    type = "text",
    name,
    label,
    required = false,
    className = "",
}: InputProps) {
    return (
        <fieldset className="border border-gray-400 h-[65px] flex items-center rounded-md overflow-hidden pb-2">
            <legend className="text-sm ms-2 px-1 text-gray-400">
                {label}{" "}
                <span className="text-red-500">{required ? "*" : ""}</span>
            </legend>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`outline-none w-full h-full px-3 font-medium ${className}`}
            />
        </fieldset>
    );
}
