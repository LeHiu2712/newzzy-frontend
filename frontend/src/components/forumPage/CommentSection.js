import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import lodash from 'lodash';
import { useParams } from 'react-router';
import { countTimeDiff } from '../../utils';
import defaultAvatar from './../../defaultAvatar.jpg'

const CommentSection = ({ isUser, isAdmin }) => {
    const { id } = useParams();

    const [fetchComment, setFetchComment] = useState([]);
    const [sortedCommentArray, setSortedCommentArray] = useState([]);
    const [contentComment, setContentComment] = useState();
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const getComment = () => {
        axios.get(`http://localhost:9000/forums/comment/${id}`)
            .then(async (response) => {
                if (Array.isArray(response?.data)) {
                    const temp = response.data.filter((item) =>
                        item.hasOwnProperty('user_id')
                    );
                    const modified = [];
                    for (let i = 0; i < temp.length; ++i) {
                        const userId = temp[i].user_id;
                        await axios
                            .get(
                                `http://localhost:9000/profile/profiledetails/${userId}`
                            )
                            .then((result) => {
                                if (result?.data) {
                                    const { username, name, avatar } = result.data;
                                    modified.push({
                                        ...temp[i],
                                        username,
                                        name,
                                        avatar
                                    });
                                }
                            })
                            .catch((error) => console.error(error));
                    }
                    await modified.sort((first, second) => {
                        return (new Date(second.createdAt) - new Date(first.createdAt))
                    })
                    setFetchComment(modified);
                }
            })
            .catch((error) => console.error(error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post('http://localhost:9000/forums/comments', {
                content: contentComment,
                user_id: currentUser.id,
                post_id: id,
            })
            .catch((err) => { });
        window.location.reload();
    };

    const handleChangeComment = (e) => {
        const debounce = lodash.debounce(
            (value) => setContentComment(value),
            300
        );
        debounce(e.target.value);
    };
    const sortCommentArray = () => {
        var newCommentArray = [...fetchComment];
        setSortedCommentArray(newCommentArray)
    }
    useEffect(() => {
        getComment();
    }, []);
    // useEffect(() => {
    //     sortCommentArray()
    //     console.log(fetchComment)
    // }, [fetchComment]);


    return (
        <section>
            <div className='mt-5'>
                <div className='card bg-light'>
                    <div className='card-body container'>
                        <div className='row'>
                            <form className='my-4 mx-2' onSubmit={handleSubmit}>
                                <div className='form-floating'>
                                    <textarea
                                        className='form-control'
                                        placeholder='Leave a comment here'
                                        id='floatingTextarea2'
                                        style={{
                                            height: '100px',
                                        }}
                                        onChange={handleChangeComment}
                                    />
                                    <label htmlFor='floatingTextarea2'>
                                        Comments
                                    </label>
                                </div>
                                <button
                                    type='submit'
                                    className='btn btn-dark mt-3 pull-right'
                                >
                                    Post
                                </button>
                            </form>
                        </div>
                        <div class="container-fluid">
                            {fetchComment.length > 0 &&
                                fetchComment.map((item) => (
                                    <CommentObject data={item} isUser={isUser} isAdmin={isAdmin} />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const CommentObject = ({ data, isUser, isAdmin }) => {
    const { username, content, _id, user_id, createdAt, avatar } = data || {};
    const [isEditing, setIsEditing] = useState(false);
    const [updateDataComment, setUpdateDataComment] = useState();
    const currentComment = useRef(content);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const handleDeleteComment = () => {
        axios
            .delete(`http://localhost:9000/forums/comment/${_id}`)
            .catch((error) => console.error(error))
            .finally(() => window.location.reload());
    };

    const handleEditComment = () => {
        if (isEditing) {
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };
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

    const handleUpdateComment = (e) => {
        if (updateDataComment === currentComment.current) {
            setIsEditing(false);
        } else {
            e.preventDefault();
            axios
                .put(`http://localhost:9000/forums/comment/${_id}`, {
                    content: updateDataComment,
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    setIsEditing(false);
                    window.location.reload();
                });
        }
    };
    return (
        <div>
            <div className='row' key={_id}>
                <div className='col-1'>
                    <img
                        className='rounded-circle'
                        src={avatar ? `https://covi-away-app.s3.amazonaws.com/${avatar}` : defaultAvatar}
                        alt='...'
                        width="50" height="50"
                    />
                </div>
                <div className='d-flex mb-3 col-11'>
                    <div className='ms-3'>
                        <div><span className='fw-bold'>{username}</span><span className="ms-2">{countTimeDiff(createdAt)}</span></div>
                        {isEditing ? (
                            <textarea
                                onChange={(e) =>
                                    setUpdateDataComment(e.target.value)
                                }
                            >
                                {content}
                            </textarea>
                        ) : (
                            <div>{content && nl2br(content)}</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="row" style={{ marginBottom: "2%" }}>
                <div className="col-1"></div>
                <div className="col-4">
                    {(isAdmin || (isUser && user_id === currentUser.id)) &&
                    <span style={{ marginLeft: "2%" }}
                        className='btn btn-outline-danger'
                        onClick={handleDeleteComment}
                    >
                        Delete
                    </span>
                    }
                    {(isUser && user_id === currentUser.id) && (
                        <span>
                            <span style={{ marginLeft: "2%" }}
                                className='btn btn-outline-warning'
                                onClick={handleEditComment}
                            >
                                {isEditing ? "Cancel" : "Edit"}
                            </span>
                            {isEditing && (
                                <span style={{ marginLeft: "2%" }}
                                    className='btn btn-outline-success'
                                    onClick={handleUpdateComment}
                                >
                                    Send
                                </span>
                            )}
                        </span>
                    )}
                </div>
                <div className="col-7"></div>
            </div>
        </div>
    );
};

export default CommentSection;
