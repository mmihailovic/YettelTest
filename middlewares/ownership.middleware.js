module.exports = (model, foreignKey) => {
    return async (req, res, next) => {
        const userId = req.user.id
        const id = req.params.id

        const object = await model.findByPk(id)
        if(!object) {
            return res.status(404).json({message: 'Not found!'})
        }

        if(object[foreignKey] !== userId) {
            return res.status(403).json({message: 'Unauthorized!'})
        }

        next();
    }
};