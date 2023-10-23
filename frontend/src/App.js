import React, { useState } from 'react';
import './App.css'
import NetworkVisualization from './components/NetworkVisualization';
import Navbar from './components/Navbar';
import AppRouter from './components/router';

function App() {

    return (
        <div>
            <AppRouter />
        </div>
    )

}

export default App;

