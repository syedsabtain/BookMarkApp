import React, { useEffect, useState } from 'react'
import {useQuery,useMutation} from '@apollo/client'
import gql from 'graphql-tag'
import {Bookmark} from '../interfaces/Allinterface'
import {useForm} from 'react-hook-form'
import Swal from 'sweetalert2'
import Footer from '../components/Footer'
import Loader from 'react-loader-spinner'
import Header from '../components/Header'

const  BOOKMARK_DATA= gql`
{
    Data{
            Bookmarkdata
    }
  }

`
const   ADD_BOOKMARK= gql`
mutation addBookmark($text:String!,$url:String!){
    addBookmark(input:{
      text:$text,
      url:$url
    }){
      Bookmarkdata
    }
  }`
  const DELETE_BOOKMARK= gql`
  mutation deleteBookmark($ref:String!){
    deleteBookmark(input:{
     ref:$ref
   }){
     Bookmarkdata
   }
   }`

   const UPDATE_BOOKMARK = gql`
   mutation updateBookmark($text:String!,$url:String!,$ref:String!){
    updateBookmark(input:{
      text:$text,
      url:$url,
      ref:$ref
    }){
      Bookmarkdata
    }
    }`

export default()=>{
    const {handleSubmit,register,errors,reset}  = useForm()
    const [bookmarkdata,setBookmarkdata] = useState<Bookmark>();
    const {loading,data,error}  = useQuery(BOOKMARK_DATA)
    const [addBookmark] = useMutation(ADD_BOOKMARK)
    const [deleteBookmark] = useMutation(DELETE_BOOKMARK)
    const [updateBookmark] = useMutation(UPDATE_BOOKMARK)
    
    const loaderhandle=()=>{
        let timerInterval
        Swal.fire({
            title: 'Loading',
            timer: 4000,
            showConfirmButton: false,
            timerProgressBar: true,
            willOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                    const content = Swal.getContent()
                    if (content) {
                        const b:any = content.querySelector('b')
                        if (b) {
                            b.textContent = Swal.getTimerLeft()
                        }
                    }
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        })
    }
    const Completionhandle=(text:string)=>{
       
        
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: text,
            showConfirmButton: false,
            timer: 1500
          })
    }
    const Errorhandle=()=>{
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Oops Something Went Wrong',
            showConfirmButton: false,
            timer: 1500
          })
    }

    const HandleSubmit=async(data)=>{
        loaderhandle()

    const result  =    await  addBookmark({
            variables:{
                text:data.text,
                url:data.url
            },
            refetchQueries:[{query:BOOKMARK_DATA}]
        })
        if(result?.data?.addBookmark?.Bookmarkdata==="Success"){
            reset()
            Completionhandle("Added")
        }
        else{
            Errorhandle()
        }
    }
    const HandleDelete=async(obj:string)=>{
        loaderhandle()

       const result = await   deleteBookmark({
            variables:{
                ref:obj
            },
            refetchQueries:[{query:BOOKMARK_DATA}]
        })
        if(result?.data?.deleteBookmark?.Bookmarkdata==="Success"){

            Completionhandle("Deleted")

        }
        else{
         Errorhandle()
        }

    }
    
    const HandleEdit=async (text:string,url:string,ref:string) => {
        
        Swal.mixin({
            input: 'text',
            confirmButtonText: 'Next &rarr;',
            showCancelButton: true,
            progressSteps: ['1', '2']
          }).queue([
            {
                input: 'url',
                inputValue: url,
              },
              {
                title: 'Enter  Name/Text Here',
                input: 'text',
                inputValue:text
                
                
              },
    
          ]).then((result:any) => {
            if (result.value) {
                loaderhandle()

                updateBookmark({
                    variables:{
                        text:result.value[1],
                        url:result.value[0],
                        ref:ref
                    },
                    refetchQueries:[{query:BOOKMARK_DATA}]
                }).then((result)=>{
                    
                    if(result.data.updateBookmark.Bookmarkdata==="Success"){
                        
                            Completionhandle("Updated")
                      
                    }
                    else{
                       Errorhandle()
                    }
                })
            }
          })
    }

    useEffect(()=>{
        if(loading){

        }
        else{
            const result = JSON.parse(data?.Data[0]?.Bookmarkdata)
            setBookmarkdata(result)
        }
    },[loading,data])

    return(
        <div className='container text-center mt-5'>
            <Header></Header>
            <div className='row d-flex justify-content-center'>
                <div className='col-md-4 mt-5'>
                    <h1 className='mt-3  txt txtsize'>BOOKMARK APP</h1>
                    <h6 className='mt-2 mb-5 txt'> Built Using React Gatsby, Netlify, FaunaDB, Typescript, Graphql </h6>
                    
                    <form className="form-signin" onSubmit={handleSubmit(HandleSubmit)}>
                        <input type="text" id="inputEmail" name='text' className="form-control" placeholder="Enter Name/Text Here" ref={register({required:true,minLength:'3',pattern:/^\s*(.*\S)\s*$/})}/>
                        {errors.text && errors.text.type === 'required' && (
                            <h6 className='mt-3 txt'>* This Field Is Required</h6>
                        )}
                        {errors.text && errors.text.type === 'minLength' && (
                            <h6 className='mt-3 txt'>* MinLength Allowed is 3</h6>
                        )}
                        {errors.text && errors.text.type === 'pattern' && (
                            <h6 className='mt-3 txt'>* Only Whitespaces Are Not Allowed</h6>
                        )}
                         <br/>

                        <input type="text" id="inputPassword" name='url' className="form-control" placeholder="Enter Url Here" ref={register({required:true,pattern:/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/})}/>
                        {errors.url && errors.url.type ==='required' && (
                            <h6 className='mt-3 txt'>* This Field Is Required</h6>
                        )}
                        {errors.url && errors.url.type ==='pattern' && (
                            <h6 className='mt-3 txt'>* Invalid URL</h6>
                        )}
                        <button className="btn mt-3 btn-info " type="submit">Add</button>
                        
                    </form>
                </div>
            </div>
            <div className='row d-flex justify-content-center mt-5'>
           {loading ? (
      
            < Loader type="Grid" color="#00BFFF" height={ 100 } width={ 100 } timeout={ 3000 }  />
           ) : (
               <>
               {bookmarkdata?.data.map((value,key)=>{

                   return(
                    <div className="col-md-4 mt-5 " key={key}>
                    <div className="card mb-4 shadow-sm text-center cardbg">
                        
                        <div className="card-body  ">
                   <h3 className="card-text txt mb-3">{value.data.text}</h3>
                            
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="btn-group  ">
                                    <a type="button" className="btn btn-sm btn-outline-primary font-weight-bold" href={value.data.url} target='blank'>View</a>
                                    <button type="button" className="far fa-edit btn btn-sm btn-outline-info " onClick={()=>HandleEdit(value.data.text,value.data.url,value.ref["@ref"].id)} > Edit</button>
                                    <button type="button" className="fas fa-trash-alt btn btn-sm btn-outline-danger" onClick={()=>{HandleDelete(value.ref["@ref"].id)}}> Delete</button>
                                    
                                </div>
                             
                            </div>
                        </div>
                    </div>
                </div>
                   )
               })}
               </>
           )}
            </div>

            <Footer></Footer>
        </div>
    )
}