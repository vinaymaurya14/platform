import './Header.css'
import { AppBar, StyledEngineProvider, TextField, Badge } from '@mui/material'
import  SearchIcon  from '../../assets/icons/search.svg?react';
import NotificationIcon from "../../assets/icons/notification.svg?react";
import FaceIcon from '@mui/icons-material/Face';
export default function Header(){
    return (
        <StyledEngineProvider injectFirst>
            <AppBar position='static' className="header-app-bar" color='inherit'>
                <div style={{display:"flex", alignItems: "center", flex:"60%"}}>
                    <div style={{flex:1}}>
                        <span className="day-name">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>                
                        <span className="date-label"> {new Date().toLocaleDateString('en-Us', { month: 'short',day:'numeric', year: 'numeric'})}&nbsp;&nbsp;</span>
                    </div>
                    {/* <div className='search-box-ctn' >
                        <div className='search-icon-ctn'>
                           <SearchIcon/>
                        </div>
                        <TextField size='small' placeholder='Search your project'  sx={{"& fieldset": { border: 'none' },}}></TextField>
                    </div> */}
                </div>
                <div style={{flex:"60%",display:"flex", justifyContent:"flex-end", alignItems:"center"}}>
                    <Badge badgeContent={4} color="primary" style={{marginRight:"20px"}}>
                        <NotificationIcon/>
                    </Badge>
                    <div className="profile-ctn">
                        <div className="profile-pic-ctn">
                            <FaceIcon style={{width:"100%", height:"100%"}}></FaceIcon>
                        </div>
                        <div className="user-ctn">
                            <small className='wel-come'>Welcome!</small>
                            <span className="user-name">{sessionStorage.getItem("email")}</span>
                        </div>
                    </div>
                </div>
            </AppBar>
        </StyledEngineProvider>
    )
}