let confirmationResult: any = null;

export const setConfirmation = (result: any) => {
    confirmationResult = result;
};

export const getConfirmation = () => {
    return confirmationResult;
};

export const clearConfirmation = () => {
    confirmationResult = null;
};