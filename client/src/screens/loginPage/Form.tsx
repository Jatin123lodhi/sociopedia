import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { ErrorMessage, Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import { BASE_URL } from "../../utils";
import { toast } from "sonner";
const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

interface ILoginFormValue {
  email: string;
  password: string;
}
interface IRegisterFormValue extends ILoginFormValue {
  firstName: string;
  lastName: string;
  location: string;
  occupation: string;
  picture: File | "";
}

const initialValuesRegister: IRegisterFormValue = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin: ILoginFormValue = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState<"register" | "login">("login");
  const [pictureName,setPictureName] = useState("");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const register = async (
    values: IRegisterFormValue,
    onSubmitProps: FormikHelpers<IRegisterFormValue>
  ) => {
    // this allows us to send form info with image
    const formData = new FormData();
    let value: keyof typeof values;
    for (value in values) {
      formData.append(value, values[value]);
    }
    
    values.picture && formData.append("picturePath", values.picture.name || "");

    const savedUserResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      body: formData,
    });
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();
    
    if (savedUser) {
      toast.success("Registration successfull!");
      setPageType("login");
    }
  };

  const login = async (
    values: ILoginFormValue,
    onSubmitProps: FormikHelpers<ILoginFormValue>
  ) => {
    const loggedInResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if(loggedInResponse.ok){
      const loggedIn = await loggedInResponse.json();
      onSubmitProps.resetForm();
  
      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        navigate("/home");
      }
    }else{
      toast.error('User does not exits');
    }
  };

  const handleFormSubmit = async (
    values: IRegisterFormValue | ILoginFormValue,
    onSubmitProps: FormikHelpers<IRegisterFormValue | ILoginFormValue>
  ) => {
    if (pageType === "register") {
      register(
        values as IRegisterFormValue,
        onSubmitProps as FormikHelpers<IRegisterFormValue>
      );
    } else {
      login(
        values as ILoginFormValue,
        onSubmitProps as FormikHelpers<ILoginFormValue>
      );
    }
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={
        pageType === "login" ? initialValuesLogin : initialValuesRegister
      }
      validationSchema={pageType === "login" ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => {
        
        return (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {pageType === "register" && (
                <>
                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={(values as IRegisterFormValue).firstName}
                    name="firstName"
                    sx={{ gridColumn: "span 2" }}
                  />
                  <ErrorMessage name="firstName" />
                  <TextField
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={(values as IRegisterFormValue).lastName}
                    name="lastName"
                    sx={{ gridColumn: "span 2" }}
                  />
                  <ErrorMessage name="lastName" />
                  <TextField
                    label="Location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={(values as IRegisterFormValue).location}
                    name="location"
                    sx={{ gridColumn: "span 4" }}
                  />
                  <ErrorMessage name="location" />
                  <TextField
                    label="Occupation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={(values as IRegisterFormValue).occupation}
                    name="occupation"
                    sx={{ gridColumn: "span 4" }}
                  />
                  <ErrorMessage name="occupation" />
                  <Box
                    gridColumn="span 4"
                    border={`1px solid ${palette.neutral.medium}`}
                    borderRadius="5px"
                    p="1rem"
                  >
                    <Dropzone
                      accept={{
                        "image/.jpg": [".jpg"],
                        "image/.jpeg": [".jpeg"],
                        "image/.png": [".png"],
                      }}
                      multiple={false}
                      onDrop={(acceptedFiles) =>{
                        setFieldValue("picture", acceptedFiles[0])
                        setPictureName(acceptedFiles[0].name)
                      }
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          border={`2px dashed ${palette.primary.main}`}
                          p="1rem"
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        >
                          <input {...getInputProps()} />
                          {!(values as IRegisterFormValue).picture  ? (
                            <p>Add Picture Here</p>
                          ) : (
                            <FlexBetween>
                              <Typography>{pictureName}</Typography>  
                              <EditOutlinedIcon />
                            </FlexBetween>
                          )}
                        </Box>
                      )}
                    </Dropzone>
                  </Box>
                  <ErrorMessage name="picture" />
                </>
              )}

              <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            {/* BUTTONS */}
            <Box>
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {pageType === "login" ? "LOGIN" : "REGISTER"}
              </Button>
              <Typography
                onClick={() => {
                  setPageType(pageType === "login" ? "register" : "login");
                  resetForm();
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                }}
              >
                {pageType === "login"
                  ? "Don't have an account? Sign Up here."
                  : "Already have an account? Login here."}
              </Typography>
            </Box>
          </form>
        );
      }}
    </Formik>
  );
};

export default Form;
