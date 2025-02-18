import { Group, Text, Accordion, Button, ScrollArea, Card, SimpleGrid} from "@mantine/core"
import { ActivityDetailed, Phase, Skill } from "@shared/frontend";
import {  IconPencil, IconPlus } from "@tabler/icons-react"
import { ActivityFeedback } from "./activityFeedback";
import classes from "@/styles/accordian.module.css";
import { SkillCard } from "./skillCard";



interface AccordionLabelProps {
    title: string;
    date: Date;
  }
  
  function AccordionLabel({ title, date}: AccordionLabelProps) {
    return (
      <Group wrap="nowrap">
        <div>
            <Text size="lg" fw={700}>{title}</Text>
          <Text size="sm" c="dimmed" fw={400}>
            {new Date(date).toLocaleDateString()}
          </Text>
        </div>
      </Group>
    )
}

interface ActivityDisplayProps {
    activity: ActivityDetailed;
    canEditActivity: boolean;
    startEditActivity: (activity: ActivityDetailed) => void;
    triggerSkill: (activity: ActivityDetailed,phase: Phase) => void;
    canLeaveFeedback: boolean;
    triggerFeedback: (activity: ActivityDetailed) => void;
    triggerValidation: (activity: ActivityDetailed, skill: Skill) => void;
    canValidateSkill: boolean;
    phase: Phase;
}

export const ActivityDisplay = (
    {
        activity, 
        canEditActivity,
        startEditActivity,
        triggerSkill, 
        canLeaveFeedback, 
        triggerFeedback,
        canValidateSkill,
        triggerValidation,
        phase,
    }: ActivityDisplayProps
)=>{
    return(
        <div
            style={{
                width: "100%", // Ensures full width
                boxSizing: "border-box", // Includes padding and borders in width
            }}
        >

        <Accordion variant="separated" chevronPosition="left">
            <Accordion.Item className={classes.accordionItem} value={activity.id.toString()}>                
                <Accordion.Control>
                        <AccordionLabel title={activity.title} date={activity.date} />
                </Accordion.Control>
                <Accordion.Panel>
                    {/* <Group justify="center" grow={true} align="start" > */}
                    <SimpleGrid cols ={{base: 1, md: 2}} spacing="lg">
                        
                    
                    <div>

                    
                    <Text mt="xs">{activity.description}</Text>
                    <Text mt="xs" size="lg" fw={600} mb="lg">Technical Skills ({activity.skills.length})</Text>
                    <ScrollArea h={330}>
                        {
                            activity.skillsDetailed.length > 0 ? (
                            activity.skillsDetailed.map((skill,index) => {
                                return(
                                    <SkillCard
                                        key={index}
                                        skill={skill}
                                        activity={activity}
                                        canValidateSkill={canValidateSkill}
                                        triggerValidation={triggerValidation}
                                        index={index}
                                    />
                                )
                            })
                            ) : (
                                <Card shadow="sm" p="lg" radius="md" withBorder style={{width: "80%"}}>
                                    <Text size="md" ta="center" c="dimmed">
                                    No skills available for this activity.
                                    </Text>
                                </Card>
                            )
                        }
                    </ScrollArea>
                    <Group>
                        {canEditActivity && <Button color="blue" onClick={() => startEditActivity(activity)}>
                            <IconPencil/> Edit Activity
                            </Button>}
                        {canEditActivity && <Button color="red" onClick={() => triggerSkill(activity,phase)}>
                            <IconPlus/> Add Skill
                            </Button>}
                    </Group>
                    </div>
                    <ActivityFeedback
                        activity={activity}
                        canLeaveFeedback={canLeaveFeedback}
                        triggerFeedback={triggerFeedback}
                    />
                    </SimpleGrid>
                    {/* </Group> */}
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
        </div>
    )
}
