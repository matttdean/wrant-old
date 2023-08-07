'use client';

import React, { useEffect, useState, useRef, useContext } from 'react';
import { StorageContext } from '@/context/storage-context';

export default function MainTextArea() {
    const { list, setList } = useContext(StorageContext);
    const [wordCount, setWordCount] = useState(0);
    const [currentDocumentText, setCurrentDocumentText] = useState("");
    const [currentDocumentTitle, setCurrentDocumentTitle] = useState("")
    
    const titleRef = useRef();
    const contentRef = useRef();
    const caretPos = useRef();


    function getCaret(el) {
        const sel = window.getSelection();
      
        if (sel.rangeCount === 0) {
          return 0;
        }
      
        const range = sel.getRangeAt(0);
        const preRange = range.cloneRange();
        preRange.selectNodeContents(el);
        preRange.setEnd(range.endContainer, range.endOffset);
        const contents = preRange.cloneContents();
      
        let caretAt = 0;
      
        for (const node of contents.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            caretAt += node.textContent.length;
          } else if (node.nodeName === 'BR') {
            caretAt++;
          }
        }
      
        return caretAt;
      }
      
      const setCaretPosition = (el, pos) => {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
          acceptNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
              return NodeFilter.FILTER_ACCEPT;
            }
            if (node.nodeName === 'BR') {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          }
        });
      
        let currentPos = 0;
      
        while (walker.nextNode()) {
          const node = walker.currentNode;
      
          if (node.nodeType === Node.TEXT_NODE) {
            const nodeLength = node.textContent.length;
            if (currentPos + nodeLength >= pos) {
              const range = document.createRange();
              const sel = window.getSelection();
      
              range.setStart(node, pos - currentPos);
              range.collapse(true);
      
              sel.removeAllRanges();
              sel.addRange(range);
              return;
            } else {
              currentPos += nodeLength;
            }
          } else if (node.nodeName === 'BR') {
            if (currentPos === pos) {
              const range = document.createRange();
              const sel = window.getSelection();
      
              range.setStartAfter(node);
              range.collapse(true);
      
              sel.removeAllRanges();
              sel.addRange(range);
              return;
            } else {
              currentPos++;
            }
          }
        }
      };
      

    const getActive = () => {
        const active = list.filter(item => item.active === true);
        if (active[0] !== undefined) {
            return active[0];
        }  else  {
            return false;
        }
    }

    const activeDocument = getActive();


    useEffect(() => {
        setCaretPosition(titleRef.current, caretPos.current);
        
      }, [currentDocumentTitle]);

    
    useEffect(() => {
        setCaretPosition(contentRef.current, caretPos.current);
        
      }, [currentDocumentText]);

    const updateTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.nativeEvent.inputType  === 'insertParagraph') { 
            return;
        }
        const newList = list.map(item => {
            if (item.active === true) {
              return {
                ...item,
                title: item.title = event.target.innerText,
              };
            } else {
              return item;
            }
          })
          setList(newList)
          setCurrentDocumentTitle(event.target.textContent);
          caretPos.current = getCaret(titleRef.current);  
    }
   
    const updateTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {

            if (event.nativeEvent.inputType  === 'insertParagraph') { 
                return;
            }

        const newList = list.map(item => {
            if (item.active === true) {
              return {
                ...item,
                text: item.text = event.target.innerHTML,
                preview: item.preview = event.target.textContent,
              };
            } else {
              return item;
            }
          })
        setList(newList);
        setCurrentDocumentText(event.target.innerHTML)
        setWordCount(event.target.textContent.length);
        caretPos.current = getCaret(contentRef.current);  
    }

  return (
        <>
            <div className='w-full lg:w-[60rem] pt-12 px-6 sm:pt-10 sm:px-10'>
                <div
                    ref={titleRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={updateTitleInput} 
                    id="main-title" 
                    className='w-full mb-4 outline-none text-teal-400 text-opacity-20 text-3xl sm:text-4xl caret-cyan-200 tracking-wide selection:bg-teal-400 selection:text-slate-100 selection:bg-opacity-20 bg-transparent font-semibold focus:text-opacity-40 placeholder:text-teal-400 placeholder:text-opacity-20 placeholder:focus:text-opacity-10 focus:border-b border-teal-300/20 resize-none'
                >
                    {activeDocument && activeDocument.title}

                    </div>
                    <div 
                        contentEditable
                        suppressContentEditableWarning
                        ref={contentRef}  
                        id="main-text" 
                        name="main-text" 
                        className='outline-none text-slate-400 text-md sm:text-xl caret-cyan-200 leading-loose tracking-wide selection:bg-teal-400 selection:text-slate-100 selection:bg-opacity-20 bg-transparent w-[100%] text-opacity-20 focus:text-opacity-100 placeholder:text-slate-400 placeholder:text-opacity-20 placeholder:focus:text-opacity-10 resize-none inline-block'
                        onInput={updateTextInput}
                        dangerouslySetInnerHTML={{__html: activeDocument.text}} 
                    >
                        
                    </div>
                </div>
            <div 
            className='min-w-10 h-10 p-4 flex justify-center items-center fixed top-0 right-0 sm:top-10 sm:right-10 bg-slate-100/10 text-teal-200/30'
            >
                    {wordCount}
            </div>
        </>

  )
}
