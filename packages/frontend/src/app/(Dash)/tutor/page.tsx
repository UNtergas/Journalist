'use client';
import { Header } from "@/container/header";
import { AppShell } from "@mantine/core";
import { DashBoardTutor } from "@/container/dashboardTutor";
import { useAuth } from "@/auth.context";
import { APIException, emailValidator, MissionDetailed } from "@shared/frontend";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import ApiClient from "@/api/ApiClient";
import { toast } from "react-toastify";
import { MissionBlock } from "@/components/missionBlock";
import { ApprenticeLinkForm } from "@/components/apprenticeLinkForm";
import { useDisclosure } from "@mantine/hooks";
export default function TutorPage(){
    const {currentUser} = useAuth();
    const [currentMission, setCurrentMission] = useState<MissionDetailed | null>(null);
    const [missions, setMissions] = useState<MissionDetailed[]>([]);
    const [showInfo, setShowInfo] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [opened, { toggle }] = useDisclosure();

    const apprenticeForm= useForm({
        initialValues:{
            apprenticeEmail: '',
        },
        validate: {
            apprenticeEmail: (value) => emailValidator().test(value) ? null : 'Invalid email',
        },
    })
    const fetchMissions = async () => {
        const missions_ = (await ApiClient.Apprentice.getApprenticesByTutor()).flatMap(apprentice => apprentice.mission_apprenticeDetailed);
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

    const handleApprenticeFormSubmit = async (values: {apprenticeEmail: string}) => {
        try{
            setLoading(true);
            await ApiClient.Apprentice.setTutorat(values.apprenticeEmail);
            const updatedMissions= await ApiClient.Activity.getMissions();
            setLoading(false);
            toast.success('Apprentice linked successfully');
            setMissions(updatedMissions);
            setShowForm(false);
            apprenticeForm.reset();
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
                        <DashBoardTutor 
                            missions={missions} 
                            formCallBack={() => setShowForm(true)} 
                            missionCallBack={missionCallBack} 
                            role={currentUser.role}
                        />
                    </AppShell.Navbar>
                    <AppShell.Main>
                        {/* Form Modal */}
                        <ApprenticeLinkForm 
                            showForm={showForm} 
                            setShowForm={setShowForm} 
                            loading={loading} 
                            form={apprenticeForm} 
                            handleSubmit={handleApprenticeFormSubmit}
                        />
                        {/* Mission Info */}
                        {showInfo && 
                        <MissionBlock 
                            mission={currentMission} 
                            onClose={()=> setShowInfo(false)} 
                            reloadMissions={fetchMissions}
                            currentUser={currentUser}
                        />}
                    </AppShell.Main>
                </AppShell>
                ):(
                    <div>Unauthorized</div>
                )}
            </>
        )
}