const express = require("express");
const Router = express.Router();
const auth = require("../middleware/auth");
const notAdmin = require("../middleware/notAdmin");
const { getCollection, getCreatedData } = require("../services");
//@route get api/domains
//@desc Show all domains
//@access Private admin - full access, user - permission based access

Router.get("/", auth, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const domainsRef = await getCollection("domains").get();
      let domainsData = [];
      domainsRef.forEach(domain => {
        domainsData.push(domain.data());
      });
      return res.status(200).json({ domainsData });
    }
    res.status(200).send("Will share your domains in a while");
  } catch (err) {
    res.status(400).send("Server Error");
  }
});

//@route post api/domains
//@desc Create a domain
//@access Private admin - full access, user - permission based access

Router.post("/", auth, notAdmin, async (req, res) => {
  try {
    // notAdmin(req, res);
    const domainColRef = getCollection("domains");

    //Does domain exist?
    const getDuplicateDomain = await domainColRef
      .where("name", "==", req.body.name)
      .get();
    if (!getDuplicateDomain.empty) {
      return res.status(400).send("The Domain already exists");
    }
    //start id generation
    const domainsRef = await domainColRef.get();
    let numDomains = 0;
    if (!domainsRef.empty) {
      domainsRef.forEach(() => numDomains++);
    }
    const timeMS = new Date().getTime(); //time from epoch
    const domain_id = `asset_inventory_domain_${timeMS}_${numDomains++}`;
    //Stop id creation
    const domainCreated = await domainColRef.doc(domain_id).set({
      ...req.body,
      domain_id,
      ...getCreatedData(req)
    });
    res.status(200).json({
      msg: "Domain created successfully",
      domainData: { ...req.body, domain_id }
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});
module.exports = Router;
