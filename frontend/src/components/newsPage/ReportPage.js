import { useParams } from 'react-router';
import { useState } from 'react';
import { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    useRouteMatch,
} from 'react-router-dom';
import defaultAvatar from './../../defaultAvatar.jpg'

export default function ReportPage(props) {
    const { id } = useParams();

    const endPoint = `http://localhost:9000/newsdata/articles`;

    const [item, setItem] = useState();

    const redirectToMainPage = () => {
        window.location.replace('http://localhost:3000');
    };

    const load = () => {
        fetch(endPoint + '/' + id)
            .then((response) => response.json())
            .then((data) =>
                fetch(
                    `http://localhost:9000/profile/profiledetails/${data.user_id}`
                )
                    .then((res) => res.json())
                    .then((dataUser) =>
                        setItem({ ...data, name: dataUser.name, avatar: dataUser.avatar })
                    )
            );
    };

    const deleteNews = () => {
        console.log('clicked');
        fetch(endPoint + '/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id: id }),
        }).then(response => response.json()).then(data => redirectToMainPage());
    };
    const breakLine = <br />;

    // function nl2br(str, is_xhtml) {
    //     if (typeof str === 'undefined' || str === null) {
    //         return '';
    //     }
    //     //var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? <br /> : <br>;
    //     return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakLine + '$2');
    // }

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

    //load data automatically
    useEffect(() => {
        load();
    }, []);

    return (
        <div>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-lg-2'></div>
                    <div className='col-lg-8 col-md-12'>
                    <figure className='text-center my-5'>
                            <h1 className='display-2'>{item && item.title}</h1>
                            <a href={item && `/profile/${item.user_id}`} style={{textDecoration: "none", color:"black"}}><img
                                className='rounded-circle shadow my-3'
                                src={item && item.avatar ? `https://covi-away-app.s3.amazonaws.com/${item.avatar}` : defaultAvatar}
                                alt='Profile picture'
                                style={{ width: '80px', height: '80px' }}
                            ></img>
                            <p className='lead'>{item && item.name}</p></a>
                        </figure>
                        <p className='lead'>
                            Created at:{' '}
                            {item && item.createdAt.substring(0, 10)} (Updated:{' '}
                            {item && item.updatedAt.substring(0, 10)})
                        </p>
                        <hr className='bg-secondary border-2 border-top border-secondary'></hr>
                        <figure className='text-center my-5'>
                            <div style={{ textAlign: 'justify' }}>
                                <div className='card my-3'>
                                    <figure className='text-center my-2'>
                                        <img
                                            style={{ width: '90%' }}
                                            src={item && item.image && `https://covi-away-app.s3.amazonaws.com/${item.image}`}
                                            alt='Image'
                                        />
                                    </figure>
                                </div>
                                <p className='fw-normal lh-base'>
                                    {item && nl2br(item.content)}
                                </p>
                            </div>
                        </figure>
                        <hr className='bg-secondary border-2 border-top border-secondary'></hr>
                        <a href={item && `/profile/${item.user_id}`} style={{textDecoration: "none", color:"black"}}><figure className='text-start border border-light border-2 my-3'>
                            <h6>
                                <img
                                    className='rounded-circle shadow my-3 mx-3'
                                    src={item && item.avatar ? `https://covi-away-app.s3.amazonaws.com/${item.avatar}` : defaultAvatar}
                                    alt='Profile picture'
                                    style={{ width: '80px', height: '80px' }}
                                ></img>{' '}
                                Reporter {item && item.name}
                            </h6>
                        </figure></a>
                    </div>

                    {props.isReporter &&
                    props.currentUser &&
                    item &&
                    props.currentUser.id === item.user_id ? (
                        <div className='col-lg-2'>
                            <figure className='text-center my-5'>
                                <button
                                    type='button'
                                    className='btn btn-danger w-100'
                                    data-bs-toggle='modal'
                                    data-bs-target='#deleteModal'
                                >
                                    Delete This Article
                                </button>
                                <button
                                    type='button'
                                    className='btn btn-warning my-3 w-100'
                                >
                                    <Link
                                        to={`/editnews/${item && item._id}`}
                                        style={{
                                            'text-decoration': 'none',
                                            color: 'black',
                                        }}
                                    >
                                        Edit This Article
                                    </Link>
                                </button>
                            </figure>

                            <div
                                className='modal fade'
                                id='deleteModal'
                                tabindex='-1'
                                aria-labelledby='deleteModalLabel'
                                aria-hidden='true'
                            >
                                <div className='modal-dialog modal-dialog-centered'>
                                    <div className='modal-content'>
                                        <div className='modal-body'>
                                            Do you want to delete this post?
                                        </div>
                                        <div className='modal-footer'>
                                            <button
                                                type='button'
                                                className='btn btn-secondary'
                                                data-bs-dismiss='modal'
                                            >
                                                No
                                            </button>
                                            <button
                                                type='button'
                                                className='btn btn-primary'
                                                onClick={() => deleteNews()}
                                            >
                                                Yes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='col-lg-2'></div>
                    )}
                </div>
            </div>
        </div>
    );
}
