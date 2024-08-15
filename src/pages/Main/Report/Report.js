import React, { useState } from 'react';
import './report.css';

import ReportMap from "./ReportMap.js";

const jsonData = {
    modes: ["Train", "Bicycle", "Bus", "Tram", "Metro"],
    problemTypes: ["Infrastructure", "Service", "Security"],
    problems: ["Escalator", "Elevator", "Platform", "Stairs", "Ticket", "Machine", "Doors", "Bench", "Others"]
};

export default function Report() {
    const [formData, setFormData] = useState({
        mode: '',
        problemType: '',
        problem: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    return (
        <div className='formReport'>
            <h1>What do you want to report?</h1>
            <div className='formGrid'>
                <div className='textColum'>
                    <span>Choose the mobility mode:</span>
                    <select name="mode" id="mode" value={formData.mode} onChange={handleChange}>
                        <option value="" disabled>Choose one</option>
                        {jsonData.modes.map((mode, index) => (
                            <option key={index} value={mode.toLowerCase()}>{mode}</option>
                        ))}
                    </select>

                    <span>Choose the type of problem:</span>
                    <select name="problemType" id="problemType" value={formData.problemType} onChange={handleChange}>
                        <option value="" disabled>Choose one</option>
                        {jsonData.problemTypes.map((problemType, index) => (
                            <option key={index} value={problemType.toLowerCase()}>{problemType}</option>
                        ))}
                    </select>

                    <span>Specify the problem:</span>
                    <select name="problem" id="problem" value={formData.problem} onChange={handleChange}>
                        <option value="" disabled>Choose one</option>
                        {jsonData.problems.map((problem, index) => (
                            <option key={index} value={problem.toLowerCase()}>{problem}</option>
                        ))}
                    </select>

                    <span>Description:</span>
                    <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange}></textarea>

                </div>
                <div className='mapColum'>
                    <ReportMap></ReportMap>
                </div>
            </div>

            <div className='buttonBox'>
                <button>Submit</button>
            </div>
        </div>
    );
}
