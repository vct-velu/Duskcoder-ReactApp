import './ProductItem.css'
import React, { useState } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ProductItem = function (props) {

    const [editWindow, setEditWindow] = useState(false);
    const [showButton, setshowButton] = useState(true);
    const [userInput, setUserInput] = useState({
        name: '',
        price: '',
        description: '',
        image: ''
    });

    // Handle Edit Product
    const editHandler = (event) => {
        setEditWindow(true);
        setshowButton(false);

        setUserInput({ name: props.name, price: props.price, description: props.description, image: props.image });

    }

    // Handle User Inputs:
    const handleNameChange = (event) => {
        setUserInput((prevState) => { return { ...prevState, name: event.target.value }; });
    };

    const handlePriceChange = (event) => {
        setUserInput((prevState) => { return { ...prevState, price: event.target.value }; });
    };

    const handleDescChange = (event) => {
        setUserInput((prevState) => { return { ...prevState, description: event.target.value }; });
    };

    const handleImageChange = (event) => {
        setUserInput((prevState) => { return { ...prevState, image: event.target.files[0] }; });
    };

    //Handle Edit Product Submit
    const handleSubmit = (event) => {
        // console.log(userInput)
        event.preventDefault();

        setEditWindow(false);
        setshowButton(true);
        const formData = new FormData();
        formData.append('name', userInput.name);
        formData.append('price', userInput.price);
        formData.append('image', userInput.image);
        formData.append('description', userInput.description);


        console.log("FormData : ", formData);

        axios.defaults.baseURL = 'http://localhost:4000';

        axios.put(`/api/product/edit/${props.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                console.log("Edited Product : ", response.data.updatedProduct);
                props.onEditProduct(response.data.updatedProduct);
                setUserInput({ productName: '', productPrice: '', productDescription: '', });
                //    window.alert("Product Edited Successfully!")
                toast.success('Product Edited Successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

            })
            .catch(error => { console.log(error); });
    };

    // Handle Cancel Edit Product
    const cancelEdit = () => {
        setEditWindow(false);
        setshowButton(true);
    }


    // Handle Delete Product
    const deleteHandler = (event) => {
        let prompt = window.confirm("Confirm Delete");
        if (prompt == true) {

            axios.defaults.baseURL = 'http://localhost:4000';

            axios.delete(`/api/product/delete/${props.id}`)
                .then(response => {
                    console.log("Deleted Data :", response.data);
                    props.onDeleteProduct(props.id);
                    toast.success('Product Deleted Successfully!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                })
                .catch(error => { console.log(error); });
        }
    }

    return (
        <>
            <div className="product-item">
                <div className='product-image'>
                    <img src={`data:image/png;base64,${props.image}`} className='product-image' />
                </div>
                <div className='product-detail'>
                    <label name="name" className='name'>{props.name}</label>
                    <label name="price" className='price'> Rs: {props.price}</label>
                    <label name="price" className='description'> {props.description}</label>

                </div>
                {showButton ?
                    <div className='product-action'>
                        <button className='button' onClick={editHandler} > Edit </button>
                        <button className='button' onClick={deleteHandler}> Delete </button>
                    </div>
                    : null
                }
            </div>
            {editWindow ?
                <div className='edit-product-window'>
                    <form onSubmit={handleSubmit}>
                        <div className='edit-product-controls'>
                            <div className='edit-product-control'>
                                <label>Product Name</label>
                                <input type="text" id="name" value={userInput.name} onChange={handleNameChange} />
                            </div>
                            <div className='edit-product-control'>
                                <label>Product Price</label>
                                <input type="number" id="price" value={userInput.price} onChange={handlePriceChange} />
                            </div>
                            <div className='edit-product-control'>
                                <label>Product Description</label>
                                <input type="text" id="description" value={userInput.description} onChange={handleDescChange} />
                            </div>
                            <div className='edit-product-control'>
                                <label>Product Image</label>
                                <input type="file" id="image" name="image" onChange={handleImageChange} />
                            </div>
                            <div className='edit-product-action'>
                                <button className='button' onClick={cancelEdit}> Cancel </button>
                                <button className='button' type="submit" > Submit </button>
                                <ToastContainer />

                            </div>
                        </div>
                    </form>
                </div>
                : null
            }
        </>
    );

}
export default ProductItem;