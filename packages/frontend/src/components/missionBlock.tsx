import { Card, Group, Title, Badge, Divider, Blockquote, Text, ActionIcon, Box, Button, Modal, Stack, Textarea, TextInput } from "@mantine/core";
import { IconTarget, IconX } from "@tabler/icons-react";
import { MissionCreateRequest, MissionDetailed, User } from "@shared/frontend";
import { ApprenticeEmailSearch } from "./apprenticeMailSearch";
import { UseFormReturnType } from "@mantine/form";
import ActivitySection from "./Activity/main";

interface MissionBlockProps {
  mission: MissionDetailed | null;
  onClose: () => void; // Callback when closing the card
  reloadMissions: () => Promise<void>; // Callback to reload missions
  currentUser: User;
}

export function MissionBlock({ mission, onClose, reloadMissions,currentUser }: MissionBlockProps) {
  if (!mission) {
    return (
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Text>
          No mission selected
        </Text>
      </Card>
    );
  }
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      {/* Title and Semester */}
      <Group gap='md' justify='space-between'>
        <Group gap='md'>
          <Title order={3}>{mission.title}</Title>
          <Badge color="blue">{mission.semester}</Badge>
        </Group>
        <ActionIcon size="sm" variant="subtle" onClick={onClose}>
          <IconX size={18} />
        </ActionIcon>
      </Group>

      <Divider my="sm" />

      {/* Description in Blockquote */}
      <Blockquote m="md" color="blue" icon={<IconTarget size={20} />} bg="gray.0">
        {mission.description}
      </Blockquote>

      {/* Activities Section */}
      <ActivitySection mission={mission} reloadMissions={reloadMissions} currentUser={currentUser}/>
    </Card>
  );
}

interface MissionFormProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  loading: boolean;
  form: UseFormReturnType<MissionCreateRequest>;
  handleSubmit: (values: MissionCreateRequest) => void;
}

export const MissionForm = (
  { showForm, setShowForm, loading, form, handleSubmit }: MissionFormProps
) => {
  return(
    <Modal opened={showForm} onClose={() => setShowForm(false)} title="Create New Mission" centered>
      <Box p="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">

              <TextInput
              label="Title"
              placeholder="Enter mission title"
              {...form.getInputProps("title")}
              />

              <Textarea
              label="Description"
              placeholder="Enter mission description"
              {...form.getInputProps("description")}
              />

              <TextInput
              label="Semester"
              placeholder="e.g., Spring 2025"
              {...form.getInputProps("semester")}
              />
              
              <ApprenticeEmailSearch
                  setFormApprenticeEmail={(email) => form.setFieldValue("apprenticeEmail", email)}
              />

              <Button color="red.1" type="submit" loading={loading} fullWidth>
              Create Mission
              </Button>
          </Stack>
          </form>
      </Box>
  </Modal>
  )
}

