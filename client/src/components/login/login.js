import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { login } from '../../actions/login/login';
import { create } from '../../actions/user/create';
import PropTypes from 'prop-types';
import LoginCard from './login-card';
import { hashPassword } from '../../utils/passwordHasher';
import './login.css';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            passwordCheck: ''
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
        if(this.state.passwordCheck === '') {
            const { username, password } = this.state;
            this.props.login({username, password});
        } else {
            var { username, password, passwordCheck } = this.state
            if(password === passwordCheck) {
                password = hashPassword(password)
                this.props.create({username, password});
            }
        }
    }

    render() {
        const {handleSubmit} = this.props;
        return(
            <div className="text-center login overflow-hidden">
                    <LoginCard
                        onSubmit={handleSubmit(this.onSubmitLogin)}
                        onChangeField={this.onChangeField}
                        isLoading={this.props.isLoading}
                    />
            </div>
        )
    }
}

const mapDispatchToProps = {
    login,
    create
};

const mapStateToProps = state => ({
    isLoading: state.login.isLoading,
    loginError: state.login.loginError
});

export default reduxForm({
    form: 'Login'
})(connect(mapStateToProps, mapDispatchToProps)(Login));

