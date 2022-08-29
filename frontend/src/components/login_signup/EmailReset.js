import React, { useState } from 'react';
import weblogo from '../../weblogo.png'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import emailsent from './emailsent.gif'

function EmailReset() {
    const validationSchema = Yup.object().shape({
        email: Yup.string().trim()
            .required('Email is required')
            .email('Email is invalid'),
    });
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });
    const [returnMessage, setReturnMessage] = useState("")
    const endPoint = "http://localhost:9000/auth/emailforreset"
    const sendEmailReset = data => {
        fetch(endPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).then(data => {setReturnMessage(data.message)})
    };
    return (
        <div class="container" style={{ marginTop: "110px" }}>
            <div class="row">
                <div class="col-lg">
                </div>
                <div class="col-lg col-md-12">
                    {returnMessage !== "Reset password email has been sent to you. Please check your email to reset your password!" ?
                        (<form onSubmit={handleSubmit(sendEmailReset)}>
                            <div style={{ marginLeft: "35%" }}>
                                <img class="mb-4 mx-auto" src={weblogo} alt="Web Logo" width="45%" height="45%" />
                            </div>
                            <h1 class="h3 mb-3 fw-normal text-center">Enter your registered email</h1>
                            <div class="form-floating mt-2">
                                <input type="email" class={`form-control ${errors.email || returnMessage === "Email is not existed" || returnMessage === "This email has not been verified" ? 'is-invalid' : ''}`} id="floatingInput-email" placeholder="name@example.com" {...register('email')} />
                                <label for="floatingInput-email">Email</label>
                                <div className="invalid-feedback">{(returnMessage === "Email is not existed" || returnMessage === "This email has not been verified") && returnMessage}. {errors.email?.message}</div>
                            </div>
                            <button class="w-100 btn btn-lg btn-primary mt-3" type="submit">Send</button>
                        </form>) : (<div>
                            <div>
                                <img class="mb-4 mx-auto" src={emailsent} alt="Verification email sent" width="100%" height="100%" />
                            </div>
                            <div class="alert alert-success" role="alert">
                                {returnMessage}. If you don't see your email in <strong>Inbox</strong> folder. Please check the <strong>Promotions</strong> folder.
                            </div></div>
                        )

                    }
                </div>
                <div class="col-lg">
                </div>
            </div>
        </div>
    );
}

export default EmailReset;