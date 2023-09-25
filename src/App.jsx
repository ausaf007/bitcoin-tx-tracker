import { useState } from 'react';
import './App.css';

import TxMonitor from './components/TxMonitor.jsx';
import StatusDisplay from './components/StatusDisplay.jsx';
import Header from "./components/Header.jsx";

import { startTransactionMonitoring, stopTransactionMonitoring } from './services/TxMonitorService';

function App() {
    // This is to update the status  component in real time
    const [status, setStatus] = useState('Not Monitoring');

    // This is to selectively enable the monitoring buttons
    const [isMonitoring, setIsMonitoring] = useState(false);
    const handleStartMonitoring = async (txId) => {
        try{
            await startTransactionMonitoring(txId, setStatus);
            setIsMonitoring(true);
        }catch (error){
            console.error("Error starting transaction monitoring:", error);
        }
    };

    const handleStopMonitoring = async () => {
        try{
            await stopTransactionMonitoring();
            setStatus('Not Monitoring');
            setIsMonitoring(false);
        }catch (error){
            console.error("Error stopping transaction monitoring:", error);
        }
    };

    return (
        <div className="centered">
            <div className="App" >
                <Header/>
                <TxMonitor
                    onStartMonitoring={handleStartMonitoring}
                    onStopMonitoring={handleStopMonitoring}
                    isMonitoring={isMonitoring}
                />
                <StatusDisplay status={status}/>
            </div>
        </div>
    );
}

export default App;
