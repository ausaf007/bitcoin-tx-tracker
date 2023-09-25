import {useState} from 'react';

const TxMonitor = ({onStartMonitoring, onStopMonitoring}) => {
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
            <button onClick={handleStartMonitoring}>Monitor</button>
            <button onClick={onStopMonitoring}>Stop Monitoring</button>
        </div>
    );
}

export default TxMonitor;
