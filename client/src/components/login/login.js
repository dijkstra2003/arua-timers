import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { login } from '../../actions/login/login';
import PropTypes from 'prop-types';
import LoginCard from './login-card';
import './login.css';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        }

        this.onChangeField = this.onChangeField.bind(this);
        this.onSubmitLogin = this.onSubmitLogin.bind(this);
    }

    static propTypes = {
        isLoading: PropTypes.bool,
        loginError: PropTypes.string
    }

    onChangeField(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        });
    }

    onSubmitLogin() {
        this.props.login(this.state);
    }

    render() {
        const {handleSubmit} = this.props;
        return(
            <div className="text-center login overflow-hidden">
                <div className="card">
                    <LoginCard
                        onSubmit={handleSubmit(this.onSubmitLogin)}
                        onChangeField={this.onChangeField}
                        isLoading={this.props.isLoading}
                    />
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = {
    login
};

const mapStateToProps = state => ({
    isLoading: state.login.isLoading,
    loginError: state.login.loginError
});

export default reduxForm({
    form: 'Login'
})(connect(mapStateToProps, mapDispatchToProps)(Login));

