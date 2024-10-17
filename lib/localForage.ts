import localforage from 'localforage';

localforage.config({
  name: 'CoBillCRM',
  storeName: 'crm_data',
});

export default localforage;
