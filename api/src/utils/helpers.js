import Thyme from '@trys/thyme';

exports.notFound = (res) => res.status(404).json({ error: 'Not found' });

exports.error = (e, res) => {
  let code = e.mapped ? 400 : 500;
  let error = e.detail ? e.detail : (e.mapped ? e.mapped() : e.toString());
  return res.status(code).json({ error });
};

exports.request = (body, id, schema, key = 'id') => {
  const instance = Object.keys(schema).reduce((c, key) => {
    if (key.indexOf('.') !== -1) key = key.substring(0, key.indexOf('.'));
    c[key] = body[key];
    return c;
  }, {});
  if (id) instance[key] = id;
  return instance;
};

exports.get_dates = ({ start, end, restricted_days = [], specific_dates = [], restricted_dates = [] }) => {
  specific_dates = specific_dates ? specific_dates.map(d => new Date(d).toISOString().split('T')[0]) : [];
  restricted_dates = new Thyme().range(restricted_dates ? restricted_dates.map(d => new Date(d).toISOString().split('T')[0]) : []);
  start = new Thyme(new Date(start).toISOString().split('T')[0]);
  end = new Date(end).toISOString().split('T')[0];

  if (specific_dates.length) return new Thyme().range(specific_dates);

  return new Thyme().range(start.till(end)
    .filter(d => {
      if ((!restricted_days || !restricted_days.length) && (!restricted_dates || !restricted_dates.length)) return true;
      return !restricted_days.includes(d.getDay()) && !restricted_dates.contains(d);
    }));
};

const extract_sagepay_request = (data) => {
  return decodeURI(data).replace(/&/g, '\r\n').split('\r\n').reduce((c,line) => {
    const index = line.indexOf('=');
    c[line.substring(0, index)] = line.substring(index + 1);
    return c;
  }, {});
};

exports.extract_sagepay_request = extract_sagepay_request;

exports.extract_sagepay_route = (data) => {
  return Promise.resolve(extract_sagepay_request(data));
};

exports.formatDate = (d) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};
