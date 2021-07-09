import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import GaugeChart from 'react-gauge-chart'
import logo from './image/logo.png'
import './App.css';
import * as io from 'socket.io-client'

class App extends Component {
  constructor() {
    super()

    this.state = {
      temps: 25.0,
      humis: 50.2,
      input: '',
      message: [],
      payload: "",
      endpoint: "https://socketcmcsmartfarm.mqttcnx.com", // เชื่อมต่อไปยัง url ของ realtime server
      sw1: false,
      sw2: false,
      sw3: false,
      _stateSW1: false,
      _stateSW2: false,
      _stateSW3: false
    }
  }

  componentDidMount = () => {
    this.response()
  }

  // เมื่อมีการส่งข้อมูลไปยัง server
  send1 = (message) => {
    // this.setState({ _stateSW1: true });
    const { endpoint, input, sw1 } = this.state
    const socket = socketIOClient(endpoint);
    (sw1) ? socket.emit('sent-message', "/PUMP:0") : socket.emit('sent-message', "/PUMP:1");
    console.log("ReadSend1");
    // this.setState({ input: '' })
  }

  // เมื่อมีการส่งข้อมูลไปยัง server
  send2 = (message) => {
    // this.setState({ _stateSW2: true });
    const { endpoint, input, sw2 } = this.state
    const socket = socketIOClient(endpoint);
    (sw2) ? socket.emit('sent-message', "/VALVE1:0") : socket.emit('sent-message', "/VALVE1:1");
    console.log("ReadSend2");
    // this.setState({ input: '' })
  }

  // เมื่อมีการส่งข้อมูลไปยัง server
  send3 = (message) => {
    // this.setState({ _stateSW3: true });
    const { endpoint, input, sw3 } = this.state
    const socket = socketIOClient(endpoint);
    (sw3) ? socket.emit('sent-message', "/VALVE2:0") : socket.emit('sent-message', "/VALVE2:1");
    console.log("ReadSend3");
    // this.setState({ input: '' })
  }

  setMessagePayload = (messageNew) => {
    const { payload, temps, humis, sw1, sw2, sw3, _stateSW1, _stateSW2, _stateSW3 } = this.state;
    this.setState({ payload: messageNew });
    if (payload.toString().indexOf("/HUMIDITY:50") != -1) {
      this.setState({ humis: payload.substring(payload.indexOf(":") + 1, payload.length) });
    }
    if (payload.toString().indexOf("/TEMPERATURE:") != -1) {
      this.setState({ temps: payload.substring(payload.indexOf(":") + 1, payload.length) });
    }
    if (payload.toString().indexOf("/PUMP:") != -1) {
      const flag = payload.substring(payload.indexOf(":") + 1, payload.length);
      if (flag == 1) {
        this.setState({ _stateSW1: true });
      } else {
        this.setState({ _stateSW1: false });
      }
      this.sw1Func();
    }
    if (payload.toString().indexOf("/VALVE1:") != -1) {
      const flag = payload.substring(payload.indexOf(":") + 1, payload.length);
      if (flag == 1) {
        this.setState({ _stateSW2: true });
      } else {
        this.setState({ _stateSW2: false });
      }
      this.sw2Func();
    }
    if (payload.toString().indexOf("/VALVE2:") != -1) {
      const flag = payload.substring(payload.indexOf(":") + 1, payload.length);
      if (flag == 1) {
        this.setState({ _stateSW3: true });
      } else {
        this.setState({ _stateSW3: false });
      }
      this.sw3Func();
    }
  }

  sw1Func = () => {
    const { payload, temps, humis, sw1, sw2, sw3, _stateSW1, _stateSW2, _stateSW3 } = this.state;
    if(sw1 != _stateSW1){
      this.setState({ sw1: _stateSW1 });
    }
    console.log("flag = " + _stateSW1);
      console.log("sw1 = " + sw1);
  }

  sw2Func = () => {
    const { payload, temps, humis, sw1, sw2, sw3, _stateSW1, _stateSW2, _stateSW3 } = this.state;
    if(sw2 != _stateSW2){
      this.setState({ sw2: _stateSW2 });
    }
  }

  sw3Func = () => {
    const { payload, temps, humis, sw1, sw2, sw3, _stateSW1, _stateSW2, _stateSW3 } = this.state;
    if(sw3 != _stateSW3){
      this.setState({ sw3: _stateSW3 });
    }
  }
  // รอรับข้อมูลเมื่อ server มีการ update
  response = () => {
    const { endpoint, message, payload } = this.state
    const temp = message
    const socket = socketIOClient(endpoint)
    socket.on('new-message', (messageNew) => {
      // payload = messageNew.toString();
      // temp.push(messageNew)
      // this.setState({ message: temp })
      // payload = messageNew.toString();
      // if(messageNew.toString().indexOf("/HUMIDITY:")!= -1){
      this.setMessagePayload(messageNew);
      // console.log(messageNew);
      // }

    })
  }

