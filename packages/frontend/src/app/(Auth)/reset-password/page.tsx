'use client';

import {
    Button,
    Container,
    Group,
    Paper,
    PasswordInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from '@/styles/auth.module.css';
import { APIException } from '@shared/frontend';
import { useRouter } from 'next/navigation';
import ApiClient from '@/api/ApiClient';
import { useState } from 'react';
import { toast } from 'react-toastify';


const REDIRECT_DELAY = 3000;

export default function AuthentificationPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const form = useForm({
        initialValues:{
            oldPassword: '',
            newPassword: '',
        },
        validate: {
            oldPassword: (value) => value.length > 0 ? null : 'Old password is required',
            newPassword: (value) => value.length > 0 ? null : 'New password is required',
        },
    });
    const handelSubmit = async ( values:{oldPassword:string,newPassword:string}) => {
        try{
            setLoading(true);
            await ApiClient.User.resetPassword(values.oldPassword, values.newPassword);
            // Show success notification
            // Show success notification with the same duration as redirection
            toast.success('Password changed successfully! Redirecting...', {
                autoClose: REDIRECT_DELAY,
            });

            setLoading(false);

            // Delay the redirection for the same duration
            setTimeout(() => {
                window.location.href = '/user';
            }, REDIRECT_DELAY);
        }catch(e){
            setLoading(false);
            if(e instanceof APIException){
                toast.error(e.message);
            }
        }
    }

    return (
        <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
            Password reset
        </Title>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <form onSubmit={form.onSubmit(handelSubmit)}>
                <PasswordInput label="Old Password" placeholder="Old password" required mt="md" {...form.getInputProps('oldPassword')} />
                <PasswordInput label="New Password" placeholder="New password" required mt="md" {...form.getInputProps('newPassword')} />
                <Group justify="space-between" mt="lg">
                </Group>
                <Button fullWidth mt="xl" color='red.1' loading={loading} loaderProps={{type: 'dots'}} type="submit">
                    Change password
                </Button>
            </form>
        </Paper>
        </Container>
    );
}