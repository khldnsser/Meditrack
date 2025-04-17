import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, Paper, Tab, Tabs } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { DoctorRegisterData } from '../../types/auth';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`auth-tabpanel-${index}`}
            aria-labelledby={`auth-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const DoctorAuth: React.FC = () => {
    const [tabValue, setTabValue] = React.useState(0);
    const { login, register, error } = useAuth();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const loginFormik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                await login(values.email, values.password, 'doctor');
            } catch (err) {
                console.error('Login failed:', err);
            }
        },
    });

    const registerFormik = useFormik({
        initialValues: {
            name: '',
            phone_number: '',
            email: '',
            specialization: '',
            password: '',
            license_number: '',
            pin: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            phone_number: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            specialization: Yup.string().required('Required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
            license_number: Yup.string()
                .matches(/^[A-Za-z]{2}\d{6}$/, 'License number must be 2 letters followed by 6 digits')
                .required('Required'),
            pin: Yup.string()
                .matches(/^\d{4}$/, 'PIN must be 4 digits')
                .required('Required'),
        }),
        onSubmit: async (values: DoctorRegisterData) => {
            try {
                await register(values, 'doctor');
            } catch (err) {
                console.error('Registration failed:', err);
            }
        },
    });

    return (
        <Paper elevation={3} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab label="Login" />
                <Tab label="Register" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                <form onSubmit={loginFormik.handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            value={loginFormik.values.email}
                            onChange={loginFormik.handleChange}
                            error={loginFormik.touched.email && Boolean(loginFormik.errors.email)}
                            helperText={loginFormik.touched.email && loginFormik.errors.email}
                        />
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={loginFormik.values.password}
                            onChange={loginFormik.handleChange}
                            error={loginFormik.touched.password && Boolean(loginFormik.errors.password)}
                            helperText={loginFormik.touched.password && loginFormik.errors.password}
                        />
                        {error && <Typography color="error">{error}</Typography>}
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Login
                        </Button>
                    </Box>
                </form>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <form onSubmit={registerFormik.handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Name"
                            value={registerFormik.values.name}
                            onChange={registerFormik.handleChange}
                            error={registerFormik.touched.name && Boolean(registerFormik.errors.name)}
                            helperText={registerFormik.touched.name && registerFormik.errors.name}
                        />
                        <TextField
                            fullWidth
                            id="phone_number"
                            name="phone_number"
                            label="Phone Number"
                            value={registerFormik.values.phone_number}
                            onChange={registerFormik.handleChange}
                            error={registerFormik.touched.phone_number && Boolean(registerFormik.errors.phone_number)}
                            helperText={registerFormik.touched.phone_number && registerFormik.errors.phone_number}
                        />
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            value={registerFormik.values.email}
                            onChange={registerFormik.handleChange}
                            error={registerFormik.touched.email && Boolean(registerFormik.errors.email)}
                            helperText={registerFormik.touched.email && registerFormik.errors.email}
                        />
                        <TextField
                            fullWidth
                            id="specialization"
                            name="specialization"
                            label="Specialization"
                            value={registerFormik.values.specialization}
                            onChange={registerFormik.handleChange}
                            error={registerFormik.touched.specialization && Boolean(registerFormik.errors.specialization)}
                            helperText={registerFormik.touched.specialization && registerFormik.errors.specialization}
                        />
                        <TextField
                            fullWidth
                            id="license_number"
                            name="license_number"
                            label="License Number"
                            value={registerFormik.values.license_number}
                            onChange={registerFormik.handleChange}
                            error={registerFormik.touched.license_number && Boolean(registerFormik.errors.license_number)}
                            helperText={registerFormik.touched.license_number && registerFormik.errors.license_number}
                        />
                        <TextField
                            fullWidth
                            id="pin"
                            name="pin"
                            label="Hospital PIN"
                            type="password"
                            value={registerFormik.values.pin}
                            onChange={registerFormik.handleChange}
                            error={registerFormik.touched.pin && Boolean(registerFormik.errors.pin)}
                            helperText={registerFormik.touched.pin && registerFormik.errors.pin}
                        />
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={registerFormik.values.password}
                            onChange={registerFormik.handleChange}
                            error={registerFormik.touched.password && Boolean(registerFormik.errors.password)}
                            helperText={registerFormik.touched.password && registerFormik.errors.password}
                        />
                        {error && <Typography color="error">{error}</Typography>}
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Register
                        </Button>
                    </Box>
                </form>
            </TabPanel>
        </Paper>
    );
};

export default DoctorAuth; 