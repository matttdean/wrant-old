import {  useContext } from 'react';
import { StorageContext } from '@/context/storage-context';


const saveDocument = (list, input) => {
    const newList = list.map(item => {
      if (item.active === true) {
        return {
          ...item,
          text: item.text = input,
        };
      } else {
        return item;
      }
    })
    setList(newList);
}