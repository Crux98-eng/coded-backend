import('../src/services/email/index.js')
  .then(() => console.log('email index imported'))
  .catch((e) => {
    console.error('import error', e && e.message ? e.message : e);
    process.exit(1);
  });
