import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

import disableScroll from '../../utils/disableScroll'
import useWindowSize from '../../utils/windowSize'

import Link from 'next/link'

const Layout = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false)

  const { width: windowWidth } = useWindowSize()
  const isMobile = windowWidth < 768

  const isMenuShown = !isMobile || showMenu

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  useEffect(() => {
    if (showMenu) {
      disableScroll.on()
    } else {
      disableScroll.off()
    }
  }, [showMenu])

  const date = new Date()
  const year = date.getFullYear()

  return (
      <>
      {/* Header */}
      <div className='h-16 flex flex-col justify-between items-center fixed top-0 left-0 right-0 bg-white z-2 shadow px-4 md:px-0'>
        <div className='container h-full flex flex-row justify-between items-center'>
          <div>
            <Link href='/' className='font-bold text-primary-blue text-xl'>
              EnTUR CASE
            </Link>
          </div>
          <div>
            {isMobile && (
              <button type='button' className='flex items-center justify-center' onClick={toggleMenu}>
                {showMenu ? (
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                ) : (
                  <FontAwesomeIcon icon={faBars} size="lg" />
                )}
              </button>
            )}
            {isMenuShown && (
              <div className='h-[calc(100vh-4rem)] pt-4 px-0 pb-40 flex flex-col justify-start absolute top-12 left-0 right-0 bg-white overflow-y-scroll md:h-8 md:p-0 md:flex-row md:justify-end md:items-center md:static md:overflow-y-hidden'>
                <Link
                  href='/'
                  className='w-full py-6 px-5 text-lg text-left font-medium border-b md:w-auto md:ml-8 md:p-0 md:text-sm md:text-left md:border-b-0 md:hover:underline'
                >
                  Hjem
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className='mt-16 mx-4 md:mx-0 min-h-full-header'>{children}</div>
      {/* Footer */}
      <div className='w-full justify-center items-center flex flex-col md:flex-row gap-4 py-4 text-sm font-medium  '>
        <span>© {year} Norsk Luftambulanse Teknologi</span>
      </div>
    </>
  )
}

export default Layout
