import React from 'react'
import { useWindowSize } from '~/lib/hooks'

type Props = {
  children: React.ReactNode
}

export function PleaseUseComputer({ children }: Props) {
  const { width } = useWindowSize()

  const isSmall = width && width < 700

  if (isSmall)
    return (
      <div className='h-screen bg-gray-100'>
        <div className='flex h-full justify-center'>
          <div className='mt-16 h-fit w-8/12 rounded-md bg-slate-400 p-3 shadow-lg'>
            <img
              src='/error-x.png'
              alt='xerrorimage'
              className='mx-auto w-36 rounded-full'
            />
            <p className='my-2 px-5 text-sm text-white'>
              Hey There! This website is <b>optimized</b> for desktop. Please
              visit us from a laptop or desktop to proceed.
            </p>
          </div>
        </div>
      </div>
    )

  return <>{React.Children.map(children, (child) => child)}</>
}
