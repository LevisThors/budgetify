import { getUserData } from "@/components/partials/User";
import { redirect } from "next/navigation";

export default async function Home() {
    try {
        const userData = await getUserData();

        if (userData.firstName) {
            redirect("/dashboard/account/transactions");
        } else {
            redirect("/auth/login");
        }
    } catch (error) {
        redirect("/auth/login");
    }
}
