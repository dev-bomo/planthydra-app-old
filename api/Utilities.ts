export const fetchWithError: (url: string, method: string, header?: any, body?: any) => Promise<any> = (url: string, method: string, header: any, body: any) => {
    return fetch(url, {
        method: method,
        headers: header,
        body: body
    }).then((response: Response) => {
        if (response.status >= 200 && response.status < 300) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json()
            } else {
                return response.text()
            }
        }

        throw new Error(response.statusText);
    }).catch((err: Error) => {
        throw err;
    });
}