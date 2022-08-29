import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react';
import { useEffect } from 'react';

export default function CreateNews(props) {
    const endPoint = 'http://localhost:9000/newsdata/articles';
    const categoryEndPoint = 'http://localhost:9000/newsdata/news-catergory';

    const validationSchema = Yup.object().shape({
        title: Yup.string().trim()
            .required('Title is required')
            .matches(/^[a-zA-Z0-9 ?,;.$'"-_()@!%*#?&\/\\]+$/, 'Title cannot contain certain special characters'),
        content: Yup.string().trim()
            .required('Content is required')
            .matches(
                /^[a-zA-Z0-9 ?,.$'"-:+_();@!%*#?&\/\\(\r\n|\r|\n)]+$/,
                'Content cannot contain certain special characters. Be careful with apostrophe. The valid one is " \' "'
            ),
        image: Yup.mixed()
            .test('fileName', 'Image is required', (value) => {
                if (value.length) {
                    return true; // attachment is optional
                }
                return false;
            })

            .test('fileSize', 'The file is too large', (value) => {
                if (!value.length) {
                    return true; // attachment is optional
                }
                return value[0].size <= 2000000;
            })
            .test('fileType', 'Only jpeg/png file is accepted', (value) => {
                if (!value.length) {
                    return true; // attachment is optional
                }
                return (
                    value[0].type === 'image/jpeg' ||
                    value[0].type === 'image/png'
                );
            }),
        category: Yup.string().test(
            'value',
            'Category is required',
            (value) => {
                if (value === '0') {
                    return false;
                }
                return true;
            }
        ),
    });
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    // const [title, setTitle] = useState('');
    // const [content, setContent] = useState('');
    const [breaking, setBreaking] = useState('');
    // const [image, setImage] = useState('');

    const redirectToMainPage = () => {
        window.location.replace('http://localhost:3000');
    };

    const user = props.currentUser.id;

    const [categoryList, setCategoryList] = useState([]);

    const submit = (data) => {
        const formData = new FormData();

        formData.append('title', data.title);

        formData.append('content', data.content);

        formData.append('image', data.image[0]);

        formData.append('breaking', breaking);

        formData.append('news_category_id', data.category);

        formData.append('user_id', user);
        console.log(data);
        fetch(endPoint, {
            method: 'POST',
            body: formData,
        }).then(response => response.json()).then((data) =>redirectToMainPage());
        console.log(data);
    };

    const loadCategory = () => {
        fetch(categoryEndPoint)
            .then((response) => response.json())
            .then((result) => setCategoryList(result));
    };

    useEffect(() => {
        loadCategory();
    }, []);

    function checkBox() {
        var box = document.getElementById('postbreaking');
        if (box.checked) {
            box.value = '1';
            console.log(box.value);
        } else {
            box.value = '0';
            console.log(box.value);
        }
    }

    return (
        <div>
            <div className='container'>
                <div className='row'>
                    <div className='col-3'></div>
                    <div className='col-6'>
                        <div className='pt-3'>
                            <div className='card mb-4'>
                                <div
                                    className='card-header text-center'
                                    id='post-{{$post->id}}'
                                >
                                    CREATE NEW ARTICLE
                                </div>

                                <div className='card-body container-fluid'>
                                    <form
                                        onSubmit={handleSubmit(submit)}
                                        enctype='multipart/form-data'
                                    >
                                        <input
                                            type='hidden'
                                            name='user_id'
                                            value={props.currentUser.id}
                                        />
                                        {console.log(props.currentUser.id)}
                                        <div className='row'>
                                            <div className='form-group mb-3 col-7'>
                                                <label for='posttitle'>
                                                    Title
                                                </label>
                                                <input
                                                    type='text'
                                                    name='title'
                                                    className={`form-control border border-secondary ${
                                                        errors.title
                                                            ? 'is-invalid'
                                                            : ''
                                                    }`}
                                                    placeholder='Article Title'
                                                    id='posttitle'
                                                    {...register('title')}
                                                />
                                                <div className='invalid-feedback'>
                                                    {errors.title?.message}
                                                </div>
                                            </div>
                                            <div className='form-group mb-3 col-5'>
                                                <label for='inputGroupSelect01'>
                                                    Category
                                                </label>
                                                <div>
                                                    <select
                                                        name='news_category_id'
                                                        className={`custom-select  ${
                                                            errors.category
                                                                ? 'is-invalid'
                                                                : ''
                                                        }`}
                                                        id='inputGroupSelect01'
                                                        style={{
                                                            height: '35px',
                                                        }}
                                                        {...register(
                                                            'category'
                                                        )}
                                                    >
                                                        <option value='0'>
                                                            Choose Category
                                                        </option>

                                                        {categoryList.map(
                                                            (cat, index) => {
                                                                return (
                                                                    <option
                                                                        key={
                                                                            index
                                                                        }
                                                                        value={
                                                                            cat._id
                                                                        }
                                                                    >
                                                                        {
                                                                            cat.name
                                                                        }
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </select>
                                                    <div className='invalid-feedback'>
                                                        {
                                                            errors.category
                                                                ?.message
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='form-group mb-3'>
                                            <label for='postcontent'>
                                                Content
                                            </label>
                                            <textarea
                                                className={`form-control border border-secondary ${
                                                    errors.content
                                                        ? 'is-invalid'
                                                        : ''
                                                }`}
                                                name='content'
                                                placeholder='Article Content'
                                                id='postcontent'
                                                {...register('content')}
                                            ></textarea>
                                            <div className='invalid-feedback'>
                                                {errors.content?.message}
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='form-group mb-3 col-6'>
                                                <div className='custom-file'>
                                                    <label
                                                        className='custom-file-label'
                                                        for='inputGroupFile01'
                                                    >
                                                        Upload Image
                                                    </label>
                                                    <br />
                                                    <input
                                                        type='file'
                                                        name='image'
                                                        className={`custom-file-input ${
                                                            errors.image
                                                                ? 'is-invalid'
                                                                : ''
                                                        }`}
                                                        id='inputGroupFile01'
                                                        {...register('image')}
                                                    />
                                                    <div className='invalid-feedback'>
                                                        {errors.image?.message}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='form-check form-switch col-6'>
                                                <input
                                                    className='form-check-input'
                                                    onChange={(e) => {
                                                        checkBox();
                                                        setBreaking(
                                                            e.target.value
                                                        );
                                                    }}
                                                    name='breaking'
                                                    type='checkbox'
                                                    id='postbreaking'
                                                />
                                                <label
                                                    className='form-check-label'
                                                    for='flexSwitchCheckDefault'
                                                >
                                                    Breaking news
                                                </label>
                                            </div>
                                        </div>

                                        <div className='text-center'>
                                            &nbsp;&nbsp;
                                            <button
                                                type='submit'
                                                className='btn btn-primary'
                                            >
                                                Upload
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-3'></div>
                </div>
            </div>
        </div>
    );
}
