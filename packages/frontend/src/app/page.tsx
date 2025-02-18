import Image from 'next/image';
import { Button, Container, Group } from '@mantine/core';
import Link from 'next/link';
import classes from '@/styles/home.module.css';

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh', // Full screen height
        minWidth: '100vw',  // Full screen width
        position: 'relative',
        overflow: 'hidden', // Prevent scrollbars
      }}
    >
      {/* Blurred Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('/homepage.png') no-repeat center center fixed",
          backgroundSize: 'cover',
          filter: 'blur(10px)', // Adjust the blur intensity
          zIndex: -1, // Ensure it's behind all content
        }}
      ></div>

      {/* Main Content */}
      <Container fluid className={classes.root}>
        {/* Logo in the top-left corner */}
        <div className={classes.logo}>
          <Image src="/logo.png" alt="Logo" width={120} height={80} />
        </div>

        {/* Button row */}
        <div className={classes.buttonArea}>
          <Group align="center" justify="center" gap="xl">
            <Button size="xl" radius="sm" variant="filled" color="red.2">
              <Link href="/user">ÉTUDIANTS</Link>
            </Button>
            <Button size="xl" radius="sm" variant="filled" color="red.2">
              <Link href="/tutor">ENSEIGNANTS</Link>
            </Button>
            <Button size="xl" radius="sm" variant="filled" color="red.2">
              <Link href="/company">ENTREPRISES</Link>
            </Button>
            <Button size="xl" radius="sm" variant="filled" color="red.2">
              <Link href="/admin">ADMINISTRATION</Link>
            </Button>
          </Group>
        </div>
      </Container>
    </div>
  );
}
