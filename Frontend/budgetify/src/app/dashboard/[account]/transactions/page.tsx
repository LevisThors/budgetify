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
import { ScrollArea } from "@/components/ui/scroll-area";
import MESSAGE from "@/messages";
import { LoadingProvider } from "@/context/Loading";

interface TransactionsPageProps {
    params: {
        account: string;
    };
    searchParams?: {
        query?: string;
        type?: string;
        sort?: string;
    };
}

async function getTransactions(
    accountId: string,
    searchParams: { query?: string; type?: string; sort?: string } | null
) {
    const response = await fetch(
        `${PATHS.API.BASE.TRANSACTION.GET}?account_id=${accountId}${
            searchParams?.query ? `&query=${searchParams.query}` : ""
        }${searchParams?.type ? `&type=${searchParams.type}` : ""}${
            searchParams?.sort ? `&sort=${searchParams.sort}` : ""
        }`,
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

const getCategories = async (accountId: string) => {
    const res = await fetch(
        `${PATHS.API.BASE.CATEGORY.GET}?account_id=${accountId}`,
        {
            headers: {
                Cookie: `laravel_session=${
                    cookies().get("laravel_session")?.value
                }`,
                "X-XSRF-TOKEN": cookies().get("XSRF-TOKEN")?.value || "",
                "ngrok-skip-browser-warning": "69420",
            },
            credentials: "include",
        }
    );

    return res.json();
};

export default async function TransactionsPage({
    params,
    searchParams,
}: TransactionsPageProps) {
    const transactionsData = await getTransactions(
        params?.account,
        searchParams || null
    );

    const category = await getCategories(params.account);
    const hasCategories =
        category.Expenses.length > 0 || category.Income.length > 0;

    return (
        <section className="flex w-full justify-between h-full">
            <div className="w-2/3 px-16 flex flex-col gap-5">
                <Suspense>
                    <SearchBar />
                </Suspense>
                <SortBy />
                <Suspense fallback="LOADINGGG">
                    <ScrollArea>
                        <div className="max-h-[75vh] flex flex-col gap-5">
                            {transactionsData?.message !== "Empty account" ? (
                                transactionsData?.transactions?.map(
                                    (transaction: TransactionType) => (
                                        <LoadingProvider key={transaction.id}>
                                            <Card
                                                transaction={transaction}
                                                currency={currencyToSymbol(
                                                    transactionsData.currency
                                                )}
                                                page="transactions"
                                            />
                                        </LoadingProvider>
                                    )
                                )
                            ) : (
                                <span className="w-full text-center">
                                    {MESSAGE.ERROR.NOT_FOUND("Transactions")}
                                </span>
                            )}
                        </div>
                    </ScrollArea>
                </Suspense>
            </div>
            <div className="w-1/3 flex flex-col justify-between h-full gap-4">
                <div className="flex flex-col gap-4">
                    <Suspense>
                        <FilterButton type="Income" />
                        <FilterButton type="Expenses" />
                    </Suspense>
                    <Suspense fallback="loading">
                        <Sheet>
                            <SheetTrigger>
                                <ActionButton
                                    text={MESSAGE.BUTTON.ADD("Account")}
                                />
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader className="flex flex-row justify-between items-center">
                                    <h1 className="text-2xl">
                                        {MESSAGE.BUTTON.ADD("Account")}
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
                        <Sheet>
                            {hasCategories && (
                                <SheetTrigger>
                                    <ActionButton
                                        text={MESSAGE.BUTTON.ADD("Transaction")}
                                        needsAccount={true}
                                    />
                                </SheetTrigger>
                            )}
                            <SheetContent>
                                <SheetHeader className="flex flex-row justify-between items-center">
                                    <h1 className="text-2xl">
                                        {MESSAGE.BUTTON.ADD("Transaction")}
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
                    <PiggyBank accountId={params.account} />
                </div>
            </div>
        </section>
    );
}
