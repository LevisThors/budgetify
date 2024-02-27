const PATHS = {
    API: {
        PROXY: {
            ACCOUNT: {
                GET: "/backend/api/accounts",
                POST: "/backend/api/accounts",
                PUT: (accountId: string | number) =>
                    `/backend/api/accounts/${accountId}`,
                DELETE: (accountId: string | number) =>
                    `/backend/api/accounts/${accountId}`,
            },
            TRANSACTION: {
                GET: "/backend/api/transactions",
                POST: "/backend/api/transactions",
                PUT: (transactionId: string | number) =>
                    `/backend/api/transactions/${transactionId}`,
                DELETE: (transactionId: string | number) =>
                    `/backend/api/transactions/${transactionId}`,
                DOWNLOAD: (path: string) =>
                    `/backend/api/transactions/download/${path}`,
            },
            SUBSCIRPTION: {
                GET: "/backend/api/subscriptions",
                POST: "/backend/api/subscriptions",
                PUT: (subscriptionId: string | number) =>
                    `/backend/api/subscriptions/${subscriptionId}`,
                DELETE: (subscriptionId: string | number) =>
                    `/backend/api/subscriptions/${subscriptionId}`,
            },
            CATEGORY: {
                GET: "/backend/api/categories",
                POST: "/backend/api/categories",
                PUT: (categoryId: string | number) =>
                    `/backend/api/categories/${categoryId}`,
                DELETE: (categoryId: string | number) =>
                    `/backend/api/categories/${categoryId}`,
            },
            OBLIGATORY: {
                GET: "/backend/api/obligatories",
                POST: "/backend/api/obligatories",
                PUT: (obligatoryId: string | number) =>
                    `/backend/api/obligatories/${obligatoryId}`,
                DELETE: (obligatoryId: string | number) =>
                    `/backend/api/obligatories/${obligatoryId}`,
            },
            PIGGY_BANK: {
                GET: "/backend/api/piggy-banks",
                POST: "/backend/api/piggy-banks",
                PUT: (piggyBankId: string | number) =>
                    `/backend/api/piggy-banks/${piggyBankId}`,
                DELETE: (piggyBankId: string | number) =>
                    `/backend/api/piggy-banks/${piggyBankId}`,
                CRASH: (piggyBankId: string | number) =>
                    `/backend/api/piggy-banks/${piggyBankId}/crash`,
            },
            AUTH: {
                GET_CSRF: "/backend/sanctum/csrf-cookie",
                LOGIN: "/backend/api/login",
                REGISTER: "/backend/api/register",
                LOGOUT: "/backend/api/logout",
                FORGOT_PASSWORD: "/backend/api/auth/forgot-password",
                RESET_PASSWORD: "/backend/api/auth/reset-password",
            },
            USER: {
                GET: "/backend/api/user",
            },
        },
        BASE: {
            USER: {
                GET: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`,
            },
            ACCOUNT: {
                GET: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts`,
            },
            TRANSACTION: {
                GET: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`,
            },
            SUBSCRIPTION: {
                GET: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions`,
            },
            CATEGORY: {
                GET: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`,
            },
            OBLIGATORY: {
                GET: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/obligatories`,
            },
            PIGGY_BANK: {
                GET: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/piggy-banks`,
            },
            CATEGORY_STATISTICS: {
                GET: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/statistics`,
            },
        },
    },
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        FORGOT_PASSWORD: "/auth/forgot-password",
        RESET_PASSWORD: "/auth/reset-password",
    },
    PAGES: (
        accountId?: string | number
    ): {
        CATEGORIES?: string;
        HOME: string;
        OBLIGATORY?: string;
        SUBSCRIPTIONS?: string;
        STATISTIC?: string;
    } => {
        if (!accountId)
            return {
                CATEGORIES: `/dashboard/categories`,
                HOME: `/dashboard/account/transactions`,
            };
        else
            return {
                HOME: `/dashboard/${accountId}/transactions`,
                OBLIGATORY: `/dashboard/${accountId}/obligatory`,
                SUBSCRIPTIONS: `/dashboard/${accountId}/subscriptions`,
                STATISTIC: `/dashboard/${accountId}/statistic`,
            };
    },
};

export default PATHS;
