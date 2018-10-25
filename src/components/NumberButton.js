import React from 'react'

const NumberButton = ({ id, value, style, onClick, keyPressed }) => {

  return (
    <div tabIndex={0} id={id} className={keyPressed === value ? 'parallax hover-style' : 'parallax'} style={style} onClick={_ => onClick(value)}>
      <div className="content">
        {value}
      </div>
    </div>
  )
}

export default NumberButton
