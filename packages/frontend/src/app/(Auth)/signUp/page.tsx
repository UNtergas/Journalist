'use client';

import {
    Button,
    Container,
    Group,
    Paper,
    PasswordInput,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from '@/styles/auth.module.css';
import { APIException, emailValidator, RegisterDTO } from '@shared/frontend';
import { useRouter } from 'next/navigation';
import ApiClient from '@/api/ApiClient';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function AuthentificationPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const form = useForm({
        initialValues:{
            name: '',
            email: '',
            password: '',
        },
        validate: {
            name: (value) => value.length > 0 ? null : 'Name is required',
            email: (value) => (emailValidator().test(value) ? null : 'Invalid email'),
            password: (value) =>
                value.length > 0 ? null : 'Password is required',
        },
    });
    const handelSubmit = async ( values: RegisterDTO) => {
        try{
            setLoading(true);
            await ApiClient.Auth.signUp(values.name,values.email, values.password);
            setLoading(false);
            toast.success('Account created successfully',{ autoClose: 2000 });
            
            setTimeout(() => {
                router.push('/signIn');
            }, 2000);
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
            Create an account
        </Title>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <form onSubmit={form.onSubmit(handelSubmit)}>
                <TextInput label="Name" placeholder="john" required {...form.getInputProps('name')}/>
                <TextInput label="Email" placeholder="email@insa.com" required {...form.getInputProps('email')}/>
                <PasswordInput label="Password" placeholder="Your password" required mt="md" {...form.getInputProps('password')} />
                <Group justify="space-between" mt="lg">
                </Group>
                <Button fullWidth mt="xl" color='red.1' loading={loading} loaderProps={{type: 'dots'}} type="submit">
                    Sign Up
                </Button>
            </form>
        </Paper>
        </Container>
    );
}