import Post from '../forumPage/Post';

import ProfileCard from './ProfileCard';
import './profile.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { countTimeDiff } from '../../utils';

export default function MyProfile(props) {
    const { id } = useParams();
    const [numOfLoad, setNumOfLoad] = useState(1);
    const endPoint = `http://localhost:9000/forums/userpost/${id}?limit=${numOfLoad*10}`;
    const [userPost, setuserPost] = useState([]);
    const fetchUserPost = () => {
        fetch(endPoint)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setuserPost(data);
            });
    };

    const [userProfile, setuserProfile] = useState();
    const fetchUserProfile = () => {
        fetch(`http://localhost:9000/profile/profiledetails/${id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setuserProfile(data);
            });
    };
    useEffect(() => {
        fetchUserProfile();
    }, []);
    useEffect(() => {
        fetchUserPost();
    }, [numOfLoad])

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-lg-2'></div>
                <div className='col-lg-8 col-md-12'>
                    <ProfileCard
                        user={userProfile !== undefined && userProfile}
                        isUser={props.isUser}
                    />
                    <div className='posts'>
                        {userPost.map((element) => {
                            console.log(element);
                            return (
                                <Post
                                    isProfilePage={true}
                                    username={
                                        userProfile !== undefined &&
                                        userProfile.username
                                    }
                                    element={element}
                                    createdAt={countTimeDiff(element.createdAt)}
                                    isUser={props.isUser}
                                />
                            );
                        })}
                    </div>
                </div>
                <div class="col-lg-2 ms-auto me-auto">
                </div>
                <div className='col-lg-2 ms-auto me-auto'></div>
            </div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{ textAlign: 'center' }}>
                    <button type="button"
                        className='btn btn-dark'
                        onClick={() => {
                            setNumOfLoad(numOfLoad + 1);
                        }}
                    >Load More
                    </button>
                </div>
                <div className='col-lg-2'></div>
            </div>
        </div>
    );
}
