import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import "./result_page.css";
import {
    Button, Table, TableContainer, TableBody, TableRow, TableHead, TableCell, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
    Alert
} from "@mui/material";

function Result1Page() {
    const location = useLocation();
    const { result_data } = location.state || {};
    const actual_data = result_data[0];
    const output_data = result_data[1];
    // const optimal_list =  ['', 'Ye
    // es', 'No', 'No', 'No', 'Yes', 'Yes', 'No', 'No', 'No']
    const optimal_text = ['', 'Schema is Valid i.e all the columns are matched and primary key is also matched and the data types are also matched', 'All columns from the source are in target database', 'All columns in the target are from source', 'All datatypes are matched', 'Both have same primary key', 'All the actual data in the table are perfectly matched', 'There are no missing rows', 'There are no additional rows other than from source', 'All data in the table is  matched']
    const failure_text = ['', 'Schema is not valid', 'The following columns are missing in the target database:', 'The following columns are not present in source but present in target database:', "The following columns' datatypes is mismatched:", 'Primary key is diferent in both databases', 'The data is not perfectly matched', 'The rows with following primary keys are not present in target:', 'The rows with following primary keys are not present in source but present in target:', 'The data in the following columns and there corresponding primary key row are mismatch:']
    const [showMismatchDialog, setShowMismatchDialog] = useState(false);
    const handleCloseMismatch = () => setShowMismatchDialog(false);
    const [text, setText] = useState('');
    const [row, setRow] = useState(0);
    const [col, setCol] = useState(0);
    const [output, setOutput] = useState([]);

    var Table_head = null;
    var Table_body = null;

    if (col == 4) {
        Table_head = (
            <TableRow>
                <TableCell>Column Name</TableCell>
                <TableCell>Datatype in source</TableCell>
                <TableCell>Datatype in Target</TableCell>
            </TableRow>
        );
        Table_body = (
            Object.entries(output).map(([key, value]) => (
                <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value[0]}</TableCell>
                    <TableCell>{value[1]}</TableCell>
                </TableRow>
            ))
        );
    } else if (col == 5) {
        Table_head = (
            <TableRow>
                <TableCell>Source Primary Key</TableCell>
                <TableCell>Target Primary key</TableCell>
            </TableRow>
        );
        Table_body = (
            <TableRow>
                <TableCell>{output[0].join(", ")}</TableCell>
                <TableCell>{output[1].join(", ")}</TableCell>
            </TableRow>
        );
    } else if (col == 9 && typeof output != 'string') {
        Table_head = (
            <TableRow>
                <TableCell>Column name</TableCell>
                <TableCell>Primary keys where data is not matched</TableCell>
            </TableRow>
        );
        Table_body = (
            Object.entries(output).map(([key, value]) => (
                <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{"{"}{value.join("}, {")}{"}"}</TableCell>
                </TableRow>
            ))
        );
    } else if (typeof output != 'string') {
        Table_body = (
            output.map((value, index) => (
                <TableRow key={index}>
                    <TableCell>{value}</TableCell>
                </TableRow>
            ))
        );
    }

    const details = (event) => {
        const rowcol = event.target.id.split("&");
        setRow(rowcol[0]);
        setCol(rowcol[1]);
        const row = rowcol[0];
        const col = rowcol[1];
        setOutput(actual_data[row - 1][col]);

        if (col === 0) {
            return;
        }
        else if (output_data[row][col] === "NA") {
            setText("Schema is not valid. So data validity is not available.");
        }
        else {
            setText(failure_text[col]);
        }
        setShowMismatchDialog(true);
    }

    return (
        <div class='head'>
            <h2 align="center">Validation Results </h2>
            <br />
            <TableContainer component={Paper} sx={{
                marginTop: 2, backgroundColor: "#1e1e1e", borderRadius: 2, "& thead th": {
                    color: "#aa0ac7", fontWeight: "bold", border: "1px solid #333"
                },
                "& tbody td": {
                    border: "1px solid #444"
                }
            }}>
                <Table size="medium" >
                    <TableHead>
                        <TableRow sx={{ textAlign: "center" }}>
                            {output_data[0].map((row) => {
                                return (
                                    <TableCell sx={{ color: "#aa0ac7", fontWeight: "bold", textAlign: "center" }}>{row}</TableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {output_data.map((table_data, row) => {
                            if (row === 0) return null;
                            return (
                                <TableRow>
                                    {
                                        table_data.map((table_items, column) => {
                                            return (
                                                table_items === optimal_list[column] || column === 0 ? <TableCell sx={{ color: "#41dc8e", textAlign: "center" }}>{table_items}</TableCell> : <TableCell id={`${row}&${column}`} className='link' onClick={details} sx={{ color: "orange", fontWeight: "bold", textAlign: "center" }}>{table_items}</TableCell>
                                            )
                                        }
                                        )}
                                </TableRow>)
                        })
                        }
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
                <DialogContent dividers sx={{ padding: 2 }}>
                    <TableContainer component={Paper} sx={{
                        backgroundColor: "#1e1e1e", borderRadius: 2, "& thead th": {
                            color: "#aa0ac7", fontWeight: "bold", border: "1px solid #333"
                        },
                        "& tbody td": {
                            border: "1px solid #444", color: "#fff"
                        }
                    }}>
                        <Table size="small">
                            <TableHead>
                                {Table_head}
                            </TableHead>
                            <TableBody>
                                {Table_body}
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
        </div>
    );
}
export default Result1Page;
