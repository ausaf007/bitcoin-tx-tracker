import {useState} from 'react';

const TxMonitor = ({onStartMonitoring, onStopMonitoring, isMonitoring}) => {
    const [txId, setTxId] = useState('');

    const handleStartMonitoring = () => {
        if (txId) {
            onStartMonitoring(txId);
        }
    };

    return (
        <div className="centered">
            <input
                type="text"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                placeholder="Enter Bitcoin Transaction ID"
            />
            <br/>
            <button onClick={handleStartMonitoring} disabled={isMonitoring}>Monitor</button>
            <button onClick={onStopMonitoring} disabled={!isMonitoring}>Stop Monitoring</button>
        </div>
    );
}

export default TxMonitor;
