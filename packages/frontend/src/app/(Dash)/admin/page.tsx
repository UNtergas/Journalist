'use client';
import { Alert, AppShell, Button, Flex, Group, Modal, Table, TextInput, Title } from "@mantine/core";
import { Header } from "@/container/header";
import { useEffect, useState } from "react";
import { APIException, emailValidator, User } from "@shared/frontend";
import { useForm } from "@mantine/form";
import ApiClient from "@/api/ApiClient";
import { toast } from "react-toastify";
import { UsersTable } from "@/components/adminTable";

const DEFAULT_SELLER_PASSWORD = 'azerty'

export default function AdminPage(){
    const [users,setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAdd,setIsAdd] = useState<"company" | "tutor" | null>(null);

    const form = useForm({
        initialValues:{
            name: '',
            email: '',
        },
        validate: {
            name: (value) => value.length > 0 ? null : 'Name is required',
            email: (value) => (emailValidator().test(value) ? null : 'Invalid email'),
        },
    });
    useEffect(() => {
        async function fetchUsers() {
            const users_ = await ApiClient.User.getAll();
            setUsers(users_);
        }
        fetchUsers();
    }, []);

    const addCompany = async (values: {name: string, email: string}) => {
        try{
            setLoading(true);
            await ApiClient.User.createCompany({
                name: values.name,
                email: values.email,
                password: DEFAULT_SELLER_PASSWORD
            });
            const updatedUsers = await ApiClient.User.getAll();
            setUsers(updatedUsers);
            setLoading(false);
            toast.success('Company added successfully');
            setIsAdd(null);
            form.reset();
        }catch(err){
            if(err instanceof APIException){
                setError(err.message);
            }
            setLoading(false);
        }
    }
    
    const addTutor = async (values: {name: string, email: string}) => {
        try{
            setLoading(true);
            await ApiClient.User.createTutor({
                name: values.name,
                email: values.email,
                password: DEFAULT_SELLER_PASSWORD
            });
            const updatedUsers = await ApiClient.User.getAll();
            setUsers(updatedUsers);
            setLoading(false);
            toast.success('Tutor added successfully');
            setIsAdd(null);
            form.reset();
        }catch(err){
            if(err instanceof APIException){
                setError(err.message);
            }
            setLoading(false);
        }
    }

    return(
        <AppShell
            header={{ height:20}}
        >
            <AppShell.Header>
                <Header
                    hasBurger={false}
                />
            </AppShell.Header>
            <AppShell.Main pt={'xl'}>
                <Flex direction={'column'} pt={'xl'}>
                    {/* Buttons Section */}
                    <Flex direction={'row'} justify="space-between" align="flex-start" mb={'xs'}>
                        <Title order={1} size="xl"> Manage Users</Title>
                        <Group>
                            <Button color="red" onClick={() => {setIsAdd("company")}}>Add Company</Button>
                            <Button color="red" onClick={() => {setIsAdd("tutor")}}>Add Tutor</Button>
                        </Group>
                    </Flex>
                    {/* User table section */}
                    <UsersTable users={users}/>
                    
                    {isAdd && (
                        <Modal
                            size={"md"}
                            opened={!!isAdd}
                            onClose={() => setIsAdd(null)}
                            closeOnClickOutside={false}
                            title={isAdd === "company" ? "Add Company" : "Add Tutor"}
                        >
                            <form
                                onSubmit={form.onSubmit((values) => {
                                    if (isAdd === "company") addCompany(values);
                                    else if (isAdd === "tutor") addTutor(values);
                                })}
                            >
                                <TextInput
                                    label="Name"
                                    placeholder="Enter name"
                                    {...form.getInputProps("name")}
                                />
                                <TextInput
                                    label="Email"
                                    placeholder="Enter email"
                                    {...form.getInputProps("email")}
                                />
                                <Button
                                    mt={"xs"}
                                    loading={loading}
                                    loaderProps={{ type: "dots" }}
                                    type="submit"
                                    disabled={loading}
                                >
                                    Add {isAdd === "company" ? "Company" : "Tutor"}
                                </Button>
                            </form>

                            {error && (
                                <Alert color="red" mt="md">
                                    {error}
                                </Alert>
                            )}

                            <Alert variant="light" color="blue" mt={"xl"} title="Notice">
                                The password for the new account is: <strong>{DEFAULT_SELLER_PASSWORD}</strong>
                                <br />
                                User is advised to change the password.
                            </Alert>
                        </Modal>
                    )}
                </Flex>
            </AppShell.Main>
        </AppShell>
        
    )
}
