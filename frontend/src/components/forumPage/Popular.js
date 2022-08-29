import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Post from './Post';
import CreatePost from './CreatePost';
import { countTimeDiff } from '../../utils';

export default function Popular(props) {
    const [Posts, setPosts] = useState([]);
    const [numOfLoad, setNumOfLoad] = useState(0);
    const [sortedPostArray, setSortedPostArray] = useState([]);
    //const [postUserInfo, setPostUserInfo] = useState({})
    // const fetchPostUser = (userId) => {
    //     var newElement = {}
    //     fetch(`http://localhost:9000/profile/${userId}`)
    //     .then(res => res.json())
    //     .then(data => setPostUserInfo({username: data.username}))
    // }
    const fetchPost = () => {
        fetch(`http://localhost:9000/forums/posts?skip=${numOfLoad}`)
            .then((response) => response.json())
            .then((data) => {
                data.map(async function (postElement) {
                    await fetch(
                        `http://localhost:9000/profile/profiledetails/${postElement.user_id}`
                    )
                        .then((res) => res.json())
                        .then((data) => {
                            setPosts((Posts) => [
                                ...Posts,
                                {
                                    ...postElement,
                                    username: data.username,
                                    followers: data.followers,
                                },
                            ]);
                        });
                    // .then(res => setPosts(Posts => [...Posts, res]));
                    //fetchPostUser(postElement.user_id)
                });
                //setPosts(data);
            });
    };
    const sortPostArray = () => {
        var newPostArray = [...Posts];
        newPostArray.sort((first, second) => {
            return second.vote.length - first.vote.length;
        });
        setSortedPostArray(newPostArray);
    };

    useEffect(() => {
        fetchPost();
    }, [numOfLoad]);

    useEffect(() => {
        sortPostArray();
    }, [Posts]);
    const [showCreatePostForm, setShowCreatePostForm] = useState(false);
    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-lg-4 col-md-12 ps-5 pe-5'>
                    <Sidebar isUser = {props.isUser}
                        setPostList={(e) => setPosts(e)}
                        showCreatePostForm={showCreatePostForm}
                        showForm={(showCreatePostForm) =>
                            setShowCreatePostForm(showCreatePostForm)
                        }
                    />
                </div>

                <div className='col-lg-6 col-md-12'>
                    {showCreatePostForm && <CreatePost />}
                    {sortedPostArray.map((element) => {
                        return (
                            <Post
                                isUser={props.isUser}
                                createdAt={countTimeDiff(element.createdAt)}
                                element={element}
                            />
                        );
                    })}
                    <div style={{ textAlign: 'center' }}>
                        <button type="button"
                            className='btn btn-dark'
                            onClick={() => {
                                setNumOfLoad(numOfLoad + 1);
                            }}
                        >Load More
                        </button>
                    </div>
                </div>
                <div className='col-lg-2 col-md-0 mt-3'>
                    {/*<button type="button" className="btn btn-dark" style={{ marginLeft: "35%" }} onClick={() => setShowCreatePostForm(!showCreatePostForm)}>{showCreatePostForm ? "Close Form" : "Create New Post"}</button>   */}
                </div>
            </div>
        </div>
    );
}
