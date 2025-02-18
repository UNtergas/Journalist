import { useState } from 'react';
import { IconChevronRight, Icon} from '@tabler/icons-react';
import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import classes from '@/styles/linkgroup.module.css';

export interface LinkItem {
    label: string;
    link?: string;
    icon?: Icon;
    links?: LinkItem[];
    callback?: () => void;
}

export interface LinksGroupProps {
  icon: Icon;
  label: string;
  initiallyOpened?: boolean;
  links?: LinkItem[];
  level?: number;
  callback?: () => void;
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, links, level=0, callback}: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);

  const handleClick = () => {
    if (callback) {
      callback(); // Execute the callback if provided
    }
    if (hasLinks) {
      setOpened((o) => !o); // Toggle collapse only if there are links
    }
  };
  
  const items = (hasLinks ? links : []).map((link) =>
    link.links ? (
      // Render nested LinksGroup
      <div key={link.label} className={classes[`nested-${level}`]}>
          <LinksGroup
            key={link.label}
            icon={link.icon ?? IconChevronRight}
            label={link.label}
            links={link.links}
            level={level + 1} // Increment the level
            callback={link.callback}
          />
      </div>
    ) : (
      // Render normal text link
      <Text<'a'>
        component="a"
        className={classes[`link-${level}`]} // Apply level-specific class
        key={link.label}
        onClick={(e) => {
            if (link.callback) {
                e.preventDefault(); // Prevent default if there's a callback
                link.callback();
            }
        }}
        style={{ cursor: "pointer" }} 
      >
        <span>{link.label}</span>
        {link.icon && <link.icon size={16} />}
      </Text>
    )
  );

  return (
    <>
      <UnstyledButton onClick={handleClick} className={classes.control}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={16}
              style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
