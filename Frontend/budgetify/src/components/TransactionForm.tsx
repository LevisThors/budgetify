import { TransactionType } from "@/type/TransactionType";

export default function TransactionForm({
    type,
    transaction,
}: {
    type: string;
    transaction: TransactionType;
}) {
    switch (type) {
        case "view":
            return <TransactionViewForm transaction={transaction} />;
        case "edit":
            return <TransactionEditForm transaction={transaction} />;
        case "create":
            return <TransactionCreateForm />;
    }
}

function TransactionViewForm({
    transaction,
}: {
    transaction: TransactionType;
}) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between">
                <span className="text-lg">{transaction.type}</span>
                <span
                    className={`text-3xl ${
                        transaction.type === "Expenses"
                            ? "text-red-500"
                            : "text-green-500"
                    }`}
                >
                    {transaction.type === "Expenses"
                        ? "-"
                        : "" + transaction.amount}
                    $
                </span>
            </div>
            <div>
                <h1 className="text-2xl">{transaction.title}</h1>
            </div>
            <div className="flex gap-3">
                {transaction.categories.map((category) => (
                    <span
                        key={category.id}
                        className="px-9 py-3 border border-black rounded-lg font-bold"
                    >
                        {category.title}
                    </span>
                ))}
            </div>
            <div>
                <div className="w-full flex py-3 border-b border-b-authBlack last:border-none text-lg">
                    <span className="w-1/3 font-bold">Payment Date:</span>
                    <span className="w-2/3">
                        {transaction.payment_date.toString()}
                    </span>
                </div>
                {["Payee", "Description"].map((field) => (
                    <div
                        key={field}
                        className="w-full flex py-3 border-b border-b-authBlack last:border-none text-lg"
                    >
                        <span className="w-1/3 font-bold">{field}</span>
                        <span className="w-2/3">
                            {transaction[field.toLowerCase()]}
                        </span>
                    </div>
                ))}
            </div>
            <div>mediaItem</div>
        </div>
    );
}

function TransactionEditForm({
    transaction,
}: {
    transaction: TransactionType;
}) {
    return <div>Hello</div>;
}

function TransactionCreateForm() {
    return (
        <div>
            {/* <h1>{transaction.title}</h1>
            <p>{transaction.type}</p>
            <p>{transaction.amount}</p>
            <p>{transaction.payee}</p>
            <p>{transaction.payment_date}</p> */}
        </div>
    );
}
