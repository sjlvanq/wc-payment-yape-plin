import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

const AccountTable = ( {settings} ) => {
  const {bankAcct_alias, bankAcct_cci, bankAcct_holder} = settings;
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell align="right" style={{ fontWeight: 'bold'}}>Alias</TableCell>
            <TableCell>{bankAcct_alias}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right" style={{ fontWeight: 'bold'}}>CCI</TableCell>
            <TableCell>{bankAcct_cci}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right" style={{ fontWeight: 'bold'}}>Titular</TableCell>
            <TableCell>{bankAcct_holder}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AccountTable;