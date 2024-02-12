import PATHS from "@/paths";
import { cookies } from "next/headers";
import { PiggyBankType } from "@/type/PiggyBankType";
import { Suspense } from "react";
import PiggyBankForm from "./PiggyBankForm";
import PiggyBankButton from "./partials/PiggyBankButton";

async function getPiggyBanks(accountId: string) {
    const response = await fetch(
        `${PATHS.API.BASE.PIGGY_BANK.GET}?account_id=${accountId}`,
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
export default async function PiggyBank({ accountId }: { accountId: string }) {
    const { piggyBanks, currency } = await getPiggyBanks(accountId);

    return (
        <div className="flex flex-col gap-4">
            <Suspense>
                <PiggyBankButton />
                {piggyBanks?.map((piggyBank: PiggyBankType) => (
                    <PiggyBankButton
                        key={piggyBank.id}
                        piggyBank={{ ...piggyBank, currency: currency }}
                    />
                ))}
            </Suspense>
        </div>
    );
}
