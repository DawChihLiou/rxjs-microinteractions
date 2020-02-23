import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import { ThemeProvider } from '@material-ui/core';

import Homepage from './pages/Homepage';
import SideMenu from './components/SideMenu';
import LoadingStatePage from './pages/LoadingStatePage';
import ToggleAnimationPage from './pages/ToggleAnimationPage';
import SwipeToDeletePage from './pages/SwipeToDeletePage';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" minHeight="100%">
        <CssBaseline />
        <Router>
          <SideMenu />
          <Switch>
            <Route path="/loading-state">
              <LoadingStatePage />
            </Route>
            <Route path="/toggle-animation">
              <ToggleAnimationPage />
            </Route>
            <Route path="/swipe-to-dismiss">
              <SwipeToDeletePage />
            </Route>
            <Route path="/">
              <Homepage />
            </Route>
          </Switch>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
