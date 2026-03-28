import cf from 'cloudfront';

const kvs = cf.kvs();

function hasFileExtension(uri) {
  const lastSegment = uri.split('/').pop() || '';
  return lastSegment.includes('.');
}

function serializeQuerystring(querystring) {
  const parts = [];

  for (const key in querystring) {
    if (!Object.prototype.hasOwnProperty.call(querystring, key)) {
      continue;
    }

    const entry = querystring[key];
    const values =
      entry.multiValue && entry.multiValue.length > 0
        ? entry.multiValue
        : [entry];

    for (let index = 0; index < values.length; index += 1) {
      const value = values[index].value;
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }

  return parts.join('&');
}

function buildRedirectLocation(destination, querystring) {
  const serializedQuery = serializeQuerystring(querystring);

  if (!serializedQuery) {
    return destination;
  }

  const separator = destination.includes('?') ? '&' : '?';
  return `${destination}${separator}${serializedQuery}`;
}

export async function handler(event) {
  const request = event.request;
  const uri = request.uri;

  try {
    const redirectTarget = await kvs.get(uri);

    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: {
          value: buildRedirectLocation(redirectTarget, request.querystring),
        },
      },
    };
  } catch (error) {
    // A missing key just means this request is not a redirect.
  }

  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!hasFileExtension(uri)) {
    request.uri += '/index.html';
  }

  return request;
}

// common mistake: Don't forget runtime: cloudfront.FunctionRuntime.JS_2_0. CloudFront KeyValueStore helper methods require JavaScript runtime 2.0.

//There isn't a required terminal command in this step if you're editing the file in your editor, so the important thing to verify is the JSON shape itself.
