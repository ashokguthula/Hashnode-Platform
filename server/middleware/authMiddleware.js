const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        //check weather the authorization header exists
        if (!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                message: "not authorized, token missing",
            });
        }

        //extract the token
        const token = authHeader.split(" ")[1];

        //verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //store the decoded user information on the request
        req.user = decoded;

        //continue to the next middleware/controller
        next();
    } catch (error){
        return res.status(401).json({
            message: "Not authorized, invalid or expired token",
        });
    }
};

module.exports = protect;