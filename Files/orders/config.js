exports.order_config = {
    name: `имя`,
};
exports.order_form = (res) => {
    return JSON.parse(JSON.stringify(res));
}