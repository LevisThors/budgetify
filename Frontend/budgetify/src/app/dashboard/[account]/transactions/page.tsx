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
import TransactionForm from "@/components/TransactionForm";
import PATHS from "@/paths";
import PiggyBank from "@/components/PiggyBank";
import FilterButton from "@/components/partials/FilterButton";
import SearchBar from "@/components/partials/SearchBar";
import SortBy from "@/components/partials/SortBy";
import currencyToSymbol from "@/util/currencyToSymbol";

interface TransactionsPageProps {
    params: {
        account: string;
    };
    searchParams?: {
        query?: string;
        type?: string;
    };
}

async function getTransactions(
    accountId: string,
    searchParams: { query?: string; type?: string } | null
) {
    const response = await fetch(
        `${PATHS.API.BASE.TRANSACTION.GET}?account_id=${accountId}${
            searchParams?.query ? `&query=${searchParams.query}` : ""
        }${searchParams?.type ? `&type=${searchParams.type}` : ""}`,
        {
            headers: {
                Cookie: `laravel_session=${
                    cookies().get("laravel_session")?.value
                }`,
                Accept: "application/json",
                "ngrok-skip-browser-warning": "69420",
            },
            credentials: "include",
        }
    );

    return response.json();
}

export default async function TransactionsPage({
    params,
    searchParams,
}: TransactionsPageProps) {
    const transactionsData = await getTransactions(
        params?.account,
        searchParams || null
    );

    return (
        <section className="flex w-full justify-between h-full">
            <div className="w-2/3 px-16 flex flex-col gap-5">
                <Suspense>
                    <SearchBar />
                </Suspense>
                <SortBy />
                {transactionsData?.message !== "Empty account" &&
                    transactionsData.transactions.map(
                        (transaction: TransactionType) => (
                            <Card
                                key={transaction.id}
                                transaction={transaction}
                                currency={currencyToSymbol(
                                    transactionsData.currency
                                )}
                            />
                        )
                    )}
            </div>
            <div className="w-1/3 h-full flex flex-col justify-between h-full">
                <div className="flex flex-col gap-4">
                    <Suspense>
                        <FilterButton type="Income" />
                        <FilterButton type="Expenses" />
                    </Suspense>
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
                                <ActionButton
                                    text="Add Transaction"
                                    needsAccount={true}
                                />
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
                                <TransactionForm type="create" />
                            </SheetContent>
                        </Sheet>
                    </Suspense>
                </div>
                <div>
                    <PiggyBank />
                </div>
            </div>
        </section>
    );
}
