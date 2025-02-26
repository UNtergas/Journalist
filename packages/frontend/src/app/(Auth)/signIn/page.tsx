'use client';

import { zodResolver } from 'mantine-form-zod-resolver';
import { useForm } from '@mantine/form';
import { APIException, SignInDTO, signInSchema } from '@shared/frontend';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '@/auth.context';
import LoginForm from '@/components/authForm/loginForm';

export default function AuthentificationPage() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(signInSchema),
  });

  const handleSubmit = async (values: SignInDTO) => {
    try {
      setLoading(true);
      await signIn(values.email, values.password);
      setLoading(false);
      window.location.href = '/user';
    } catch (e) {
      setLoading(false);
      if (e instanceof APIException) {
        toast.warn(e.message);
      }
    }
  }

  return (
    <LoginForm<SignInDTO>
      loading={loading}
      handleSubmit={handleSubmit}
      form={form}
    />
  );
}
