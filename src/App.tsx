import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import {HashRouter, Route, Routes,} from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import {InitScreen} from "./InitScreen";
import {GamePool} from "./components/GamePool";


function App() {
    return (<>
            <HashRouter>
                <Routes>
                    <Route path="/pool" element={<GamePool/>}/>
                    <Route path="/" element={<InitScreen/>}/>
                </Routes>
            </HashRouter>
            <ToastContainer position="bottom-right" autoClose={3000}/>
        </>
    );
}

export default App;
