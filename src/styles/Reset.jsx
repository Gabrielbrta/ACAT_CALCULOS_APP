import React from 'react'
import {createGlobalStyle} from 'styled-components';


const Reset = createGlobalStyle`
    *{
        margin: 0px;
        padding: 0;
        box-sizing: border-box;
        font-family: ${({theme} ) => theme.font.default};
    }
`;

export default Reset;