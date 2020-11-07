const express = require("express");
const Router = express.Router();
const auth = require("../middleware/auth");
const notAdmin = require("../middleware/notAdmin");
const { getCollection, getCreatedData } = require("../services");
//@route get api/modules
//@desc Show all modules
//@access Private admin - full access, user - permission based access

Router.get("/:domainId", auth, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const modulesRef = await getCollection("modules")
        .where("domain_id", "==", req.params.domainId)
        .get();
      let modulesData = [];
      modulesRef.forEach(module => {
        modulesData.push(module.data());
      });
      return res.status(200).json({ modulesData });
    }
    res.status(200).send("Will share your modules in a while");
  } catch (err) {
    res.status(400).send("Server Error");
  }
});

//@route post api/modules
//@desc Crea a module
//@access Private admin
Router.post("/", auth, notAdmin, async (req, res) => {
  try {
    // notAdmin(req, res);
    const moduleColRef = getCollection("modules");

    //Does domain exist?
    const getDuplicateModule = await moduleColRef
      .where("name", "==", req.body.name)
      .get();
    if (!getDuplicateModule.empty) {
      return res.status(400).send("The Domain already exists");
    }
    //start id generation
    const moduleRef = await moduleColRef.get();
    let numModules = 0;
    if (!moduleRef.empty) {
      moduleRef.forEach(() => numModules++);
    }
    const timeMS = new Date().getTime(); //time from epoch
    const module_id = `asset_inventory_module_${timeMS}_${numModules++}`;
    //Stop id creation
    const modulesCreated = await moduleColRef.doc(module_id).set({
      ...req.body,
      module_id,
      ...getCreatedData(req)
    });
    res.status(200).json({
      msg: "Module created successfully",
      moduleData: { ...req.body, module_id }
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});
module.exports = Router;
