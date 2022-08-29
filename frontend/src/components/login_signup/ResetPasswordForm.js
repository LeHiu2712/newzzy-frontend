import React, { useEffect, useState } from 'react';
import weblogo from '../../weblogo.png'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useParams } from 'react-router';

function ResetPasswordForm() {
    let {id, token} = useParams()
    const validationSchema = Yup.object().shape({
        password: Yup.string().trim()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .max(40, 'Password must not exceed 40 characters')
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]*$/, 'Password must contain at least one letter, one number, and one special character'),
        confirmPassword: Yup.string().trim()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password'), null], 'Confirm Password does not match')
    });
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });
    const [returnMessage, setReturnMessage] = useState("")
    const [canReset, setCanReset] = useState(false)
    const endPoint = `http://localhost:9000/auth/passwordreset/${id}/${token}`
    const verifyLink = () => {
        fetch(`http://localhost:9000/user/password-reset/${id}/${token}`)
        .then(response => response.json()).then(data => {console.log(data);setCanReset(data.canReset)})
    }
    const resetPassword = data => {
        fetch(endPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password: data.password})
        }).then(response => response.json()).then(data => setReturnMessage(data.message))
    };
    useEffect(()=>{
        verifyLink()
    }, [])
    return (
        <div class="container" style={{ marginTop: "110px" }}>
            <div class="row">
                <div class="col-lg">
                </div>
                {canReset ?
                <div class="col-lg col-md-12">
                    {returnMessage !== "Your password is successfully reset. Please log in again with your new password!" ?
                        (<form onSubmit={handleSubmit(resetPassword)}>
                            <div style={{ marginLeft: "35%" }}>
                                <img class="mb-4 mx-auto" src={weblogo} alt="Web Logo" width="45%" height="45%" />
                            </div>
                            <h1 class="h3 mb-3 fw-normal text-center">RESET PASSWORD</h1>

                            <div class="form-floating mt-2">
                                <input type="password" class={`form-control ${errors.password ? 'is-invalid' : ''}`} id="floatingPassword" placeholder="Password" {...register('password')} />
                                <label for="floatingPassword">New Password</label>
                                <div className="invalid-feedback">{errors.password?.message}</div>
                            </div>
                            <div class="form-floating mt-2">
                                <input type="password" class={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} id="floatingPassword" placeholder="Password" {...register('confirmPassword')} />
                                <label for="floatingPassword">Confirm Password</label>
                                <div className="invalid-feedback">
                                    {errors.confirmPassword?.message}
                                </div>
                            </div>
                            <button class="w-100 btn btn-lg btn-primary mt-3" type="submit">Reset</button>
                        </form>) : (
                            <div class="alert alert-success" role="alert">
                                {returnMessage}. <a class="mx-auto" href="/login">Login here</a>
                            </div>
                        )

                    }
                </div> : <div></div>}
                <div class="col-lg">
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordForm;