import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Box,
  Typography,
  Divider,
  Stack,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DownloadIcon from '@mui/icons-material/Download';
const API_BASE_URL = process.env.REACT_APP_API_URL;


const AppRemediation = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [logs, setLogs] = useState([]);
  const [translationType, setTranslationType] = useState('');
  const [uploadResult, setUploadResult] = useState(null);

  const handleFolderSelect = (event) => {
    const files = Array.from(event.target.files);
    const sortedFiles = files.sort((a, b) =>
      a.webkitRelativePath.localeCompare(b.webkitRelativePath)
    );
    setFileList(sortedFiles);
    setLogs((prev) => [...prev, `Selected folder with ${files.length} file(s).`]);
  };

  const handleUpload = async () => {
    if (!translationType) {
      alert('Please select a translation type');
      return;
    }

    const formData = new FormData();
    formData.append('translationType', translationType);
    fileList.forEach((file) => formData.append('files', file));

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/apprem/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setUploadResult(result);
      setLogs((prev) => [
        ...prev,
        `Upload success: ${result.message}`,
        ...(result.log_content ? result.log_content.split('\n') : []),
      ]);
    } catch (error) {
      setLogs((prev) => [...prev, `Upload failed: ${error.message}`]);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = () => setLogs([]);
  const handleDownloadLogs = () => {
    const element = document.createElement('a');
    const file = new Blob([logs.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'app_remediation_logs.txt';
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="main-content">
      <Typography
        variant="h4"
        align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
          mt: 0,
          mb: 2,
          pb: 0,
        }}
      >
        App Remediation
      </Typography>
      <Divider sx={{ borderColor: '#aa0ac7', mb: 4 }} />
      <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', padding: '20px' }}>

        {/* Upload Section */}
        <Box
          sx={{
            border: '2px dashed #aa0ac7',
            padding: 4,
            borderRadius: 2,
            backgroundColor: '#1e1f1e',
            mb: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: '#fff', mb: 2, borderBottom: '2px solid #aa0ac7', pb: 1 }}
          >
            Select Folder and Translation Type
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel
              id="translation-type-label"
              sx={{ color: '#ccc', '&.Mui-focused': { color: '#aa0ac7' } }}
            >
              Translation Type
            </InputLabel>
            <Select
              labelId="translation-type-label"
              value={translationType}
              onChange={(e) => setTranslationType(e.target.value)}
              sx={{
                color: '#fff',
                backgroundColor: '#2c2c2c',
                '& svg': { color: '#fff' },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#aa0ac7',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#aa0ac7',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#aa0ac7',
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#2c2c2c',
                    color: '#fff',
                  },
                },
              }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="StoM">Sybase to MySQL</MenuItem>
              <MenuItem value="PtoM">PostgreSQL to MySQL</MenuItem>
            </Select>
          </FormControl>

          <input
            type="file"
            webkitdirectory="true"
            directory=""
            id="folder-upload"
            multiple
            hidden
            onChange={handleFolderSelect}
          />

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <label htmlFor="folder-upload">
              <Button
                variant="outlined"
                component="span"
                sx={{
                  color: '#fff',
                  borderColor: '#aa0ac7',
                  '&:hover': {
                    borderColor: '#8b08a5',
                    backgroundColor: '#1e1f1e',
                  },
                }}
              >
                Choose Folder
              </Button>
            </label>

            <Button
              variant="contained"
              disabled={fileList.length === 0}
              onClick={handleUpload}
              startIcon={<CloudUploadIcon />}
              sx={{
                backgroundColor: '#aa0ac7',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#8b08a5',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#aa0ac730',
                },
              }}
            >
              Upload
            </Button>

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <CircularProgress size={30} thickness={6} sx={{ color: '#aa0ac7' }} />
              </Box>
            )}
          </Stack>

          {fileList.length > 0 && (
            <Typography variant="body2" sx={{ color: '#ccc' }}>
              {fileList.length} file(s) selected.
            </Typography>
          )}
        </Box>

        {/* Upload Result */}
        {uploadResult?.message && (
          <Paper sx={{ padding: 3, backgroundColor: '#2a2a2a', mb: 4 }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
              Upload Summary
            </Typography>
            <Typography sx={{ color: '#ccc' }}>
              <strong>Message:</strong> {uploadResult.message}
            </Typography>
            {typeof uploadResult.total_files_scanned === 'number' && (
              <>
                <Typography sx={{ color: '#ccc' }}>
                  <strong>Total Files Scanned:</strong> {uploadResult.total_files_scanned}
                </Typography>
                <Typography sx={{ color: '#ccc' }}>
                  <strong>Files with Queries:</strong> {uploadResult.files_with_queries}
                </Typography>
                <Typography sx={{ color: '#ccc' }}>
                  <strong>Total Queries Converted:</strong> {uploadResult.total_queries_converted}
                </Typography>
              </>
            )}
          </Paper>
        )}

        {/* Logs Section */}
        <Box
          sx={{
            border: '1px solid #aa0ac7',
            borderRadius: 2,
            padding: 3,
            backgroundColor: '#1e1f1e',
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
            Logs
          </Typography>
          <Paper
            sx={{
              backgroundColor: '#121212',
              color: '#fff',
              padding: 2,
              minHeight: 150,
              maxHeight: 300,
              overflowY: 'auto',
              border: '1px dashed #aa0ac7',
            }}
          >
            {logs.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#999' }}>
                No logs yet.
              </Typography>
            ) : (
              logs.map((log, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                  {log}
                </Typography>
              ))
            )}
          </Paper>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClearLogs}
              startIcon={<RestartAltIcon />}
              sx={{
                color: '#fff',
                borderColor: '#aa0ac7',
                '&:hover': {
                  borderColor: '#8b08a5',
                  backgroundColor: '#1e1f1e',
                },
              }}
            >
              Clear Logs
            </Button>
            <Button
              variant="outlined"
              onClick={handleDownloadLogs}
              startIcon={<DownloadIcon />}
              sx={{
                color: '#fff',
                borderColor: '#aa0ac7',
                '&:hover': {
                  borderColor: '#8b08a5',
                  backgroundColor: '#1e1f1e',
                },
              }}
            >
              Download Logs
            </Button>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default AppRemediation;
