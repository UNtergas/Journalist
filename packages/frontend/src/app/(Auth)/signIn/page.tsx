'use client';

import {
    Anchor,
    Button,
    Container,
    Group,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from '@/styles/auth.module.css';
import { APIException, SignInDTO, emailValidator } from '@shared/frontend';
import { useRouter } from 'next/navigation';
import ApiClient from '@/api/ApiClient';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useAuth } from '@/auth.context';
export default function AuthentificationPage() {
    const {signIn} = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const form = useForm({
        initialValues:{
            email: '',
            password: '',
        },
        validate: {
            email: (value) => (emailValidator().test(value) ? null : 'Invalid email'),
            password: (value) =>
                value.length > 0 ? null : 'Password is required',
        },
    });
    const handleSubmit = async ( values: SignInDTO) => {
        try{
            setLoading(true);
            // await ApiClient.Auth.signIn(values.email, values.password);
            await signIn(values.email, values.password);
            setLoading(false);
            window.location.href = '/user';
            // router.push('/user');
        }catch(e){
            setLoading(false);
            if(e instanceof APIException){
                toast.warn(e.message);
            }
        }
    }

    return (
        <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
            Welcome back!
        </Title>
        <Text c="gray.9" size="sm" ta="center" mt={5}>
            Do not have an account yet?{' '}
            <Anchor size="sm" component="button" c="gruvbox.1" className={classes.anchor}>
                <Link href={'/signUp'}>
                    Create account
                </Link>
            </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput label="Email" placeholder="you@insa.fr" required {...form.getInputProps('email')}/>
                <PasswordInput label="Password" placeholder="Your password" required mt="md" {...form.getInputProps('password')} />
                <Group justify="space-between" mt="lg">
                </Group>
                <Button fullWidth mt="xl" color='red.1' loading={loading} loaderProps={{type: 'dots'}} type="submit">
                    Sign in
                </Button>
            </form>
        </Paper>
        </Container>
    );
}