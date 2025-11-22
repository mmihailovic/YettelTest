module.exports = (error, req, res, next) => {
    res.status(error.status).json({ message: error.message })
}