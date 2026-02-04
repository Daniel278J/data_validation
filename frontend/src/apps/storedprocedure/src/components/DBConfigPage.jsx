import React, { useState } from 'react';
import { validateConnection } from '../api/backend';
import { useNavigate } from 'react-router-dom';
import './DBConfigPage.css';

const DBConfigPage = () => {
  const [showConfig, setShowConfig] = useState(false);
  const [targetDB, setTargetDB] = useState('');
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [isNextEnabled, setIsNextEnabled] = useState(false);

  const [sourceConfig, setSourceConfig] = useState({
    user: 'c##Student_DB',
    password: 'Root2021R',
    port: '1521',
    server: 'localhost',
    database: 'orcl',
  });

  const [targetConfig, setTargetConfig] = useState({
    user: 'root',
    password: 'Pilot@123',
    port: '3306',
    host: 'localhost',
    database: 'storedprocstudent',
  });

  const navigate = useNavigate();

  const handleConfigure = () => {
    if (targetDB) setShowConfig(true);
  };

  const handleSourceChange = (e) => {
    setSourceConfig({ ...sourceConfig, [e.target.name]: e.target.value });
  };

  const handleTargetChange = (e) => {
    setTargetConfig({ ...targetConfig, [e.target.name]: e.target.value });
  };

  const handleConnect = async () => {
    try {
      const sourcePayload = {
        db_type: 'oracle',
        config: { ...sourceConfig },
      };

      const targetPayload = {
        db_type: targetDB.toLowerCase(),
        config: { ...targetConfig },
      };

      await validateConnection(sourcePayload);
      await validateConnection(targetPayload);

      setConnectionSuccess(true);
      alert('Both connections successful!');
      setIsNextEnabled(true);
      document.getElementById("next-btn").style.backgroundColor = "#aa0ac7";
      document.getElementById("next-btn").style.cursor = "pointer";
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionSuccess(false);
      alert('Failed to connect to databases.');
    }
  };

  // ✅ Bypass connection check and always navigate
  const goToNextPage = () => {
    navigate('/storedproc/translator', { state: { src: sourceConfig, target: targetConfig } });
  };

  return (
    <div className="db-config-page">
      <h1 className="title">Database Connection Setup</h1>

      <div className="db-select-box">
        <div className="db-select">
          <label>Source DB</label>
          <select disabled>
            <option value="Oracle">Oracle</option>
          </select>
        </div>

        <div className="db-select">
          <label>Target DB</label>
          <select value={targetDB} onChange={(e) => setTargetDB(e.target.value)}>
            <option value="">-- Select --</option>
            <option value="MySQL">MySQL</option>
          </select>
        </div>
      </div>

      <button className="configure-btn" onClick={handleConfigure}>
        Configure
      </button>

      {showConfig && (
        <div className="config-section">
          <h2 className="section-title">Configuration Details</h2>

          <div className="config-boxes">
            {/* Source DB Config */}
            <div className="config-box">
              <h3>Source DB - Oracle</h3>
              {['user', 'password', 'port', 'server', 'database'].map((field) => (
                <div className="input-group" key={field}>
                  <label>{field}</label>
                  <input
                    type={field === 'password' ? 'password' : 'text'}
                    name={field}
                    value={sourceConfig[field]}
                    onChange={handleSourceChange}
                  />
                </div>
              ))}
            </div>

            {/* Target DB Config */}
            <div className="config-box">
              <h3>Target DB - {targetDB || 'N/A'}</h3>
              {['user', 'password', 'port', 'host', 'database'].map((field) => (
                <div className="input-group" key={field}>
                  <label>{field}</label>
                  <input
                    type={field === 'password' ? 'password' : 'text'}
                    name={field}
                    value={targetConfig[field]}
                    onChange={handleTargetChange}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="connect-btn-wrap">
            <button className="connect-btn" onClick={handleConnect}>
              Connect
            </button>
          </div>
        </div>
      )}

      {/* Next Button */}
      <div style={{ position: 'fixed', bottom: 20, right: 30 }}>
        <button id="next-btn" className="next-btn" onClick={goToNextPage} disabled={!isNextEnabled}>
          Next →
        </button>
      </div>
    </div>
  );
};

export default DBConfigPage;
