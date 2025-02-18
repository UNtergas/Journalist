import ApiClient from "@/api/ApiClient";
import { Button, Box, Modal, Stack, Textarea, Group, Text, Timeline, ThemeIcon, Accordion, ScrollArea } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form";
import { ActivityDetailed, FeedbackDetailed, Role, ROLE } from "@shared/frontend"
import { IconBubbleText, IconBuildings, IconSchool } from "@tabler/icons-react";
import { useEffect, useState } from "react";


const SENDERICON = [
    {role: ROLE.COMPANY, icon: <IconBuildings/>, color: "blue"},
    {role: ROLE.TUTOR, icon: <IconSchool/>, color: "green"} 
];

const getSenderInfo = (role: Role) => {
    return SENDERICON.find(icon => icon.role === role);
}

interface ActivityFeedbackProps {
    activity: ActivityDetailed;
    canLeaveFeedback: boolean;
    triggerFeedback: (activity: ActivityDetailed) => void;
}


export const ActivityFeedback = (
    {activity, canLeaveFeedback, triggerFeedback}: ActivityFeedbackProps
) => {
    const [feedbacks, setFeedbacks] = useState<FeedbackDetailed[]>([]);

    const fetchFeedbacks = async () => {
        const feedback_ = await ApiClient.Activity.getFeedbacks(activity.id);
        setFeedbacks(feedback_);
    }
    useEffect(()=>{
        fetchFeedbacks();
    },[activity])
    return(
        <Accordion chevronPosition="left" variant="contained" chevron={<IconBubbleText/>}>
            <Accordion.Control >
                <Text size="lg" fw={700}> Activity Feedbacks ({activity.feedbacks.length})</Text>
            </Accordion.Control>
            <Accordion.Panel>
           {/* Feedback Section */}
           {feedbacks && feedbacks.length > 0 ? (
                <ScrollArea h={280}>
                {/* <Text size="lg" fw={700} mb="md">Feedbacks</Text> */}
                <Timeline mt="md" ml="md">
                    {feedbacks.map((feedback: FeedbackDetailed) => {
                        const icon = getSenderInfo(feedback.senderRole)?.icon;
                        const color = getSenderInfo(feedback.senderRole)?.color;
                        return(
                        <Timeline.Item key={feedback.id} bullet={
                            <ThemeIcon color={color} radius="xl" p={3} size="lg">
                                {icon}
                            </ThemeIcon>
                        }>
                            <Group key={feedback.id}>
                                <div>
                                    <Text size="sm">{feedback.senderName}</Text>
                                    <Text size="xs" c="gray">{new Date(feedback.createdAt).toLocaleDateString()}</Text>
                                </div>
                            
                            </Group>
                            <Text pl={10} pt="sm" size="sm">{feedback.content}</Text>
                        </Timeline.Item>
                    )})}
                </Timeline>
                </ScrollArea>
                ) : (
                    <p>No feedback available.</p>
                )}

            {/* Feedback Button (Only for COMPANY && Tutor Role) */}
            {canLeaveFeedback && <Button mt="sm" color="red" onClick={() => triggerFeedback(activity)}> 
                Add Feedback
                </Button>}
            </Accordion.Panel>
        </Accordion>
    )
}


interface FeedbackFormProps {
    showForm: boolean;
    setShowForm: (show: boolean) => void;
    loading: boolean;
    handleSubmit: (values: {content: string}) => void;
    form: UseFormReturnType<{content: string}>;
}

export const FeedbackForm = (
    {showForm, setShowForm, loading, handleSubmit, form}: FeedbackFormProps
) => {

    return(
        <Modal opened={showForm} onClose={() => setShowForm(false)} title="Create New Feedback" centered>
            <Box p="md"> 
                <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="sm">
                <Textarea
                    label="Feedback Content"
                    placeholder="Enter your feedback"
                    {...form.getInputProps("content")}
                />
                <Button color="red.1" type="submit" loading={loading} fullWidth>
                    Create Feedback
                </Button>
                </Stack>
                </form>
            </Box>
        </Modal>
    )
}
