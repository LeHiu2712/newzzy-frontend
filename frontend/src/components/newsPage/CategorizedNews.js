import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import NewsCard from './NewsCard';
import TopNew from './TopNew';
import { countTimeDiff } from '../../utils';

export default function CategorizedNews() {
    let { cateId } = useParams();
    const endPoint = 'http://localhost:9000/news';
    const [newsCategoryInfo, setNewsCategoryInfo] = useState();
    const [numOfLoad, setNumOfLoad] = useState(1);
    const [loading, setLoading] = useState(false);
    const [newsList, setNewsList] = useState([]);

    useEffect(() => {
        fetchCategoryInfo();
    }, []);
    useEffect(() => {
        fetchCategorizedNews();
        setLoading(false);
    }, [numOfLoad]);

    const fetchCategorizedNews = () => {
        fetch(endPoint + `/specific/${cateId}?limit=${numOfLoad * 8}`)
            .then((res) => res.json())
            .then((data) => {
                setNewsList(data);
            });
    };

    const fetchCategoryInfo = () => {
        fetch(endPoint + `/category/${cateId}`)
            .then((res) => res.json())
            .then((data) => {
                setNewsCategoryInfo(data);
            });
    };

    return (
        <div>
            <div className='container' style={{ marginTop: '2%' }}>
                <h1>{newsCategoryInfo && newsCategoryInfo.name}</h1>
                {newsList.length > 0 && (
                    <div>
                        <div className='row mb-3'>
                            <div className='col-lg-8 col-md-12 mt-3'>
                                <div className='row'>
                                    <Link
                                        to={`/articles/${newsList[0]._id}`}
                                        style={{
                                            textDecoration: 'none',
                                            color: 'black',
                                        }}
                                    >
                                        <TopNew
                                            news={newsList[0]}
                                            createdDiffTime={countTimeDiff(
                                                newsList[0].createdAt
                                            )}
                                        />
                                    </Link>
                                </div>
                            </div>
                            <div className='col-lg-4 col-md-12 mt-3'>
                                {newsList.length > 1 && (
                                    <Link
                                        to={`/articles/${newsList[1]._id}`}
                                        style={{
                                            textDecoration: 'none',
                                            color: 'black',
                                        }}
                                    >
                                        <TopNew
                                            news={newsList[1]}
                                            createdDiffTime={countTimeDiff(
                                                newsList[1].createdAt
                                            )}
                                        />
                                    </Link>
                                )}
                            </div>
                        </div>
                        {newsList.length > 2 &&
                            newsList.map((eachNew, newsIndex) => {
                                if (newsIndex % 2 === 0 && newsIndex > 1) {
                                    return (
                                        <div className='row'>
                                            <div className='col-lg-6 col-md-12'>
                                                <Link
                                                    to={`/articles/${newsList[newsIndex]._id}`}
                                                    style={{
                                                        textDecoration: 'none',
                                                        color: 'black',
                                                    }}
                                                >
                                                    <NewsCard
                                                        news={
                                                            newsList[newsIndex]
                                                        }
                                                        createdDiffTime={countTimeDiff(
                                                            newsList[newsIndex]
                                                                .createdAt
                                                        )}
                                                    />
                                                </Link>
                                            </div>
                                            <div className='col-lg-6 col-md-12'>
                                                {newsIndex + 1 <
                                                    newsList.length && (
                                                    <Link
                                                        to={`/articles/${
                                                            newsList[
                                                                newsIndex + 1
                                                            ]._id
                                                        }`}
                                                        style={{
                                                            textDecoration:
                                                                'none',
                                                            color: 'black',
                                                        }}
                                                    >
                                                        <NewsCard
                                                            news={
                                                                newsList[
                                                                    newsIndex +
                                                                        1
                                                                ]
                                                            }
                                                            createdDiffTime={countTimeDiff(
                                                                newsList[
                                                                    newsIndex +
                                                                        1
                                                                ].createdAt
                                                            )}
                                                        />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                    </div>
                )}
                <div className='row'>
                    <div className='col-2'></div>
                    <div className='col-8' style={{ textAlign: 'center' }}>
                        <button type="button"
                            className='btn btn-dark'
                            onClick={() => {
                                setLoading(true);
                                setNumOfLoad(numOfLoad + 1);
                            }}
                        >
                            {' '}
                            {loading ? 'Loading' : 'Load More'}
                        </button>
                    </div>
                    <div className='col-2'></div>
                </div>
            </div>
        </div>
    );
}
