import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Typography,
    Container,
    FormHelperText,
    FormControl,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Copyright from '../components/Copyright'
import { useAuthContext } from '../context/AuthContext'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { signUpSchema } from './validationSchemas'
import { formValues } from '../types'

export default function SignUp() {
    const { handleSignUp } = useAuthContext()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<formValues>({
        resolver: yupResolver(signUpSchema),
    })

    return (
        <>
            <Container component='main' maxWidth='xs'>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component='h1' variant='h5'>
                        Sign up
                    </Typography>
                    <Box
                        noValidate
                        component='form'
                        onSubmit={handleSubmit(handleSignUp)}
                        sx={{ mt: 3 }}
                    >
                        <FormControl error={!!errors}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register('name')}
                                        autoComplete='given-name'
                                        fullWidth
                                        id='name'
                                        label='Name'
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register('email', {
                                            required: true,
                                        })}
                                        fullWidth
                                        required
                                        id='email'
                                        label='Email Address'
                                        autoComplete='email'
                                    />
                                    {errors.email && (
                                        <FormHelperText>
                                            {errors.email.message}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register('password', {
                                            required: true,
                                            minLength: 1,
                                        })}
                                        fullWidth
                                        required
                                        label='Password'
                                        type='password'
                                        id='password'
                                        autoComplete='new-password'
                                    />
                                    {errors.password && (
                                        <FormHelperText>
                                            {errors.password.message}
                                        </FormHelperText>
                                    )}
                                </Grid>
                            </Grid>
                        </FormControl>
                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 2 }} />
            </Container>
        </>
    )
}
