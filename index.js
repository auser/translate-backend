const translate = require ('google-translate-api');
const queryString = require ('query-string');
const {StringDecoder} = require ('string_decoder');
const decoder = new StringDecoder ('utf8');

if (process.env.NODE_ENV === 'development') {
  require ('ngrok')
    .connect ({port: 3000, subdomain: 'ari'})
    .then (url => console.log (`Server is available at: ${url}`));
}

console.log ('process.env.NODE_ENV', process.env.NODE_ENV);

module.exports = (req, res) => {
  const qs = queryString.parse (req.url.substr (1));
  console.log ('qs ->', qs);

  const q = qs.q;
  const fromLang = qs.fl || 'en';
  const toLang = qs.tl || 'es';

  translate (q, {to: toLang, from: fromLang})
    .then (translation => {
      const out = Object.assign (
        {},
        {
          from: fromLang,
          to: toLang,
          query: q,
        },
        translation
      );
      console.log (out);
      res.writeHead (200, {'Content-Type': 'application/json; charset=utf-8'});
      res.write (JSON.stringify (out), 'utf-8');
      res.end ();
    })
    .catch (e => {
      console.log ('An error occurred');
      console.log (e);
    });
};
