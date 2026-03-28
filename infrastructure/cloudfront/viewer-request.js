import cf from 'cloudfront';
const kvs = cf.kvs();
function hasFileExtension(uri) {
    const lastSegment = uri.split('/').pop() ?? '';
    return lastSegment.includes('.');
}
function serializeQuerystring(querystring) {
    const parts = [];
    for (const key in querystring) {
        if (!Object.prototype.hasOwnProperty.call(querystring, key)) {
            continue;
        }
        const entry = querystring[key];
        const values = entry.multiValue && entry.multiValue.length > 0
            ? entry.multiValue
            : [entry];
        for (const valueEntry of values) {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(valueEntry.value)}`);
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
async function handler(event) {
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
    }
    catch {
        // A missing key just means this request is not a redirect.
    }
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }
    else if (!hasFileExtension(uri)) {
        request.uri += '/index.html';
    }
    return request;
}
