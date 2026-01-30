import { useState } from 'react';
import { translateProcedure, validateProcedure } from '../api/backend';

export default function TranslatorUI() {
  const [sourceDB] = useState('oracle');
  const [targetDB, setTargetDB] = useState('mysql');
  const [inputSP, setInputSP] = useState('');
  const [outputSP, setOutputSP] = useState('');
  const [isConverting, setIsCoverting] = useState(false);
  const [isValidating, setisValidating] = useState(false);
  const [status, setStatus] = useState('');

  const handleConvert = async () => {
    setIsCoverting(true);
    setStatus('Stored procedure is being translated...');
    try {
      const response = await translateProcedure({
        source_sp: inputSP,
        source_db: sourceDB,
        target_db: targetDB,
      });

      setOutputSP(response.translated || 'No translation received');
      setStatus('Translation complete.');
    } catch (error) {
      console.error(error);
      setOutputSP('');
      setStatus('Translation failed.');
    }
    setIsCoverting(false);
  };

  const handleValidate = async () => {
    if (!outputSP.trim()) {
      alert('Please translate a stored procedure before validating.');
      return;
    }

    setStatus('Validating translated procedure...');
    setisValidating(true);

    try {
      const response = await validateProcedure({
        original_sp: inputSP,
        translated_sp: outputSP
      });
      setStatus(response.message);

    } catch (error) {
      console.error(error);
      setStatus('Validation failed. Please check the connection');
    }

    setisValidating(false);
  };
  return (
    <div style={outerContainerStyle}>
      <div style={innerBlockStyle}>
        <h2 style={titleStyle}>Stored Procedure Translator</h2>

        <div style={dropdownRowStyle}>
          <div>
            <label style={labelStyle}>Source DB:</label><br />
            <select value={sourceDB} disabled style={dropdownStyle}>
              <option value="oracle">oracle</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Target DB:</label><br />
            <select
              value={targetDB}
              onChange={(e) => setTargetDB(e.target.value)}
              style={dropdownStyle}
            >
              <option value="mysql">MySQL</option>

            </select>
          </div>
        </div>

        <div style={textareaContainerStyle}>
          <textarea
            placeholder="Enter input stored procedure"
            value={inputSP}
            onChange={(e) => setInputSP(e.target.value)}
            style={textareaStyle}
          />
          <textarea
            placeholder="Translated stored procedure"
            value={outputSP}
            readOnly
            style={{ ...textareaStyle, backgroundColor: '#181818' }}
          />
        </div>

        <div style={actionWrapperStyle}>
          <button
            onClick={handleConvert}
            disabled={isConverting || isValidating}
            style={{
              ...buttonStyle,
              backgroundColor: '#aa0ac7',
              opacity: isConverting || isValidating ? 0.6 : 1,
            }}
          >
            {isConverting ? 'Translating...' : 'Convert'}
          </button>

          <button
            onClick={handleValidate}
            disabled={isValidating || !outputSP || isConverting}
            style={{
              ...buttonStyle,
              backgroundColor: '#aa0ac7',
              marginLeft: '20px',
              opacity: isValidating || !outputSP || isConverting ? 0.6 : 1,
            }}
          >
            {isValidating ? 'Validating...' : 'Validate'}
          </button>

          {(isValidating || isConverting) && (
            <div style={progressWrapper}>
              <div style={progressBar} />
            </div>
          )}

          {status && (
            <p style={statusTextStyle}>{status}</p>
          )}
        </div>

        <style>
          {`
            @keyframes moveBar {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}
        </style>
      </div>
    </div>
  );
}

// === Dark Theme Styles ===
const outerContainerStyle = {
  height: '100vh',
  width: '100vw',
  backgroundColor: '#121212',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const innerBlockStyle = {
  width: '94%',
  height: '88vh',
  backgroundColor: '#1e1f1e',
  border: '2px dashed #aa0ac7',
  borderRadius: '16px',
  padding: '25px 40px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
};

const titleStyle = {
  textAlign: 'center',
  color: '#aa0ac7',
  fontSize: '26px',
  marginBottom: '20px',
};

const dropdownRowStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '40px',
  marginBottom: '20px',
};

const labelStyle = {
  color: '#ffffff',
};

const dropdownStyle = {
  padding: '10px',
  width: '160px',
  borderRadius: '6px',
  border: '1px solid #aa0ac7',
  backgroundColor: '#2c2c2c',
  color: '#fff',
};

const textareaContainerStyle = {
  display: 'flex',
  gap: '30px',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '20px',
};

const textareaStyle = {
  width: '45%',
  minHeight: '180px',
  maxHeight: '400px',
  resize: 'none',
  fontFamily: 'monospace',
  backgroundColor: '#1e1f1e',
  color: '#fff',
  border: '1px solid #aa0ac7',
  padding: '12px',
  borderRadius: '10px',
};

const buttonStyle = {
  padding: '12px 30px',
  fontSize: '16px',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

const actionWrapperStyle = {
  textAlign: 'center',
  marginTop: '10px',
};

const progressWrapper = {
  width: '60%',
  height: '10px',
  margin: '15px auto 5px',
  backgroundColor: '#333',
  borderRadius: '5px',
  overflow: 'hidden',
};

const progressBar = {
  height: '100%',
  width: '100%',
  background: 'linear-gradient(270deg, #aa0ac7, #8a40ff)',
  backgroundSize: '200% 100%',
  animation: 'moveBar 2s linear infinite',
};

const statusTextStyle = {
  marginTop: '8px',
  color: '#ccc',
  fontSize: '14px',
};