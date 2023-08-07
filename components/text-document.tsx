import { StorageContext } from '@/context/storage-context'
import React, { useContext } from 'react'

export default function TextDocument({ title, preview, id, remove, setActive, isActive }) {
  const { list, setList } = useContext(StorageContext);
  return (
    <div 
    className='border-b border-teal-200/40 text-teal-200/20 w-9/12 min-h-28 mb-10 flex-shrink-0 relative'
    >
        <div
          onClick={setActive} 
          className='group cursor-pointer'>
          <h2 className='text-xl mb-4 hyphens-auto break-words group-hover:text-teal-200/80' 
            style={isActive ? {  color: 'rgb(153 246 228 / 0.8)' } : {}}
          >
            {title} {title.length >= 50 && <span className='text-teal-200/60'>...</span>}
          </h2>
          <p
            className='text-teal-200/10 mb-10 hyphens-auto break-words group-hover:text-teal-200/60'
            style={isActive ? {  color: 'rgb(153 246 228 / 0.6)' } : {}}
          >
            {preview} {preview.length >= 100 && <span className='text-teal-200/40'>...</span>}
          </p>
        </div>
        <button 
        onClick={remove}
        className=' float-right active:translate-y-1 hover:text-teal-200/60'
        >Remove</button>
    </div>
  )
}
