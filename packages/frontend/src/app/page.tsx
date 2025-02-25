'use-client'
import { Container, Title, Text, Group, Button, Image, Flex } from "@mantine/core";
import classes from './home-page.module.css'
import image from '../../public/tree.png'
import { IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";

export default function Home() {
  return (
    <Container size='md'>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Flex gap='xl'>   
            <Group>
              <Title className={classes.title}>
                An <span className={classes.highlight}> interactive</span> journal website <br /> that
                you can track your working progress.
              </Title>
              <Text c="dimmed" mt="md">
                Support end to end data encryption with a fun playground to visualize your task
                into missions and rewards.
              </Text>
              <Group mt={30}>
                <Button radius='xl' size="md" className={classes.control}>
                  <Link href="/user">Start now</Link>
                </Button>
                <Button variant="default" radius='xl' size="md" className={classes.control} leftSection={<IconBrandGithub size={16}/>}>
                  <a href="https://github.com/UNtergas/Journalist">
                    Github
                  </a>
                </Button>
              </Group>
            </Group>
            <Image src={image.src} className={classes.image} alt="hero"/>
          </Flex>
        </div>
      </div>
    </Container>
  );
}
