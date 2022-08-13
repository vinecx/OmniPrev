import axios from 'axios';

const apinl = axios.create({
  baseURL: 'http://buscaurl.nl.com.br:8100',
});

export default apinl;
