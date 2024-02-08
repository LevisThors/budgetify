import Card from "@/components/partials/Card";
import { TransactionType } from "@/type/TransactionType";
import { cookies } from "next/headers";
import ActionButton from "@/components/partials/ActionButton";
import {
    SheetTrigger,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetClose,
} from "@/components/ui/sheet";
import Image from "next/image";
import AccountForm from "@/components/AccountForm";
import { Suspense } from "react";

interface TransactionsPageProps {
    params: {
        account: string;
    };
}

async function getTransactions(accountId: string) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions?account_id=${accountId}`,
        {
            headers: {
                Cookie: `laravel_session=${
                    cookies().get("laravel_session")?.value
                }`,
                Accept: "application/json",
            },
            credentials: "include",
        }
    );

    return response.json();
}

export default async function TransactionsPage({
    params,
}: TransactionsPageProps) {
    const transactionsData = await getTransactions(params?.account);

    return (
        <section className="flex w-full justify-between h-full">
            <div className="w-2/3 px-16">
                {transactionsData.map((transaction: TransactionType) => (
                    <Card key={transaction.id} transaction={transaction} />
                ))}
            </div>
            <div className="w-1/3 h-full flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                    <Suspense fallback="loading">
                        <Sheet>
                            <SheetTrigger>
                                <ActionButton text="Add Account" />
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader className="flex flex-row justify-between items-center">
                                    <h1 className="text-2xl">Add Account</h1>
                                    <div>
                                        <SheetClose>
                                            <Image
                                                src="/icons/close.svg"
                                                alt="close"
                                                width={35}
                                                height={35}
                                            />
                                        </SheetClose>
                                    </div>
                                </SheetHeader>
                                <AccountForm type="create" />
                            </SheetContent>
                        </Sheet>
                        <Sheet>
                            <SheetTrigger>
                                <ActionButton text="Add Transaction" />
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader className="flex flex-row justify-between items-center">
                                    <h1 className="text-2xl">
                                        Add Transaction
                                    </h1>
                                    <div>
                                        <SheetClose>
                                            <Image
                                                src="/icons/close.svg"
                                                alt="close"
                                                width={35}
                                                height={35}
                                            />
                                        </SheetClose>
                                    </div>
                                </SheetHeader>
                                <AccountForm type="create" />
                            </SheetContent>
                        </Sheet>
                    </Suspense>
                </div>
                <div>
                    <h1>Piggy Bank</h1>
                </div>
            </div>
        </section>
    );
}
