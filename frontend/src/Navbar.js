import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useEffect, useState } from 'react';
import weblogo from './weblogo.png';
import defaultAvatar from './defaultAvatar.jpg'
export default function Navbar(props) {
    const endPoint = 'http://localhost:9000/news';

    const [newsCategoryList, setNewsCategoryList] = useState([]);
    const [currentUserInfo, setCurrentUserInfo] = useState()
    const [searchUsername, setSearchUsername] = useState();
    const [searchResult, setSearchResult] = useState()

    useEffect(() => {
        fetchAllNewsCategory();
    }, []);
    const searchUsernameFunction = () => {
        fetch(`http://localhost:9000/profile/search/${searchUsername}`)
            .then(res => res.json())
            .then(data => {
                setSearchResult(data)
                document.getElementById("searchResultButton").click();
            })
    }

    const logout = () => {
        localStorage.removeItem('user');
        window.location.replace('http://localhost:3000');
    };

    const fetchAllNewsCategory = () => {

        fetch(endPoint + '/newscategory').then(res => res.json()).then(data => {
            data.sort((first, second) => {
                return first.name === 'Cases' ? -1 : second.name === 'Cases' ? 1 : 0
            })
            setNewsCategoryList(data)
        })
    }

    const fetchCurrentUser = () => {
        if (props.currentUser) {
            fetch(`http://localhost:9000/profile/profiledetails/${props.currentUser.id}`)
                .then(res => res.json())
                .then(data => setCurrentUserInfo(data))
        }
    }

    useEffect(() => {
        fetchCurrentUser()
        fetchAllNewsCategory()
    }, [])
    return (
        <>
            <div style={{ position: "sticky", top: "0", zIndex: "1000" }} >
                <nav
                    className='navbar navbar-expand-lg navbar-dark'
                    style={{ backgroundColor: '#A19882' }}
                >
                    <div className='container-fluid'>
                        <a
                            className='navbar-brand'
                            href='/'
                            style={{ fontSize: '25px' }}
                        >
                            <img
                                src={weblogo}
                                alt=''
                                width='40'
                                height='40'
                                className='d-inline-block'
                            />
                            COVI-AWAY
                        </a>
                        <button
                            className='navbar-toggler'
                            type='button'
                            data-bs-toggle='collapse'
                            data-bs-target='#navbarSupportedContent'
                            aria-controls='navbarSupportedContent'
                            aria-expanded='false'
                            aria-label='Toggle navigation'
                        >
                            <span className='navbar-toggler-icon'></span>
                        </button>
                        <div
                            className='collapse navbar-collapse'
                            id='navbarSupportedContent'
                        >
                            <ul
                                className='navbar-nav me-auto mb-2 mb-lg-0'
                                style={{ fontSize: '20px' }}
                            >
                                <li className='nav-item dropdown'>
                                    <a
                                        className='nav-link dropdown-toggle'
                                        href='/'
                                        id='navbarDropdown'
                                        role='button'
                                        data-bs-toggle='dropdown'
                                        aria-expanded='false'
                                    >
                                        News
                                    </a>
                                    <ul
                                        className='dropdown-menu'
                                        aria-labelledby='navbarDropdown'
                                    >
                                        {newsCategoryList.map((eachNew) => (
                                            <li key={eachNew._id}>
                                                <a
                                                    className='dropdown-item'
                                                    href={`/category/${eachNew._id}`}
                                                >
                                                    {eachNew.name}
                                                </a>
                                            </li>
                                        ))}
                                        <li>
                                            <hr className='dropdown-divider' />
                                        </li>
                                        <li>
                                            <a
                                                className='dropdown-item'
                                                href={`/breaking`}
                                            >
                                                Breaking News
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className='nav-item'>
                                    <a className='nav-link' href='/forum'>
                                        Forum
                                    </a>
                                </li>
                            </ul>
                            <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" onSubmit={(e) => { e.preventDefault(); searchUsernameFunction() }}>
                                <input type="search" class="form-control" placeholder="Search Username" aria-label="Search" onChange={(e) => { setSearchUsername(e.target.value) }} />
                            </form>
                            <button type="button" id="searchResultButton" style={{ display: "none" }} class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#searchResultModal"></button>
                            {props.isUser ? <div className="dropdown">
                                <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                                    <img src={currentUserInfo && currentUserInfo.avatar ? `https://covi-away-app.s3.amazonaws.com/${currentUserInfo.avatar}` : defaultAvatar} alt="" width="32" height="32" class="rounded-circle me-2" />
                                    <strong>{props.currentUser.username}</strong>
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownUser2" data-popper-placement="top-end">


                                    {props.isReporter && <li><a class="dropdown-item" href="/articleform">Create News Article</a></li>}
                                    <li><a class="dropdown-item" href={`/profile/${props.currentUser.id}`}>Profile</a></li>
                                    <li><hr class="dropdown-divider" /></li>
                                    <li><a class="dropdown-item" href="/" onClick={(e) => { e.preventDefault(); logout() }}>Sign out</a></li>
                                </ul>
                            </div> : <div><a href="/signup"><button class="btn btn-light me-2" type="button">Sign Up</button></a>
                                <a href="/login"><button class="btn btn-light" type="button">Login</button></a></div>}




                        </div>
                    </div>
                </nav>
            </div>
            <div class="modal fade" id="searchResultModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Result</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            {
                                searchResult && searchResult.map((element) => <div style={{ marginBottom: "5px" }}><a href={`/profile/${element._id}`} style={{ textDecoration: "none", color: 'black', fontSize: "16px" }}>
                                    <img src={element.avatar ? `https://covi-away-app.s3.amazonaws.com/${element.avatar}` : defaultAvatar} alt="" width="32" height="32" class="rounded-circle me-2" />
                                    <span>{element.username}</span>
                                </a></div>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
