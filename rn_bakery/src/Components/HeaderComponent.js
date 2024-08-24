import React from "react";
import { Link } from "react-router-dom";
import "./HeaderComponent.css";

function HeaderComponent() {
    return (
        <header className="header">
            <h1>RN Bakery Management</h1>

            <nav>
                <div className="navbar-links-container">
                    <ul>
                        <li><Link to="/form">Form</Link></li>
                        <li><Link to="/table-view">Table View</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default HeaderComponent;
