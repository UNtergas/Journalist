import { Card, Group, Badge, Text, Button, Tooltip } from "@mantine/core";
import { ActivityDetailed, Skill } from "@shared/frontend";
import { IconBadgeFilled, IconCheck } from "@tabler/icons-react";


interface SkillCardProps {
    skill: Skill;
    activity: ActivityDetailed;
    canValidateSkill: boolean;
    triggerValidation: (activity: ActivityDetailed, skill: Skill) => void;
    index: number;
}

export const SkillCard = ({ skill, activity, canValidateSkill, triggerValidation, index}:SkillCardProps) => {
  return (
        <Card key={index} shadow="lg" p="lg" radius="md" mb="xs" withBorder style={{ width: "80%" }}>
          <Group justify="space-between" align="center" mb="xs">
            {/* Skill Type and Level */}
            <Group>
              <Badge size="lg" color="green" variant="filled">
                {skill.level}
              </Badge>
              <Text size="md" fw={700} c="gruvbox.9">
                {skill.type}
              </Text>
            </Group>

            {/* Validation Section */}
            {skill.validation ? (
              <Group gap="xs">
                <Badge
                  size="lg"
                  color="orange"
                  leftSection={<IconBadgeFilled size={16} />}
                >
                  Validated: {skill.validation.validatedLevel}
                </Badge>
                <Tooltip label={`Validated at ${new Date(skill.validation.validatedAt).toLocaleDateString()}`}>
                  <Text size="sm" c="dimmed">
                    {new Date(skill.validation.validatedAt).toLocaleDateString()}
                  </Text>
                </Tooltip>
              </Group>
            ) : (
              canValidateSkill && (
                <Button
                  size="xs"
                  color="blue"
                  onClick={() => triggerValidation(activity, skill)}
                  leftSection={<IconCheck />}
                >
                  Validate
                </Button>
              )
            )}
          </Group>

          {/* Skill Description */}
          {skill.description && (
            <Text size="sm" c="dimmed" mt="sm">
              {skill.description}
            </Text>
          )}
        </Card>
  );
};