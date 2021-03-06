import React, {useEffect, useState} from "react";
import {withStyles, makeStyles, useTheme} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {api, globalData} from "../../repo/api.js"
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Title from '../../components/Title';
import {MDBContainer} from "mdbreact";
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import StorageIcon from '@material-ui/icons/Storage';
import FavoriteIcon from '@material-ui/icons/Timeline';
import PersonPinIcon from '@material-ui/icons/PieChart';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Chart from "react-google-charts";
import {Label, Line, LineChart, XAxis, YAxis, hAxis, vAxis, CartesianGrid, Tooltip,} from "recharts";
import MaterialTable from "material-table";
import moment from "moment";
import DeleteData from "../../components/DeleteData";
import Report from 'react-data-report';
import {useTranslation} from "react-i18next";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

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

export default function Sensor() {
    const theme = useTheme();
    const colors = ["#009933", "#0099FF", "#FF6666"]
    const [value, setValue] = React.useState(0);
    const [t] = useTranslation('common');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let [data, setSensorData] = useState([]);
    let [chart_data, setChartSensorData] = useState([]);
    let [rechart_data, setReChartSensorData] = useState([]);
    let [normalValues, setNormalValues] = useState([]);
    let [lowerValues, setLowerValues] = useState([]);
    let [higherValues, setHigherValues] = useState([]);
    let [isLoading, setLoading] = useState(false);

    async function loadData() {
        setLoading(true)
        let res = await api.getSensorData();
        setLoading(false)
        setSensorData(res.data.data)
        setReChartSensorData(res.data.data.map(x => ({time: x.timestamp, value: x.value})))
        setChartSensorData(res.data.data.map(x => ["Date(" + x.timestamp + ")", x.value]))
        if (globalData.sensor.max_val)
            setHigherValues(res.data.data.filter(x => x.value > globalData.sensor.max_val));
        else setHigherValues([])

        if (globalData.sensor.min_val)
            setLowerValues(res.data.data.filter(x => x.value < globalData.sensor.min_val));
        else setLowerValues([])

        if (globalData.sensor.min_val && globalData.sensor.max_val)
            setNormalValues(res.data.data.filter(x => x.value >= globalData.sensor.min_val && x.value <= globalData.sensor.max_val));
        setNormalValues(res.data.data)
    }

    useEffect(() => {
        loadData()
    }, [])

    function level(val, minVal, maxVal){
        if (val < minVal)
            return "low"
        else if (val > maxVal)
            return "high"
        else return "normal"
    }

    return (
        <MDBContainer>
            <p className="mx-auto">
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                        aria-label="scrollable force tabs example">
                        <Tab label={t('sensor.receivedData', {framework:'React'})} icon={<StorageIcon />} {...a11yProps(0)} />
                        <Tab label={t('sensor.charts', {framework:'React'})} icon={<FavoriteIcon />} {...a11yProps(1)} />
                        <Tab label={t('sensor.piecharts', {framework:'React'})} icon={<PersonPinIcon />} {...a11yProps(2)} />
                        <Tab label={t('sensor.reports', {framework:'React'})} icon={<LibraryBooks />} {...a11yProps(3)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <div style={{maxWidth: '100%'}}>
                        <MaterialTable
                            columns={[
                                {
                                    title: '#',
                                    render: (it) => <p>{it.tableData.id + 1}</p>,
                                    headerStyle: {width: "20px"}
                                },
                                {
                                    title: t('sensor.value', {framework:'React'}),
                                    field: 'value',
                                    cellStyle: {
                                        backgroundColor: '#f2f2f7',
                                    }
                                },
                                {
                                    title: t('sensor.day', {framework:'React'}),
                                    field: 'timestamp',
                                    render: ({timestamp}) => moment(timestamp).format("DD/MM/YY")
                                },
                                {
                                    title: t('sensor.time', {framework:'React'}),
                                    field: 'timestamp',
                                    render: ({timestamp}) => moment(timestamp).format("HH:mm:ss")
                                },
                                {
                                    title: t('sensor.level', {framework:'React'}),
                                    field: 'value',
                                    render: ({value}) => level(value, 25, 90),
                                },
                                {
                                    title: t('sensor.delete', {framework:'React'}),
                                    render: (rowData) => <DeleteData data={rowData} onFinishDelete={() => loadData()}/>
                                }
                            ]}
                            data={data}
                            isLoading={isLoading}
                            title={globalData.sensor.name + " - " + t('sensor.title', {framework:'React'})}
                            options={{
                                filtering: true,
                                headerStyle: {
                                    backgroundColor: '#E8E8F0',
                                    fontSize: 20
                                },
                                rowStyle: x => {
                                    if (x.tableData.id % 2) {
                                        return {backgroundColor: "#f7f7fa"}
                                    }
                                }
                            }}
                        />
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {isLoading ? <CircularProgress/> :
                        <div align={"center"} style={{backgroundColor: "white"}}>
                        <LineChart
                            width={1200}
                            height={500}
                            data={rechart_data}
                            margin={{ top: 100, right: 20, left: 30, bottom: 100 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time"  tick={false} ><Label >Time</Label></XAxis>
                            <YAxis stroke={theme.palette.text.secondary}>
                                <Label
                                    angle={270}
                                    position="left"
                                    style={{ textAnchor: 'middle', fill: theme.palette.text.primary }} >
                                    {globalData.sensor.type + ' (' + globalData.sensor.measure_unit + ')'}
                                </Label>
                            </YAxis>
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main}  />
                        </LineChart>
                        </div>
                    }
                </TabPanel>
                <TabPanel value={value} index={2}>
                    {isLoading ? <CircularProgress/> :
                        <div align={"center"} style={{backgroundColor: "white"}}>
                        <Chart
                        width={'1000px'}
                        height={'600px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['Data', 'Level'],
                            ['Normal', normalValues.length],
                            ['Lower', lowerValues.length],
                            ['Higher', higherValues.length],
                        ]}
                        options={{
                            title: 'Levels',
                            slices: {
                                0: {color: colors[0]},
                                1: {color: colors[1]},
                                2: {color: colors[2]},
                            },
                            backgroundColor: 'transparent',
                            filterCellStyle: {
                                backgroundColor: '#E8E8F0'
                            }
                        }}
                    /></div> }
                </TabPanel>
                <TabPanel value={value} index={3}>
                    {
                        <div style={{backgroundColor: "white"}}>
                            <Report data={rechart_data}/>
                        </div>}
                </TabPanel>
            </p>
        </MDBContainer>
    );
}

export { Data, StyledTableRow, StyledTableCell }