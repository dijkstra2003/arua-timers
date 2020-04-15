import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/map/';

export default [
  <Route path="/maps/create" component={Create} exact key="create" />,
  <Route path="/maps/edit/:id" component={Update} exact key="update" />,
  <Route path="/maps/show/:id" component={Show} exact key="show" />,
  <Route path="/maps/" component={List} exact strict key="list" />,
  <Route path="/maps/:page" component={List} exact strict key="page" />
];
