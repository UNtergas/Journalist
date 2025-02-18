'use client';

import ApiClient from "@/api/ApiClient";
import { useAuth } from "@/auth.context";
import { MissionBlock, MissionForm } from "@/components/missionBlock";
import { DashBoardCompany } from "@/container/dashboardCompany";

import { Header } from "@/container/header";
import { AppShell, Burger } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { APIException, emailValidator, MissionCreateRequest, MissionDetailed } from "@shared/frontend";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CompanyPage(){
    const { currentUser } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [currentMission, setCurrentMission] = useState<MissionDetailed | null>(null);
    const [missions, setMissions] = useState<MissionDetailed[]>([]);
    const [loading, setLoading] = useState(false);
    const [opened, { toggle }] = useDisclosure();
    

    // Mission Info
    const form = useForm({
        initialValues: {
            title: '',
            description: '',
            semester: '',
            apprenticeEmail: '',
        },
        validate: {
            title: (value) => value.length > 0 ? null : 'Title is required',
            description: (value) => value.length > 0 ? null : 'Description is required',
            semester: (value) => value.length > 0 ? null : 'Semester is required',
            apprenticeEmail: (value) => emailValidator().test(value) ? null : 'Invalid email',
        },
    })
    const fetchMissions = async () => {
        const missions_ = await ApiClient.Activity.getMissions();
        setMissions([...missions_]);
        if (currentMission) {
            const updatedMission = missions_.find(m => m.id === currentMission.id);
            setCurrentMission(updatedMission ? { ...updatedMission } : null); // Trigger hierarchy update in MissionBlock
        }
    };

    useEffect(() => {
        fetchMissions();
    }, []);

    const missionCallBack = (mission: MissionDetailed) => {
        setCurrentMission(mission);
        setShowInfo(true);
        toggle();
    }

    const handleSubmit = async (values: MissionCreateRequest) => {
        try{
            setLoading(true);
            await ApiClient.Company.createMission(values);
            const updatedMissions = await ApiClient.Activity.getMissions();
            setLoading(false);
            toast.success('Mission created successfully');
            setMissions(updatedMissions);
            setShowForm(false);
            form.reset();
        }catch(e){
            setLoading(false);
            if(e instanceof APIException){
                toast.warn(e.message);
            }
        }
    }
    return(
        <>{currentUser ? (
            <AppShell 
                header={{height: 60}} 
                navbar={{
                    width: 320, 
                    breakpoint: 'sm',
                    collapsed: { mobile: !opened },
                }}
                padding="md"
            >
                <AppShell.Header>
                    <Header 
                        hasBurger={true}
                        opened={opened}
                        toggle={toggle}
                    />
                </AppShell.Header>
                <AppShell.Navbar>
                    <DashBoardCompany missions={missions} formCallBack={() => setShowForm(true)} missionCallBack={missionCallBack} role={currentUser.role} />
                </AppShell.Navbar>
                <AppShell.Main>
                    {/* Form Modal */}
                    <MissionForm 
                        showForm={showForm} 
                        setShowForm={setShowForm} 
                        loading={loading} 
                        form={form} 
                        handleSubmit={handleSubmit}
                    />
                    {/* Mission Info */}
                    {showInfo && <MissionBlock mission={currentMission} onClose={()=> setShowInfo(false)} reloadMissions={fetchMissions} currentUser={currentUser}/>}
                </AppShell.Main>
            </AppShell>
            ):(
                <div>Unauthorized</div>
            )}
        </>
    )
}