import { IconBackpack, IconBuildings,IconPyramid, IconSchool } from '@tabler/icons-react';
import { Anchor, Avatar, Badge, Group, Paper, Table, Text } from '@mantine/core';
import { Role, ROLE, User } from '@shared/frontend';

const ROLES = [
  {role: ROLE.ADMIN, icon: <IconPyramid/>, color:"red"}, 
  {role: ROLE.COMPANY, icon: <IconBuildings/>, color:"blue"}, 
  {role: ROLE.TUTOR, icon: <IconSchool/>, color:"green"},
  {role: ROLE.STUDENT, icon: <IconBackpack/>, color:"aqua"}
];
const getUserInfo = (role: Role) => {
    return ROLES.find(icon => icon.role === role);
}

interface UsersTableProps {
  users: User[];
}
export function UsersTable(
  { users }: UsersTableProps
) {
  const rows = users.map((user) => {
    const icon = getUserInfo(user.role)?.icon;
    const color = getUserInfo(user.role)?.color;
    
    return(
    <Table.Tr key={user.name}>
      <Table.Td>
        <Group gap="sm">
          <Avatar radius="sm" color={color} >
            {icon}
          </Avatar>
          <Text fz="sm" fw={500}>
            {user.name}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Badge color={color} variant="light">
          {user.role}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Anchor component="button" size="sm">
          {user.email}
        </Anchor>
      </Table.Td>
      {/* <Table.Td>
        <Text fz="sm">{item.phone}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray">
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td> */}
    </Table.Tr>
  )});

  return (
    <Paper mt="md" ml="xl" mr="xl" p="xl" shadow="xl" radius="lg" withBorder>
      <Table.ScrollContainer minWidth={600} >
        <Table verticalSpacing="sm" horizontalSpacing="xl" withTableBorder >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Email</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}