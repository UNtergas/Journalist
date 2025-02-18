'use client';

import ApiClient from "@/api/ApiClient";
import { Accordion, Stack, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { APIException, Phase, PHASE, ROLE, Activity, LEVEL, skillPhaseMapping, SkillCreate, Level, MissionDetailed, ActivityDetailed, Skill, User } from "@shared/frontend";
import { IconBook, IconDirectionSign, IconProgressCheck } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { ActivityEdit } from "./activityEdit";
import { ActivityDisplay } from "./activityDisplay";
import { FeedbackForm } from "./activityFeedback";
import { SkillForm, SkillValidationForm } from "./activitySkill";

const PHASES = [
    {phase: PHASE.STUDY, icon: <IconBook/>}, 
    {phase:PHASE.ACTION, icon: <IconDirectionSign/>}, 
    {phase:PHASE.IMPROVEMENT, icon: <IconProgressCheck/>}];
    
interface ActivityProps {
    mission: MissionDetailed;
    currentUser : User;
    reloadMissions: () => Promise<void>;
}    
const ActivitySection = (
    {mission,reloadMissions,currentUser}:ActivityProps
) => {
    // Auth context
    // const { currentUser } = useAuth();
    //form state
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSkillForm, setShowSkillForm] = useState(false);
    const [showValidationForm, setShowValidationForm] = useState(false);
    // Current Action state
    const [currentActivity, setCurrentActivity] = useState<ActivityDetailed | null>(null);
    const [isEditActivity, setIsEditActivity] = useState(false);
    const [editActivity, setEditActivity] = useState<ActivityDetailed | null>(null);
    const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
    const [currentPhase, setCurrentPhase] = useState<Phase>(PHASE.STUDY);
    // Authroization
    const role = currentUser?.role;
    const canLeaveFeedback = (role === ROLE.COMPANY || role === ROLE.TUTOR);
    const canEditActivity = (role === ROLE.STUDENT);
    const canValidateSkill = (role === ROLE.TUTOR);
    // Function to filter activities by phase
    const getActivitiesByPhase = (phase:Phase) => 
        mission.activitiesDetailed.filter(activity => activity.phase === phase);

    //Feedback form info
    const feedbackForm = useForm({
        initialValues: {
            content: '',
        },
        validate: {
            content: (value) => value.length > 0 ? null : 'Title is required',
        },
    })

    const handleFeedbackSubmit = async (values: {content:string}) =>{
        try{
            setLoading(true);
            if (currentUser && currentActivity) {
            await ApiClient.Activity.createFeedback({
                content: values.content,
                activityId: currentActivity.id,
            });
            toast.success('Feedback created successfully');
            setShowForm(false);
            await reloadMissions();
            feedbackForm.reset();
            setLoading(false);
            } else {
            toast.warn("Current user or activity is not available.");
            }
        }catch(e){
            if(e instanceof APIException){
                toast.warn(e.message);
            }
        }
    }

    // Skill Form
    const skillForm = useForm({
        initialValues: {
            description: '',
            level: LEVEL.BASIC as Level,
            type: skillPhaseMapping[PHASE.STUDY][0],
        },
        validate: {
            description: (value) => value.length > 0 ? null : 'Description is required',
        },
    })

    const handleSkillSubmit = async (values: SkillCreate,activityId:number) => {
        try{
            setLoading(true);
            await ApiClient.Activity.updateActivity(activityId,{
                skillDescription: values.description,
                skillLevel: values.level,
                skillType: values.type,
            })
            toast.success('Skill created successfully');
            setShowForm(false);
            await reloadMissions();
            skillForm.reset();
            setLoading(false);
      
        }catch(e){
            if(e instanceof APIException){
                toast.warn(e.message);
            }
        }
    }
    const handleSkillFormSubmit = async (values: SkillCreate) => {
        if(currentActivity && currentUser){
            await handleSkillSubmit(values,currentActivity.id);
        }else{
            toast.warn("Current user or activity is not available.");
        }
    }

    //Skill Validation Form

    const skillValidationForm = useForm({
        initialValues: {
            validatedLevel: LEVEL.BASIC as Level,
        }
    })

    const handleSkillValidationSubmit = async (values: {validatedLevel:Level}) => {
        try{
            if (currentUser && currentActivity && currentSkill) {
                await ApiClient.Activity.createValidation({
                    apprenticeId: currentActivity.apprenticeId,
                    skillId: currentSkill.id,
                    validatedLevel: values.validatedLevel,
                });
                toast.success('Skill validated successfully');
                setShowValidationForm(false);
                await reloadMissions();
                skillValidationForm.reset();
                setLoading(false);
            } else {
                toast.warn("Current user or activity is not available.");
            }
        }catch(e){
            if(e instanceof APIException){
                toast.warn(e.message);
            }
        }
    }


    // Form triggers
    const triggerFeedback = (activity:ActivityDetailed) => {
        setCurrentActivity(activity);
        setShowForm(true);
    }
    const triggerSkill = (activity:ActivityDetailed, phase: Phase) => {
        setCurrentPhase(phase);
        setCurrentActivity(activity);
        setShowSkillForm(true);
    }
    const triggerValidation = (activity:ActivityDetailed, skill: Skill) => {
        setCurrentSkill(skill);
        setCurrentActivity(activity);
        setShowValidationForm(true);
    }

    /// Edit Activity
    const startEditActivity = (activity:ActivityDetailed) => {
        setEditActivity(activity);
        setIsEditActivity(true);
    }

    const cancelEditActivity = () => {
        setEditActivity(null);
        setIsEditActivity(false);
    }

    const updateActivity = async (activity:Activity) => {
        if(!editActivity) return
        try{
            setLoading(true);
            await ApiClient.Activity.updateActivity(activity.id,{
            title: editActivity.title,
            description: editActivity.description,
            });
            toast.success('Activity updated successfully');
            await reloadMissions();
            cancelEditActivity();
            setLoading(false);
        }catch(e){
            if(e instanceof APIException){
                toast.warn(e.message);
            }
        }
    }

    return(    
        // <>{currentUser ? (    
        <div>
            <Title order={3} mt="md">Activities</Title>
            <Accordion variant="contained" mt="sm">
                {PHASES.map(
                    ({phase,icon},phaseIndex) => {
                        const phaseActivities = getActivitiesByPhase(phase);
                        return(
                            <Accordion.Item key={phaseIndex} value={phase}>
                                <Accordion.Control>{icon}{phase}</Accordion.Control>
                                <Accordion.Panel>
                                    {phaseActivities.length > 0 ? (
                                    <>
                                        <Stack align="stretch" justify="center">
                                            {phaseActivities.map((activity:ActivityDetailed,index) => (
                                                <div key={index}
                                                >
                                                    {
                                                    isEditActivity && editActivity?.id === activity.id ? (
                                                        <ActivityEdit
                                                            editActivity={editActivity}
                                                            setEditActivity={setEditActivity}
                                                            updateActivity={updateActivity}
                                                            cancelEditActivity={cancelEditActivity}
                                                            />
                                                        ):(
                                                        <ActivityDisplay
                                                        activity={activity}
                                                        canEditActivity={canEditActivity}
                                                        startEditActivity={startEditActivity}
                                                        triggerSkill={triggerSkill}
                                                        phase={phase}
                                                        canLeaveFeedback={canLeaveFeedback}
                                                        triggerFeedback={triggerFeedback}
                                                        canValidateSkill={canValidateSkill}
                                                        triggerValidation={triggerValidation}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </Stack>
                                    </>
                                    ):(
                                        <p>No activities for this phase.</p>
                                    )}
                                </Accordion.Panel>
                            </Accordion.Item>
                        )
                    }
                )}
            </Accordion>

            {/* Feedback Form */}
            <FeedbackForm
                showForm={showForm}
                setShowForm={setShowForm}
                loading={loading}
                handleSubmit={handleFeedbackSubmit}
                form={feedbackForm}
            />
            {/* Skill Form */}
            <SkillForm
                showForm={showSkillForm}
                setShowForm={setShowSkillForm}
                loading={loading}
                handleSubmit={handleSkillFormSubmit}
                form={skillForm}
                currentPhase={currentPhase}
            />
            {/* Skill Validation Form */}
            <SkillValidationForm
                showForm={showValidationForm}
                setShowForm={setShowValidationForm}
                loading={loading}
                handleSubmit={handleSkillValidationSubmit}
                form={skillValidationForm}
            />
        </div>
        // ):(
        //         <div>Unauthorized</div>
        //     )}
        // </>
    )
};
export default ActivitySection;