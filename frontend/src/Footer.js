export default function Footer() {
    return (
        <footer className='py-3 my-4'>
            <ul className='nav justify-content-center border-bottom pb-3 mb-3'>
                <li className='nav-item'>
                    <a href='/' className='nav-link px-2 text-muted'>
                        Home
                    </a>
                </li>
                <li className='nav-item'>
                    <a href='/' className='nav-link px-2 text-muted'>
                        News
                    </a>
                </li>
                <li className='nav-item'>
                    <a href='/forum' className='nav-link px-2 text-muted'>
                        Forum
                    </a>
                </li>
                <li className='nav-item'>
                    <a href='#' className='nav-link px-2 text-muted'>
                        Back to top
                    </a>
                </li>
            </ul>
            <p className='text-center text-muted'>
                © 2021 RMIT University, Further Web Programming, GMagnet Team
            </p>
        </footer>
    );
}
