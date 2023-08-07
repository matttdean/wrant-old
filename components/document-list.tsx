'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import TextDocument from './text-document';
import { v4 as uuid } from 'uuid';
import { HiMiniArrowsRightLeft } from 'react-icons/hi2';
import { StorageContext } from '@/context/storage-context';

export default function DocumentList() {
  const { list, setList, isSwiping, setIsSwiping, sideBarIsActive } = useContext(StorageContext);
  const sideBarRef = useRef<HTMLDivElement>();
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
 

  
  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;
  
  const onTouchStart = (e) => {
    setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX)
  }
  
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
      setIsSwiping(true)
    } 
  }

  const removeListItem = async (id)=> {
    const newList = list.filter((item) => item.id !== id);
    setList(newList);
  }

  const toggleSideBar = () => {
    sideBarRef.current.classList.toggle('-translate-x-[100%]');
    sideBarIsActive.current = !sideBarIsActive.current;
    
  }

  useEffect(() => {
    if(isSwiping) {
    toggleSideBar();
    }
    setIsSwiping(false)
  }, [isSwiping])



const removeActive = () => {

  setList(prevList => {
    return prevList.map((e) => {
      return {...e, active: e.active = false}
    }
  )})

}

  const setActive = (id) =>  {
    
    removeActive();

    const newList = list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          active: item.active = true,
        };
      } else {
        return item;
      }
    })
    setList(newList)

    if (Math.min(window.screen.width, window.screen.height) < 768) {
      toggleSideBar();
    }

  }

  const newTextDocument = () => {
    const newId = uuid();
    removeActive();
    setList([...list, {id: newId,  title: "What are you wranting about", text: 'Start wranting...', preview: 'Start wranting...', active: true}]);
    if (Math.min(window.screen.width, window.screen.height) < 768) {
      toggleSideBar();
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
    localStorage.setItem('contentObj', JSON.stringify(list));
    }
  }, [list])
  return (
    <div 
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      ref={sideBarRef} className='fixed flex flex-col items-center left-0 top-0 w-full sm:w-[25rem] h-screen bg-teal-400/10 transition-transform pt-10 backdrop-blur-md z-[999]'>
    <div className='overflow-y-scroll flex flex-col items-center w-full h-auto no-scrollbar !overflow-x-hidden'>
  
      {list.map((item) => (
        <TextDocument key={item.id} id={item.id} title={item.title.substring(0,50)} preview={item.preview.substring(0,100)} isActive={item.active} setActive={() => setActive(item.id)} remove={() => removeListItem(item.id)} />
      ))}
      <button onClick={newTextDocument} className='flex-shrink-0 rounded-full bg-teal-300/10 h-10 w-10 text-teal-200/40 active:translate-y-1 mb-10'>+
      </button>
   
  
  
    </div>
    <button onClick={toggleSideBar} className='text-teal-200/40 absolute rounded-e-md bottom-[initial] top-0 sm:top-[initial] sm:bottom-10 -right-10 bg-teal-400/10 w-10 h-10 flex items-center justify-center text-center active:translate-y-1'>
    <HiMiniArrowsRightLeft />
    </button>
    <button onClick={toggleSideBar} className='text-teal-200/40 absolute rotate-180 rounded-e-md bottom-10 right-0 sm:-right-10 bg-teal-400/10 w-10 h-10 flex sm:hidden items-center justify-center text-center active:translate-y-1'>
    <HiMiniArrowsRightLeft />
    </button>
    </div>
  )
}
