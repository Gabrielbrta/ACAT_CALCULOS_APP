import {useState} from 'react';

const Form = () => {

  return (
    <form className='home-form'>
        <h2>Bandeira 1</h2>
        <label htmlFor="nomeContrato">Nome Contrato</label>
        <input 
            type="text" 
            required
            placeholder='Petrobras' 
            name="nomeContrato" 
            id="nomeContrato" 
            className='nomeContrato' 
            />
        <label htmlFor="bandeira1">Bandeira</label>
        <input 
            
            type="text" 
            placeholder='3,54'
            name="bandeira1" 
            id="bandeira1" 
            className='bandeira1' 
            />
        <label htmlFor="bandeirada1">Bandeirada</label>
        <input 
            
            type="text"
            name="bandeirada1" 
            id="bandeirada1"
            placeholder='3,54'
            className='bandeirada1' 
            />
        <label htmlFor="desconto1">Desconto</label>
        <input 
            type="text" 
            name="desconto1" 
            placeholder='4'
            id="desconto1" 
            className='desconto1' 
            />
        <h2>Bandeira 2</h2>
        <label htmlFor="bandeira2">Bandeira 2</label>
        <input 
            type="text" 
            name="bandeira2"
            placeholder='4,32' 
            id="bandeira2" 
            className='bandeira2' 
            />
        <label htmlFor="bandeirada2">Bandeirada 2</label>
        <input 
            name="bandeirada2" 
            id="bandeirada2" 
            placeholder='4,32' 
            className='bandeirada2' 
            />
        <label htmlFor="desconto2">Desconto 2</label>
        <input 
            type="text" 
            name="desconto2" 
            placeholder='5' 
            id="desconto2" 
            className='desconto2' 
            />
        <button type="submit" >Criar Contrato</button>
    </form>
  )
}

export default Form;