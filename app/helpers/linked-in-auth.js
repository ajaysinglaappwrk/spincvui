export const getURLWithQueryParams = (base, params) => {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  return `${base}?${query}`;
};

export const LINKEDIN_URL = getURLWithQueryParams(
  "https://www.linkedin.com/oauth/v2/authorization",
  {
    response_type: "code",
    client_id: '8659wwgs86azn1',
    redirect_uri: 'https://spincv-demo.azurewebsites.net/',
    state: 'DCEeFWf45A53sdfKef424',
    scope: ['r_emailaddress', 'r_liteprofile ']
  }
);


export const queryToObject = queryString => {
  const pairsString =
    queryString[0] === "?" ? queryString.slice(1) : queryString;
  const pairs = pairsString
    .split("&")
    .map(str => str.split("=").map(decodeURIComponent));
  return pairs.reduce(
    (acc, [key, value]) => (key ? { ...acc, [key]: value } : acc),
    {}
  );
};
