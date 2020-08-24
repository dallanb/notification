const router = express.Router();

router.get('/', function (req, res, next) {
    res.json({
        "msg": "OK",
        "data": {
            "message": "pong"
        }
    })
});

module.exports = router;