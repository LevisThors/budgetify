import Card from "@/components/partials/Card";
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
import { Suspense } from "react";
import TransactionForm from "@/components/TransactionForm";
import PATHS from "@/paths";
import SearchBar from "@/components/partials/SearchBar";
import SortBy from "@/components/partials/SortBy";
import currencyToSymbol from "@/util/currencyToSymbol";
import { ScrollArea } from "@/components/ui/scroll-area";
import SubscriptionForm from "@/components/SubscriptionsForm";
import MESSAGE from "@/messages";
import { SubscriptionType } from "@/type/SubscriptionType";
import { LoadingProvider } from "@/context/Loading";

interface SubscriptionsPageProps {
    params: {
        account: string;
    };
    searchParams?: {
        query?: string;
        type?: string;
        sort?: string;
    };
}

async function getSubscriptions(
    accountId: string,
    searchParams: { query?: string; type?: string; sort?: string } | null
) {
    const response = await fetch(
        `${PATHS.API.BASE.SUBSCRIPTION.GET}?account_id=${accountId}${
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

export default async function SubscriptionsPage({
    params,
    searchParams,
}: SubscriptionsPageProps) {
    const subscriptionsData = await getSubscriptions(
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
                <Suspense>
                    <ScrollArea>
                        <div className="max-h-[75vh] flex flex-col gap-5">
                            {subscriptionsData?.message !== "Empty account" ? (
                                subscriptionsData?.subscriptions?.map(
                                    (subscription: SubscriptionType) => (
                                        <LoadingProvider key={subscription.id}>
                                            <Card
                                                key={subscription.id}
                                                transaction={subscription}
                                                page="subscriptions"
                                                currency={currencyToSymbol(
                                                    subscriptionsData.currency
                                                )}
                                            />
                                        </LoadingProvider>
                                    )
                                )
                            ) : (
                                <span className="w-full text-center">
                                    {MESSAGE.ERROR.NOT_FOUND("Subscriptions")}
                                </span>
                            )}
                        </div>
                    </ScrollArea>
                </Suspense>
            </div>
            <div className="w-1/3 flex flex-col justify-between h-full gap-4">
                <div className="flex flex-col gap-4">
                    <Suspense fallback="loading">
                        <Sheet>
                            <SheetTrigger>
                                <ActionButton
                                    text={MESSAGE.BUTTON.ADD("Subscription")}
                                />
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader className="flex flex-row justify-between items-center">
                                    <h1 className="text-2xl">
                                        {MESSAGE.BUTTON.ADD("Subscription")}
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
                                <SubscriptionForm type="create" />
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
            </div>
        </section>
    );
}
