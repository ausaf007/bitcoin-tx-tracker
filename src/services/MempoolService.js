import {mempoolConfig} from "../configs/config.js";

let ws = null; // To maintain the WebSocket connection

export const initializeWebSocket = (onMessageCallback) => {
    try {
        // Initialize the WebSocket connection
        ws = new WebSocket(mempoolConfig.wsUrl);

        // Handle the connection open event
        ws.onopen = () => {
            console.log('WebSocket connection opened.');
            ws.send(JSON.stringify(mempoolConfig.initialWsMessage));
        };

        // Handle incoming messages
        ws.onmessage = (event) => {
            const res = JSON.parse(event.data);
            onMessageCallback(res);
        };

        // Handle errors
        ws.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        // Handle connection close
        ws.onclose = (event) => {
            if (event.wasClean) {
                console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
            } else {
                console.error('Connection died');
            }
        };

        return ws;

    } catch (error) {
        console.error("Error initializing WebSocket:", error);
        return null;
    }
};

export const closeWebSocket = () => {
    if (ws) {
        ws.close();
        ws = null;
    }
};

export const fetchTransactionDetails = async (txId) => {
    try {
        const response = await fetch(`${mempoolConfig.apiBaseUrl}/tx/${txId}`);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error("Error fetching transaction details:", error);
        return null;
    }
};

export const getBlockHeight = async () => {
    try {
        const response = await fetch(`${mempoolConfig.apiBaseUrl}/blocks/tip/height`);
        if (response.ok) {
            const heightText = await response.text();
            return parseInt(heightText, 10);
        }
        console.error("Failed to fetch block height.");
        return null;
    } catch (error) {
        console.error("Error fetching block height:", error);
        return null;
    }
};

