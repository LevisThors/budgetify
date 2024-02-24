"use client";

import FilterButton from "@/components/partials/FilterButton";
import SearchBar from "@/components/partials/SearchBar";
import PATHS from "@/paths";
import { CategoryType } from "@/type/CategoryType";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ActionButton from "@/components/partials/ActionButton";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet";
import CategoryForm from "@/components/CategoryForm";
import { toast } from "@/components/ui/use-toast";
import MESSAGE from "@/messages";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DialogBody from "@/components/partials/DialogBody";

export default function CategoryPage() {
    const [categories, setCategories] = useState<CategoryType[]>();
    const [refetch, setRefetch] = useState(false);
    const params = useSearchParams();

    const getCategories = async (searchParams: any) => {
        const res = await fetch(
            `${
                PATHS.API.PROXY.CATEGORY.GET
            }?unordered=true&account_id=${localStorage.getItem(
                "activeAccount"
            )}${
                searchParams.get("query")
                    ? `&query=${searchParams.get("query")}`
                    : ""
            }${
                searchParams.get("type")
                    ? `&type=${searchParams.get("type")}`
                    : ""
            }`,
            {
                headers: {
                    Cookie: `laravel_session=${getCookie("laravel_session")}`,
                    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                    "ngrok-skip-browser-warning": "69420",
                },
                credentials: "include",
            }
        );

        return res.json();
    };

    const refetchData = () => {
        setRefetch((prev) => !prev);
    };

    const handleDelete = (id: string | number) => {
        fetch(`${PATHS.API.PROXY.CATEGORY.DELETE(id)}`, {
            method: "DELETE",
            headers: {
                Cookie: `laravel_session=${getCookie("laravel_session")}`,
                "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                "ngrok-skip-browser-warning": "69420",
            },
            credentials: "include",
        }).then((res) => {
            if (res.status === 200) {
                refetchData();
                toast({
                    description: MESSAGE.SUCCESS.DELETE("Category"),
                    variant: "destructive",
                });
            }
        });
    };

    useEffect(() => {
        getCategories(params).then((data) => setCategories(data));
    }, [params, refetch]);

    return (
        <section className="flex justify-between gap-5">
            <div className="flex flex-col gap-4 min-w-[60%]">
                <div className="w-2/3">
                    <SearchBar />
                </div>
                <div className="w-full flex flex-wrap gap-5">
                    {categories?.length === 0 && (
                        <div className="w-full flex justify-center">
                            <span>{MESSAGE.ERROR.NOT_FOUND("Categories")}</span>
                        </div>
                    )}
                    {categories?.map((category) => {
                        return (
                            <div
                                key={category.id}
                                className={`px-3 py-3 border-2 ${
                                    category.type === "Expenses"
                                        ? "border-[#EE3F19]"
                                        : "border-[#21C206]"
                                } rounded-xl 
                                cursor-pointer flex gap-3 text-lg font-bold items-center`}
                            >
                                <span>{category.title}</span>
                                <div className="flex gap-1 items-center">
                                    <span className="flex items-center">
                                        <Sheet>
                                            <SheetTrigger>
                                                <Image
                                                    src="/icons/edit.svg"
                                                    alt="edit transaction"
                                                    width={20}
                                                    height={20}
                                                />
                                            </SheetTrigger>
                                            <SheetContent>
                                                <SheetHeader className="flex flex-row justify-between items-center">
                                                    <h1 className="text-2xl">
                                                        Edit Category
                                                    </h1>
                                                    <div>
                                                        <SheetClose>
                                                            <Image
                                                                src="/icons/close.svg"
                                                                alt="close"
                                                                width={35}
                                                                height={35}
                                                            />
                                                        </SheetClose>
                                                    </div>
                                                </SheetHeader>
                                                <CategoryForm
                                                    type="edit"
                                                    category={category}
                                                    refetch={refetchData}
                                                />
                                            </SheetContent>
                                        </Sheet>
                                    </span>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button>
                                                <Image
                                                    src="/icons/delete.svg"
                                                    alt="delete Category"
                                                    width={20}
                                                    height={20}
                                                />
                                            </button>
                                        </DialogTrigger>
                                        <DialogBody
                                            header="Delete Category"
                                            body={MESSAGE.WARNING.DELETE(
                                                "Category"
                                            )}
                                            onYes={() =>
                                                handleDelete(category.id || "")
                                            }
                                        />
                                    </Dialog>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="min-w-[20%] flex flex-col gap-4">
                <FilterButton type="Income" />
                <FilterButton type="Expenses" />
                <Sheet>
                    <SheetTrigger>
                        <ActionButton text="Add Category" />
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader className="flex flex-row justify-between items-center">
                            <h1 className="text-2xl">
                                {MESSAGE.BUTTON.ADD("Category")}
                            </h1>
                            <div>
                                <SheetClose>
                                    <Image
                                        src="/icons/close.svg"
                                        alt="close"
                                        width={35}
                                        height={35}
                                    />
                                </SheetClose>
                            </div>
                        </SheetHeader>
                        <CategoryForm type="add" refetch={refetchData} />
                    </SheetContent>
                </Sheet>
            </div>
        </section>
    );
}
