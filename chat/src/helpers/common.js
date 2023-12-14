



export const storage = {
    getParsed: (key, _default = null) => {
        var value = JSON.parse(localStorage.getItem(key));
        if (value == undefined || value == null) {
            value = _default;
        }
        return value;
    }
}

