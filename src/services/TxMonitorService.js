import { initializeWebSocket, closeWebSocket, fetchTransactionDetails, getBlockHeight } from './MempoolService';
import { saveToFirestore } from './FirestoreService';
import { txMonitorConfig } from '../configs/config';
import { calculateSatsPerVbyte, calculateConfirmations, determineStatus } from '../utils/helpers';


let payload = {
    txId: "",
    lastStatusAt: null,
    lastStatus: "not found",
    satsPerVbyte: 0
};

export const startTransactionMonitoring = async (txId, setStatus) => {

    payload.txId = txId;
    setStatus("Monitoring on.")
    // First, check if the transaction exists using the REST API
    const txDetails = await fetchTransactionDetails(txId);

    if (!txDetails) {
        // If the transaction doesn't exist, start monitoring via WebSocket
        initializeWebSocket((res) => {
            if (res.transactions) {
                const foundTx = res.transactions.find(tx => tx.txid === txId);
                if (foundTx) {
                    startRestApiMonitoring(foundTx.txid.toString(), setStatus);
                    closeWebSocket();
                }
            }
        });
    } else {
        // Tx Details found.
        await startRestApiMonitoring(txId, setStatus);
    }
};

let restApiInterval = null; // To keep track of the setInterval for REST API monitoring

const startRestApiMonitoring = async (txId, setStatus) => {
    console.log("REST API Monitoring started");

    // Define the function that fetches transaction details
    const fetchAndUpdate = async () => {
        const txDetails = await fetchTransactionDetails(txId);
        if (txDetails) {
            const currentBlockHeight = await getBlockHeight();
            handleTransactionUpdate(txDetails, setStatus, currentBlockHeight);
        }
    };

    // Call the function immediately
    await fetchAndUpdate();

    // Then set up the interval to call it every 60 seconds
    restApiInterval = setInterval(fetchAndUpdate, txMonitorConfig.pollingInterval); // 60 seconds
};
const stopRestApiMonitoring = () => {
    if (restApiInterval) {
        clearInterval(restApiInterval);
        restApiInterval = null;
    }
};
const handleTransactionUpdate = (transaction, setStatus, currentBlockHeight) => {
    const satsPerVbyte = calculateSatsPerVbyte(transaction.fee, transaction.weight);
    const confirmations = calculateConfirmations(currentBlockHeight, transaction.status.block_height);
    const lastStatus = determineStatus(transaction.status.confirmed, confirmations);

    if (!transaction.status.confirmed) {
        setStatus(`Monitoring On. Transaction is currently in the mempool and has 0 block-confirmations. Fee: ${satsPerVbyte} sats/Vbyte.`);
    } else {
        setStatus(`Monitoring On. Transaction has ${confirmations} confirmations. Fee: ${satsPerVbyte} sats/Vbyte.`);
    }

    // Update the payload
    payload = {
        lastStatus: lastStatus,
        txId:  transaction.txid,
        lastStatusAt: new Date(),
        satsPerVbyte: parseFloat(satsPerVbyte)
    };
};

export const stopTransactionMonitoring = async () => {
    closeWebSocket();
    stopRestApiMonitoring();

    // If lastStatus is "not found", set lastStatusAt to current time
    if (payload.lastStatus === "not found") {
        payload.lastStatusAt = new Date();
    }
    // Save the payload to Firestore
    await saveToFirestore(payload);

    // Reset the payload for future use
    resetPayload();

    // Refresh the whole application
    window.location.reload();
};

const resetPayload = () => {
    payload = {
        txId: "",
        lastStatusAt: null,
        lastStatus: "not found",
        satsPerVbyte: 0
    };
}