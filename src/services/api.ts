// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://some-pots-beam.loca.lt/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '3a2de9bc56463e72d5190206faf4bff3c4985311ff57c620546a746bf376542e',
  },
});


// Interceptor para log de requisições
api.interceptors.request.use(
  request => {
    console.log("Iniciando requisição:", {
      url: request.url,
      method: request.method,
      headers: request.headers,
      data: request.data,
    });
    return request;
  },
  error => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }
);

// Interceptor para log de respostas
api.interceptors.response.use(
  response => {
    console.log("Resposta recebida:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  error => {
    console.error("Erro na resposta:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;


