import React, { useState } from 'react';
import { useParams } from 'react-router';
import weblogo from '../../weblogo.png';
import { set, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

function Login(props) {
    let { verified } = useParams();
    const [returnMessage, setReturnMessage] = useState('');
    const endPoint = 'http://localhost:9000/auth/login';
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
    });
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });
    const redirectToMainPage = () => {
        window.location.replace('http://localhost:3000');
    };
    const login = (data) => {
        fetch(endPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: data.username,
                password: data.password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    setReturnMessage(data.message);
                    if (data.deleteTokenUser) {
                        localStorage.setItem(
                            'deleteToken',
                            JSON.stringify(data.deleteTokenUser)
                        );
                    }
                } else {
                    data.authenticatedUser.accessToken &&
                        localStorage.setItem(
                            'user',
                            JSON.stringify(data.authenticatedUser)
                        );
                    redirectToMainPage();
                }
            });
    };
    return (
        <div className='container' style={{ marginTop: '150px' }}>
            <div className='row'>
                <div className='col-lg'></div>
                <div className='col-lg col-md-12'>
                    {verified === 'verified' && (
                        <div className='alert alert-success' role='alert'>
                            Your Email Is Succesfully Verified{' '}
                            <i className='far fa-check-circle'></i>
                        </div>
                    )}
                    <div style={{ marginLeft: '35%' }}>
                        <img
                            className='mb-4 mx-auto'
                            src={weblogo}
                            alt='Web Logo'
                            width='45%'
                            height='45%'
                        />
                    </div>
                    <form onSubmit={handleSubmit(login)}>
                        <h1 className='h3 mb-3 fw-normal text-center'>
                            SIGN IN
                        </h1>
                        {returnMessage ===
                            'Your email has not been verified.' && (
                            <div className='alert alert-danger' role='alert'>
                                {returnMessage} Please check again your email to
                                verify or{' '}
                                <a href='/signup'>
                                    Click here to sign up again
                                </a>
                            </div>
                        )}
                        <div className='form-floating'>
                            <input
                                type='user'
                                className={`form-control ${
                                    errors.username ||
                                    returnMessage ===
                                        'Wrong username. Please try again!'
                                        ? 'is-invalid'
                                        : ''
                                }`}
                                id='floatingInput'
                                placeholder='Kienhq51'
                                {...register('username')}
                            />
                            <label for='floatingInput'>Username</label>
                            <div className='invalid-feedback'>
                                {returnMessage ===
                                    'Wrong username. Please try again!' &&
                                    returnMessage}{' '}
                                {errors.username?.message}
                            </div>
                        </div>
                        <div className='form-floating mt-2'>
                            <input
                                type='password'
                                className={`form-control ${
                                    errors.password ||
                                    returnMessage ===
                                        'Wrong password. Please try again!'
                                        ? 'is-invalid'
                                        : ''
                                }`}
                                id='floatingPassword'
                                placeholder='Password'
                                {...register('password')}
                            />
                            <label for='floatingPassword'>Password</label>
                            <div className='invalid-feedback'>
                                {returnMessage ===
                                    'Wrong password. Please try again!' &&
                                    returnMessage}{' '}
                                {errors.password?.message}
                            </div>
                        </div>
                        <div className='mb-3 mt-3 text-center'>
                            <label>

                                <a href="/emailresetform">Forgot Password?</a>
                            </label>
                        </div>
                        <button
                            className='w-100 btn btn-lg btn-primary'
                            type='submit'
                        >
                            Sign in
                        </button>
                        <div className='mb-3 mt-3 text-center'>
                            <label>
                                <a className='mx-auto' href='/signup'>
                                    Create New Account
                                </a>
                            </label>
                        </div>
                    </form>
                </div>
                <div className='col-lg'></div>
            </div>
        </div>
    );
}

export default Login;
