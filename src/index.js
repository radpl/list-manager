import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import '@atlaskit/css-reset';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import App from './components/App';
import './index.css';

const Wrapper = styled.div`
display:flex;
padding:8px;
margin:8px;
`;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <Wrapper>
          <App />
        </Wrapper>
      </DndProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
