import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    height: 'calc(100% - 32px)',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    overflow: 'auto',
  },
}));

interface ContentContainerProps {
  children?: React.ReactNode;
}

export default function ContentContainer({ children }: ContentContainerProps) {
  const classes = useStyles();

  return (
    <Container>
      <Paper elevation={4} classes={classes}>
        {children}
      </Paper>
    </Container>
  );
}
