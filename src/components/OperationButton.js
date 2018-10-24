import React from 'react'

const OperationButton = ({ operation, opSign, style, onClick }) => {
  return (
    <div id={operation} className='parallax' style={style} onClick={_ => onClick(opSign)}>
      <div className="content">
        {opSign}
      </div>
    </div>
  )
}

export default OperationButton
