'use strict';

const API_URL = 'https://api.github.com';
const API = exports;

API.API_URL = API_URL;

API.USER_CONFIG = {
  username: '',
  password: ''
};

API.finalize = (object) => {
  object.headers = {
    'Accept': 'application/vnd.github.v3+json'
  };

  return object;
};

API.listPRs = (owner, repo) => {
  return API.finalize({
    method: 'GET',
    url: `${API_URL}/repos/${owner}/${repo}/pulls`
  });
};

API.listLabels = (owner, repo) => {
  return API.finalize({
    method: 'GET',
    url: `${API_URL}/repos/${owner}/${repo}/labels`
  });
};

API.removeLabel = (owner, repo, name) => {
  return API.finalize({
    method: 'DELETE',
    url: `${API_URL}/repos/${owner}/${repo}/labels/${name}`,
  });
};
