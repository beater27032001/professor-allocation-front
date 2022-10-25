async function get(url) {
    const response = await fetch(url);
    if (response.ok) {
        return response.json();
    }
}

async function post(url, body) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (response.ok) {
        return response.json();
    }
}

async function put(url, body) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (response.ok) {
        return response.json();
    }
}

async function remove(url) {
    const response = await fetch(url, {
        method: 'DELETE',
    });
    if (response.ok) {
        return true;
    }

    return false;
}