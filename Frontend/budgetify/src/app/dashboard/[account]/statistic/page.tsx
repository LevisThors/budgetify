import BarChart from "@/components/partials/BarChart";
import { Suspense } from "react";
import { cookies } from "next/headers";
import PATHS from "@/paths";
import Statistics from "@/components/Statistics";

async function getCategoryStatistics(accountId: string) {
    const response = await fetch(
        `${PATHS.API.BASE.CATEGORY_STATISTICS.GET}?account_id=${accountId}`,
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
    console.log(categoryStatistics);
    return (
        <Suspense>
            <Statistics statistics={categoryStatistics} />
        </Suspense>
    );
}
