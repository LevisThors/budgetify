"use client";

import { NextIntlClientProvider, useMessages } from "next-intl";
import Login from "../Login";

export default function LoginWrapper({ locale }: { locale: string }) {
    const messages = useMessages();

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <Login />
        </NextIntlClientProvider>
    );
}
