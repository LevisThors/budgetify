import BarChart from "@/components/partials/BarChart";
import { Suspense } from "react";
import { cookies } from "next/headers";
import PATHS from "@/paths";
import Statistics from "@/components/Statistics";

async function getCategoryStatistics(
    accountId: string,
    searchParams:
        | {
              download?: string;
              date?: string;
              categories?: string;
          }
        | undefined
) {
    const response = await fetch(
        `${PATHS.API.BASE.CATEGORY_STATISTICS.GET}?account_id=${accountId}&${
            searchParams?.date
                ? `&date=${searchParams.date}&
            ${
                searchParams?.categories
                    ? `&categories=${searchParams.categories}`
                    : ""
            }`
                : ""
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

async function getMonthlyStatistics(
    accountId: string,
    searchParams:
        | {
              download?: string;
              date?: string;
          }
        | undefined
) {
    const response = await fetch(
        `${PATHS.API.BASE.MONTHLY_STATISTICS.GET}?account_id=${accountId}
        ${searchParams?.date ? `&date=${searchParams.date}` : ""}
        ${searchParams?.download ? `&download=${searchParams.download}` : ""}`,
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
    searchParams,
}: {
    params: { account: string };
    searchParams?: {
        download?: string;
        date?: string;
        categories?: string;
    };
}) {
    const categoryStatistics = await getCategoryStatistics(
        params.account,
        searchParams
    );

    const monthlyStatistics = await getMonthlyStatistics(
        params.account,
        searchParams
    );

    return (
        <Suspense>
            <Statistics
                statistics={categoryStatistics}
                monthlyStatistics={monthlyStatistics}
                accountId={params.account}
            />
        </Suspense>
    );
}
