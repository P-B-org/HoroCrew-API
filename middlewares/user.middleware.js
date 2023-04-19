const User = require("../models/User.model")

module.exports.addCurrentUserToReq = (req, res, next) => {
    if (!req.currentUserId) {
        return next(
            createError(
                StatusCodes.UNAUTHORIZED,
                "Authentication required"
            )
        )
    }

    // Codigo de verdad
    User.findById(req.currentUserId)
        .then(user => {
            if (!user) {
                return next(
                    createError(
                        StatusCodes.UNAUTHORIZED,
                        "Authentication required"
                    )
                )
            }

            req.user = user
            next()
        })
        .catch(next)
}