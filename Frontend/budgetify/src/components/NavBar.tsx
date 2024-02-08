import Link from "next/link";
import User from "./partials/User";

const navLinks = {
    Categories: "/categories",
    Subscriptions: "/subscriptions",
    Obligatory: "/obligatory",
    Statistic: "/statistic",
    Admin: "/admin",
};

export default function NavBar() {
    return (
        <nav className="flex justify-between py-7 items-center">
            <div>
                <span>Budgetify</span>
            </div>
            <div>
                <ul className="flex gap-5 text-md">
                    {Object.entries(navLinks).map(([name, path]) => {
                        return (
                            <li
                                key={name}
                                className="py-1 px-1 hover:border-b border-b-black"
                            >
                                <Link href={path}>{name}</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div>
                <User />
            </div>
        </nav>
    );
}
