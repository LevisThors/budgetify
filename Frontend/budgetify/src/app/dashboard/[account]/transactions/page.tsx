import Card from "@/components/partials/Card";
import { TransactionType } from "@/type/TransactionType";
import { cookies } from "next/headers";
import ActionButton from "@/components/partials/ActionButton";
import { SheetTrigger, Sheet, SheetContent } from "@/components/ui/sheet";
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
        <section className="flex w-full justify-between">
            <div className="w-2/3 px-16">
                {transactionsData.map((transaction: TransactionType) => (
                    <Card key={transaction.id} transaction={transaction} />
                ))}
            </div>
            <div className="w-1/3">
                {/* <Suspense fallback="">
                    <Sheet>
                        <SheetTrigger>
                            <ActionButton />
                        </SheetTrigger>
                        <SheetContent>
                            <AccountForm type="create" />
                        </SheetContent>
                    </Sheet>
                </Suspense> */}
            </div>
        </section>
    );
}
