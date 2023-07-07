const disableScroll = {
  on: () => {
    window.document.documentElement.style.overflow = 'hidden'
  },
  off: () => {
    window.document.documentElement.style.overflow = 'unset'
  }
}

export default disableScroll
