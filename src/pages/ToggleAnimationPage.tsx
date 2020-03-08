import React, { Fragment, useState, useCallback } from 'react';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import GitHubIcon from '@material-ui/icons/GitHub';
import Fab from '@material-ui/core/Fab';
import TwitterIcon from '@material-ui/icons/Twitter';
import Zoom from '@material-ui/core/Zoom';
import { useObservable } from 'rxjs-hooks';
import { mergeMap, take, map } from 'rxjs/operators';
import { timer } from 'rxjs';

import ContentContainer from '../components/ContentContainer';
import { members } from '../utils/rxCoreTeam';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 520,
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
    icon: {
      fontSize: 14,
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(4),
      right: theme.spacing(4),
      marginBottom: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
  }),
);

export default function ToggleAnimationPage() {
  const classes = useStyles();
  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const handleClick = useCallback(
    (index: number) => () => setSelectedIndex(index),
    [],
  );

  const showFab = useObservable<boolean, [number]>(
    input$ =>
      input$.pipe(
        // input:  i---------------(i|)
        // output: x (300ms) o-----x (300ms) (o|)
        mergeMap(([input]) =>
          timer(0, 300).pipe(
            // i (300ms) (i|)
            take(2),
            // x (300ms) (o|)
            map(number => (number === 0 ? false : input !== -1)),
          ),
        ),
      ),
    false,
    [selectedIndex],
  );

  return (
    <ContentContainer>
      <Box position="relative">
        <Box display="flex" justifyContent="center">
          <List className={classes.root}>
            {members.map((member, i) => (
              <Fragment key={member.id}>
                <ListItem
                  button
                  selected={i === selectedIndex}
                  alignItems="flex-start"
                  onClick={handleClick(i)}
                >
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={member.avatar_url} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.name}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          <GitHubIcon className={classes.icon} />
                          {` ${member.login} `}
                        </Typography>
                        {member.bio ? member.bio : null}
                      </>
                    }
                  />
                </ListItem>
                {i !== members.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </Fragment>
            ))}
          </List>
        </Box>
        <Zoom in={showFab} timeout={transitionDuration} unmountOnExit>
          <Fab
            color="primary"
            aria-label="tweet"
            className={classes.fab}
            component="a"
            href={
              selectedIndex !== -1 ? members[selectedIndex].twitter_url : '#'
            }
            target="_blank"
          >
            <TwitterIcon />
          </Fab>
        </Zoom>
      </Box>
    </ContentContainer>
  );
}
