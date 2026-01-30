import React from 'react'
import { Button } from '@mui/material'

const button = ({buttonText, handleclick, btn_variant, class_name }) => {
    // const handleclick = ()=>{
    //     console.log("this event is click");   
    // }
  return (
    <>
    <Button type="submit" sx={class_name} onClick={handleclick} variant={btn_variant}>{buttonText}</Button>
    </>
  )
}

export default button