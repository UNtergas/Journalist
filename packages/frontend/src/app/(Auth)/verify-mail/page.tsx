'use client'

import { Button, Container, Group, Text, Title } from '@mantine/core';
import classes from './verify-mail.module.css';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ApiClient from '@/api/ApiClient';
import { APIException } from '@shared/frontend';

export default function VerifyMail() {
  const secretParams = useSearchParams();
  const secret = secretParams.get('secret');

  if(!secret){
    <NoParamsError/>
  }else{
    const [err,setErr] = useState<string>('');
    useEffect(()=>{
      const verifyEmail = async() =>{
        try{
          await ApiClient.Auth.verifyMail(secret);
        } catch (e){
          if(e instanceof APIException){
            setErr(e.message);
          }
        }
      }
      verifyEmail();
    },[])
    if(err){
      return(
        <VerifyError/>
      )
    }
    return (
      <Container className={classes.root}>
        <div className={classes.label}>Mail Verified</div>
        <Title className={classes.title}>Your request has been processed</Title>
        <Text c="dimmed" size="lg" ta="center" className={classes.description}>
          Your account is verified, now you can login using your credentials
        </Text>
        <Group justify="center">
          <Button variant="subtle" size="md">
            <Link href='/signIn'>
              Go To Login Page
            </Link>
          </Button>
        </Group>
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
      This page should not be accesses directly with url. To verify your email, please check your inbox for verification email.
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


const VerifyError= () =>{
  return(
    <Container className={classes.root}>
    <div className={classes.label}>Verify Email Failed</div>
    <Title className={classes.title}>Something has gone wrong when we tried to verify your email</Title>
    <Text c="dimmed" size="lg" ta="center" className={classes.description}>
      Please retry later or contain the page 
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