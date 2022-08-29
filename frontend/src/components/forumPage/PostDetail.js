import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import Sidebar from './Sidebar';
import CreatePost from './CreatePost';
import CommentSection from './CommentSection';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';


import { countTimeDiff } from '../../utils';

const PostDetail = (props) => {
    const [showCreatePostForm, setShowCreatePostForm] = useState(false);
    const [catId, setCatId] = useState([]);
    const [postDetail, setpostDetail] = useState({});
    const defaultValue = useRef();

    const { id } = useParams();
    const endPoint = `http://localhost:9000/forums/posts/${id}`;
    const currentUser = JSON.parse(localStorage.getItem('user'));
    function flatMap(array, fn) {
        var result = [];
        for (var i = 0; i < array.length; i++) {
            var mapping = fn(array[i]);
            result = result.concat(mapping);
        }
        return result;
    }

    var nl2br = function (string) {
        string = flatMap(string.split(/\n/), function (part) {
            return [part, <br />];
        });
        // Remove the last spac
        string.pop();
        return <div>{string}</div>;
    };
    const validationSchema = Yup.object().shape({
        title: Yup.string().trim()
            .required('Title is required')
            .matches(
                /^[a-zA-Z0-9 ?,;.$'"-_()@!%*#?&\/\\]+$/,
                'Title cannot contain certain special characters'
            ),
        content: Yup.string().trim()
            .required('Content is required')
            .matches(
                /^[a-zA-Z0-9 ?,;.$'"-:+_()@!%*#?&\/\\(\r\n|\r|\n)]+$/,
                'Content cannot contain certain special characters. Be careful with apostrophe. The valid one is " \' "'
            ),
        image: Yup.mixed()
            .test('fileSize', 'The file is too large', (value) => {
                if (!value.length) {
                    return true; // attachment is optional
                }
                return value[0].size <= 2000000;
            })
            .test('fileType', 'Only jpeg/png file is accepted', (value) => {
                if (!value.length) {
                    return true; // attachment is optional
                }
                return (
                    value[0].type === 'image/jpeg' ||
                    value[0].type === 'image/png'
                );
            }),
        cat: Yup.string()
            .test("value", "Category is required", (value) => {
                if (value === "0") {
                    return false
                }
                return true
            })

    });
    const { register, handleSubmit, unregister, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });


    useEffect(() => {
        fetchPostDetail();
        getCat();
    }, []);

    const fetchUserInfo = (passId, oldData, setFunction) => {
        fetch(`http://localhost:9000/profile/profiledetails/${passId}`)
            .then((res) => res.json())
            .then((dataProfile) => {
                setFunction({ ...oldData, username: dataProfile.username });
                defaultValue.current = oldData;
            });
    };

    const getCat = async () => {
        try {
            const res = await axios.get(
                'http://localhost:9000/post_categories/'
            );
            const myCat = res?.data || {};
            setCatId(myCat);
        } catch (err) { }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:9000/forums/posts/${id}`);
            window.location.replace('http://localhost:3000/forum');
        } catch (err) { }
    };

    const handleUpdate = async (e) => {
        const data = new FormData();
        data.append("title", e.title)
        data.append("content", e.content)
        data.append("post_category_id", e.cat)


        data.append('image', e.image[0]);

        try {
            await axios.put(
                'http://localhost:9000/forums/posts/' + postDetail._id,
                data
            );
            window.location.replace(
                'http://localhost:3000/forum/post/postdetail/' + postDetail._id
            );
        } catch (err) { }
    };

    const fetchPostDetail = () => {
        fetch(endPoint)
            .then((response) => response.json())
            .then((data) => {
                fetchUserInfo(data.user_id, data, setpostDetail);
            });
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-lg-4 col-md-12 ps-5 pe-5'>
                    <Sidebar isUser={props.isUser}
                        showCreatePostForm={showCreatePostForm}
                        showForm={(showCreatePostForm) =>
                            setShowCreatePostForm(showCreatePostForm)
                        }
                    />
                </div>
                <div className='col-lg-6 col-md-12'>
                    {showCreatePostForm && <CreatePost />}
                    <div className='row'>
                        <article>
                            <header class='my-4'>
                                <div>
                                    <h1 className='fw-bolder'>
                                        {postDetail.title}
                                    </h1>

                                    <span className="pull-right">
                                        {(props.isAdmin || (props.isUser && currentUser.id === postDetail.user_id)) && (<button type='button' className='btn btn-outline-danger me-2' onClick={handleDelete}>Delete This Post</button>)}
                                        {props.isUser && currentUser.id === postDetail.user_id && (
                                            <button type='button' className='btn btn-outline-warning' data-bs-toggle="modal" data-bs-target="#exampleModal">Edit This Post</button>)}
                                    </span>
                                </div>
                                <p class='text-muted fst-italic'>
                                    Last edited{' '}
                                    {countTimeDiff(postDetail.updatedAt)} by{' '}
                                    {postDetail.username}
                                </p>

                                <p class='fw-normal'>
                                    Category:
                                    {catId.map((cate) =>
                                        cate._id === postDetail.post_category_id &&
                                        <a href={`/forum/categorized/${cate._id}`} class='btn btn-light btn-sm'>
                                            {cate.name}
                                        </a>
                                    )}
                                </p>
                            </header>
                            <section className='mb-2 ' style={{ textAlign: 'justify' }}>
                                <p className='lh-base mb-4 fs-5 lead'>{postDetail && postDetail.content && nl2br(postDetail.content)}</p>
                            </section>

                            {postDetail.image && (
                                <figure className='img-fluid'>
                                    <img
                                        src={`https://covi-away-app.s3.amazonaws.com/${postDetail.image}`}
                                        className='d-block w-100 img-fluid'
                                        alt='...'
                                    />
                                </figure>
                            )}

                        </article>
                        <CommentSection isAdmin={props.isAdmin} isUser={props.isUser} />

                    </div>
                </div>
            </div>
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Edit Post</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form onSubmit={handleSubmit(handleUpdate)} enctype='multipart/form-data'>
                                <div class='row'>
                                    <div class='form-group mb-3 col-7'>
                                        <label for='posttitle'>Title</label>
                                        <input type='text' name="title" class={`form-control border border-secondary ${errors.title ? 'is-invalid' : ''}`} placeholder='Post Title' id='posttitle' defaultValue={postDetail && postDetail.title} {...register('title')} />
                                        <div className='invalid-feedback'> {errors.title?.message}</div>
                                    </div>
                                    <div class='form-group mb-3 col-5'>
                                        <label for='inputGroupSelect01'>
                                            Category
                                        </label>
                                        <div>
                                            <select class={`custom-select  ${errors.cat ? 'is-invalid' : ''}`} name="post_category_id" id='inputGroupSelect01' style={{ height: '35px' }} {...register('cat')}>
                                                <option value="0"> Choose Category</option>
                                                {catId.map((cate) => (
                                                    <option value={cate._id} selected={postDetail && postDetail.post_category_id === cate._id ? "selected" : ""}>
                                                        {cate.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className='invalid-feedback'>
                                                {errors.cat?.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class='form-group mb-3'>
                                    <label for='postcontent'>Content</label>
                                    <textarea
                                        class={`form-control border border-secondary ${errors.content ? 'is-invalid' : ''
                                            }`}
                                        name="content"
                                        placeholder='Post Content'
                                        id='postcontent' defaultValue={postDetail && postDetail.content} {...register('content')}
                                    ></textarea>
                                    <div className='invalid-feedback'>
                                        {errors.content?.message}
                                    </div>
                                </div>

                                <div class='form-group mb-3'>
                                    <div class='custom-file'>
                                        <label class='custom-file-label' for='inputGroupFile01'>Upload Image</label>
                                        <br />
                                        <input
                                            type='file' name="image"
                                            class={`custom-file-input ${errors.image ? 'is-invalid' : ''
                                                }`}
                                            id='inputGroupFile01'
                                            {...register('image')}

                                        />
                                        <div className='invalid-feedback'>
                                            {errors.image?.message}
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" class="btn btn-primary" onClick={() => {

                                        unregister("title", { keepDefaultValue: true });

                                        unregister("content", { keepDefaultValue: true });

                                        unregister("cat", { keepDefaultValue: true });

                                        unregister("image", { keepDefaultValue: true });

                                    }}>Upload</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default PostDetail;
