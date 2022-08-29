const TopNew = ({ news, createdDiffTime }) => {
    return (
        <div className='card mb-3' style={{ width: '100%', height: '100%' }}>
            <img
                src={news.image && `https://covi-away-app.s3.amazonaws.com/${news.image}`}
                className='card-img-top img-fluid'
                alt='topNew'
                style={{ maxWidth: '900px', maxHeight: '700px' }}
            />
            <div className='card-body'>
                <h2 className='card-title'>{news.title}</h2>
                <p className='card-text'>
                    {news.content.length > 500
                        ? news.content.substring(0, 499) + '......'
                        : news.content}
                </p>
                <p className='card-text'>
                    <small className='text-muted'>{createdDiffTime}</small>
                </p>
            </div>
        </div>
    );
};

export default TopNew;
