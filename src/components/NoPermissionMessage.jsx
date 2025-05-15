import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";

const NoPermissionMessage = ({
    title = "You do not have permission to view this page.",
    message = "Please contact your administrator if you believe this is a mistake.",
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            sx={{
                backgroundColor: colors.primary[400],
                border: "1px solid #fff",
                borderRadius: 2,
                padding: "32px",
                margin: "40px auto",
                maxWidth: 500,
                textAlign: "center",
                boxShadow: 2,
                marginTop:15,
            }}
        >
            <Typography variant="h6" color="warning.main" fontWeight="bold">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
                {message}
            </Typography>
        </Box>
    );
};

export default NoPermissionMessage;