import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function BreakingNewsCarousel(props) {
    const endPoint = 'http://localhost:9000/news';
    const [breakingNewsList, setBreakingNewsList] = useState([]);
    const getBreakingNews = () => {
        fetch(endPoint + '/breakingnews')
            .then((res) => res.json())
            .then((data) => {
                setBreakingNewsList(data);
            });
    };
    useEffect(() => {
        getBreakingNews();
    }, []);
    return (
        <div>
            <div
                id='carouselExampleCaptions'
                className='carousel slide mb-3 mt-3'
                data-bs-ride='carousel'
            >
                <div className='carousel-indicators' id='breakingButton'>
                    {breakingNewsList.map((element, i) => {
                        return (
                            <button
                                type='button'
                                data-bs-target='#carouselExampleCaptions'
                                data-bs-slide-to={`${i}`}
                                className={`${i === 0 ? 'active' : ''}`}
                                aria-current={`${i === 0 ? 'true' : ''}`}
                                aria-label={`Slide ${i + 1}`}
                            ></button>
                        );
                    })}
                </div>
                <div className='carousel-inner'>
                    {breakingNewsList.map((element, i) => (
                        <div
                            className={`carousel-item ${i === 0 && 'active'}`}
                            style={{ height: '300px' }}
                        >
                            <Link to={`/articles/${element._id}`}>
                                <img
                                    src={element.image && `https://covi-away-app.s3.amazonaws.com/${element.image}`}
                                    style={{
                                        opacity: '32%',
                                        maxWidth: '1500px',
                                        maxHeight: '300px',
                                    }}
                                    className='d-block w-100 img-fluid'
                                    alt='...'
                                />
                                <div
                                    className='carousel-caption d-none d-md-block'
                                    style={{ color: 'black' }}
                                >
                                    <h2>{`${element.title}`}</h2>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <button
                    className='carousel-control-prev'
                    type='button'
                    data-bs-target='#carouselExampleCaptions'
                    data-bs-slide='prev'
                >
                    <span
                        className='carousel-control-prev-icon'
                        aria-hidden='true'
                    ></span>
                    <span className='visually-hidden'>Previous</span>
                </button>
                <button
                    className='carousel-control-next'
                    type='button'
                    data-bs-target='#carouselExampleCaptions'
                    data-bs-slide='next'
                >
                    <span
                        className='carousel-control-next-icon'
                        aria-hidden='true'
                    ></span>
                    <span className='visually-hidden'>Next</span>
                </button>
            </div>
        </div>
    );
}
