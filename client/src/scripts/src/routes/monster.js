import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/monster/';

export default [
  <Route path="/monsters/create" component={Create} exact key="create" />,
  <Route path="/monsters/edit/:id" component={Update} exact key="update" />,
  <Route path="/monsters/show/:id" component={Show} exact key="show" />,
  <Route path="/monsters/" component={List} exact strict key="list" />,
  <Route path="/monsters/:page" component={List} exact strict key="page" />
];
