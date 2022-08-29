export default function NewsCard(props) {
    return (
        <div>
            <div className='card mb-3' style={{ maxWidth: '100%' }}>
                <div className='row g-0'>
                    <div className='col-md-4'>
                        <img
                            src={props.news.image && `https://covi-away-app.s3.amazonaws.com/${props.news.image}`}
                            className='rounded-start'
                            alt='...'
                            style = {
                                    { width: '100%',height: '100%' }                              
                            }
                        />
                    </div>
                    <div className='col-md-8'>
                        <div className='card-body'>
                            <h4 className='card-title'>{props.news.title}</h4>
                            <p className='card-text'>
                                {props.isBreaking
                                    ? props.news.content.length > 200
                                        ? props.news.content.substring(0, 199) +
                                          '......'
                                        : props.news.content
                                    : props.news.content.length > 100
                                    ? props.news.content.substring(0, 99) +
                                      '......'
                                    : props.news.content}
                            </p>
                            <p className='card-text'>
                                <small className='text-muted'>
                                    {props.createdDiffTime}
                                </small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
