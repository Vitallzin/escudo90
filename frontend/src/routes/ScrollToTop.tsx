import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const scrollPositions = new Map<string, number>()
const scrollStorageKey = 'escudo90:scroll-positions'
const maxRestoreFrames = 45

let hasLoadedStoredPositions = false

function getScrollKey(pathname: string, search: string) {
  return `${pathname}${search}`
}

function loadStoredPositions() {
  if (hasLoadedStoredPositions) return

  hasLoadedStoredPositions = true

  try {
    const storedPositions = window.sessionStorage.getItem(scrollStorageKey)
    if (!storedPositions) return

    const parsedPositions = JSON.parse(storedPositions) as Record<string, number>
    Object.entries(parsedPositions).forEach(([key, position]) => {
      if (Number.isFinite(position)) {
        scrollPositions.set(key, position)
      }
    })
  } catch {
    window.sessionStorage.removeItem(scrollStorageKey)
  }
}

function persistPositions() {
  try {
    window.sessionStorage.setItem(scrollStorageKey, JSON.stringify(Object.fromEntries(scrollPositions)))
  } catch {
    return
  }
}

function saveCurrentPosition(persist = false) {
  scrollPositions.set(getScrollKey(window.location.pathname, window.location.search), window.scrollY)

  if (persist) {
    persistPositions()
  }
}

function getMaxScroll() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
}

function restorePosition(top: number) {
  if (top <= 0) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    return () => {}
  }

  let frame = 0
  let animationFrame = 0
  let cancelled = false

  function tryRestore() {
    if (cancelled) return

    const canRestoreNow = getMaxScroll() >= top
    const shouldStopWaiting = frame >= maxRestoreFrames

    if (canRestoreNow || shouldStopWaiting) {
      window.scrollTo({ top: Math.min(top, getMaxScroll()), left: 0, behavior: 'instant' })
      return
    }

    frame += 1
    animationFrame = window.requestAnimationFrame(tryRestore)
  }

  animationFrame = window.requestAnimationFrame(tryRestore)

  return () => {
    cancelled = true
    window.cancelAnimationFrame(animationFrame)
  }
}

function isNavigationClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false
  }

  return event.target instanceof Element && Boolean(event.target.closest('a[href]'))
}

export function ScrollToTop() {
  const { hash, pathname, search } = useLocation()
  const previousLocation = useRef({ pathname, search })
  const cancelRestore = useRef<(() => void) | null>(null)

  useEffect(() => {
    loadStoredPositions()
    window.history.scrollRestoration = 'manual'
    let animationFrame = 0

    function handleScroll() {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(() => saveCurrentPosition())
    }

    function handleClick(event: MouseEvent) {
      if (isNavigationClick(event)) {
        saveCurrentPosition(true)
      }
    }

    function handleSubmit() {
      saveCurrentPosition(true)
    }

    function handlePageLeave() {
      saveCurrentPosition(true)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('click', handleClick, true)
    window.addEventListener('submit', handleSubmit, true)
    window.addEventListener('pagehide', handlePageLeave)
    window.addEventListener('visibilitychange', handlePageLeave)

    return () => {
      handlePageLeave()
      window.cancelAnimationFrame(animationFrame)
      window.history.scrollRestoration = 'auto'
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('click', handleClick, true)
      window.removeEventListener('submit', handleSubmit, true)
      window.removeEventListener('pagehide', handlePageLeave)
      window.removeEventListener('visibilitychange', handlePageLeave)
    }
  }, [])

  useLayoutEffect(() => {
    loadStoredPositions()
    cancelRestore.current?.()

    const wasSamePath = previousLocation.current.pathname === pathname
    const wasSameSearch = previousLocation.current.search === search
    previousLocation.current = { pathname, search }

    if (hash) {
      window.setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 0)
      return
    }

    if (wasSamePath && !wasSameSearch) {
      saveCurrentPosition()
      return
    }

    const savedPosition = pathname.startsWith('/produto/') ? 0 : (scrollPositions.get(getScrollKey(pathname, search)) ?? 0)
    cancelRestore.current = restorePosition(savedPosition)

    return () => {
      cancelRestore.current?.()
      cancelRestore.current = null
    }
  }, [hash, pathname, search])

  return null
}
