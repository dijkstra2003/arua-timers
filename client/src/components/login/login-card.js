import React from 'react';
import { Field } from 'redux-form';
import { renderField } from './login-field';
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import './login.css';

class LoginCard extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            register: false
        }

        this.handleRegister = this.handleRegister.bind(this);
    }

    handleRegister() {
        this.setState({
            register: !this.state.register
        })
    }

    render() {
        return(
            <div className="card login-card">
                <div className="card-body login-card-body">
                    <label className="login-label">AruaRose</label>
                    {this.props.loginError && (
                        <span className="invalid-credentials"> gebruikersnaam of wachtwoord onjuist</span>
                    )}
                    {!this.state.register ? (
                    <div>
                    <form className="mt-4 login-form" onSubmit={this.props.onSubmit}>
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
                            <button className="btn login-button">log in</button>
                        )}
                    </form>
                    <button className="btn login-button mt-2" onClick={this.handleRegister}>register</button>
                    </div>
                    ) : (
                    <div>
                        <form className="mt-4 login-form" onSubmit={this.props.onSubmit}>
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
                             <Field
                                name="passwordCheck"
                                label="repeat password"
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
                                <button className="btn login-button">register</button>
                            )}
                        </form>
                        <button className="btn login-button mt-2" onClick={this.handleRegister}>back to login</button>
                    </div>
                    )

                    }
                </div>
            </div>
        )
    }
}

export default LoginCard;