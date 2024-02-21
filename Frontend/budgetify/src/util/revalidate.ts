"use server";

import { revalidatePath } from "next/cache";

export default async function revalidate(path?: string) {
    try {
        if (path) {
            revalidatePath(path);
        } else {
            revalidatePath("/");
        }
    } catch (error) {
        console.error("clearCachesByServerAction=> ", error);
    }
}
