const getCurrent = async (req, res) => {
    const { id, email, name } = req.user;
    res.json({
        user: {
            id,
            email,
            name
        }
    })
}
module.exports = getCurrent;