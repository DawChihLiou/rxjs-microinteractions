import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Slide from '@material-ui/core/Slide';
import GitHubIcon from '@material-ui/icons/GitHub';
import { useEventCallback } from 'rxjs-hooks';
import {
  tap,
  switchMap,
  takeUntil,
  map,
  scan,
  withLatestFrom,
} from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';

import ContentContainer from '../components/ContentContainer';
import { author } from '../utils/author';

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
    listItem: {
      cursor: 'grab',
      '&:active': {
        cursor: 'grabbing',
      },
    },
  })
);

const trigger = (px: number): boolean => Math.abs(px) > 100;

const swipeMove = merge(
  fromEvent<React.TouchEvent>(document, 'touchmove'),
  fromEvent<React.MouseEvent>(document, 'mousemove')
);
const swipeEnd = merge(
  fromEvent<React.TouchEvent>(document, 'touchend'),
  fromEvent<React.MouseEvent>(document, 'mouseup')
);

export default function SwipeToDeletePage() {
  const classes = useStyles();

  const [handleSwipe, dx] = useEventCallback<
    React.TouchEvent | React.MouseEvent,
    number
  >(
    event$ =>
      event$.pipe(
        tap(startEvent => startEvent.persist()),
        switchMap(startEvent =>
          swipeMove.pipe(
            takeUntil(swipeEnd),
            map(event => {
              if (event.type === 'touchmove') {
                return (event as React.TouchEvent).targetTouches[0].clientX;
              }
              if (event.type === 'mousemove') {
                return (event as React.MouseEvent).clientX;
              }
            }),
            scan((acc, clientX) => {
              if (clientX === undefined) {
                return acc;
              }
              if (startEvent.type === 'touchstart') {
                return Math.round(
                  clientX -
                    (startEvent as React.TouchEvent).targetTouches[0].clientX
                );
              }
              if (startEvent.type === 'mousedown') {
                return Math.round(
                  clientX - (startEvent as React.MouseEvent).clientX
                );
              }
              return acc;
            }, 0)
          )
        )
      ),
    0
  );
  const [handleLastPosition, isIn] = useEventCallback<
    React.TouchEvent | React.MouseEvent,
    boolean,
    [number]
  >(
    (event$, state$) =>
      event$.pipe(
        tap(event => event.persist()),
        withLatestFrom(state$),
        map(([event, [delta]]) => (trigger(delta) ? false : true))
      ),
    true,
    [dx]
  );

  return (
    <ContentContainer>
      <Box
        height="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <List className={classes.root}>
          <Slide direction="left" in={isIn} mountOnEnter unmountOnExit>
            <div>
              <div
                onTouchStart={handleSwipe as (e: React.TouchEvent) => void}
                onTouchEnd={handleLastPosition as (e: React.TouchEvent) => void}
                onMouseDown={handleSwipe as (e: React.MouseEvent) => void}
                onMouseUp={handleLastPosition as (e: React.MouseEvent) => void}
                style={{
                  transform: `translateX(${dx}px)`,
                }}
              >
                <ListItem
                  button
                  alignItems="flex-start"
                  disableTouchRipple
                  disableRipple
                  className={classes.listItem}
                >
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={author.avatar_url} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={author.name}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          <GitHubIcon className={classes.icon} />
                          {` ${author.login} `}
                        </Typography>
                        {author.bio ? author.bio : null}
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            </div>
          </Slide>
        </List>
      </Box>
    </ContentContainer>
  );
}
