import React from "react"
import {render, waitFor, screen, fireEvent} from "@testing-library/react"
import AppFunctional from "./AppFunctional"
import '@testing-library/jest-dom/extend-expect'

test('sanity', () => {
  expect(true).toBe(true)
})
test("x,y koordinat gösterimi doğru", ()=>{
  render(<AppFunctional/>)
  const kareler = screen.getByText(/koordinatlar/i)
  expect(kareler).toHaveTextContent("(2,2)")
})
test("up tıklaması koordinat gösterimi doğru", ()=>{
  render(<AppFunctional/>)
  const up = screen.getByText(/koordinatlar/i)
  const upButton = screen.getByText(/YUKARI/i)
  fireEvent.click(upButton)
  expect(up).toHaveTextContent("(2,1)")
})
test("yukarı tıklamada hata mesajı kontrolü", ()=>{
  render(<AppFunctional/>)
  const mesaj = document.querySelector("#message")
  const upButton = screen.getByText(/YUKARI/i)
  fireEvent.click(upButton)
  fireEvent.click(upButton)
  expect(mesaj).toHaveTextContent("Yukarıya gidemezsiniz")
})
test("mail adresi inputu kontrolü", async()=>{
  render(<AppFunctional/>)
  
  const mesaj = document.querySelector("#message")
  const email = document.querySelector("#email")

fireEvent.change(email, {target: {value:"foo@bar.baz"}})
const submitButton = document.querySelector("#submit")
fireEvent.click(submitButton)

await waitFor (()=>{
  const message = screen.queryByText(/failure/i);
  expect(mesaj).toBe(message)
})

})
test("mail adresi inputu kontrolü", async()=>{
  render(<AppFunctional/>)

  const mesaj = document.querySelector("#message")
  const email = document.querySelector("#email")

fireEvent.change(email, {target: {value:"assfg@gmail.com"}})
const submitButton = document.querySelector("#submit")
fireEvent.click(submitButton)

await waitFor (()=>{
  const message = screen.queryByText(/win/i);
  expect(mesaj).toBe(message)
})

})