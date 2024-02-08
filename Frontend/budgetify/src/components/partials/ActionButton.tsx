export default function ActionButton({ text }: { text: string }) {
    const isAdd = text.split(" ")[0].toLowerCase() === "add";

    return (
        <div className="bg-buttonTeal text-authBlack py-1 px-4 rounded-lg flex items-center gap-2">
            {isAdd && (
                <span className="flex w-[35px] h-[35px] bg-white text-buttonTeal rounded-full items-center justify-center text-4xl">
                    +
                </span>
            )}
            <span className="font-medium">{text}</span>
        </div>
    );
}
