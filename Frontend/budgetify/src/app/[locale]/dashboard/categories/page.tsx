import CategoryPage from "@/components/CategoryPage";
import { Suspense } from "react";

export default function CategoriesPage() {
    return (
        <Suspense>
            <CategoryPage />
        </Suspense>
    );
}
