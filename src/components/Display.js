import React from 'react'

const Display = ({ valToDisplay, history, style }) => {
  const formula = history.slice(0, history.length - 1).length ? history.slice(0, history.length - 1).reduce((string, value) => string += ' ' + value) : null

  return (
    <div id='display' className='parallax' style={style}>
      <div className="content">
        <span style={{ opacity: '0.3' }}>{formula}</span> {valToDisplay}
      </div>
    </div>
  )
}

export default Display
