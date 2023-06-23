import axios from 'axios'
import React from 'react'
import { useState } from 'react'
// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  const [state, setState] = useState({
    message: initialMessage,
    email: initialEmail,
    steps: initialSteps,
    index:initialIndex
  });

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    const x = (state.index % 3) + 1;
    const y = Math.floor(state.index / 3) + 1;
    return {x,y}
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    const {x,y} = getXY()
    return `Koordinatlar (${x},${y})`
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setState(
      {
        message: initialMessage,
        email: initialEmail,
        steps: initialSteps,
        index:initialIndex
      }
    )
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    const {x,y} = getXY()
    if(yon === "left" && x !== 1){
      setState({...state, index: state.index-1,steps: state.steps+1, message: ""})
    }
    else if(yon === "right" && x !== 3){
      setState({...state, index: state.index+1,steps: state.steps+1, message: ""})
    }
    else if(yon === "up" && y !== 1){
      setState({...state, index: state.index-3,steps: state.steps+1, message: ""})
    }
    else if(yon === "down" && y !== 3){
      setState({...state, index: state.index+3,steps: state.steps+1, message: ""})
    }

    if(yon === "left" && x === 1){
      setState({...state, message: "Sola gidemezsiniz"})
    }
    else if(yon === "right" && x === 3){
      setState({...state,message: "Sağa gidemezsiniz"})
    }
    else if(yon === "up" && y === 1){
      setState({...state,message: "Yukarıya gidemezsiniz"})
    }
    else if(yon === "down" && y === 3){
      setState({...state,  message: "Aşağıya gidemezsiniz"})
    }
  }
 
 


  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    sonrakiIndex(evt.target.id)
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setState({...state,email: evt.target.value})
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault();
    const {x,y} = getXY();
    const payload = {x, y, steps: state.steps, email: state.email}
    axios.post("http://localhost:9000/api/result", payload)
    .then((res)=>{
      setState({...state, message: res.data.message, email: ""})
      console.log(res)
    })
    .catch((err)=>{
      setState({...state, message: err.response.data.message, email: ""})
    })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{state.steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === state.index ? ' active' : ''}`}>
              {idx === state.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{state.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>SOL</button>
        <button id="up" onClick={ilerle}>YUKARI</button>
        <button id="right" onClick={ilerle}>SAĞ</button>
        <button id="down" onClick={ilerle}>AŞAĞI</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" onChange={onChange} type="email" value={state.email} placeholder="email girin"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
