import { Group, Code, ScrollArea } from "@mantine/core";
import { IconBackpack, IconBook, IconBuildings, IconChartHistogram, IconDirectionSign, IconLicense, IconPencil, IconProgressCheck, IconSchool } from "@tabler/icons-react";
import classes from "@/styles/dashboard.module.css";
import { MissionDetailed, PHASE, ROLE, Role } from "@shared/frontend";
import { LinkItem, LinksGroup } from "@/components/linkgroup";

const ICON = {
  [ROLE.COMPANY]: <IconBuildings />,
  [ROLE.STUDENT]: <IconBackpack/>,
  [ROLE.TUTOR]: <IconSchool />,
}
interface DashBoardProps {
  missions?: MissionDetailed[];
  formCallBack?: () => void;
  missionCallBack?: (mission: MissionDetailed) => void;
  chartCallBack?: () => void;
  role?: Role;
}

export function DashBoard({ missions = [], formCallBack, missionCallBack,chartCallBack ,role }: DashBoardProps) {
  const missionLinks:LinkItem[] = missions.map((mission) => ({
    link: mission.title,
    label: mission.title,
    icon: IconPencil,
    callback: () => missionCallBack?.(mission),
    links:[
      {
        link: PHASE.STUDY,
        icon: IconBook,
        label: "Study",
        links: mission.activities.filter((activity) => activity.phase === PHASE.STUDY).map((activity) => ({
          link: activity.id.toString(),
          label: activity.title,
        })),
      },
      {
        link: PHASE.ACTION,
        icon: IconDirectionSign,
        label: "Action",
        links: mission.activities.filter((activity) => activity.phase === PHASE.ACTION).map((activity) => ({
          link: activity.id.toString(),
          label: activity.title,
        })),
      },
      {
        link: PHASE.IMPROVEMENT,
        icon: IconProgressCheck,
        label: "Improvement",
        links: mission.activities.filter((activity) => activity.phase === PHASE.IMPROVEMENT).map((activity) => ({
          link: activity.id.toString(),
          label: activity.title,
        })),
      },
      ...(role === ROLE.STUDENT
        ? [
            {
              link: "add-mission",
              label: "+ Add new activity",
              callback: formCallBack,
            },
          ]
        : []),
      ]
    }));
    

    return (
      <nav className={classes.navbar}>
        <div className={classes.header}>
          <Group justify="space-between">
            {role && ICON[role as keyof typeof ICON]}
            <Code fw={700}>{role}</Code>
          </Group>
        </div>
  
        <LinksGroup icon={IconChartHistogram} label="Skill Point" initiallyOpened callback={chartCallBack} />
        <ScrollArea h={550}>
           <LinksGroup icon={IconLicense} label="My missions" links={missionLinks} initiallyOpened />
        </ScrollArea>
      </nav>
    );
  }