import BarChart from "@/components/partials/BarChart";
import { Suspense } from "react";
import { cookies } from "next/headers";
import PATHS from "@/paths";

async function getCategoryStatistics(accountId: string) {
    const response = await fetch(
        `${PATHS.API.BASE.CATEGORY_STATISTICS.GET}?account_id=${accountId}&date=2024-02-04,2024-02-10`,
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

export default async function StatisticPage({
    params,
}: {
    params: { account: string };
}) {
    const categoryStatistics = await getCategoryStatistics(params.account);

    return (
        <div>
            <h1>StatisticPage</h1>
            <Suspense>
                <BarChart categoryStatistics={categoryStatistics} />
            </Suspense>
        </div>
    );
}
