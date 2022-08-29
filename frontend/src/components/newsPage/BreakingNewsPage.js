import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from './NewsCard';
import TopNew from './TopNew';
import { countTimeDiff } from '../../utils';

export default function BreakingNewsPage() {
    const endPoint = 'http://localhost:9000/news';
    const [numOfLoad, setNumOfLoad] = useState(1);
    const [loading, setLoading] = useState(false);
    const [newsList, setNewsList] = useState([]);
    const fetchBreakingNews = () => {
        fetch(endPoint + `/breaking/all?limit=${numOfLoad * 8}`)
            .then((res) => res.json())
            .then((data) => {
                setNewsList(data);
            });
    };

    useEffect(() => {
        fetchBreakingNews();
        setLoading(false);
    }, [numOfLoad]);
    return (
        <div>
            <div className='container' style={{ marginTop: '2%' }}>
                <h1 style={{color: "red"}}>Breaking News</h1>
                {newsList.length > 0 && (
                    <div>
                        <div className='row mb-3'>
                            <div className='col-lg-2'></div>
                            <div className='col-lg-8 col-md-12'>
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
                            <div className='col-lg-2'></div>
                        </div>
                        {newsList.length > 1 &&
                            newsList.map((eachNew, i) => {
                                if (i > 0) {
                                    return (
                                        <div className='row'>
                                            <div className='col-lg-2'></div>
                                            <div className='col-lg-8 col-md-12'>
                                                <Link
                                                    to={`/articles/${eachNew._id}`}
                                                    style={{
                                                        textDecoration: 'none',
                                                        color: 'black',
                                                    }}
                                                >
                                                    <NewsCard
                                                        isBreaking={true}
                                                        news={eachNew}
                                                        createdDiffTime={countTimeDiff(
                                                            eachNew.createdAt
                                                        )}
                                                    />
                                                </Link>
                                            </div>
                                            <div className='col-lg-2'></div>
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
