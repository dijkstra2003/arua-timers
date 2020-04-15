import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './login.css';

export const renderField = ({input, label, type, icon, meta:{error}}) => {
    return(
        <div className="input-group form-group justify-content-center">
            <div className="input-group-prepend">
                <span className="input-group-text"><FontAwesomeIcon icon={icon}/></span>
            </div>
            <input {...input} type={type} placeholder={label}/>
        </div>
    )
}