import { Container, Title, Anchor, Paper, TextInput, PasswordInput, Group, Button, Text } from "@mantine/core";
import Link from "next/link";
import classes from './auth.module.css';
import { UseFormReturnType } from "@mantine/form";


interface LoginFormProps<T> {
  loading: boolean,
  form: UseFormReturnType<T>;
  handleSubmit: (values: T) => void;
}

export default function LoginForm<T>(
  { loading, form, handleSubmit }: LoginFormProps<T>
) {
  return (
    <Container size={420} mt='xl'>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="gray.9" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button" c="red.5" className={classes.anchor}>
          <Link href={'/signUp'}>
            Create account
          </Link>
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Email" placeholder="you@email.fr" required {...form.getInputProps('email')} />
          <PasswordInput label="Password" placeholder="Your password" required mt="md" {...form.getInputProps('password')} />
          <Group justify="space-between" mt="lg">
            <Anchor component='button' size='sm'>
              <Link href='/send-mail'>Forgot-password</Link>
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" color='red.1' loading={loading} loaderProps={{ type: 'dots' }} type="submit">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
