interface ButtonProps {
    text: string;
    active?: boolean;
    onClick: (e: any) => void;
}

export default function Button({ text, active, onClick }: ButtonProps) {
    return (
        <button
            className={`${
                active ? "opacity-100" : "opacity-80"
            } bg-buttonTeal text-authBlack py-3 px-4 rounded-md `}
            onClick={onClick}
        >
            {text}
        </button>
    );
}
