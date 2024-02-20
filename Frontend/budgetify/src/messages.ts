const MESSAGE = {
    ERROR: {
        INVALID_CHARACTER:
            "Please, enter the name that doesnt include any of these characters: «*~`!@#$%^&/><+_=|»",
        EXISTS: (name: string) => `${name} with such name already exists`,
        INVALID_INPUT: (name: string) => `Please enter a valid ${name}`,
        INSUFFICIENT_FUNDS: "Insufficient funds",
        MAX_FILES: (max: number) => `You can only upload ${max} files at once`,
        MAX_LENGTH: (max: number) => `Maximum length is ${max} characters`,
    },
    SUCCESS: {
        CREATION: (name: string) => `${name} has been created successfully`,
        UPDATE: (name: string) => `${name} has been updated successfully`,
        DELETE: (name: string) => `${name} has been deleted successfully`,
    },
};

export default MESSAGE;
