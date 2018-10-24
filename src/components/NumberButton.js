import React from 'react'

const NumberButton = ({ id, value, style, onClick }) => {
  return (
    <div id={id} className='parallax' style={style} onClick={_ => onClick(value)}>
      <div className="content">
        {value}
      </div>
    </div>
  )
}

export default NumberButton
