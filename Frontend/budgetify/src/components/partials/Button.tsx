interface ButtonProps {
    text: string;
    active?: boolean;
    onClick?: (e: any) => void;
    className?: string;
}

export default function Button({
    text,
    active = true,
    onClick,
    className,
}: ButtonProps) {
    return (
        <button
            className={`${className} ${
                active ? "opacity-100" : "opacity-80"
            } bg-buttonTeal text-authBlack py-3 px-4 rounded-md`}
            disabled={!active}
            onClick={active ? onClick : undefined}
        >
            {text}
        </button>
    );
}
