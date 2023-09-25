
export const calculateSatsPerVbyte = (fee, weight) => {
    return (4 * fee / weight).toFixed(2);
};

export const calculateConfirmations = (currentBlockHeight, transactionBlockHeight) => {
    return currentBlockHeight - transactionBlockHeight + 1;
};

export const determineStatus = (isConfirmed, confirmations) => {
    if (!isConfirmed) {
        return "seen in mempool";
    } else {
        return confirmations === 1 ? "1 confirmation" : `${confirmations} confirmations`;
    }
};
