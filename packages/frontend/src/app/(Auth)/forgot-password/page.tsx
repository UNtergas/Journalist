'use client';

import { IconArrowLeft } from '@tabler/icons-react';
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import classes from './forgot-password.module.css';
import Link from 'next/link';
import { useForm, zodResolver } from '@mantine/form';
import { APIException, SendForgetPasswordDTO, sendForgetPasswordSchema } from '@shared/frontend';
import { useState } from 'react';
import ApiClient from '@/api/ApiClient';
import { toast } from 'react-toastify';
export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: ''
    },
    validate: zodResolver(sendForgetPasswordSchema),
  })
  const handleSubmit = async (values: SendForgetPasswordDTO) => {
    try {
      setLoading(true);
      await ApiClient.Auth.sendMail(values.email);
      setLoading(false);
      window.location.href = '/send-mail-done';
    } catch (e) {
      console.log(e);
      setLoading(false);
      if (e instanceof APIException) {
        toast.warn(e.message);
      }
    }
  }
  return (
    <Container size={460} my={30}>
      <Title className={classes.title} ta="center">
        Forgot your password?
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Your email" placeholder="email@journalist.dev" required {...form.getInputProps('email')} />
          <Group justify="space-between" mt="lg" className={classes.controls}>
            <Anchor c="dimmed" size="sm" className={classes.control} href='/signIn' component={Link}>
              <Center inline>
                <IconArrowLeft size={12} stroke={1.5} />
                <Box ml={5}>
                  Back to the login page
                </Box>
              </Center>
            </Anchor>
            <Button className={classes.control} loading={loading} type='submit'>Reset password</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
