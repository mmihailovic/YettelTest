const jwt = require('jsonwebtoken');

module.exports = (...roles) => {
    return (req, res, next) => {
        let authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Missing JWT!' });
        }

        if (authHeader.startsWith('Bearer')) {
            authHeader = authHeader.substring(7)
        }

        try {
            const decoded = jwt.verify(authHeader, process.env.JWT_SECRET)

            if(!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Unauthorized!' });
            }

            req.user = { id: decoded.id, role: decoded.role };
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid JWT!' });
        }
    }
};