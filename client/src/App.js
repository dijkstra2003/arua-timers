import React from 'react';
import {Route, Switch} from "react-router";
import {connect} from 'react-redux';
import {checkAdminUserRole} from './utils/jwtTokenReader';
import './styles/styles.css';
import history from './history';
import Login from './components/login/login';
// Import your routes here 
import userRoutes from './routes/user'; 
import monsterRoutes from './routes/monster'; 
import mapRoutes from './routes/map';

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
								<Switch>
									{/* Add your routes here */}
									{userRoutes},
									{monsterRoutes},
									{mapRoutes},
									<Route path="/login" component={Login}/>,
								</Switch>
							</div> : <Route component={Login}/>
						}
					</div>
			)
	}
}

export default connect(mapStateToProps, null)(App);