import { getUserData } from "@/util/getUserData";
import PATHS from "@/paths";
import { redirect } from "next/navigation";

export default async function Home({
    params,
}: {
    params: {
        locale: string;
    };
}) {
    try {
        const userData = await getUserData();

        if (userData.firstName) {
            redirect(`${params.locale}/${PATHS.PAGES().HOME}`);
        } else {
            redirect(`${params.locale}/${PATHS.AUTH.LOGIN}`);
        }
    } catch (error) {
        redirect(`${params.locale}/${PATHS.AUTH.LOGIN}`);
    }
}
