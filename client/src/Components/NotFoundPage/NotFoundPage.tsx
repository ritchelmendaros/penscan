import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className='NotFoundPage Main MainContent'>
            {/* <Header /> */}
            <main>
                <h1>Page Not Found.</h1>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </main>
        </div>
    );
};

export default NotFoundPage;
