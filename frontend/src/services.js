export const Services = {
    ObtenerTemperaturas
};

const urlApi = 'http://localhost:3001';

function ObtenerTemperaturas() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //body: JSON.stringify({ grant_type, username, password })
    };
    return fetch(`${urlApi}`, requestOptions)
        .then(handleResponse)
        .then(respuesta => {
            return respuesta;
        },
        (error) => {
            console.log(error);
        })
        .catch((error) => {
            console.log(error);
        });
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                //logout();
                //location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}