import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './login.css';

export const renderField = ({input, label, type, icon, meta:{error}}) => {
    return(
        <div className="input-group justify-content-center mb-2">
            <div className="input-group-prepend">
                <span className="input-group-text"><FontAwesomeIcon icon={icon}/></span>
            </div>
            
            <input {...input} type={type} placeholder={label} className="form-control"/>
        </div>
    )
}