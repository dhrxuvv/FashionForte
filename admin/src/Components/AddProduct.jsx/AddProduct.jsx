import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: '',
        image: '',
        category: 'women',
        new_price: '',
        old_price: ''
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const addProduct = async () => {
        console.log(productDetails);
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product', image);

        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        })
            .then((resp) => resp.json())
            .then((data) => {
                responseData = data;
                if (responseData.success) {
                    product.image = responseData.image_url;
                    console.log(product);
                    return fetch('http://localhost:4000/addproduct', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(product),
                    });
                } else {
                    throw new Error('Failed to upload image');
                }
            })
            .then((resp) => resp.json())
            .then((data) => {
                data.success
                    ? alert('Successfully added')
                    : alert('Failed to add product');
            })
            .catch((error) => console.error('Error:', error.message));
    };

    return (
        <div className='add-product'>
            <div className='addproduct-itemfield'>
                <p>Product Title</p>
                <input
                    value={productDetails.name}
                    onChange={changeHandler}
                    type='text'
                    name='name'
                    placeholder='Enter Title'
                />
            </div>
            <div className='addproduct-price'>
                <div className='addproduct-itemfield'>
                    <p>Price</p>
                    <input
                        value={productDetails.old_price}
                        onChange={changeHandler}
                        type='text'
                        name='old_price'
                        placeholder='Enter Old Price'
                    />
                </div>
                <div className='addproduct-itemfield'>
                    <p>Offer Price</p>
                    <input
                        value={productDetails.new_price}
                        onChange={changeHandler}
                        type='text'
                        name='new_price'
                        placeholder='Enter New Price'
                    />
                </div>
            </div>
            <div className='addproduct-itemfield'>
                <p>Product Category</p>
                <select
                    value={productDetails.category}
                    onChange={changeHandler}
                    name='category'
                    className='add-product-selector'
                >
                    <option value='women'>Women</option>
                    <option value='men'>Men</option>
                    <option value='kid'>Kid</option>
                </select>
            </div>
            <div className='addproduct-itemfield'>
                <label htmlFor='file-input'>
                    <img
                        src={
                            image
                                ? URL.createObjectURL(image)
                                : upload_area
                        }
                        alt=''
                        className='addproduct-thumbnail-image'
                    />
                </label>
                <input
                    onChange={imageHandler}
                    type='file'
                    name='image'
                    id='file-input'
                    hidden
                />
            </div>
            <button onClick={addProduct} className='addproduct-btn'>
                Add
            </button>
        </div>
    );
};

export default AddProduct;
