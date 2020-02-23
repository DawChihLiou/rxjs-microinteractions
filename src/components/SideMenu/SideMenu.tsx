import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import ListItemLink from '../ListItemLink';

const pages = [
  { id: 'loading-state', title: 'Loading State', route: '/loading-state' },
  {
    id: 'toggle-animation',
    title: 'Toggle Animation',
    route: '/toggle-animation',
  },
  {
    id: 'swipe-to-dismiss',
    title: 'Swipe to Dismiss',
    route: '/swipe-to-dismiss',
  },
];

const useStyles = makeStyles(theme => ({
  root: {
    width: 240,
  },
  paper: {
    width: 240,
  },
}));

export default function SideMenu() {
  const classes = useStyles();
  return (
    <Drawer variant="permanent" anchor="left" classes={classes}>
      <Divider />
      <List>
        {pages.map(({ id, title, route }) => (
          <ListItemLink key={id} to={route} primary={title} />
        ))}
      </List>
    </Drawer>
  );
}
