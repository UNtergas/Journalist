import { Illustration } from "@/styles/404.svg";
import { Container, Title, Group, Button, Text } from "@mantine/core";
import classes from "@/styles/notfound.module.css";
import Link from "next/link";
export default function NotFound() {
    return(
        <Container className={classes.root}>
            <div className={classes.inner}>
                <Illustration className={classes.image} />
                <div className={classes.content}>
                    <Title className={classes.title}>Nothing to see here</Title>
                    <Text c="dimmed" size="lg" ta="center" className={classes.description}>
                        Page you are trying to open does not exist. You may have mistyped the address, or the
                        page has been moved to another URL. If you think this is an error contact support.
                    </Text>
                    <Group justify="center">
                        <Button size="md">
                            <Link href="/">Take me back to home page</Link>
                        </Button>
                    </Group>
                </div>
            </div>
        </Container>
    )
}