'use client';

import {
    Button,
    Container,
    Group,
    Paper,
    PasswordInput,
    Title,
    Text,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import classes from '@/components/authForm/auth.module.css';
import { APIException } from '@shared/frontend';
import { useSearchParams } from 'next/navigation';
import ApiClient from '@/api/ApiClient';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { confirmedResetPasswordSchema } from '@/utils/resetPassword';


const REDIRECT_DELAY = 3000;

export default function AuthentificationPage() {
  const secretParams = useSearchParams();
  const secret = secretParams.get('secret');
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode:'uncontrolled',
    initialValues:{
      password: '',
      confirmPassword: ''
    },
    validate: zodResolver(confirmedResetPasswordSchema),
  });
  if(!secret){
    return(
      <NoParamsError/>
    )
  }else{
    const handleSubmit = async ( values:{password:string,confirmPassword:string}) => {
      try{
        setLoading(true);
        console.log(secret);
        await ApiClient.User.resetPassword(secret,values.password);
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
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <PasswordInput label="password" placeholder="New password" required mt="md" {...form.getInputProps('password')} />
            <PasswordInput label="Confirm password" placeholder="New password" required mt="md" {...form.getInputProps('confirmPassword')} />
            <Button fullWidth mt="xl" color='red.1' loading={loading} loaderProps={{type: 'dots'}} type="submit">
                Change password
            </Button>
          </form>
        </Paper>
      </Container>
    );
  }
}



const NoParamsError= () =>{
  return(
    <Container className={classes.root}>
    <div className={classes.label}>Missing Params</div>
    <Title className={classes.title}>Non accessible directly</Title>
    <Text c="dimmed" size="lg" ta="center" className={classes.description}>
      This page should not be accesses directly with url. To reset password, return to the signIn page and click on 
      Forget password and follow the instruction
    </Text>
    <Group justify="center">
      <Button variant="subtle" size="md">
        <Link href='/'>
          Take me back to home page
        </Link>
      </Button>
    </Group>
  </Container>
  )
}
  
  
// const ResetPassError= () =>{
//   return(
//     <Container className={classes.root}>
//     <div className={classes.label}>Verify Email Failed</div>
//     <Title className={classes.title}>Something has gone wrong when we tried to verify your email</Title>
//     <Text c="dimmed" size="lg" ta="center" className={classes.description}>
//       Please retry later or contain the page 
//     </Text>
//     <Group justify="center">
//       <Button variant="subtle" size="md">
//         <Link href='/'>
//           Take me back to home page
//         </Link>
//       </Button>
//     </Group>
//   </Container>
//   )
// }