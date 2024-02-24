import { getUserData } from "@/util/getUserData";
import PATHS from "@/paths";
import { redirect } from "next/navigation";

export default async function Home() {
    try {
        const userData = await getUserData();

        if (userData.firstName) {
            redirect(PATHS.PAGES().HOME);
        } else {
            redirect(PATHS.AUTH.LOGIN);
        }
    } catch (error) {
        redirect(PATHS.AUTH.LOGIN);
    }
}
