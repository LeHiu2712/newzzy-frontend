import { useParams } from 'react-router';
import { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export default function EditNews(props) {
    const { id } = useParams();
    console.log(id);

    const endPoint = `http://localhost:9000/newsdata/articles`;
    const categoryEndPoint = 'http://localhost:9000/newsdata/news-catergory';

    const validationSchema = Yup.object().shape({
        title: Yup.string().trim()
            .required('Title is required')
            .matches(/^[a-zA-Z0-9 ?,;.$'"-_()@!%*#?&\/\\]+$/, 'Title cannot contain certain special characters'),
        content: Yup.string().trim()

            .required('Content is required')
            .matches(
                /^[a-zA-Z0-9 ?,.$'"-:+_();@!%*#?&\/\\(\r\n|\r|\n)]+$/,
                'Content cannot contain certain special characters'
            ),
        image: Yup.mixed()
            // .test("fileName", "Image is required", (value) => {
            //     if (value.length) {
            //         return true // attachment is optional
            //     }
            //     return false
            // })
            .test('fileSize', 'The file is too large', (value) => {
                if (!value.length) {
                    return true; // attachment is optional
                }
                return value[0].size <= 2000000;
            })
            .test('fileType', 'Image file is required', (value) => {
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
        unregister,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const [item, setItem] = useState();

    const redirectToMainPage = () => {
        window.location.replace(`http://localhost:3000/articles/${id}`);
    };
    const loadCurrentNews = () => {
        fetch(endPoint + '/' + id)
            .then((response) => response.json())
            .then((data) => {
                setItem(data);
                setNewBreaking(data.breaking);
            });
    };

    // const [newTitle, setNewTitle] = useState('');
    // const [newContent, setNewContent] = useState('');
    const [newBreaking, setNewBreaking] = useState('');
    // const [newCategory, setNewCategory] = useState('');
    // const [newImage, setNewImage] = useState('');

    // const user = props.currentUser.id;

    const [categoryList, setCategoryList] = useState([]);

    const edit = (data) => {
        console.log("Hello from edit news")
        const formData = new FormData();

        formData.append('id', id);

        formData.append('title', data.title);

        formData.append('content', data.content);

        formData.append('image', data.image[0]);

        formData.append('breaking', newBreaking);

        formData.append('news_category_id', data.category);
        fetch(endPoint, {
            method: 'PUT',
            body: formData,
        }).then(response => response.json())
        .then(result => redirectToMainPage());
        console.log(data);
    };

    const loadCategory = () => {
        fetch(categoryEndPoint)
            .then((response) => response.json())
            .then((result) => setCategoryList(result));
    };

    useEffect(() => {
        loadCurrentNews();
    }, []);

    useEffect(() => {
        loadCategory();
    }, []);

    function checkBox() {
        var box = document.getElementById('postbreaking');
        if (box.checked) {
            box.setAttribute('value', '1');
            console.log(box.value);
        } else {
            box.setAttribute('value', '0');
            console.log(box.value);
        }
    }

    return (
        <div>
            {props.currentUser &&
                item &&
                props.currentUser.id === item.user_id && (
                    <div className='container'>
                        <div className='row'>
                            <div className='col-3'></div>
                            <div className='col-6'>
                                <div className='pt-3'>
                                    <div className='card mb-4'>
                                        <div className='card-header text-center'>
                                            EDIT ARTICLE
                                        </div>

                                        <div className='card-body container-fluid'>
                                            <form
                                                onSubmit={handleSubmit(edit)}
                                                enctype='multipart/form-data'
                                            >
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
                                                            defaultValue={
                                                                item &&
                                                                item.title
                                                            }
                                                            placeholder='Article Title'
                                                            id='posttitle'
                                                            {...register(
                                                                'title'
                                                            )}
                                                        />
                                                        <div className='invalid-feedback'>
                                                            {
                                                                errors.title
                                                                    ?.message
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='form-group mb-3 col-5'>
                                                        <label for='postcategory'>
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
                                                                defaultValue={
                                                                    item &&
                                                                    item.news_category_id
                                                                }
                                                                id='inputGroupSelect01'
                                                                style={{
                                                                    height: '35px',
                                                                }}
                                                                {...register(
                                                                    'category'
                                                                )}
                                                            >
                                                                <option value='0'>
                                                                    Choose
                                                                    Category
                                                                </option>

                                                                {categoryList.map(
                                                                    (
                                                                        cat,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <option
                                                                                key={
                                                                                    index
                                                                                }
                                                                                value={
                                                                                    cat._id
                                                                                }
                                                                                selected={
                                                                                    item &&
                                                                                    item.news_category_id ===
                                                                                        cat._id
                                                                                        ? 'selected'
                                                                                        : ''
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
                                                                    errors
                                                                        .category
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
                                                        defaultValue={
                                                            item && item.content
                                                        }
                                                        name='content'
                                                        placeholder='Article Content'
                                                        id='postcontent'
                                                        {...register('content')}
                                                    ></textarea>
                                                    <div className='invalid-feedback'>
                                                        {
                                                            errors.content
                                                                ?.message
                                                        }
                                                    </div>
                                                </div>

                                                <div className='row'>
                                                    <div className='form-group mb-3 col-6'>
                                                        <div className='custom-file'>
                                                            <label
                                                                className='custom-file-label'
                                                                for='postfile'
                                                            >
                                                                Upload Image:{' '}
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
                                                                {...register(
                                                                    'image'
                                                                )}
                                                            />
                                                            <div className='invalid-feedback'>
                                                                {
                                                                    errors.image
                                                                        ?.message
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='form-check form-switch col-6'>
                                                        <input
                                                            className='form-check-input'
                                                            onChange={(e) => {
                                                                checkBox();
                                                                setNewBreaking(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                            name='breaking'
                                                            type='checkbox'
                                                            id='postbreaking'
                                                            defaultChecked={
                                                                item &&
                                                                item.breaking ===
                                                                    '1'
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        <label
                                                            className='form-check-label'
                                                            for='postbreaking'
                                                        >
                                                            Breaking news
                                                        </label>
                                                    </div>
                                                    <div>
                                                        (Leaving this field
                                                        empty will result in the
                                                        image remains unchanged)
                                                    </div>
                                                </div>

                                                <div className='text-center'>
                                                    &nbsp;&nbsp;
                                                    <button
                                                        type='submit'
                                                        className='btn btn-primary'
                                                        onClick={() => {
                                                            unregister(
                                                                'title',
                                                                {
                                                                    keepDefaultValue: true,
                                                                }
                                                            );

                                                            unregister(
                                                                'content',
                                                                {
                                                                    keepDefaultValue: true,
                                                                }
                                                            );

                                                            unregister(
                                                                'category',
                                                                {
                                                                    keepDefaultValue: true,
                                                                }
                                                            );

                                                            unregister(
                                                                'image',
                                                                {
                                                                    keepDefaultValue: true,
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        Save
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
                )}
        </div>
    );
}
