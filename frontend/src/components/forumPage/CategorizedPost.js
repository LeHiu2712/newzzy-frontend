import Sidebar from './Sidebar';
import Post from './Post';
import { useParams } from 'react-router';
import CreatePost from './CreatePost';
import { useState, useEffect } from 'react';
import { countTimeDiff } from '../../utils';

export default function CategorizedPost(props) {
    const [categorizedPosts, setCategorizedPosts] = useState([]);
    const [numOfLoad, setNumOfLoad] = useState(0);
    const [sortedPostArray, setSortedPostArray] = useState([])
    let { categorized_id } = useParams()
    const endPoint = `http://localhost:9000/categorize/categorize_post/${categorized_id}?skip=${numOfLoad}`
    const fetchCategorizedPost = async () => {
        fetch(endPoint)
            .then((response) => response.json())
            .then((data) => {
                //setCategorizedPosts(data)
                data.map(async (postElement) => {
                    var newElement = {};
                    await fetch(`http://localhost:9000/profile/profiledetails/${postElement.user_id}`)
                        .then((res) => res.json())
                        .then((dataProfile) => newElement = { ...postElement, username: dataProfile.username, followers: dataProfile.followers })
                        .then(res => setCategorizedPosts(categorizedPosts => [...categorizedPosts, res]));

                });
            })
    }
    const sortPostArray = () => {
        var newPostArray = [...categorizedPosts];
        newPostArray.sort((first, second) => {
            return (new Date(second.createdAt) - new Date(first.createdAt))
        })
        setSortedPostArray(newPostArray)
    }

    useEffect(() => {
        fetchCategorizedPost();
    }, [numOfLoad]);

    useEffect(() => {
        sortPostArray();
    }, [categorizedPosts]);

    const [showCreatePostForm, setShowCreatePostForm] = useState(false);
    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-lg-4 col-md-12 ps-5 pe-5'>
                    <Sidebar isUser={props.isUser} showCreatePostForm={showCreatePostForm} showForm={(showCreatePostForm) => setShowCreatePostForm(showCreatePostForm)} />
                </div>

                <div className='col-lg-6 col-md-12'>
                    {showCreatePostForm && <CreatePost />}
                    {sortedPostArray.map((element, i) => {
                        return (
                            <Post
                                key={i}
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
    )
}