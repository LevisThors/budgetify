interface ButtonProps {
    text: string;
    active?: boolean;
    onClick?: (e: any) => void;
    onInactiveClick?: (e: any) => void;
    className?: string;
}

export default function Button({
    text,
    active = true,
    onClick,
    className,
    onInactiveClick,
}: ButtonProps) {
    return (
        <button
            className={`${className} ${
                active ? "opacity-100" : "opacity-60 cursor-default"
            } bg-buttonTeal text-authBlack py-3 px-4 rounded-md`}
            onClick={active ? onClick : onInactiveClick}
        >
            {text}
        </button>
    );
}
