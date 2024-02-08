import { cookies } from "next/headers";

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
        <section>
            <h1>Transactions</h1>
        </section>
    );
}
