const express = require("express");
const Router = express.Router();
const auth = require("../middleware/auth");
const notAdmin = require("../middleware/notAdmin");
const { getCollection, getCreatedData } = require("../services");
//@route get api/permissions
//@desc Show all permissions of logged in user
//@access Private

Router.get("/", (req, res) => {
  res.send("Permissions route loaded");
});

//@route post api/permissions
//@desc Create a permission
//@access Private - Admin
Router.post("/", auth, notAdmin, async (req, res) => {
  try {
    // notAdmin(req, res);
    const permissionColRef = getCollection("permissions");

    //start id generation
    //Check if duplicate id is present with win_id
    let permission_id = "";
    console.log("Permission id starts");
    const getDuplicatePermission = await permissionColRef
      .where("win_id", "==", req.body.winId)
      .get();
    if (!getDuplicatePermission.empty) {
      permission_id = getDuplicatePermission.doc().permission_id;
    }
    console.log("Reached till here");
    if (!permission_id) {
      const permissionsRef = await permissionColRef.get();
      let numPermissions = 0;
      if (!permissionsRef.empty) {
        permissionsRef.forEach(() => numPermissions++);
      }
      const timeMS = new Date().getTime(); //time from epoch
      permission_id = `asset_inventory_permission_${timeMS}_${numPermissions++}`;
    }

    //Stop id creation
    const permissionCreated = await permissionColRef.doc(permission_id).set({
      ...req.body,
      permission_id,
      ...getCreatedData(req)
    });
    res.status(200).json({
      msg: "Permission created successfully",
      permissionData: { ...req.body, permission_id }
    });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ error: err });
  }
});

module.exports = Router;
