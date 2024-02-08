import { AccountType } from "@/type/AccountType";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Account from "./Account";

const getAccounts = async () => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts`,
        {
            headers: {
                Cookie: `laravel_session=${
                    cookies().get("laravel_session")?.value
                }`,
                "X-XSRF-TOKEN": cookies().get("XSRF-TOKEN")?.value || "",
            },
            credentials: "include",
        }
    );

    return res.json();
};

export default async function SideBar() {
    const accountData = await getAccounts();

    return (
        <ul className="flex flex-col gap-7">
            {accountData.map((account: AccountType) => (
                <Suspense key={account.id}>
                    <Account account={account} />
                </Suspense>
            ))}
        </ul>
    );
}
