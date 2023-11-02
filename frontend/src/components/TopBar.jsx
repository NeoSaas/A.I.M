import React from 'react'

const TopBar = () => {
  return(
    <div className='inline-flex w-full dark:bg-slate-800 bg-[#FAF9F6] h-16 absolute'>
        <img src={require("./images/logo3.png")} className=' m-2 w-12 rounded-lg'/>
        <h2 className='my-auto mx-0 font-semibold text-xl'> AIDR </h2>
    </div>
  );
}

export default TopBar;


