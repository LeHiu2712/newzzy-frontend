import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState, useEffect } from 'react'
export default function ChangePassword() {
    const [returnMessage, setReturnMessage] = useState()
    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string()
            .trim()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .max(40, 'Password must not exceed 40 characters')
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]*$/,
                'Password must contain at least one letter, one number, and one special character'
            ),
        password: Yup.string()
            .trim()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .max(40, 'Password must not exceed 40 characters')
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]*$/,
                'Password must contain at least one letter, one number, and one special character'
            ),
        confirmPassword: Yup.string()
            .trim()
            .required('Confirm Password is required')
            .oneOf(
                [Yup.ref('password'), null],
                'Confirm Password does not match'
            ),
    });
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const currentUser = JSON.parse(localStorage.getItem("user"))
    const changePassword = (data) => {
        fetch(`http://localhost:9000/user/` + `${currentUser.id}/changepassword`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ password: data.password, oldPassword: data.oldPassword }),
        })
            .then((response) => response.json())
            .then(data => setReturnMessage(data.message));
    };
    return (
        <>
            <span className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#changePassword">Change Password</span>
            <div class="modal fade" id="changePassword" tabindex="-1" aria-labelledby="changePasswordLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" style={{ color: "black" }} id="exampleModalLabel">CHANGE PASSWORD</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {returnMessage === "Password is successfully changed" ?
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-2"></div>
                                    <div className="col-8">
                                        <div class="alert alert-success" role="alert">
                                            {returnMessage}
                                        </div>
                                    </div>
                                    <div className="col-2"></div>
                                </div>
                            </div> : (<form onSubmit={handleSubmit(changePassword)} className="container">
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-2"></div>
                                        <div className="col-8">
                                            <div class="form-floating mt-2">
                                                <input type="password" class={`form-control ${errors.oldPassword || returnMessage === "Wrong password. Please try again!" ? 'is-invalid' : ''}`} id="floatingPassword" placeholder="Password" {...register('oldPassword')} />
                                                <label for="floatingPassword" style={{ color: "black" }}>Old Password</label>
                                                <div className="invalid-feedback">{returnMessage === "Wrong password. Please try again!" && returnMessage} {errors.oldPassword?.message}</div>
                                            </div>
                                            <div class="form-floating mt-2">
                                                <input type="password" class={`form-control ${errors.password ? 'is-invalid' : ''}`} id="floatingPassword" placeholder="Password" {...register('password')} />
                                                <label for="floatingPassword" style={{ color: "black" }}>New Password</label>
                                                <div className="invalid-feedback">{errors.password?.message}</div>
                                            </div>
                                            <div class="form-floating mt-2">
                                                <input type="password" class={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} id="floatingPassword" placeholder="Password" {...register('confirmPassword')} />
                                                <label for="floatingPassword" style={{ color: "black" }}>Confirm Password</label>
                                                <div className="invalid-feedback">
                                                    {errors.confirmPassword?.message}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-2"></div>
                                </div>
                                <div className="modal-footer"><div className="col-9"></div><div className="col-3"><button class="w-100 btn btn-lg btn-primary mt-3" type="submit">Save</button></div></div>
                            </form>)}
                    </div>
                </div>
            </div>
        </>
    )
}