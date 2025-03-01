import { Container, Title, Paper, TextInput, PasswordInput, Button } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import classes from './auth.module.css';

interface RegisterFormProps<T> {
  loading: boolean;
  form: UseFormReturnType<T>;
  handleSubmit: (values: T) => void;
}


export default function RegisterForm<T>(
  {
    loading,
    form,
    handleSubmit,
  }: RegisterFormProps<T>
) {
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Create an account
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Name" placeholder="john" required {...form.getInputProps('name')} />
          <TextInput label="Email" placeholder="email@insa.com" required {...form.getInputProps('email')} />
          <PasswordInput label="Password" placeholder="Your password" required mt="md" {...form.getInputProps('password')} />
          <PasswordInput label="Confirm password" placeholder="Your password" required mt= 'md' {...form.getInputProps('confirmPassword')} />
          <Button fullWidth mt="xl" loading={loading} loaderProps={{ type: 'dots' }} type="submit">
            Sign Up
          </Button>
        </form>
      </Paper>
    </Container>
  )
}