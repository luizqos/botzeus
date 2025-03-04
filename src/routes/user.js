const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.get("/get-all-users", userController.fetchUsers);
router.post("/renew-trust/:id", userController.renewalOfTrust);
router.post("/renew/:id", userController.renewal);
module.exports = router;
