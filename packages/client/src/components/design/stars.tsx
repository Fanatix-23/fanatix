import React from "react"

interface StarStyle {
  position?: "absolute" | "relative" | "fixed"
  color?: string
  transform?: string
  top?: string
  left?: string
}

const FourStar: React.FC<StarStyle> = (styles: StarStyle) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={styles}
    >
      <path
        d="M7.1635 1.33055C7.32644 0.889816 7.94933 0.889816 8.11277 1.33055L9.60703 5.37006C9.65864 5.50871 9.76794 5.6175 9.90609 5.66911L13.9456 7.16387C14.3863 7.32681 14.3863 7.94971 13.9456 8.11265L9.90609 9.60741C9.76794 9.65852 9.65864 9.76782 9.60703 9.90646L8.11277 13.946C7.94933 14.3867 7.32644 14.3867 7.1635 13.946L5.66872 9.90646C5.61761 9.76782 5.50834 9.65852 5.36969 9.60741L1.33017 8.11265C0.889942 7.94971 0.889942 7.32681 1.33017 7.16387L5.36969 5.66911C5.50834 5.6175 5.61761 5.50871 5.66872 5.37006L7.1635 1.33055Z"
        fill="url(#paint0_linear_4566_17150)"
        stroke="#2F2F2F"
        strokeWidth="1.51804"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_4566_17150"
          x1="13.0019"
          y1="1.31183"
          x2="2.87758"
          y2="12.5565"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFB843" />
          <stop offset="0.936216" stopColor="#FD6641" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const FiveStar: React.FC<StarStyle> = (styles: StarStyle) => {
  return (
    <svg
      width="31"
      height="32"
      viewBox="0 0 31 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...styles}
    >
      <path
        d="M11.5141 2L18.1513 10.3431L28.1348 6.60816L22.2547 15.4964L28.8868 23.8345L18.6207 20.9879L12.7356 29.8761L12.2712 19.2314L2 16.3847L11.9835 12.6498L11.5141 2Z"
        fill="#00C7A9"
        stroke="black"
        strokeWidth="1.00946"
        strokeMiterlimit="10"
      />
    </svg>
  )
}

const getRandomStyle = () => {
  return {
    position: "absolute" as "absolute" | "relative" | "fixed",
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    transform: `scale(${Math.random() * 0.75 - 0.25}) rotate(${Math.random() * 360}deg)`,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
  }
}

const Stars = () => {
  const numStars = 200
  const stars = []

  for (let i = 0; i < numStars; i++) {
    const StarComponent: React.FC<StarStyle> = i % 2 === 0 ? FourStar : FiveStar
    const style = getRandomStyle()
    stars.push(
      <div className="animate-pulse" style={{ ...style, animationDelay: `${Math.random()}s` }}>
        <StarComponent key={i} />
      </div>
    )
  }

  return (
    <div className="z-0" style={{ position: "absolute", height: "100%", width: "100%" }}>
      {stars}
    </div>
  )
}

export default Stars
