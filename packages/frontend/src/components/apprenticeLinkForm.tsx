import { Modal, Box, Stack, Button } from "@mantine/core"
import { ApprenticeEmailSearch } from "./apprenticeMailSearch"
import { UseFormReturnType } from "@mantine/form";

interface ApprenticeLinkFormProps {
    showForm: boolean;
    setShowForm: (show: boolean) => void;
    loading: boolean;
    form: UseFormReturnType<{apprenticeEmail: string}>;
    handleSubmit: (values: {apprenticeEmail: string}) => void;
}
export const ApprenticeLinkForm = (
    { showForm, setShowForm, loading, form, handleSubmit }: ApprenticeLinkFormProps
) => {
    return(
        <Modal opened={showForm} onClose={() => setShowForm(false)} title="Link new apprentice" centered>
          <Box p="md">
              <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="sm">               
                  <ApprenticeEmailSearch
                      setFormApprenticeEmail={(email) => form.setFieldValue("apprenticeEmail", email)}
                  />    
                  <Button color="red.1" type="submit" loading={loading} fullWidth>
                    Link Apprentice
                  </Button>
              </Stack>
              </form>
          </Box>
      </Modal>
    )
}