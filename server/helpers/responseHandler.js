
module.exports = {
    getSuccess,
    errorResponse,
    insertSuccess
}


function getSuccess(res, response) {
    return res.json({
        message : "fetched",
        data : response,
        status : true,
        encrypted : false
    })
}

function insertSuccess(res, response) {
    return res.json({
        message : "Inserted",
        data : response,
        status : true,
        encrypted : false
    })
}

function errorResponse(res, err) {
    return res.json({
        message : err,
        status : false,
        encrypted : false
    })
}