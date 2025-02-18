'use client';

import { useState } from 'react';
import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconUserFilled,
} from '@tabler/icons-react';
import cx from 'clsx';
import {
  Burger,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from '@/styles/navbar.module.css';
import Image from 'next/image';
import { useAuth } from '@/auth.context';
import { useRouter } from 'next/navigation';


// const links = [
//   { link: '/about', label: 'Features' },
//   { link: '/pricing', label: 'Pricing' },
//   { link: '/learn', label: 'Learn' },
//   { link: '/community', label: 'Community' },
// ];

interface HeaderProps {
  opened?: boolean,
  toggle?: () => void,
  hasBurger: boolean,
}

export function Header(
  {opened, toggle, hasBurger}: HeaderProps
) {
  const { signOut, currentUser } = useAuth();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const router = useRouter();

  const resetPassword = () => {
    router.push('/reset-password');
  }

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          {hasBurger && <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />}
          {/* <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" /> */}
          <Image src="/logo.png" alt="Logo" width={80} height={40}/>
        </Group>

        <Group>
          {/* <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group> */}
          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
            >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
              >
                <Group gap={7}>
                  <IconUserFilled size={12}/>
                  <Text fw={500} size="md" lh={1} mr={3}>
                    {currentUser?.name}
                  </Text>
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item onClick={resetPassword} leftSection={<IconSettings size={16} stroke={1.5} />}>
                Reset Password
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item onClick={signOut} leftSection={<IconLogout size={16} stroke={1.5} />}>Logout</Menu.Item>
            </Menu.Dropdown>
            </Menu>
        </Group>
      </div>
    </header>
  );
}
