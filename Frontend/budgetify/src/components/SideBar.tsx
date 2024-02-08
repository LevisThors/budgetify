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
                "ngrok-skip-browser-warning": "69420",
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
                <Suspense
                    key={account.id}
                    fallback={
                        <div className="flex justify-between w-[400px] h-[185px] relative bg-gradient-linear rounded-xl p-5 cursor-pointer opacity-50"></div>
                    }
                >
                    <Account account={account} />
                </Suspense>
            ))}
        </ul>
    );
}
