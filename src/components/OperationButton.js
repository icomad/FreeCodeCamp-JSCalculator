import React from 'react'

const OperationButton = ({ operation, opSign, style, onClick, keyPressed, keyCode }) => {
  return (
    <div id={operation} className={keyPressed === keyCode ? 'parallax hover-style' : 'parallax'} style={style} onClick={_ => onClick(opSign)}>
      <div className="content">
        {opSign}
      </div>
    </div>
  )
}

export default OperationButton
