export const rotateToMouse = (
  e: MouseEvent,
  card: React.MutableRefObject<HTMLElement>,
  glow: React.MutableRefObject<HTMLElement>,
  bounds: DOMRect,
  glare?: boolean,
  color1?: string,
  color2?: string,
  skew?: number
) => {
  const mouseX = e.clientX
  const mouseY = e.clientY
  const leftX = mouseX - bounds.x
  const topY = mouseY - bounds.y
  const center = {
    x: leftX - bounds.width / 2,
    y: topY - bounds.height / 2,
  }
  const distance = Math.sqrt(center.x ** 2 + center.y ** 2)
  const skewAngle = skew || 1.07

  card.current.style.transform = `
    scale3d(${skewAngle}, ${skewAngle}, ${skewAngle})
    rotate3d(
      ${center.y / 100},
      ${-center.x / 100},
      0,
      ${Math.log(distance) * 2}deg
    )
  `

  if (glow.current)
    glow.current.style.backgroundImage = glare
      ? `
    radial-gradient(
      circle at
      ${center.x * 2 + bounds.width / 2}px
      ${center.y * 2 + bounds.height / 2}px,
      ${color1},
      ${color2}
    )
  `
      : "none"
}
