import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    background-color: #FAFAFA;
    height: 100%;
    width: 100%;
    line-height: 1.5;
  }

  body {
    font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1.5em;
  }
`;

export default GlobalStyle;
