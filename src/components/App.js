import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';

import Display from './Display';
import NumberButton from './NumberButton';
import OperationButton from './OperationButton';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mForce: 15,
      rForce: 15,
      parallax: {
        top: 'inherit',
        left: 'inherit',
        transform: 'none',
      },
      initialState: {
        valToDisplay: '0',
        currentValue: '0',
        currentOp: '',
        currentResult: '0',
        history: [],
      },
      valToDisplay: '0',
      currentValue: 0,
      currentOp: '',
      currentResult: 0,
      isDecimal: false,
      history: [],
    }
  }

  componentDidMount() {
    if (!isMobile) {
      this.mouse = document.addEventListener('mousemove', this.handleMouse);
      this.keyboard = document.addEventListener('keypress', this.handleKeyboard);
    }
  }

  componentWillUnmount() {
    if (!isMobile) {
      this.mouse = document.removeEventListener('mousemove', this.handleMouse);
      this.keyboard = document.removeEventListener('keypress', this.handleKeyboard);
    }
  }

  handleKeyboard = (e) => {
    switch (e.key) {
      case '0':
        this.handleNumber(0);
        break;
      case '1':
        this.handleNumber(1);
        break;
      case '2':
        this.handleNumber(2);
        break;
      case '3':
        this.handleNumber(3);
        break;
      case '4':
        this.handleNumber(4);
        break;
      case '5':
        this.handleNumber(5);
        break;
      case '6':
        this.handleNumber(6);
        break;
      case '7':
        this.handleNumber(7);
        break;
      case '8':
        this.handleNumber(8);
        break;
      case '9':
        this.handleNumber(9);
        break;
      case 'a':
        this.handleOperator('+');
        break;
      case 's':
        this.handleOperator('-');
        break;
      case 'm':
        this.handleOperator('x');
        break;
      case 'd':
        this.handleOperator('/');
        break;
      case 'c':
        this.handleOperator('AC');
        break;
      case 'u':
        this.handleOperator('CE');
        break;
      case 'Enter':
        this.handleOperator('=');
        break;
      case 'n':
        this.handleOperator('+/-');
        break;
      default:
        break;
    }
  }

  handleMouse = (e) => {
    const { rForce, mForce } = this.state;
    const docX = document.documentElement.clientWidth;
    const docY = document.documentElement.clientHeight
    const moveX = (e.pageX - docX / 2) / (docX / 2) * -mForce;
    const moveY = (e.pageY - docY / 2) / (docY / 2) * -mForce;
    const rotateY = (e.pageX / docX * rForce * 2) - rForce;
    const rotateX = -((e.pageY / docY * rForce * 2) - rForce);
    const left = moveX + 'px';
    const top = moveY + 'px';
    const transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    this.setState({ parallax: { top, left, transform } });
  }

  calcResult = (op, currentResult, currentValue) => {
    let total = 0;
    switch (op) {
      case '+':
        total = currentResult + currentValue;
        break;
      case '-':
        total = currentResult - currentValue;
        break;
      case '/':
        total = currentResult / currentValue;
        break;
      case 'x':
        total = currentResult * currentValue;
        break;
      default:
        total = currentValue;
        break;
    }
    return total;
  }

  revertOp = (op, currentResult, currentValue) => {
    switch (op) {
      case '+':
        return currentResult - currentValue;
      case '-':
        return currentResult + currentValue;
      case '/':
        return currentResult * currentValue;
      case 'x':
        return currentResult / currentValue;
      default:
        break;
    }
  }

  handleOperator = (op) => {
    let { valToDisplay, currentValue, currentResult, currentOp, isDecimal } = this.state;
    if ((op !== '+/-' && op !== '.')) {
      isDecimal = false;
      currentResult = this.calcResult(currentOp, currentResult, currentValue);
      if (typeof valToDisplay === 'string') {
        currentResult = this.revertOp(currentOp, currentResult, currentValue);
      }
      this.setState({ currentResult, isDecimal });
    }
    let history = [...this.state.history];
    switch (op) {
      case 'AC':
        history = [];
        valToDisplay = '0';
        currentOp = '';
        currentValue = 0;
        currentResult = 0;
        this.setState({ history, valToDisplay, currentValue, currentOp, currentResult });
        break;
      case 'CE':
        if (typeof valToDisplay === 'string' || currentOp === '') break;
        valToDisplay = currentOp;
        history.pop();
        currentResult = this.revertOp(currentOp, currentResult, currentValue);
        currentValue = history[history.length - 2];
        this.setState({ history, valToDisplay, currentValue, currentResult });
        break;
      case '+':
      case '-':
      case 'x':
      case '/':
        history[typeof valToDisplay === 'string' && history.length ? history.length - 1 : history.length] = op;
        currentOp = op;
        valToDisplay = op;
        this.setState({ history, currentOp, valToDisplay });
        break;
      case '+/-':
        if (currentValue === 0) break;
        currentValue = -currentValue;
        valToDisplay = currentValue;
        history[history.length - 1] = currentValue;
        this.setState({ history, currentValue, valToDisplay });
        break;
      case '.':
        isDecimal = true;
        currentValue = parseFloat(Math.floor(currentValue * 10000) / 10000);
        valToDisplay = currentValue + '.';
        this.setState({ isDecimal, currentValue, valToDisplay });
        break;
      case '=':
        currentValue = Math.floor(currentResult * 100000000) / 100000000;
        valToDisplay = Math.floor(currentResult * 10000) / 10000;
        history = [Math.floor(currentResult * 10000) / 10000];
        currentOp = '=';
        this.setState({ history, currentOp, currentResult, currentValue, valToDisplay });
        break;
      default:
        break;
    }

  }

  handleNumber = (value) => {
    let { currentResult, currentValue, valToDisplay, isDecimal, currentOp } = this.state;
    let history = [...this.state.history];
    if (currentOp === '=') {
      currentResult = 0;
      currentValue = 0;
      history = [];
      valToDisplay = '0';
    }
    if (isDecimal) {
      const index = typeof valToDisplay === 'string' ? valToDisplay.indexOf('.') : valToDisplay.toString().indexOf('.');
      const decimPlaces = valToDisplay.toString().length - index;
      currentValue = currentValue + value / Math.pow(10, decimPlaces);
      currentValue = Math.floor(currentValue * 100000000) / 100000000;
    } else {
      currentValue = typeof valToDisplay === 'number' ? (currentValue >= 0 ? currentValue * 10 + value : currentValue * 10 - value) : value;
    }
    history[typeof valToDisplay === 'number' || isDecimal ? history.length - 1 : history.length] = currentValue;
    valToDisplay = currentValue;
    this.setState({ history, currentValue, valToDisplay, currentResult });
  }

  render() {
    const { parallax, history, valToDisplay } = this.state;
    return (
      <div className='calc-grid'>
        <Display valToDisplay={valToDisplay} history={history} style={parallax} />
        <OperationButton onClick={this.handleOperator} operation={'undo'} opSign={'CE'} style={parallax} />
        <OperationButton onClick={this.handleOperator} operation={'equals'} opSign={'='} style={parallax} />
        <OperationButton onClick={this.handleOperator} operation={'add'} opSign={'+'} style={parallax} />
        <OperationButton onClick={this.handleOperator} operation={'subtract'} opSign={'-'} style={parallax} />
        <OperationButton onClick={this.handleOperator} operation={'multiply'} opSign={'x'} style={parallax} />
        <OperationButton onClick={this.handleOperator} operation={'divide'} opSign={'/'} style={parallax} />
        <OperationButton onClick={this.handleOperator} operation={'decimal'} opSign={'.'} style={parallax} />
        <OperationButton onClick={this.handleOperator} operation={'negative'} opSign={'+/-'} style={parallax} />
        <OperationButton onClick={this.handleOperator} operation={'clear'} opSign={'AC'} style={parallax} />
        <NumberButton onClick={this.handleNumber} id={'zero'} value={0} style={parallax} />
        <NumberButton onClick={this.handleNumber} id={'one'} value={1} style={parallax} />
        <NumberButton onClick={this.handleNumber} id={'two'} value={2} style={parallax} />
        <NumberButton onClick={this.handleNumber} id={'three'} value={3} style={parallax} />
        <NumberButton onClick={this.handleNumber} id={'four'} value={4} style={parallax} />
        <NumberButton onClick={this.handleNumber} id={'five'} value={5} style={parallax} />
        <NumberButton onClick={this.handleNumber} id={'six'} value={6} style={parallax} />
        <NumberButton onClick={this.handleNumber} id={'seven'} value={7} style={parallax} />
        <NumberButton onClick={this.handleNumber} id={'eight'} value={8} style={parallax} />
        <NumberButton onClick={this.handleNumber} id={'nine'} value={9} style={parallax} />
      </div>
    )
  }
}

export default App
