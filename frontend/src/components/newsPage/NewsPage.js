import NewsCard from './NewsCard';
import BreakingNewsCarousel from './BreakingNewsCarousel';
import TopNew from './TopNew';
import {
    BrowserRouter as Router,
    Route,
    Link,
    useRouteMatch,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../../App.css';
import { countTimeDiff } from '../../utils';

export default function NewsPage() {
    const endPoint = 'http://localhost:9000/news';
    const [newsCategoryList, setNewsCategoryList] = useState([]);
    const [latestCovidDataVietnam, setLatestCovidDataVietnam] = useState();
    const [latestCovidDataGlobal, setLatestCovidDataGlobal] = useState();
    const [categorizedNewsList, setCategoriedNewsList] = useState([]);

    useEffect(() => {
        fetchAllNewsCategory();
        getLatestCovidData();
    }, []);

    const fetchAllNewsCategory = () => {
        fetch(endPoint + '/newscategory')
            .then((res) => res.json())
            .then((data) => {
                data.sort((first, second) => {
                    return first.name === 'Cases'
                        ? -1
                        : second.name === 'Cases'
                        ? 1
                        : 0;
                });
                setNewsCategoryList(data);
                data.map((element) =>
                    fetch(endPoint + `/specific/${element._id}?limit=4`)
                        .then((res) => res.json())
                        .then((data) => {
                            setCategoriedNewsList((categorizedNewsList) => [
                                ...categorizedNewsList,
                                data,
                            ]);
                        })
                );
            });
    };

    const getLatestCovidData = () => {
        fetch('https://corona.lmao.ninja/v2/countries/VN')
            .then((res) => res.json())
            .then((data) => {
                setLatestCovidDataVietnam(data);
            });
        fetch('https://corona.lmao.ninja/v2/all')
            .then((res) => res.json())
            .then((data) => {
                setLatestCovidDataGlobal(data);
            });
    };

    return (
        <div>
            <div className='container'>
                <a
                    href='/breaking'
                    className='btn btn-danger btn-sm mt-3'
                    tabindex='-1'
                    role='button'
                    aria-disabled='true'
                >
                    BREAKING NEWS
                </a>
                <div className='row'>
                    <div className='col-12'>
                        <BreakingNewsCarousel />
                    </div>
                </div>
            </div>
            {newsCategoryList.map((element, indexCate) => {
                return (
                    <div
                        className='container'
                        key={indexCate}
                        style={{ marginTop: '2%' }}
                    >
                        <a
                            href={`/category/${element._id}`}
                            className='categoryroute'
                            style={{ textDecoration: 'none', color: 'black' }}
                        >
                            <h1>
                                {`${element.name}`}
                                <i className='fas fa-arrow-right ms-3'></i>
                            </h1>
                        </a>
                        {newsCategoryList.length !== 0 &&
                            categorizedNewsList.length ===
                                newsCategoryList.length &&
                            categorizedNewsList.map((news, i) => {
                                if (
                                    news[0] !== undefined &&
                                    news[0].news_category_id === element._id
                                ) {
                                    return (
                                        <div>
                                            <div className='row mb-3'>
                                                <div className='col-lg-8 col-md-12 mt-3 order-lg-first'>
                                                    <div className='row'>
                                                        <Link
                                                            to={`/articles/${news[0]._id}`}
                                                            style={{
                                                                textDecoration:
                                                                    'none',
                                                                color: 'black',
                                                            }}
                                                        >
                                                            <TopNew
                                                                news={news[0]}
                                                                createdDiffTime={countTimeDiff(
                                                                    news[0]
                                                                        .createdAt
                                                                )}
                                                            />
                                                        </Link>
                                                    </div>
                                                </div>
                                                {indexCate === 0 ? (
                                                    <div className='col-lg-4 col-md-12 mt-3 order-md-first order-sm-first order-first'>
                                                        {latestCovidDataVietnam ? (
                                                            <div
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                }}
                                                            >
                                                                <h1>
                                                                    Vietnam Live
                                                                    Statistics
                                                                </h1>
                                                                <div
                                                                    style={{
                                                                        color: 'red',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Total
                                                                        Cases:{' '}
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {latestCovidDataVietnam.cases &&
                                                                            latestCovidDataVietnam.cases
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        color: 'grey',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Deaths:{' '}
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {latestCovidDataVietnam.deaths &&
                                                                            latestCovidDataVietnam.deaths
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        color: 'green',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Recovered:{' '}
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {latestCovidDataVietnam.recovered &&
                                                                            latestCovidDataVietnam.recovered
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        color: '#FFB830',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Active
                                                                        cases:
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {' '}
                                                                        {latestCovidDataVietnam.active &&
                                                                            latestCovidDataVietnam.active
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                Vietnam Case
                                                                Statistics: See
                                                                below link
                                                            </div>
                                                        )}
                                                        {latestCovidDataGlobal ? (
                                                            <div
                                                                className='mt-2'
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                }}
                                                            >
                                                                <h1>
                                                                    Global Live
                                                                    Statistics
                                                                </h1>
                                                                <div
                                                                    style={{
                                                                        color: 'red',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Total
                                                                        Cases:{' '}
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {latestCovidDataGlobal.cases &&
                                                                            latestCovidDataGlobal.cases
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        color: 'grey',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Deaths:{' '}
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {latestCovidDataGlobal.deaths &&
                                                                            latestCovidDataGlobal.deaths
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        color: 'green',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Recovered:{' '}
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {latestCovidDataGlobal.recovered &&
                                                                            latestCovidDataGlobal.recovered
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        color: '#FFB830',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Active
                                                                        cases:
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {' '}
                                                                        {latestCovidDataGlobal.active &&
                                                                            latestCovidDataGlobal.active
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                Global Case
                                                                Statictics See
                                                                below link
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className='col-lg-4 col-md-12 mt-3'>
                                                        {news.length > 1 && (
                                                            <Link
                                                                to={`/articles/${news[1]._id}`}
                                                                style={{
                                                                    textDecoration:
                                                                        'none',
                                                                    color: 'black',
                                                                }}
                                                            >
                                                                <TopNew
                                                                    news={
                                                                        news[1]
                                                                    }
                                                                    createdDiffTime={countTimeDiff(
                                                                        news[1]
                                                                            .createdAt
                                                                    )}
                                                                />
                                                            </Link>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className='row'>
                                                <div className='col-lg col-md-12'>
                                                    {news.length > 1 &&
                                                    indexCate === 0 ? (
                                                        <Link
                                                            to={`/articles/${news[1]._id}`}
                                                            style={{
                                                                textDecoration:
                                                                    'none',
                                                                color: 'black',
                                                            }}
                                                        >
                                                            <NewsCard
                                                                news={news[1]}
                                                                createdDiffTime={countTimeDiff(
                                                                    news[1]
                                                                        .createdAt
                                                                )}
                                                            />
                                                        </Link>
                                                    ) : (
                                                        news.length > 2 && (
                                                            <Link
                                                                to={`/articles/${news[2]._id}`}
                                                                style={{
                                                                    textDecoration:
                                                                        'none',
                                                                    color: 'black',
                                                                }}
                                                            >
                                                                <NewsCard
                                                                    news={
                                                                        news[2]
                                                                    }
                                                                    createdDiffTime={countTimeDiff(
                                                                        news[2]
                                                                            .createdAt
                                                                    )}
                                                                />
                                                            </Link>
                                                        )
                                                    )}
                                                </div>
                                                <div className='col-lg col-md-12'>
                                                    {news.length > 2 &&
                                                    indexCate === 0 ? (
                                                        <Link
                                                            to={`/articles/${news[2]._id}`}
                                                            style={{
                                                                textDecoration:
                                                                    'none',
                                                                color: 'black',
                                                            }}
                                                        >
                                                            <NewsCard
                                                                news={news[2]}
                                                                createdDiffTime={countTimeDiff(
                                                                    news[2]
                                                                        .createdAt
                                                                )}
                                                            />
                                                        </Link>
                                                    ) : (
                                                        news.length > 3 && (
                                                            <Link
                                                                to={`/articles/${news[3]._id}`}
                                                                style={{
                                                                    textDecoration:
                                                                        'none',
                                                                    color: 'black',
                                                                }}
                                                            >
                                                                <NewsCard
                                                                    news={
                                                                        news[3]
                                                                    }
                                                                    createdDiffTime={countTimeDiff(
                                                                        news[3]
                                                                            .createdAt
                                                                    )}
                                                                />
                                                            </Link>
                                                        )
                                                    )}
                                                </div>
                                                {/* <div className="col">
                                        {news.length > 3 &&
                                            indexCate === 0 ?
                                            <Link to={`/articles/${news[3]._id}`} style={{ "textDecoration": "none", "color": "black" }}>
                                                <NewsCard news={news[3]} createdDiffTime={countTimeDiff(news[3].createdAt)} />
                                            </Link> : news.length > 4 && <Link to={`/articles/${news[4]._id}`}style={{ "textDecoration": "none", "color": "black" }}>
                                                <NewsCard news={news[4]} createdDiffTime={countTimeDiff(news[4].createdAt)} />
                                            </Link>
                                        }
                                    </div> */}
                                            </div>
                                        </div>
                                    );
                                } else if (news[0] === undefined) {
                                    return (
                                        <div>
                                            <div className='row mb-3'>
                                                <div className='col-8'></div>
                                                {element.name === 'Cases' && (
                                                    <div className='col-4'>
                                                        {latestCovidDataVietnam ? (
                                                            <div
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                }}
                                                            >
                                                                <h1>
                                                                    Vietnam Live
                                                                    Statistics
                                                                </h1>
                                                                <div
                                                                    style={{
                                                                        color: 'red',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Total
                                                                        Cases:{' '}
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {latestCovidDataVietnam.confirmed &&
                                                                            latestCovidDataVietnam.confirmed
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        color: 'grey',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Deaths:{' '}
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {latestCovidDataVietnam.deaths &&
                                                                            latestCovidDataVietnam.deaths
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        color: 'green',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Recovered:{' '}
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {latestCovidDataVietnam.recovered &&
                                                                            latestCovidDataVietnam.recovered
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        color: '#FFB830',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Active
                                                                        cases:
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {' '}
                                                                        {latestCovidDataVietnam.critical &&
                                                                            latestCovidDataVietnam.critical
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                Vietnam Case
                                                                Statistics: See
                                                                below link
                                                            </div>
                                                        )}
                                                        {latestCovidDataGlobal ? (
                                                            <div
                                                                className='mt-2'
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                }}
                                                            >
                                                                <h1>
                                                                    Global Live
                                                                    Statistics
                                                                </h1>
                                                                <div
                                                                    style={{
                                                                        color: 'red',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Total
                                                                        Cases:{' '}
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {latestCovidDataGlobal.cases &&
                                                                            latestCovidDataGlobal.cases
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        color: 'grey',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Deaths:{' '}
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {latestCovidDataGlobal.deaths &&
                                                                            latestCovidDataGlobal.deaths
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        color: 'green',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Recovered:{' '}
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {latestCovidDataGlobal.recovered &&
                                                                            latestCovidDataGlobal.recovered
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        color: '#FFB830',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    >
                                                                        Active
                                                                        cases:
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            fontSize: 35,
                                                                            fontWeight:
                                                                                'bold',
                                                                        }}
                                                                    >
                                                                        {' '}
                                                                        {latestCovidDataGlobal.active &&
                                                                            latestCovidDataGlobal.active
                                                                                .toString()
                                                                                .replace(
                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                    ','
                                                                                )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                Global Case
                                                                Statictics See
                                                                below link
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                    </div>
                );
            })}
        </div>
    );
}
