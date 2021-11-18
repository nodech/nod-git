'use strict';

const API_URL = 'https://api.github.com';
const API = exports;

API.API_URL = API_URL;

API.USER_CONFIG = {
  username: '',
  password: ''
};

API.finalize = (object) => {
  return {
    ...object,
    timeout: 20000,
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  };
};

API.listPRs = (owner, repo) => {
  return API.finalize({
    method: 'GET',
    url: `${API_URL}/repos/${owner}/${repo}/pulls`
  });
};

API.listLabels = (owner, repo, perPage = 100, page = 1) => {
  return API.finalize({
    method: 'GET',
    url: `${API_URL}/repos/${owner}/${repo}/labels`,
    query: {
      per_page: perPage,
      page: page
    }
  });
};

API.removeLabel = (owner, repo, name) => {
  return API.finalize({
    method: 'DELETE',
    url: `${API_URL}/repos/${owner}/${repo}/labels/${name}`,
  });
};

API.importLabel = (owner, repo, label) => {
  return API.finalize({
    method: 'POST',
    url: `${API_URL}/repos/${owner}/${repo}/labels`,
    json: {
      name: label.name,
      color: label.color,
      description: label.description
    }
  });
};
