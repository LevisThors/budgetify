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
import { SubscriptionType } from "@/type/SubscriptionType";
import ObligatoryForm from "@/components/ObligatoryForm";
import { LoadingProvider } from "@/context/Loading";
import { ObligatoryType } from "@/type/ObligatoryType";
import { useMessages, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

interface ObligatoriesPageProps {
    params: {
        account: string;
        locale: string;
    };
    searchParams?: {
        query?: string;
        type?: string;
        sort?: string;
    };
}

async function getObligatories(
    accountId: string,
    searchParams: { query?: string; type?: string; sort?: string } | null
) {
    const response = await fetch(
        `${PATHS.API.BASE.OBLIGATORY.GET}?account_id=${accountId}${
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

export default async function ObligatoriesPage({
    params,
    searchParams,
}: ObligatoriesPageProps) {
    const obligatoriesData = await getObligatories(
        params?.account,
        searchParams || null
    );

    const category = await getCategories(params.account);
    const hasCategories =
        category.Expenses.length > 0 || category.Income.length > 0;
    const t = await getTranslations("Obligatory");
    const transactionMessage = await getTranslations("Transaction");

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
                            {obligatoriesData?.message !== "Empty account" ? (
                                obligatoriesData?.obligatories?.map(
                                    (obligatory: ObligatoryType) => (
                                        <LoadingProvider key={obligatory.id}>
                                            <Card
                                                key={obligatory.id}
                                                transaction={obligatory}
                                                page="obligatories"
                                                currency={currencyToSymbol(
                                                    obligatoriesData.currency
                                                )}
                                            />
                                        </LoadingProvider>
                                    )
                                )
                            ) : (
                                <span className="w-full text-center">
                                    {t("notFound")}
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
                                <ActionButton text={t("add")} />
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader className="flex flex-row justify-between items-center">
                                    <h1 className="text-2xl">{t("add")}</h1>
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
                                <LoadingProvider>
                                    <ObligatoryForm type="create" />
                                </LoadingProvider>
                            </SheetContent>
                        </Sheet>
                        <Sheet>
                            {hasCategories && (
                                <SheetTrigger>
                                    <ActionButton
                                        text={transactionMessage("add")}
                                        needsAccount={true}
                                    />
                                </SheetTrigger>
                            )}
                            <SheetContent>
                                <SheetHeader className="flex flex-row justify-between items-center">
                                    <h1 className="text-2xl">
                                        {transactionMessage("add")}
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
                                <LoadingProvider>
                                    <TransactionForm type="create" />
                                </LoadingProvider>
                            </SheetContent>
                        </Sheet>
                    </Suspense>
                </div>
            </div>
        </section>
    );
}
