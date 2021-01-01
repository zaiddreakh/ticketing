import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // on the server

    return axios.create({
      baseURL: 'www.karasi-ticketing-app.xyz',
      headers: req.headers,
    });
    //original base URL was 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
  } else {
    // on the browser
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
