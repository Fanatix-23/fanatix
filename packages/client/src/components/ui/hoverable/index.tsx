import React from "react"
import clsx from "clsx"
import { rotateToMouse } from "@/utils/animate"

interface HoverableProps {
  className?: string
  color1?: string
  color2?: string
  glow?: boolean
  glowClassName?: string
  skew?: number
}

const Hoverable = (props: HoverableProps & React.PropsWithChildren) => {
  const {
    children,
    className,
    glowClassName,
    color1 = "#ffffff55",
    color2 = "#0000000f",
    glow = false,
    skew,
  } = props
  // Ref, State, Effect
  const mainRef = React.useRef<HTMLDivElement>(null)
  const glowRef = React.useRef<HTMLDivElement>(null)
  let bounds: DOMRect | null = null
  const mouseFunc = (e: MouseEvent) => {
    if (bounds)
      rotateToMouse(
        e,
        mainRef as React.MutableRefObject<HTMLElement>,
        glowRef as React.MutableRefObject<HTMLElement>,
        bounds,
        glow,
        color1,
        color2,
        skew
      )
  }
  React.useEffect(() => {
    mainRef.current?.addEventListener("mouseenter", () => {
      bounds = mainRef.current?.getBoundingClientRect() || null
      document.addEventListener("mousemove", mouseFunc)
    })
    mainRef.current?.addEventListener("mouseleave", () => {
      document.removeEventListener("mousemove", mouseFunc)
      if (mainRef.current) {
        mainRef.current.style.transform = ""
        mainRef.current.style.background = ""
      }
      if(glowRef.current) {
        glowRef.current.style.background = ""
      }
    })
  })

  return (
    <div
      style={{
        perspective: "1500px",
      }}
    >
      <div
        ref={mainRef}
        style={{
          position: "relative",
          transitionDuration: "300ms",
          transitionProperty: "transform, box-shadow",
          transitionTimingFunction: "ease-out",
          transform: "rotate3d(0)",
        }}
        className={`hover:transition-[150ms] h-min w-min ${className}`}
      >
        {children}
        {glow && (
          <div
            ref={glowRef}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              left: "0",
              top: "0",
            }}
            className={glowClassName}
          />
        )}
      </div>
    </div>
  )
}

export default Hoverable
