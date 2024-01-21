import { Box, useTheme, useMediaQuery, Typography } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMoblieScreen = useMediaQuery("(min-width:1000px)");
  return (
    <Box>
      <Box
        width={"100%"}
        sx={{
          backgroundColor:theme.palette.background.alt
        }}
        
        p="1rem 6%"
        textAlign={"center"}
      >
        <Typography fontWeight={"bold"} fontSize={"32px"} color={"primary"}>
          SocioPedia
        </Typography>
      </Box>

      <Box
        width={isNonMoblieScreen ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius={"1.5rem"}
        sx={{
          backgroundColor:theme.palette.background.alt
        }}
      >
        <Typography fontWeight={"500"} variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Sociopedia, the Social Media for Socipaths
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
