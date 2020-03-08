import React from 'react';
import ContentContainer from '../components/ContentContainer';
import { Typography, Box } from '@material-ui/core';
import { useObservable } from 'rxjs-hooks';
import { timer } from 'rxjs';
import { take, map } from 'rxjs/operators';

const messages: string[] = [
  'Server received your request.',
  'Server is processing your request.',
  'Checking database.',
  'Updating database.',
  'It looks like it is taking longer than usual.',
  'Ok, so...',
  'What would a Zero ask an Eight?',
  'Guess!',
  '...Where did you buy the belt?',
  'Your request is almost done. Please wait.',
];

export default function LoadingStatePage() {
  const text = useObservable(
    () =>
      timer(0, 3000).pipe(
        take(10),
        map(number => messages[number]),
      ),
    '',
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
        <Typography>Loading...</Typography>
        <Typography variant="body2" color="textSecondary">
          {text}
        </Typography>
      </Box>
    </ContentContainer>
  );
}
