import React from "react";
import {HashRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({isLoggedIn, userObj}) => {
    // const [isLoggedIn, setIsLoggedIn] = useState(true);
    return(
        <Router>
            {isLoggedIn && <Navigation />}
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route exact path="/" element={<Home userObj={userObj} />} />
                        <Route exact path="/profile" element={<Profile />} />
                    </>
                ) : (
                    <>
                        <Route exact path="/" element={<Auth />} />
                    </>
                )}
                <Route path="*" element={<Navigate replace to="/" />} /> 
            </Routes>
        </Router>
    )
}
export default AppRouter;