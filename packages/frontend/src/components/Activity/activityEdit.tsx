import { Stack, TextInput, Textarea, Group, ActionIcon, Text } from "@mantine/core"
import { ActivityDetailed } from "@shared/frontend";
import { IconCheck, IconX } from "@tabler/icons-react"

interface ActivityEditProps {
    editActivity: ActivityDetailed;
    setEditActivity: (activity: ActivityDetailed) => void;
    updateActivity: (activity: ActivityDetailed) => void;
    cancelEditActivity: () => void;
}

export const ActivityEdit =(
    {editActivity, setEditActivity, updateActivity, cancelEditActivity}: ActivityEditProps
)=>{
    return(
        <Stack gap="xs" >
            <Text size="lg" fw={700}>Edit mode</Text>
            <TextInput
            label="Title"
            value={editActivity.title}
            onChange={(e) => setEditActivity({...editActivity, title: e.currentTarget.value})} 
            />
            <Textarea
            label="Description"
            value={editActivity.description}
            autosize={true}              
            onChange={(e) => setEditActivity({...editActivity, description: e.currentTarget.value})}
            />
            <Group>
            <ActionIcon color="green">
                <IconCheck onClick={() => updateActivity(editActivity)} />
            </ActionIcon>
            <ActionIcon color="red">
                <IconX onClick={cancelEditActivity} />
            </ActionIcon>
            </Group>
        </Stack>
    )
}