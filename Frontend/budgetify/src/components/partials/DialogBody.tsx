import {
    DialogContent,
    DialogFooter,
    DialogClose,
    DialogHeader,
} from "../ui/dialog";
import Image from "next/image";
import Button from "./Button";

export default function DialogBody({
    header,
    body,
    onYes,
    onNo,
}: {
    header: string;
    body: string;
    onYes: () => any;
    onNo?: () => any;
}) {
    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <div className="flex justify-between">
                    <span>{header}</span>
                    <div>
                        <Image
                            src="/icons/close.svg"
                            width={35}
                            height={35}
                            alt="close popup"
                        />
                    </div>
                </div>
            </DialogHeader>
            <div className="flex items-center space-x-2">
                <p>{body}</p>
            </div>
            <DialogFooter className="flex justify-end items-center">
                <DialogClose asChild>
                    <span onClick={onYes}>Yes</span>
                </DialogClose>
                <DialogClose asChild>
                    <Button text="No" onClick={onNo || undefined} />
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}
