import { Group, Code, ScrollArea, List, Button, Divider } from "@mantine/core";
import { IconBackpack, IconBook, IconBuildings, IconDirectionSign, IconLicense, IconPencil, IconProgressCheck, IconSchool, IconUser } from "@tabler/icons-react";
import classes from "@/styles/dashboard.module.css";
import { ApprenticeDetailed, MissionDetailed, PHASE, ROLE, Role } from "@shared/frontend";
import { LinkItem, LinksGroup } from "@/components/linkgroup";
import { useEffect, useState } from "react";
import ApiClient from "@/api/ApiClient";


const ICON = {
    [ROLE.COMPANY]: <IconBuildings />,
    [ROLE.STUDENT]: <IconBackpack/>,
    [ROLE.TUTOR]: <IconSchool />,
}

const PHASES = [
    {phase: PHASE.STUDY, icon: IconBook, label: "Study"}, 
    {phase:PHASE.ACTION, icon: IconDirectionSign, label: "Action"}, 
    {phase:PHASE.IMPROVEMENT, icon: IconProgressCheck, label: "Improvement"},
];

interface DashBoardProps {
    missions?: MissionDetailed[];
    formCallBack?: () => void;
    missionCallBack?: (mission: MissionDetailed) => void;
    role: Role;
}

export function DashBoardTutor(
    { missions = [], formCallBack, missionCallBack, role}: DashBoardProps
){
    const [apprentices, setApprentices] = useState<ApprenticeDetailed[]>([]);

    const fetchApprentices = async () => {
        const apprentices_ = await ApiClient.Apprentice.getApprenticesByTutor();
        setApprentices([...apprentices_]);
    }
    useEffect(() => {
        fetchApprentices();
    },[missions]);

    const generateMissionLinks = (
        missions: MissionDetailed[],
        role: Role,
        missionCallBack?: (mission: MissionDetailed) => void,
        ): LinkItem[] => {
            const missionLinks: LinkItem[] = missions.map((mission) => ({
            link: mission.title,
            label: mission.title,
            icon: IconPencil,
            callback: () => missionCallBack?.(mission),
            links: PHASES.map(({ phase, icon, label }) => ({
                link: phase,
                icon,
                label,
                links: mission.activities
                .filter((activity) => activity.phase === phase)
                .map((activity) => ({
                    link: activity.id.toString(),
                    label: activity.title,
                })),
            })),
        }));
        return missionLinks;
    };

    return (
        <nav className={classes.navbar}>
          <div className={classes.header}>
            <Group justify="space-between">
              {role && ICON[role as keyof typeof ICON]}
              <Code fw={700}>{role}</Code>
            </Group>
          </div>
    
          <Button color="gray.3" onClick={formCallBack} mt="xs" mb="xs">
              <IconLicense/> Link Apprentices
          </Button>
          <Divider />
          <ScrollArea h={550}>
              <List style={{width: "100%"}}>
                  {
                      apprentices.map((apprentice) => (
                          <List.Item key={apprentice.id} mt="xs" w="100%" display="block">
                              <LinksGroup 
                                  icon={IconUser} 
                                  label={apprentice.email} 
                                  links={generateMissionLinks(apprentice.mission_apprenticeDetailed,role,missionCallBack)} 
                                  initiallyOpened 
                              />
                          </List.Item>
                      ))
                  }
              </List>
          </ScrollArea>
        </nav>
    );
}