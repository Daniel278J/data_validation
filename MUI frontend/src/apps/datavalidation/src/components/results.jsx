import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import "./result_page.css";
import {
    Button, Table, TableContainer, TableBody, TableRow,
    TableHead, TableCell, Paper, Dialog, DialogTitle,
    DialogContent, DialogActions
} from "@mui/material";

function ResultPage() {
    const location = useLocation();

    // ---------- SAFE EXTRACTION ----------
    const result_data = Array.isArray(location?.state?.result_data)
        ? location.state.result_data
        : [];

    const actual_data = Array.isArray(result_data[0]) ? result_data[0] : [];
    const output_data = Array.isArray(result_data[1]) ? result_data[1] : [];

    const optimal_list = ['', 'Yes', 'No', 'No', 'No', 'Yes', 'Yes', 'No', 'No', 'No'];

    const failure_text = [
        '',
        'Schema is not valid',
        'The following columns are missing in the target database:',
        'The following columns are not present in source but present in target database:',
        "The following columns' datatypes is mismatched:",
        'Primary key is diferent in both databases',
        'The data is not perfectly matched',
        'The rows with following primary keys are not present in target:',
        'The rows with following primary keys are not present in source but present in target:',
        'The data in the following columns and there corresponding primary key row are mismatch:'
    ];

    const [showMismatchDialog, setShowMismatchDialog] = useState(false);
    const [text, setText] = useState('');
    const [row, setRow] = useState(0);
    const [col, setCol] = useState(0);
    const [output, setOutput] = useState([]);

    const handleCloseMismatch = () => setShowMismatchDialog(false);

    let Table_head = null;
    let Table_body = null;

    // ---------- SAFE TABLE RENDERING ----------
    if (col === 4 && output && typeof output === 'object') {
        Table_head = (
            <TableRow>
                <TableCell>Column Name</TableCell>
                <TableCell>Datatype in source</TableCell>
                <TableCell>Datatype in Target</TableCell>
            </TableRow>
        );

        Table_body = Object.entries(output || {}).map(([key, value]) => (
            <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>{Array.isArray(value) ? value[0] : ''}</TableCell>
                <TableCell>{Array.isArray(value) ? value[1] : ''}</TableCell>
            </TableRow>
        ));
    }

    else if (col === 5 && Array.isArray(output)) {
        Table_head = (
            <TableRow>
                <TableCell>Source Primary Key</TableCell>
                <TableCell>Target Primary key</TableCell>
            </TableRow>
        );

        Table_body = (
            <TableRow>
                <TableCell>{Array.isArray(output[0]) ? output[0].join(", ") : ''}</TableCell>
                <TableCell>{Array.isArray(output[1]) ? output[1].join(", ") : ''}</TableCell>
            </TableRow>
        );
    }

    else if (col === 9 && output && typeof output === 'object' && !Array.isArray(output)) {
        Table_head = (
            <TableRow>
                <TableCell>Column name</TableCell>
                <TableCell>Primary keys where data is not matched</TableCell>
            </TableRow>
        );

        Table_body = Object.entries(output || {}).map(([key, value]) => (
            <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>
                    {Array.isArray(value) ? `{${value.join("}, {")}}` : ''}
                </TableCell>
            </TableRow>
        ));
    }

    else if (Array.isArray(output)) {
        Table_body = output.map((value, index) => (
            <TableRow key={index}>
                <TableCell>{value}</TableCell>
            </TableRow>
        ));
    }

    // ---------- CLICK HANDLER (SAFE) ----------
    const details = (event) => {
        if (!event?.target?.id) return;

        const [r, c] = event.target.id.split("&").map(Number);
        if (!r || c === undefined) return;

        setRow(r);
        setCol(c);

        const cellData = actual_data?.[r - 1]?.[c];
        if (cellData === undefined) return;

        setOutput(cellData);

        if (c === 0) return;

        if (output_data?.[r]?.[c] === "NA") {
            setText("Schema is not valid. So data validity is not available.");
        } else {
            setText(failure_text[c] || '');
        }

        setShowMismatchDialog(true);
    };

    // ---------- RENDER ----------
    if (!Array.isArray(output_data) || output_data.length === 0) {
        return (
            <div className="head">
                <h2 align="center">Validation Results</h2>
                <p style={{ textAlign: "center", color: "#aaa" }}>
                    No result data available
                </p>
            </div>
        );
    }

    return (
        <div className='head'>
            <h2 align="center">Validation Results</h2>

            <TableContainer component={Paper} sx={{
                marginTop: 2,
                backgroundColor: "#1e1e1e",
                borderRadius: 2,
                "& thead th": {
                    color: "#aa0ac7",
                    fontWeight: "bold",
                    border: "1px solid #333"
                },
                "& tbody td": {
                    border: "1px solid #444"
                }
            }}>
                <Table size="medium">
                    <TableHead>
                        <TableRow>
                            {Array.isArray(output_data[0]) &&
                                output_data[0].map((head, i) => (
                                    <TableCell
                                        key={i}
                                        sx={{ color: "#aa0ac7", fontWeight: "bold", textAlign: "center" }}
                                    >
                                        {head}
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {output_data.map((rowData, r) => {
                            if (r === 0 || !Array.isArray(rowData)) return null;

                            return (
                                <TableRow key={r}>
                                    {rowData.map((cell, c) => (
                                        cell === optimal_list[c] || c === 0 ? (
                                            <TableCell
                                                key={c}
                                                sx={{ color: "#41dc8e", textAlign: "center" }}
                                            >
                                                {cell}
                                            </TableCell>
                                        ) : (
                                            <TableCell
                                                key={c}
                                                id={`${r}&${c}`}
                                                className='link'
                                                onClick={details}
                                                sx={{ color: "orange", fontWeight: "bold", textAlign: "center" }}
                                            >
                                                {cell}
                                            </TableCell>
                                        )
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

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
                <DialogTitle sx={{ color: "#fff" }}>{text}</DialogTitle>

                <DialogContent dividers>
                    <TableContainer component={Paper} sx={{
                        backgroundColor: "#1e1e1e",
                        borderRadius: 2,
                        "& thead th": {
                            color: "#aa0ac7",
                            fontWeight: "bold",
                            border: "1px solid #333"
                        },
                        "& tbody td": {
                            border: "1px solid #444",
                            color: "#fff"
                        }
                    }}>
                        <Table size="small">
                            <TableHead>{Table_head}</TableHead>
                            <TableBody>{Table_body}</TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseMismatch} sx={{ color: "#aa0ac7" }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

}

export default ResultPage;
