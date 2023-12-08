import React from 'react'
import { createPortal } from 'react-dom'
import { MdAllInclusive } from 'react-icons/md'
import Image from 'next/image'
import Button from '../button'


const Modal = () => {
  const [open, setOpen] = React.useState(false)

  const ModalBody = (
      <div className='fixed top-0 left-0 h-screen w-screen backdrop-blur' onClick={() => {
        setOpen(false);
      }}>
        <div className='min-h-64 min-w-48 fixed flex flex-col p-5 bg-primary text-accent z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md shadow-md'>
          <div 
          className='ml-auto cursor-pointer font-sans'
          onClick={() => {
            setOpen(false)
          }}>
            <MdAllInclusive />
          </div>
          <div className="min-h-[360px] w-64 p-2 rounded-xl">
            <div className="relative h-64 w-full rounded-xl overflow-hidden">
              <Image
                fill
                src="/image/illustrative-bg.jpg"
                alt=""
              />
            </div>
            <div className="my-2">
              <h1 className="text-xl font-bold text-accent">
                Sample Card
              </h1>
              <p className="text-sm font-sm text-accent">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum porro quas corrupti nihil.
              </p>
            </div>
          </div>
        </div>
      </div>
  )

  return (
    <div>
      <Button title='Open Modal' onClick={() => {
        setOpen(true);
      }}/>
      {open && (
        // @ts-ignore
        createPortal(ModalBody, document.body)
      )}
    </div>
  )
}

export default Modal