  changeInput = (e) => {
    this.setState({ input: e.target.value })
  }


  setSW1 = (e) => {
    const { sw1 } = this.state
    this.setState({ sw1: !sw1 })
    console.log(sw1)
    this.send1();
  }

  setSW2 = (e) => {
    const { sw2 } = this.state
    this.setState({ sw2: !sw2 })
    console.log(sw2)
    this.send2();
  }

  setSW3 = (e) => {
    const { sw3 } = this.state
    this.setState({ sw3: !sw3 })
    console.log(sw3)
    this.send3();
  }
  render() {
    const { input, message, temps, humis, sw1, sw2, sw3, payload } = this.state
    return (
      // <div>
      //   <div style={style}>
      //     <input value={input} onChange={this.changeInput} />
      //     <button onClick={() => this.send()}>Send</button>
      //   </div>
      //   {
      //     message.map((data, i) =>
      //       <div key={i} style={style} >
      //         {i + 1} : {data}
      //       </div>
      //     )
      //   }
      // </div>
      <div className="App">
        <div className="container">
          <div className="title-fram">
            <div className="title-sub">
              <br />
              <img src={logo} />
              <h1>CMC Smart Farm</h1>
              <br />
            </div>
            <div className="gaugexxx">
              <div className="gauge1">
                <GaugeChart id="gauge-chart5"
                  textColor={"none"}
                  nrOfLevels={100}
                  arcsLength={[0.4, 0.4, 0.2]}
                  colors={['#5BE12C', '#F5CD19', '#EA4228']}
                  percent={temps / 100}
                  // value={100}
                  arcPadding={0.02}

                />
                <p>Temperature : {temps}</p>
              </div>
              <div className="gauge1">
                <GaugeChart id="gauge-chart5"
                  textColor={"none"}
                  arcPadding={0.01}
                  arcsLength={[0.3, 0.3, 0.05, 0.4]}
                  colors={['#d77f59', '#6bab37', '#a1bf32', '#4c9acb']}
                  percent={humis / 100}
                />
                <p>Humidity : {humis}</p>
              </div>
            </div>


          </div>
          <hr />

          <div className="sw-type">
            <div className="box-sw">
              <h2> Light </h2>
              <label className="switch" >
                <input type="checkbox" checked={sw1} defaultChecked={sw1} onClick={this.setSW1} />
                <span className="slider round" />
              </label>
            </div>
            <div className="box-sw">
              <h2> Water Pump </h2>
              <label className="switch" >
                <input type="checkbox" checked={sw2} defaultChecked={sw2} onClick={this.setSW2} />
                <span className="slider round" />
              </label>
            </div>
            <div className="box-sw">
              <h2> Fertilizer </h2>
              <label className="switch" >
                <input type="checkbox" checked={sw3} defaultChecked={sw3} onClick={this.setSW3} />
                <span className="slider round" />
              </label>
            </div>
          </div>



        </div>
      </div>
    )
  }
}

const style = { marginTop: 20, paddingLeft: 50 }

export default App

// const App = () => {

//   const [input, setInput] = useState('');
//   const [message, setMessage] = useState([]);
//   const [endpoint, setEndpoint] = useState("http://localhost:9000");
//   const style = { marginTop: 20, paddingLeft: 50 }
//   useEffect(() => {
//     response()
//   })

//   const response = () => {
//     const temp = message
//     const socket = socketIOClient(endpoint)
//     socket.on('new-message', (messageNew) => {
//       temp.push(messageNew)
//       setMessage(temp);
//     })
//   }

//   const changeInput = (e) => {
//     setInput(e.target.value)
//   }

//   // เมื่อมีการส่งข้อมูลไปยัง server
//   const send = (message) => {
//     const socket = socketIOClient(endpoint)
//     socket.emit('sent-message', input)
//     setInput('');
//   }

//   return (
//     <div>
//       <div style={style}>
//         <input value={input} onChange={changeInput} />
//         <button onClick={send}>Send</button>
//       </div>
//       {
//         message.map((data, i) =>
//           <div key={i} style={style} >
//             {i + 1} : {data}
//           </div>
//         )
//       }
//     </div>
//   )
// }

// export default App;