const express = require("express");
const Router = express.Router();
const auth = require("../middleware/auth");
const notAdmin = require("../middleware/notAdmin");
const { getCollection, getCreatedData } = require("../services");
//@route get api/permissions
//@desc Show all permissions of requested user
//@access Private

Router.get("/:id", async (req, res) => {
  try {
    const winId = req.params.id;
    const permissionRef = await getCollection("permissions")
      .where("win_id", "==", winId)
      .get();
    let permissionData = [],
      i = 0;
    let permissions = {};
    permissionRef.forEach(data => {
      permissions = { ...data.data().permissions };
    });
    for (let domain in permissions) {
      permissionData.push({});
      let domainDataRef = await getCollection("domains")
        .doc(domain)
        .get();
      let currDomain = domainDataRef.data();
      permissionData[i]["domain_name"] = currDomain.name;
      permissionData[i]["domain_id"] = currDomain.domain_id;
      permissionData[i]["modules"] = permissionData[i]["modules"] || [];
      for (let j = 0; permissions[domain][j]; j++) {
        permissionData[i]["modules"][j] = {};
        let moduleDataRef = await getCollection("modules")
          .doc(permissions[domain][j])
          .get();
        let currModule = moduleDataRef.data();
        console.log("CurrModule", currModule);
        permissionData[i]["modules"][j].module_name = currModule.name;
        permissionData[i]["modules"][j].module_id = currModule.module_id;
      }
      i++;
    }
    // permissionRef.forEach(userPermission => {
    //   let permissions = { ...userPermission.data().permissions };

    //   // Object.keys(permissions).map(async (domain, i) => {
    //   //   permissionData.push({});
    //   //   let domainDataRef = await getCollection("domains")
    //   //     .doc(domain)
    //   //     .get();
    //   //   let currDomain = domainDataRef.data();
    //   //   permissionData[i]["domain_name"] = currDomain.name;
    //   //   permissionData[i]["domain_id"] = currDomain.domain_id;
    //   //   permissionData[i]["modules"] = permissionData[i]["modules"] || [];
    //   //   permissions[domain].map(async (module, j) => {
    //   //     let moduleDataRef = await getCollection("modules")
    //   //       .doc(module)
    //   //       .get();
    //   //     let currModule = moduleDataRef.data();
    //   //     permissionData[i]["modules"].push({
    //   //       module_name: currModule.name,
    //   //       module_id: currModule.module_id
    //   //     });
    //   //     console.log("permissionData[i]", permissionData[i]);
    //   //   });
    //   //   // console.log("permissionData[i]", permissionData[i]);
    //   // });
    // });
    console.log("permissionData", permissionData);
    res.status(200).json({ permissionData });
  } catch (err) {
    console.log("Error", err);
    res.status(500).send("Internal server error");
  }
});

//@route get api/permissions
//@desc Show all permissions of logged in user
//@access Private

Router.get("/", auth, async (req, res) => {
  try {
    const winId = req.user.id;
    console.log("winId", winId);
    const permissionRef = await getCollection("permissions")
      .where("win_id", "==", winId)
      .get();
    let permissionData = [],
      i = 0;
    let permissions = {};
    console.log("Raw promise", permissionRef);
    permissionRef.forEach(data => {
      console.log("Checking permissions", data.data());
      permissions = { ...data.data().permissions };
    });
    console.log("Permissions", permissions);
    for (let domain in permissions) {
      permissionData.push({});
      let domainDataRef = await getCollection("domains")
        .doc(domain)
        .get();
      let currDomain = domainDataRef.data();
      permissionData[i]["domain_name"] = currDomain.name;
      permissionData[i]["domain_id"] = currDomain.domain_id;
      permissionData[i]["modules"] = permissionData[i]["modules"] || [];
      for (let j = 0; permissions[domain][j]; j++) {
        permissionData[i]["modules"][j] = {};
        let moduleDataRef = await getCollection("modules")
          .doc(permissions[domain][j])
          .get();
        let currModule = moduleDataRef.data();
        console.log("CurrModule", currModule);
        permissionData[i]["modules"][j].module_name = currModule.name;
        permissionData[i]["modules"][j].module_id = currModule.module_id;
      }
      i++;
    }
    // permissionRef.forEach(userPermission => {
    //   let permissions = { ...userPermission.data().permissions };

    //   // Object.keys(permissions).map(async (domain, i) => {
    //   //   permissionData.push({});
    //   //   let domainDataRef = await getCollection("domains")
    //   //     .doc(domain)
    //   //     .get();
    //   //   let currDomain = domainDataRef.data();
    //   //   permissionData[i]["domain_name"] = currDomain.name;
    //   //   permissionData[i]["domain_id"] = currDomain.domain_id;
    //   //   permissionData[i]["modules"] = permissionData[i]["modules"] || [];
    //   //   permissions[domain].map(async (module, j) => {
    //   //     let moduleDataRef = await getCollection("modules")
    //   //       .doc(module)
    //   //       .get();
    //   //     let currModule = moduleDataRef.data();
    //   //     permissionData[i]["modules"].push({
    //   //       module_name: currModule.name,
    //   //       module_id: currModule.module_id
    //   //     });
    //   //     console.log("permissionData[i]", permissionData[i]);
    //   //   });
    //   //   // console.log("permissionData[i]", permissionData[i]);
    //   // });
    // });
    console.log("permissionData", permissionData);
    res.status(200).json({ permissionData });
  } catch (err) {
    console.log("Error", err);
    res.status(500).send("Internal server error");
  }
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
    const getDuplicatePermission = await permissionColRef
      .where("win_id", "==", req.body.win_id)
      .get();
    if (!getDuplicatePermission.empty) {
      permission_id = getDuplicatePermission.doc().permission_id;
    }
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
