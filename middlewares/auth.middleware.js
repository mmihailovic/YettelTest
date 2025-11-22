const jwt = require('jsonwebtoken');

module.exports = (role) => {
    return (req, res, next) => {
        let authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Missing JWT!' });
        }

        if (authHeader.startsWith('Bearer')) {
            authHeader = authHeader.substring(7)
        }

        try {
            // const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const decoded = jwt.verify(authHeader, "MY JWT SECRET")

            if(role !== decoded.role) {
                return res.status(403).json({ message: 'Unauthorized!' });
            }

            req.user = { id: decoded.id, role: decoded.role };
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid JWT!' });
        }
    }
};