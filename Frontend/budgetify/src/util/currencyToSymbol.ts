export default function currencyToSymbol(currency: string): string {
    switch (currency) {
        case "USD":
            return "$";
        case "EUR":
            return "€";
        case "GBP":
            return "£";
        case "JPY":
            return "¥";
        default:
            return currency;
    }
}
