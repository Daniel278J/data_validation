import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Paper,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import axios from "axios";

const rdbmsOptions = ["MySQL", "PostgreSQL", "SQLServer"];
const API_BASE_URL = process.env.REACT_APP_API_URL;


const CompareDatabases = () => {
  const [server1, setServer1] = useState("");
  const [server2, setServer2] = useState("");
  const [db1, setDb1] = useState("");
  const [db2, setDb2] = useState("");
  const [dbOptions1, setDbOptions1] = useState([]);
  const [dbOptions2, setDbOptions2] = useState([]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMismatchTable, setShowMismatchTable] = useState(false);
  const [showMismatchDialog, setShowMismatchDialog] = useState(false);
  const handleOpenMismatch = () => setShowMismatchDialog(true);
  const handleCloseMismatch = () => setShowMismatchDialog(false);
  const accentPurple = "#aa0ac7";
  const backgroundDark = "#121212";

  const handleCompare = async () => {
    if (!server1 || !server2 || server1 === server2) {
      alert("Please select two different servers.");
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      const response = await axios.post(`${API_BASE_URL}/flask/object/compare`, {
        db1,
        db2,
        server1,
        server2
      });
      console.log(response.data);
      setOutput(response.data);
    } catch (error) {
      setOutput("Error occurred while comparing.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setServer1("");
    setServer2("");
    setDb1("");
    setDb2("");
    setDbOptions1([]);
    setDbOptions2([]);
    setOutput("");
  };

  // ------------------------
  if (output && output.comparison) {
    const objectMap = new Map();

    output.comparison.forEach(({ object_type, source_object, dest_object }) => {
      const name = source_object || dest_object;

      if (!objectMap.has(name)) {
        objectMap.set(name, {
          object_type,
          source_object: "",
          dest_object: "",
        });
      }

      const obj = objectMap.get(name);

      if (source_object) obj.source_object = source_object;
      if (dest_object) obj.dest_object = dest_object;
    });

    var total_similar = 0;
    var total_different = 0;

    objectMap.forEach(({ source_object, dest_object }) => {
      if (source_object && dest_object && source_object === dest_object) {
        total_similar++;
      } else {
        total_different++;
      }
    });
  }


  const fetchDatabases = async (server, setDbOptions) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/flask/object/get_databases`, {
        server
      });
      setDbOptions(response.data);
    } catch (error) {
      console.error(`Error fetching databases for ${server}`, error);
      setDbOptions([]);
    }
  };

  useEffect(() => {
    if (server1) {
      setDb1("");
      fetchDatabases(server1, setDbOptions1);
    }
  }, [server1]);

  useEffect(() => {
    if (server2) {
      setDb2("");
      fetchDatabases(server2, setDbOptions2);
    }
  }, [server2]);

  return (<div>

    {/* Header */}
    <Box
      width="100%"
      bgcolor={backgroundDark}
      display="flex"
      justifyContent="center"
      alignItems="center"
      boxShadow={3}
      borderBottom={`2px solid ${accentPurple}`}
    >
      <h2 style={{
        textAlign: 'center',
        fontSize: '200%',
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: '2rem',
        paddingBottom: '0.5rem'
      }}>
        Object Validation
      </h2>
    </Box>
    <Box display="flex" height="100vh" width="100vw" bgcolor="#121212">
      {/* Left Panel */}
      <Box
        width="20%"
        height="60%"
        bgcolor="#1e1e1e"
        display="flex"
        flexDirection="column"
        alignItems="center"
        pt={2}
        pr={2}
        sx={{
          border: '2px dashed #aa0ac7',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          marginRight: '1.5rem',
          marginTop: '3rem',
        }}
      >
        <FormControl
          sx={{
            minWidth: 180,
            mb: 2,
            backgroundColor: '#2a2a2a',
            borderRadius: 2,
            boxShadow: 1,
            color: '#ffffff',
          }}
        >
          <InputLabel sx={{ color: '#bbbbbb', px: 0.5 }}>Source Server</InputLabel>
          <Select
            value={server1}
            onChange={(e) => setServer1(e.target.value)}
            label="Source Server"
            sx={{ borderRadius: 2, color: '#ffffff' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 300, borderRadius: 2, bgcolor: '#2a2a2a', color: '#fff' } } }}
          >
            {rdbmsOptions
              .filter((opt) => opt !== server2)
              .map((db) => (
                <MenuItem key={db} value={db}>{db}</MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            minWidth: 160,
            mb: 2,
            backgroundColor: !server1 ? '#1e1e1e' : '#2a2a2a',
            borderRadius: 2,
            boxShadow: !server1 ? 0 : 1,
            color: '#ffffff',
          }}
          disabled={!server1}
        >
          <InputLabel sx={{ color: '#bbbbbb', px: 0.5 }}>Source DB</InputLabel>
          <Select
            value={db1}
            onChange={(e) => setDb1(e.target.value)}
            label="Source DB"
            sx={{ borderRadius: 2, color: '#ffffff' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 300, borderRadius: 2, bgcolor: '#2a2a2a', color: '#fff' } } }}
          >
            {dbOptions1.map((db) => (
              <MenuItem key={db} value={db}>{`${server1} - ${db}`}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            minWidth: 180,
            mb: 2,
            backgroundColor: '#2a2a2a',
            borderRadius: 2,
            boxShadow: 1,
            color: '#ffffff',
          }}
        >
          <InputLabel sx={{ color: '#bbbbbb', px: 0.5 }}>Destination Server</InputLabel>
          <Select
            value={server2}
            onChange={(e) => setServer2(e.target.value)}
            label="Destination Server"
            sx={{ borderRadius: 2, color: '#ffffff' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 300, borderRadius: 2, bgcolor: '#2a2a2a', color: '#fff' } } }}
          >
            {rdbmsOptions
              .filter((opt) => opt !== server1)
              .map((db) => (
                <MenuItem key={db} value={db}>{db}</MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            minWidth: 160,
            mb: 2,
            backgroundColor: !server2 ? '#1e1e1e' : '#2a2a2a',
            borderRadius: 2,
            boxShadow: !server2 ? 0 : 1,
            color: '#ffffff',
          }}
          disabled={!server2}
        >
          <InputLabel sx={{ color: '#bbbbbb', px: 0.5 }}>Destination DB</InputLabel>
          <Select
            value={db2}
            onChange={(e) => setDb2(e.target.value)}
            label="Destination DB"
            sx={{ borderRadius: 2, color: '#ffffff' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 300, borderRadius: 2, bgcolor: '#2a2a2a', color: '#fff' } } }}
          >
            {dbOptions2.map((db) => (
              <MenuItem key={db} value={db}>{`${server2} - ${db}`}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleCompare}
          disabled={loading || !db1 || !db2}
          sx={{
            mb: 2,
            bgcolor: '#aa0ac7',
            '&:hover': { bgcolor: '#9400b3' },
            color: '#fff',
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Compare"}
        </Button>

        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            sx={{
              color: '#fff',
              borderColor: '#aa0ac7',
              '&:hover': { borderColor: '#ffffff' },
            }}
          >
            Reset
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => window.location.href = '/'}
            sx={{
              color: '#fff',
              borderColor: '#aa0ac7',
              '&:hover': { borderColor: '#ffffff' },
            }}
          >
            Back
          </Button>
        </Box>
      </Box>

      {/* Right Panel */}
      <Box
        width="80%"
        p={4}
        bgcolor="#121212"
        overflow="auto"
        display="flex"
        flexDirection="column"
        color="#ffffff"
      >

        {output && output.comparison && (
          <Box
            mt={2}
            p={3}
            bgcolor="#1e1e1e"
            borderRadius={2}
            border="2px dashed #aa0ac7"
          >
            <Typography variant="h6" gutterBottom color="#ffffff">
              Comparison Result
            </Typography>
            {/* 🧩 Comparison Result Table */}
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: '#1a1a1a',
                border: '2px dashed #aa0ac7',
                borderRadius: 2,
                overflow: 'hidden',
                my: 2,
              }}
            >
              <Table size="small" sx={{ borderCollapse: 'collapse' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#2a2a2a' }}>
                    <TableCell sx={{ fontWeight: "bold", color: "#fff", border: "1px solid #444" }}>Object Type</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#fff", border: "1px solid #444" }}>Source Objects</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#fff", border: "1px solid #444" }}>Destination Objects</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    (() => {
                      const sourceMap = new Map();
                      const destMap = new Map();

                      output.comparison.forEach(({ object_type, source_object, dest_object }) => {
                        if (source_object) {
                          sourceMap.set(source_object, { object_type, source_object });
                        }
                        if (dest_object) {
                          destMap.set(dest_object, { object_type, dest_object });
                        }
                      });

                      const allObjectNames = new Set([
                        ...Array.from(sourceMap.keys()),
                        ...Array.from(destMap.keys()),
                      ]);

                      const rows = Array.from(allObjectNames).map((name) => {
                        const source = sourceMap.get(name);
                        const dest = destMap.get(name);

                        const object_type = source?.object_type || dest?.object_type || "";
                        const source_object = source?.source_object || "";
                        const dest_object = dest?.dest_object || "";

                        const isMatch = source_object && dest_object && source_object === dest_object;

                        return (
                          <TableRow
                            key={name}
                            hover
                            sx={{
                              backgroundColor: isMatch ? '#2e7d32' : '#121212',
                              transition: "background-color 0.3s ease-in-out",
                            }}
                          >
                            <TableCell sx={{ border: "1px solid #444", color: "#fff" }}>{object_type}</TableCell>
                            <TableCell sx={{ border: "1px solid #444", color: "#fff" }}>{source_object || "-"}</TableCell>
                            <TableCell sx={{ border: "1px solid #444", color: "#fff" }}>{dest_object || "-"}</TableCell>
                          </TableRow>
                        );
                      });

                      return rows;
                    })()
                  }
                </TableBody>
              </Table>
            </TableContainer>

            {/* 🔢 Object Count Summary Table */}
            <Box mt={3}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: "#fff" }}>
                Object Count Summary
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: '#1a1a1a',
                  border: '2px dashed #aa0ac7',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Table size="small" sx={{ borderCollapse: 'collapse' }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#2a2a2a' }}>
                      <TableCell sx={{ fontWeight: "bold", color: "#fff", border: "1px solid #444" }}>Object Type</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#fff", border: "1px solid #444" }}>Source Count</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#fff", border: "1px solid #444" }}>Destination Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      (() => {
                        const sourceCounts = {};
                        const destCounts = {};

                        output.comparison.forEach(({ object_type, source_object, dest_object }) => {
                          if (source_object) sourceCounts[object_type] = (sourceCounts[object_type] || 0) + 1;
                          if (dest_object) destCounts[object_type] = (destCounts[object_type] || 0) + 1;
                        });

                        const allTypes = Array.from(new Set([...Object.keys(sourceCounts), ...Object.keys(destCounts)]));
                        return allTypes.map((type, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ border: "1px solid #444", color: "#fff" }}>{type}</TableCell>
                            <TableCell sx={{ border: "1px solid #444", color: "#fff" }}>{sourceCounts[type] || 0}</TableCell>
                            <TableCell sx={{ border: "1px solid #444", color: "#fff" }}>{destCounts[type] || 0}</TableCell>
                          </TableRow>
                        ));
                      })()
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* ✅ Summary Info */}
            <Box mt={2} p={2} sx={{
              border: '2px dashed #aa0ac7',
              borderRadius: 1,
              backgroundColor: '#1e1e1e',
              color: '#fff'
            }}>
              <Typography variant="body1"><b>Total similar objects = {total_similar}</b></Typography>
              <Typography variant="body1">
                <b>Total different objects = </b>
                <Link
                  component="button"
                  variant="body1"
                  sx={{ color: '#aa0ac7' }}
                  onClick={() => {
                    setShowMismatchTable(!showMismatchTable);
                    handleOpenMismatch();
                  }}
                >
                  {output.comparison.filter(obj => !obj.match).length}
                </Link>
              </Typography>
            </Box>

            {/* ⚠️ Mismatched Objects Dialog */}
            <Dialog
              open={showMismatchDialog}
              onClose={handleCloseMismatch}
              maxWidth="lg"
              fullWidth
              PaperProps={{
                sx: {
                  backgroundColor: "#121212",
                  color: "#e0e0e0",
                  border: '2px dashed #aa0ac7',
                  borderRadius: 2,
                }
              }}
            >
              <DialogTitle sx={{ color: "#fff" }}>Mismatched Objects</DialogTitle>
              <DialogContent dividers sx={{ padding: 2 }}>
                <TableContainer component={Paper} sx={{ backgroundColor: "#1e1e1e", borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "#aa0ac7", fontWeight: "bold", border: "1px solid #333" }}>Object Type</TableCell>
                        <TableCell sx={{ color: "#aa0ac7", fontWeight: "bold", border: "1px solid #333" }}>Source Object</TableCell>
                        <TableCell sx={{ color: "#aa0ac7", fontWeight: "bold", border: "1px solid #333" }}>Destination Object</TableCell>
                        <TableCell sx={{ color: "#aa0ac7", fontWeight: "bold", border: "1px solid #333" }}>Reason</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {output.comparison.filter(obj => !obj.match).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ color: "#fff", border: "1px solid #444" }}>{row.object_type}</TableCell>
                          <TableCell sx={{ color: "#fff", border: "1px solid #444" }}>{row.source_object || "-"}</TableCell>
                          <TableCell sx={{ color: "#fff", border: "1px solid #444" }}>{row.dest_object || "-"}</TableCell>
                          <TableCell sx={{ color: "#fff", border: "1px solid #444" }}>{row.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseMismatch} sx={{ color: "#aa0ac7" }}>
                  Close
                </Button>
              </DialogActions>
            </Dialog>


            {/* MEMO */}
            <Typography variant="caption" color="#b0b0b0" mt={1} display="block">
              <b>MEMO:</b> Objects are considered similar if they share the same <i>name</i> and <i>schema</i>.
            </Typography>

          </Box>
        )}
      </Box>
    </Box>
  </div>
  );
};

export default CompareDatabases;
