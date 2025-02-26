import { Button, Container, Group, Text, Title } from '@mantine/core';
import classes from './send-mail.module.css';
import Link from 'next/link';

export function NotFoundTitle() {
  return (
    <Container className={classes.root}>
      <div className={classes.label}>Mail sented</div>
      <Title className={classes.title}>Your request has been processed</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        To proceed with your request, please check your mail box and follow the instruction.
      </Text>
      <Group justify="center">
        <Button variant="subtle" size="md">
          <Link href='/'>
            Take me back to home page
          </Link>
        </Button>
      </Group>
    </Container>
  );
}
