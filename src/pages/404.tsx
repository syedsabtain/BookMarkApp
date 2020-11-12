import React from 'react'
import Footer from '../components/Footer'
import {Link} from 'gatsby'
export default()=>{

    return(
        <div className='container mt-5'>
            <div className='row d-flex justify-content-center '>
                <div className='col-md-6 text-center mt-5'>
                    <h1 className='txt mt-5'>404 page Not Found</h1>
                    <Link className='btn btn-primary mt-5' to='/'>Go To HomePage</Link>
                </div>
            </div>
            <div className='text-center fixed-bottom'><Footer></Footer></div>
        </div>
    )
}