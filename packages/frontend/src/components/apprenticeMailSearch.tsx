import ApiClient from "@/api/ApiClient";
import useDebounce from "@/hooks/useDebounce";
import { Box, Loader, Popover, ScrollArea, Text, TextInput, UnstyledButton } from "@mantine/core";
import { APIException } from "@shared/frontend";
import { IconSearch } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";



interface ApprenticeEmailSearchProps {
    // form: UseFormReturnType<MissionCreateRequest | {apprenticeEmail: string}>;
    setFormApprenticeEmail: (value: string) => void;

}
export const ApprenticeEmailSearch = (
    {setFormApprenticeEmail}: ApprenticeEmailSearchProps
) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState("");
    const [opened, setOpened] = useState(false);
    const [hovered, setHovered] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [apprenticesEmail, setApprenticesEmail] = useState<string[]>([]);
  
    // Fetch emails when debounced search changes
    useDebounce(() => {
      if (search.trim() === "") {
        setApprenticesEmail([]);
        setOpened(false);
        return;
      }
      fetchApprenticesEmail();
    }, [search], 500);
  
    const fetchApprenticesEmail = async () => {
        setLoading(true);
        try {
            const apprenticeEmail_ = await ApiClient.Apprentice.getApprenticesEmails(search);
            if (apprenticeEmail_.length === 1 && apprenticeEmail_[0] === search) {
                setOpened(false);
            } else {
            setOpened(apprenticeEmail_.length > 0);
            }
            setApprenticesEmail(apprenticeEmail_);
        } catch (e) {
            setApprenticesEmail([]);
            setLoading(false);
            if(e instanceof APIException){
                toast.warn(e.message);
            }
        } finally {
            setLoading(false);
        }
    };
  
    // Handle keyboard navigation (Arrow Up/Down & Enter)
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHovered((current) => {
          const nextIndex = current + 1 >= apprenticesEmail.length ? current : current + 1;
          viewportRef.current
            ?.querySelectorAll("[data-list-item]")
            ?.[nextIndex]?.scrollIntoView({ block: "nearest" });
          return nextIndex;
        });
      }
  
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHovered((current) => {
          const nextIndex = current - 1 < 0 ? current : current - 1;
          viewportRef.current
            ?.querySelectorAll("[data-list-item]")
            ?.[nextIndex]?.scrollIntoView({ block: "nearest" });
          return nextIndex;
        });
      }
  
      if (event.key === "Enter" && hovered >= 0) {
        event.preventDefault();
        setSearch(apprenticesEmail[hovered]); // Set selected email
        // form.setFieldValue("apprenticeEmail", apprenticesEmail[hovered]);
        setFormApprenticeEmail(apprenticesEmail[hovered]);
        setOpened(false);
      }
    };
  
    const items = apprenticesEmail.map((email, index) => (
      <UnstyledButton
        data-list-item
        key={email}
        display="block"
        bg={index === hovered ? "var(--mantine-color-blue-light)" : undefined}
        w="100%"
        p={5}
        onClick={() => {
          setSearch(email);
          // form.setFieldValue("apprenticeEmail", email);
          setFormApprenticeEmail(email);
          setOpened(false);
        }}
      >
        {email}
      </UnstyledButton>
    ));
  
    return (
      <Popover width="target" opened={opened}>
        <Popover.Target>
          <TextInput
            label="Apprentice Email"
            placeholder="Search apprentice..."
            value={search}
            onFocus={() => setOpened(true)}
            onBlur={() => setOpened(false)}
            onChange={(event) => {
              setSearch(event.currentTarget.value);
              setHovered(-1);
            }}
            onKeyDown={handleKeyDown}
            rightSection={loading ? <Loader size="xs" /> : <IconSearch size={16} />}
          />
        </Popover.Target>
        <Popover.Dropdown p={0}>
          <ScrollArea.Autosize viewportRef={viewportRef} mah={200} type="always" scrollbars="y">
            <Box px="xs" py={5}>
              {items.length > 0 ? items : <Text c="dimmed">No results</Text>}
            </Box>
          </ScrollArea.Autosize>
        </Popover.Dropdown>
      </Popover>
    );
};

