import React from 'react';
import {Route, Switch} from "react-router";
import {connect} from 'react-redux';
import {checkAdminUserRole} from './utils/jwtTokenReader';
import './styles/styles.css';
import history from './history';

const mapStateToProps = state => ({
    ...state
});

window.addEventListener('storage', function(e) {
	var token = 'jwtToken';
	if(e.key === 'logout') {
		window.sessionStorage.removeItem(token);
		history.push('/');
		window.localStorage.removeItem('logout')
	}
	if(e.key === 'getSessionStorage') {
	  if(sessionStorage.getItem(token)) {
			localStorage.setItem('sessionStorage', sessionStorage.getItem(token));
			localStorage.removeItem('sessionStorage');
			localStorage.removeItem('getSessionStorage');
	  }
	} else if (e.key === 'sessionStorage' && !sessionStorage.length) {
	  if(e.newValue) {
			sessionStorage.setItem(token, e.newValue);
			history.push(window.location);
	  }
	}
});
  
if(!sessionStorage.length) {
	// Ask other tabs for session storage
	localStorage.setItem('getSessionStorage', Date.now())
}

class App extends React.Component {    
	render() {
			const jwtToken = window.sessionStorage.getItem('jwtToken');
			const isAuth = checkAdminUserRole(jwtToken);
			return (
					<div className="app">
						{isAuth ?
						<div>
							<Header isAuth={isAuth}/>
							<Switch>
								{/* Add your routes here */}								
							</Switch>
						</div>
						: <Route component={LoginForm}/> }
					</div>
			)
	}
}

export default connect(mapStateToProps, null)(App);