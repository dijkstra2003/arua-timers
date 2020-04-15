import React from 'react';
import { Field } from 'redux-form';
import { renderField } from './login-field';
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import './login.css';

class LoginCard extends React.Component {
    render() {
        return(
            <div className="card-body login-modal">
                <label className="login-label">AruaRose TE</label>
                {this.props.loginError && (
                    <span className="invalid-credentials"> gebruikersnaam of wachtwoord onjuist</span>
                )}
                <form className="mt-4" onSubmit={this.props.onSubmit}>
                    <Field
                        name="username"
                        label="username"
                        type="text"
                        component={renderField}
                        icon={faUser}
                        onChange={this.props.onChangeField}    
                    />
                    <Field
                        name="password"
                        label="password"
                        type="password"
                        component={renderField}
                        icon={faKey}
                        onChange={this.props.onChangeField}    
                    />
                    {this.props.isLoading ? (
                        <div className="spinner-border mt-4" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) : (
                        <button className="btn btn-info login-button">log in</button>
                    )}
                </form>
            </div>
        )
    }
}

export default LoginCard;