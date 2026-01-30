import { React } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './second_page.css';
import {
  Box, Typography, Divider, Grid, TextField, Select, MenuItem, Button, FormControl, InputLabel, Paper, CircularProgress
} from '@mui/material';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function Dbconnection() {

  const [host_src, set_host_src] = useState('');
  const [host_des, set_host_des] = useState('');
  const [port_src, set_Port_src] = useState('');
  const [port_des, set_port_des] = useState('');
  const [db_src, set_db_src] = useState('');
  const [db_des, set_db_des] = useState('');
  const [user_src, set_User_src] = useState('');
  const [user_des, set_user_des] = useState('');
  const [password_src, set_password_src] = useState('');
  const [password_des, set_password_des] = useState('');
  const [src, set_src] = useState('');
  const [des, set_des] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const simple = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`http://localhost:5000/validate`, {
        src: src,
        des: des,
        host_src: host_src,
        host_des: host_des,
        port_src: port_src,
        port_des: port_des,
        db_src: db_src,
        db_des: db_des,
        user_src: user_src,
        user_des: user_des,
        password_src: password_src,
        password_des: password_des
      });

      const result_data = res.data;
      const resultText = typeof result_data === 'string' ? result_data : JSON.stringify(result_data);

      const requiredKeywords = [
        "Table",
        "Schema Valid",
        "Missing Columns",
        "Excess Columns",
        "Datatypes Mismatched",
        "Primary Key Validity",
        "Data Matched",
        "Missing Primary Keys",
        "Excess Primary Keys",
        "Data Mismatched"
      ];

      const isAnyMissing = requiredKeywords.some(keyword => !resultText.includes(keyword));

      if (isAnyMissing) {
        alert("Invalid Creditials ");
      }
      else {
        navigate('/dataval/results', { state: { result_data } });
        console.log(res);
      }


    } catch (err) {
      console.error('Error calling backend:', err);
      alert("An error occurred while validating data. Please check your credentials and try again.");
    }
    setLoading(false);

  }

  const connection_display = () => {
    if (src === "") {
      alert("Please select source");
    }
    else if (des === "") {
      alert("Please select destination");
    }
    else if (des === src) {
      alert("please select 2 different databases");
    }
    else {
      setShowDetails(true);
    }
  }

  return (
    <div className="dbconnection">
      <h1 className='titlee'>
        Data Validation
      </h1>
      <Divider sx={{ borderColor: '#aa0ac7', mb: 4 }} />
      <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', padding: 4 }}>
        <Paper sx={{ padding: 4, backgroundColor: '#1e1f1e', border: '2px dashed #aa0ac7', borderRadius: 4 }}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={5}>
              <Grid container spacing={3} justifyContent="center">
                {/* Source Dropdown */}
                <Grid item xs={12} sm={6} md={5}>
                  <FormControl fullWidth sx={{ minWidth: 250 }}>
                    <InputLabel id="source-label" sx={{ color: '#ffffff' }}>
                      Source Database
                    </InputLabel>
                    <Select
                      labelId="source-label"
                      value={src}
                      onChange={(e) => set_src(e.target.value)}
                      label="Source Database"
                      sx={{
                        backgroundColor: '#1e1f1e',
                        color: '#ffffff',
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: '#aa0ac7',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#aa0ac7',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8b08a5',
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#1e1f1e',
                            color: '#ffffff',
                          },
                        },
                      }}
                    >
                      <MenuItem value="">--select--</MenuItem>
                      <MenuItem value="MySQL">MySQL</MenuItem>
                      <MenuItem value="Oracle">Oracle</MenuItem>
                      <MenuItem value="Postgresql">Postgresql</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Destination Dropdown */}
                <Grid item xs={12} sm={6} md={5}>
                  <FormControl fullWidth sx={{ minWidth: 250 }}>
                    <InputLabel id="destination-label" sx={{ color: '#ffffff' }}>
                      Destination Database
                    </InputLabel>
                    <Select
                      labelId="destination-label"
                      value={des}
                      onChange={(e) => set_des(e.target.value)}
                      label="Destination Database"
                      sx={{
                        backgroundColor: '#1e1f1e',
                        color: '#ffffff',
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: '#aa0ac7',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#aa0ac7',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8b08a5',
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#1e1f1e',
                            color: '#ffffff',
                          },
                        },
                      }}
                    >
                      <MenuItem value="">--select--</MenuItem>
                      <MenuItem value="MySQL">MySQL</MenuItem>
                      <MenuItem value="Oracle">Oracle</MenuItem>
                      <MenuItem value="Postgresql">Postgresql</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>


            </Grid>
          </Grid>

          <Box textAlign="center" mt={3}>
            <Button variant="contained" onClick={connection_display} sx={{ backgroundColor: '#aa0ac7', color: '#fff' }}>
              Proceed
            </Button>
          </Box>

          {showDetails && (
            <>
              <Typography variant="h5" align="center" sx={{ color: '#ffffff', mt: 5, mb: 2 }}>
                Connection Details
              </Typography>

              <Grid container spacing={3} justifyContent="center">
                {[
                  { field: 'Host', setter: set_host_src },
                  { field: 'Port', setter: set_Port_src },
                  { field: 'Database', setter: set_db_src },
                  { field: 'Username', setter: set_User_src },
                  { field: 'Password', setter: set_password_src },
                ].map(({ field, setter }) => (
                  <Grid item xs={12} sm={6} md={3} key={`src-${field}`}>
                    <TextField
                      label={`Source ${field}`}
                      variant="outlined"
                      fullWidth
                      type={field === 'Password' ? 'password' : 'text'}
                      onChange={(e) => setter(e.target.value)}
                      sx={{
                        input: { color: '#fff' },
                        label: { color: '#fff' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#aa0ac7' },
                        },
                      }}
                    />
                  </Grid>
                ))}

                {[
                  { field: 'Host', setter: set_host_des },
                  { field: 'Port', setter: set_port_des },
                  { field: 'Database', setter: set_db_des },
                  { field: 'Username', setter: set_user_des },
                  { field: 'Password', setter: set_password_des },
                ].map(({ field, setter }) => (
                  <Grid item xs={12} sm={6} md={3} key={`des-${field}`}>
                    <TextField
                      label={`Destination ${field}`}
                      variant="outlined"
                      fullWidth
                      type={field === 'Password' ? 'password' : 'text'}
                      onChange={(e) => setter(e.target.value)}
                      sx={{
                        input: { color: '#fff' },
                        label: { color: '#fff' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#aa0ac7' },
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>


              <Box textAlign="center" mt={4}>
                <Button variant="contained" onClick={simple} sx={{ backgroundColor: '#aa0ac7', color: '#fff' }}>
                  Validate
                </Button>
              </Box>
            </>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5 }}>
            {loading ? (
              <>
                <CircularProgress thickness={5} size={60} sx={{ color: "#ffffff" }} />
                <Typography sx={{ mt: 2, color: "white" }}>Validating...</Typography>
              </>
            ) : (
              <Typography></Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </div>
  );
}

export default Dbconnection;

