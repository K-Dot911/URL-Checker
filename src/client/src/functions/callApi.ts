async function callApi<T>(
    url: string,
    method: "DELETE" | "GET" | "POST" | "PATCH" | "PUT" = "GET",
    body: null | string = null,
): Promise<T | undefined> {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}${url}`,
            {
                method,
                headers: myHeaders,
                redirect: "follow",
                body,
            }
        );
        const json = await response.json();
        if (json) {
            json.status = response.status;
            return json;
        }
    } catch (err) {
        return Promise.reject(err);
    }
}

export default callApi;