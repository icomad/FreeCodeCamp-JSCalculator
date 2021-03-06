import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';

import Display from './Display';
import NumberButton from './NumberButton';
import OperationButton from './OperationButton';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mForce: 10,
      rForce: 10,
      parallax: {
        top: 'inherit',
        left: 'inherit',
        transform: 'none',
      },
      displayVal: '0',
      prevValue: '',
      currentValue: '',
      currentOp: '',
      history: [],
      isDecimal: false,
      disable: false,
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
        this.handleNumber('0');
        break;
      case '1':
        this.handleNumber('1');
        break;
      case '2':
        this.handleNumber('2');
        break;
      case '3':
        this.handleNumber('3');
        break;
      case '4':
        this.handleNumber('4');
        break;
      case '5':
        this.handleNumber('5');
        break;
      case '6':
        this.handleNumber('6');
        break;
      case '7':
        this.handleNumber('7');
        break;
      case '8':
        this.handleNumber('8');
        break;
      case '9':
        this.handleNumber('9');
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
      case '.':
        this.handleOperator('.');
        break;
      default:
        break;
    }
    this.setState({ keyPressed: e.key }, () => {
      setTimeout(_ => this.setState({ keyPressed: '' }), 400);
    });
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

  initialize = () => {
    this.setState({
      currentValue: '',
      prevValue: '',
      currentOp: '',
      history: [],
      displayVal: '0',
      isDecimal: false,
      disable: false,
    })
  }

  isOperator = (displayVal) => {
    return displayVal === '+' || displayVal === '-' || displayVal === '/' || displayVal === 'x';
  }

  calcResult = (history) => {
    const totalString = history.join(' ');
    return eval(totalString.replace('x', '*'));
  }

  handleOperator = (op) => {
    let history = [...this.state.history];
    let { currentValue, currentOp, displayVal, isDecimal, disable } = this.state
    switch (op) {
      case '+':
      case '-':
      case '/':
      case 'x':
        if (this.isOperator(displayVal)) history.pop();
        history.push(op);
        displayVal = op;
        currentOp = op;
        isDecimal = false;
        disable = false;
        this.setState({ history, currentOp, displayVal, isDecimal, disable });
        break;
      case 'AC':
        this.initialize();
        break;
      case 'CE':
        if (this.isOperator(displayVal) || history.length < 2) break;
        history.pop();
        displayVal = history[history.length - 1];
        isDecimal = false;
        disable = false;
        this.setState({ history, displayVal, isDecimal, disable });
        break;
      case '+/-':
        if (this.isOperator(displayVal)) break;
        currentValue = currentValue.slice(0, 1) === '-' ? currentValue.slice(1) : '-' + currentValue;
        history[history.length - 1] = currentValue;
        displayVal = currentValue;
        this.setState({ history, currentValue, displayVal });
        break;
      case '=':
        if (this.isOperator(displayVal)) history.pop();
        const result = this.calcResult(history);
        currentOp = op;
        displayVal = result;
        currentValue = result;
        history = [result];
        isDecimal = false;
        disable = false;
        this.setState({ history, displayVal, currentOp, currentValue, isDecimal, disable });
        break;
      case '.':
        if (this.isOperator(displayVal) || isDecimal || disable) break;
        if (!history.length) currentValue = '0';
        isDecimal = true;
        currentValue = currentValue + '.';
        displayVal = currentValue;
        history[history.length - 1] = currentValue;
        this.setState({ history, currentValue, displayVal, isDecimal })
        break;
      default:
        break;
    }
  }

  handleNumber = (value) => {
    let history = [...this.state.history];
    let { currentValue, prevValue, currentOp, displayVal, disable } = this.state
    if (disable) { this.setState({ displayVal: 'MAX DIGIT REACHED', disable: true }, () => { setTimeout(() => { this.setState({ displayVal: currentValue }) }, 600) }); return; }
    if (displayVal === '0' && value === '0') return;
    if (currentOp === '=') {
      currentValue = '';
      prevValue = '';
      currentOp = '';
      history = [];
    }
    if (displayVal.length > 18) { this.setState({ displayVal: 'MAX DIGIT REACHED', disable: true }, () => { setTimeout(() => { this.setState({ displayVal: currentValue }) }, 600) }); return; }
    if (!this.isOperator(displayVal) && (displayVal !== '0')) { currentValue += value; history.pop(); history.push(currentValue); }
    else if (displayVal === '0') { currentValue = value; history.pop(); history.push(currentValue) }
    else { currentValue = value; history.push(currentValue); };

    prevValue = history.slice(-3)[0];
    displayVal = currentValue;
    this.setState({ history, currentValue, displayVal, prevValue, currentOp });

  }

  render() {
    const { parallax, history, displayVal, keyPressed } = this.state;
    return (
      <>
        <header style={parallax}><h1>JS Calculator</h1></header>
        <div className='calc-grid'>
          <Display displayVal={displayVal} history={history} style={parallax} />
          <OperationButton keyPressed={keyPressed} onClick={this.handleOperator} keyCode={'u'} operation={'undo'} opSign={'CE'} style={parallax} />
          <OperationButton keyPressed={keyPressed} onClick={this.handleOperator} keyCode={'Enter'} operation={'equals'} opSign={'='} style={parallax} />
          <OperationButton keyPressed={keyPressed} onClick={this.handleOperator} keyCode={'a'} operation={'add'} opSign={'+'} style={parallax} />
          <OperationButton keyPressed={keyPressed} onClick={this.handleOperator} keyCode={'s'} operation={'subtract'} opSign={'-'} style={parallax} />
          <OperationButton keyPressed={keyPressed} onClick={this.handleOperator} keyCode={'m'} operation={'multiply'} opSign={'x'} style={parallax} />
          <OperationButton keyPressed={keyPressed} onClick={this.handleOperator} keyCode={'d'} operation={'divide'} opSign={'/'} style={parallax} />
          <OperationButton keyPressed={keyPressed} onClick={this.handleOperator} keyCode={'.'} operation={'decimal'} opSign={'.'} style={parallax} />
          <OperationButton keyPressed={keyPressed} onClick={this.handleOperator} keyCode={'n'} operation={'negative'} opSign={'+/-'} style={parallax} />
          <OperationButton keyPressed={keyPressed} onClick={this.handleOperator} keyCode={'c'} operation={'clear'} opSign={'AC'} style={parallax} />
          <NumberButton keyPressed={keyPressed} onClick={this.handleNumber} id={'zero'} value={'0'} style={parallax} />
          <NumberButton keyPressed={keyPressed} onClick={this.handleNumber} id={'one'} value={'1'} style={parallax} />
          <NumberButton keyPressed={keyPressed} onClick={this.handleNumber} id={'two'} value={'2'} style={parallax} />
          <NumberButton keyPressed={keyPressed} onClick={this.handleNumber} id={'three'} value={'3'} style={parallax} />
          <NumberButton keyPressed={keyPressed} onClick={this.handleNumber} id={'four'} value={'4'} style={parallax} />
          <NumberButton keyPressed={keyPressed} onClick={this.handleNumber} id={'five'} value={'5'} style={parallax} />
          <NumberButton keyPressed={keyPressed} onClick={this.handleNumber} id={'six'} value={'6'} style={parallax} />
          <NumberButton keyPressed={keyPressed} onClick={this.handleNumber} id={'seven'} value={'7'} style={parallax} />
          <NumberButton keyPressed={keyPressed} onClick={this.handleNumber} id={'eight'} value={'8'} style={parallax} />
          <NumberButton keyPressed={keyPressed} onClick={this.handleNumber} id={'nine'} value={'9'} style={parallax} />
        </div>
      </>
    )
  }
}

export default App
