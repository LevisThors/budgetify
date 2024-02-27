const MESSAGE = {
    ERROR: {
        INVALID_CHARACTER:
            "Please, enter the name that doesn't include any of these characters: «*~`!@#$%^&/><+_=|»",
        EXISTS: (name: string) => `${name} with such name already exists`,
        NOT_FOUND: (name: string) => `${name} not found`,
        INVALID_INPUT: (name: string) => `Please enter a valid ${name}`,
        INSUFFICIENT_FUNDS: "Insufficient funds",
        MAX_FILES: (max: number) => `You can only upload ${max} files at once`,
        MAX_LENGTH: (max: number) => `Maximum length is ${max} characters`,
        FILL_REQUIRED: "Please fill out the required fields",
        INVALID_DATE: "Payment date should be in the future",
    },
    SUCCESS: {
        CREATION: (name: string) => `${name} has been created successfully`,
        UPDATE: (name: string) => `${name} has been updated successfully`,
        DELETE: (name: string) => `${name} has been deleted successfully`,
        CRASH: (name: string) => `${name} has been crashed successfully`,
    },
    BUTTON: {
        ADD: (name: string) => `Add ${name}`,
    },
    WARNING: {
        DELETE: (name: string) => `Are you sure you want to delete ${name}?`,
        CANCEL: (name: string) =>
            `Are you sure you want to cancel? ${name} will not be saved`,
    },
    PAYMENT: {
        NEXT_DATE: "Next payment date",
    },
    HEADER: {
        INFORMATION: (name: string) => `${name} Information`,
    },
};

export default MESSAGE;
