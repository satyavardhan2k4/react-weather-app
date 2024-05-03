import React from 'react'
import { iconUrlFromCode } from '../services/weatherService'

function Forecast({title,items}) {
  console.log(items);
  return (
    <div>
      <div className='flex items-center justify-start mt-6'>
        <p className='text-white font-medium uppercase'>{title}</p>
      </div>
      <hr className='my-2'/>

      <div className='flex flex-row items-center justify-between text-white'>
        {items.map((item,index)=>{
          return(
            <div className='flex flex-col items-center justify-center' key={index}>
            <p className='font-light text-sm'>
              {item.time}
            </p>
  
  
            <img src={iconUrlFromCode(item.code)} className='w-12 my-1' alt=''/>
  
            <p className='font-medium'>{`${item.avgtemp_c.toFixed()}°`}</p>
  
          </div>)
          

        })}

      

        
      </div>


    </div>
  )
}

export default Forecast