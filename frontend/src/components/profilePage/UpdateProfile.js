import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import defaultAvatar from './../../defaultAvatar.jpg'

function UpdateProfile(props) {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    // const [user, setUser] = useState()
    // useEffect(() => {
    //   setUser(props.user)
    // }, [props.user])
    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .trim()
            .required('Username is required')
            .min(6, 'Username must be at least 6 characters')
            .max(15, 'Username must not exceed 15 characters')
            .matches(
                /^[a-zA-Z0-9_]+$/,
                'Username must only contain letters, numbers, or "_"'
            ),
        // email: Yup.string()
        //     .required('Email is required')
        //     .email('Email is invalid'),
        phoneNumber: Yup.string()
            .trim()
            .min(7, 'Phone number must contains at least 7 digits')
            .max(11, 'Phone number must contains maximum 11 digits')
            .matches(/^[0-9]*/, 'Phone numbers can only contain numbers')
            .nullable(),
        address: Yup.string().trim().nullable(),
        name: Yup.string()
            .trim()
            .required('Name is required')
            .matches(
                /^(?![ ]+$)[a-zA-Z .]*$/,
                'Name must only contain letters and space'
            )
            .nullable(true),
        dateOfBirth: Yup.string()
            .trim()
            .matches(
                /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/,
                'DoB must match the format dd/mm/yyyy'
            )
            .nullable(true),
        gender: Yup.string().trim()
        .matches(/^male$|^female$/, "Must be 'male' or 'female'")
        .nullable(true)
    });
    const {
        register,
        unregister,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        // defaultValues: { username: user && user.username}
        shouldUnregister: true,
        shouldFocusError: false,
        mode: 'onSubmit'
    });

    const [returnMessage, setReturnMessage] = useState('');
    const endPoint = `http://localhost:9000/user/`;

    const update = (data) => {
        fetch(endPoint + `${currentUser.id}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {setReturnMessage(data.message); window.location.reload()});
    };

    return (
        <>
            <button
                type='button'
                className='btn'
                data-bs-toggle='modal'
                data-bs-target='#staticBackdrop'
            >
                <i className='fas fa-user-edit'></i>
            </button>

            <div
                className='modal fade'
                id='staticBackdrop'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                tabindex='-1'
                aria-labelledby='staticBackdropLabel'
                aria-hidden='true'
            >
                <div className='modal-dialog modal-lg'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5
                                className='modal-title'
                                id='staticBackdropLabel'
                            >
                                Update your information
                            </h5>
                            <button
                                type='button'
                                className='btn-close'
                                data-bs-dismiss='modal'
                                aria-label='Close'
                            ></button>
                        </div>
                        <div className='modal-body'>
                            <body
                                className='bg-light'
                                style={{ paddingBottom: '2%' }}
                            >
                                <div className='container-fluid'>
                                    <main>
                                        <div className='py-5 text-center'>
                                            <img
                                                className='d-block mx-auto mb-4'
                                                src={(props.user && props.user.avatar) ? `https://covi-away-app.s3.amazonaws.com/${props.user.avatar}` : defaultAvatar}
                                                alt=''
                                                width='72'
                                                height='57'
                                            />
                                            <p className='lead'>
                                                {props.user.username}
                                            </p>
                                        </div>

                                        <div className='row g-5'>
                                            <div className='col-12'>
                                                <form
                                                    className='needs-validation'
                                                    onSubmit={handleSubmit(
                                                        update
                                                    )}
                                                >
                                                    <div className='row g-3'>
                                                        <div className='col-sm-6'>
                                                            <label
                                                                for='firstName'
                                                                className='form-label'
                                                            >
                                                                Name
                                                            </label>
                                                            <input
                                                                type='text'
                                                                className={`form-control ${
                                                                    errors.name ||
                                                                    returnMessage ===
                                                                        'Username is already existed.'
                                                                        ? 'is-invalid'
                                                                        : ''
                                                                }`}
                                                                id='firstName'
                                                                placeholder='Your name'
                                                                defaultValue={`${
                                                                    props.user
                                                                        .name
                                                                        ? props
                                                                              .user
                                                                              .name
                                                                        : ''
                                                                }`}
                                                                {...register(
                                                                    'name'
                                                                )}
                                                            />
                                                        </div>

                                                        <div className='col-sm-6'>
                                                            <label
                                                                for='lastName'
                                                                className='form-label'
                                                            >
                                                                DoB
                                                            </label>
                                                            <input
                                                                type='text'
                                                                className={`form-control ${
                                                                    errors.dateOfBirth ||
                                                                    returnMessage ===
                                                                        'Username is already existed.'
                                                                        ? 'is-invalid'
                                                                        : ''
                                                                }`}
                                                                id='DoB'
                                                                placeholder='dd/mm/yyyy'
                                                                defaultValue={`${
                                                                    props.user
                                                                        .dateOfBirth
                                                                        ? props
                                                                              .user
                                                                              .dateOfBirth
                                                                        : ''
                                                                }`}
                                                                {...register(
                                                                    'dateOfBirth'
                                                                )}
                                                            />
                                                            <div className='invalid-feedback'>
                                                                {' '}
                                                                {
                                                                    errors
                                                                        .dateOfBirth
                                                                        ?.message
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className='col-6'>
                                                            <label
                                                                for='username'
                                                                className='form-label'
                                                            >
                                                                Username
                                                            </label>
                                                            <div className='input-group has-validation'>
                                                                <span className='input-group-text'>
                                                                    @
                                                                </span>
                                                                <input
                                                                    type='text'
                                                                    className={`form-control ${
                                                                        errors.username ||
                                                                        returnMessage ===
                                                                            'Username is already existed.'
                                                                            ? 'is-invalid'
                                                                            : ''
                                                                    }`}
                                                                    id='username'
                                                                    placeholder='Username'
                                                                    defaultValue={`${
                                                                        props
                                                                            .user
                                                                            .username
                                                                            ? props
                                                                                  .user
                                                                                  .username
                                                                            : ''
                                                                    }`}
                                                                    {...register(
                                                                        'username'
                                                                    )}
                                                                />
                                                                <div className='invalid-feedback'>
                                                                    {returnMessage ===
                                                                        'Username is already existed.' &&
                                                                        returnMessage}{' '}
                                                                    {
                                                                        errors
                                                                            .username
                                                                            ?.message
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-6'>
                                                            <label
                                                                for='lastName'
                                                                className='form-label'
                                                            >
                                                                Gender
                                                            </label>
                                                            <input
                                                                type='text'
                                                                className={`form-control ${
                                                                    errors.gender ||
                                                                    returnMessage ===
                                                                        'Username is already existed.'
                                                                        ? 'is-invalid'
                                                                        : ''
                                                                }`}
                                                                id='DoB'
                                                                placeholder='Your gender'
                                                                defaultValue={`${
                                                                    props.user
                                                                        .gender
                                                                        ? props
                                                                              .user
                                                                              .gender
                                                                        : ''
                                                                }`}
                                                                {...register(
                                                                    'gender'
                                                                )}
                                                            />
                                                            <div className='invalid-feedback'>
                                                                {' '}
                                                                {
                                                                    errors
                                                                        .gender
                                                                        ?.message
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className='col-12'>
                                                            <label
                                                                for='email'
                                                                className='form-label'
                                                            >
                                                                Email
                                                            </label>
                                                            <input
                                                                type='email'
                                                                className='form-control'
                                                                id='email'
                                                                placeholder='you@example.com'
                                                                defaultValue={`${
                                                                    props.user
                                                                        .email
                                                                        ? props
                                                                              .user
                                                                              .email
                                                                        : ''
                                                                }`}
                                                                disabled
                                                                {...register(
                                                                    'email'
                                                                )}
                                                            />
                                                            {console.log(
                                                                props.user.email
                                                            )}
                                                        </div>

                                                        <div className='col-7'>
                                                            <label
                                                                for='address'
                                                                className='form-label'
                                                            >
                                                                Address
                                                            </label>
                                                            <input
                                                                type='text'
                                                                className='form-control'
                                                                id='address'
                                                                placeholder='1234 Main St'
                                                                defaultValue={`${
                                                                    props.user
                                                                        .address
                                                                        ? props
                                                                              .user
                                                                              .address
                                                                        : ''
                                                                }`}
                                                                {...register(
                                                                    'address'
                                                                )}
                                                            />
                                                        </div>

                                                        <div className='col-5'>
                                                            <label
                                                                for='Phone'
                                                                className='form-label'
                                                            >
                                                                Phone number
                                                                <span className='text-muted'>
                                                                    (Optional)
                                                                </span>
                                                            </label>
                                                            <input
                                                                type='text'
                                                                className={`form-control ${
                                                                    errors.phoneNumber ||
                                                                    returnMessage ===
                                                                        'Username is already existed.'
                                                                        ? 'is-invalid'
                                                                        : ''
                                                                }`}
                                                                id='address2'
                                                                placeholder='Phone number'
                                                                defaultValue={`${
                                                                    props.user
                                                                        .phoneNumber
                                                                        ? props
                                                                              .user
                                                                              .phoneNumber
                                                                        : ''
                                                                }`}
                                                                {...register(
                                                                    'phoneNumber'
                                                                )}
                                                            />
                                                            <div className='invalid-feedback'>
                                                                {' '}
                                                                {
                                                                    errors
                                                                        .phoneNumber
                                                                        ?.message
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='modal-footer'>
                                                        <button
                                                            type='button'
                                                            className='btn btn-secondary'
                                                            data-bs-dismiss='modal'
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className='btn btn-primary'
                                                            type='submit'
                                                            onClick={() => {
                                                                unregister(
                                                                    'name',
                                                                    {
                                                                        keepDefaultValue: true,
                                                                    }
                                                                );
                                                                unregister(
                                                                    'dateOfBirth',
                                                                    {
                                                                        keepDefaultValue: true,
                                                                    }
                                                                );
                                                                unregister(
                                                                    'username',
                                                                    {
                                                                        keepDefaultValue: true,
                                                                    }
                                                                );
                                                                unregister(
                                                                    'address',
                                                                    {
                                                                        keepDefaultValue: true,
                                                                    }
                                                                );
                                                                unregister(
                                                                    'phoneNumber',
                                                                    {
                                                                        keepDefaultValue: true,
                                                                    }
                                                                );
                                                                unregister(
                                                                    'gender',
                                                                    {
                                                                        keepDefaultValue: true,
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            Save changes
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </main>
                                </div>
                            </body>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UpdateProfile;
