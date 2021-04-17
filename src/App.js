import './App.scss';
import React, {useEffect, useState} from "react";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Login from "./pages/login/Login";
import Devices from "./pages/devices/Devices";
import Dashboard from "./pages/dashboard/Dashboard";
import Device from "./pages/device/Device";
import Register from "./pages/register/Register";
import Sensor from "./pages/sensor/Sensor";
import Sensors from "./pages/sensors/Sensors";
import EditAccount from "./pages/editAccount/EditAccount";
import {InfoListItems, MainListItems, SecondaryListItems} from "./components/ListItems"
import List from "@material-ui/core/List";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import {makeStyles} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AppBar from "@material-ui/core/AppBar";
import {globalData} from "./repo/api";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/forgotPassword/ResetPassword";
import FirstPage from "./pages/firstPage/FirstPage";
import HowItStarted from "./pages/firstPage/articles/HowItStarted";
import DIY from "./pages/firstPage/articles/DIY";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));

function ShowAppBar() {
    const classes = useStyles();
    let [title, setTitle] = useState(false);
    globalData.setTitle = setTitle

    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return <div>
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
            <Toolbar className={classes.toolbar}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                >
                    <MenuIcon />
                </IconButton>
                <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                    {title}
                </Typography>
                <IconButton color="inherit">
                    <Badge badgeContent={4} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Toolbar>
        </AppBar>
        <Drawer
            variant="temporary"
            classes={{
                paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
            }}
            open={open}
        >
            <div className={classes.toolbarIcon}>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            <List><MainListItems /></List>
            <Divider />
            <List><SecondaryListItems /></List>
            <Divider />
            <List><InfoListItems /></List>
        </Drawer>
    </div>
}

function App() {
    let [isLoggedIn, setLoggedIn] = useState(false);
    globalData.setLoggedIn = setLoggedIn

    document.body.style.background = "url('background-white.jpg') repeat center";

    return <div className="App">
        <Router>
            <div>{isLoggedIn && <ShowAppBar />}</div>
            <div>
                <Switch>
                    <Route path="/firstPage">
                        <FirstPage/>
                    </Route>
                    <Route path="/login">
                        <Login/>
                    </Route>
                    <Route path="/dashboard">
                        <Dashboard/>
                    </Route>
                    <Route path="/devices">
                        <Devices/>
                    </Route>
                    <Route path="/device">
                        <Device/>
                    </Route>
                    <Route path="/sensors">
                        <Sensors/>
                    </Route>
                    <Route path="/sensor">
                        <Sensor/>
                    </Route>
                    <Route path="/register">
                        <Register/>
                    </Route>
                    <Route path="/account">
                        <EditAccount/>
                    </Route>
                    <Route path="/forgotPassword">
                        <ForgotPassword/>
                    </Route>
                    <Route path="/resetPassword">
                        <ResetPassword/>
                    </Route>
                    <Route path="/howItStarted">
                        <HowItStarted/>
                    </Route>
                    <Route path="/diy">
                        <DIY/>
                    </Route>
                </Switch>
            </div>
        </Router>
    </div>

}

export default App;
