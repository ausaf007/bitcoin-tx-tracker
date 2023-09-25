
export const mempoolConfig = {
    wsUrl: 'wss://mempool.space/api/v1/ws',
    apiBaseUrl: 'https://mempool.space/api',
    initialWsMessage: {
        action: 'want',
        data: ['blocks', 'stats', 'mempool-blocks', 'live-2h-chart']
    }
};

export const txMonitorConfig = {
    pollingInterval: 60000 // 60 seconds
};

export const dbConfig ={
    collectionPath: "btc_transactions"
}