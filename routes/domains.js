const express = require("express");
const Router = express.Router();
const auth = require("../middleware/auth");
const { notAdmin, getCollection, getCreatedData } = require("../services");
//@route get api/domains
//@desc Show all domains
//@access Private admin - full access, user - permission based access

Router.get("/", (req, res) => {
  res.send("Domains route loaded");
});

//@route post api/domains
//@desc Create a domain
//@access Private admin - full access, user - permission based access

Router.post("/", auth, async (req, res) => {
  try {
    notAdmin(req, res);
    const domainsRef = await getCollection("domains").get();
    //start id generation
    let numDomains = 0;
    if (!domainsRef.empty) {
      domainsRef.forEach(() => numDomains++);
    }
    const timeMS = new Date().getTime();
    const domain_id = `asset_inventory_domain_${timeMS}_${numDomains++}`;
    //Stop id creation
    const domainCreated = getCollection("domains")
      .doc(domain_id)
      .set({
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
