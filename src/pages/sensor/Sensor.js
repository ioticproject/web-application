import React, {useEffect, useState} from "react";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {api, globalData} from "../../repo/api.js"
import Paper from "@material-ui/core/Paper";
import {Redirect} from "react-router";

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../../components/Title';
import {MDBContainer} from "mdbreact";

function Data({data, onClick}) {
    return <StyledTableRow onClick={() => onClick(data)} key={data._id}>
        <StyledTableCell>{data.value}</StyledTableCell>
        <StyledTableCell>{data.timestamp}</StyledTableCell>
        <StyledTableCell>OK</StyledTableCell>
    </StyledTableRow>
}

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

export default function Sensor() {
    const classes = useStyles();

    let [data, setSensorData] = useState([]);
    let [isLoading, setLoading] = useState(false);
    let [dataClicked, setDataClicked] = useState(false);

    function onDataClick(data){
        setDataClicked(true)
    }

    useEffect(() => {
        async function fetch(){
            setLoading(true)
            let res = await api.getSensorData();
            setLoading(false)
            setSensorData(res.data.data)
            globalData.setTitle("Sensor " + globalData.sensor.type);
        }
        fetch()
    }, [])


    if(dataClicked){
        return <Redirect to="/data"/>
    }

    return (
        <MDBContainer>
            <p className="mx-auto">
                <Title>' '</Title>
                <Title>' '</Title>
                <Title>Data</Title>
                <Table size="large" stickyHeader="true">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Type</StyledTableCell>
                            <StyledTableCell>Time</StyledTableCell>
                            <StyledTableCell>State</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? <CircularProgress/> : data.map(it => <Data key={it._id} data={it} onClick={onDataClick} />)}
                    </TableBody>
                </Table>
            </p>
        </MDBContainer>
    );
}