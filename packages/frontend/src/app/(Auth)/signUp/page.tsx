'use client';

import { useForm, zodResolver } from '@mantine/form';
import { APIException, RegisterDTO, } from '@shared/frontend';
import { useRouter } from 'next/navigation';
import ApiClient from '@/api/ApiClient';
import { useState } from 'react';
import { toast } from 'react-toastify';
import RegisterForm from '@/components/authForm/registerForm';
import { ConfirmedRegisterDTO, confirmedRegisterSchema } from '@/utils/registerSchema';

export default function AuthentificationPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validate: zodResolver(confirmedRegisterSchema),
  });
  const handleSubmit = async (values: RegisterDTO) => {
    try {
      setLoading(true);
      await ApiClient.Auth.signUp(values.name, values.email, values.password);
      setLoading(false);
      toast.success('Account created successfully', { autoClose: 2000 });

      setTimeout(() => {
        router.push('/send-mail-done');
      }, 2000);
    } catch (e) {
      setLoading(false);
      if (e instanceof APIException) {
        toast.warn(e.message);
      }
    }
  }

  return (
    <RegisterForm<ConfirmedRegisterDTO>
      loading={loading}
      handleSubmit={handleSubmit}
      form={form}
    />
  );
}




