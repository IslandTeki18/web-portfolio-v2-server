import { Contact } from "../models/contact.model.js";

//@desc     Create new contact object
//@route    POST /api/contacts/contact
//@access   Public
const postNewContactInfo = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    await Contact.create({
      name,
      phone,
      email,
      message,
    });

    return res.status(201).json({
      _id: contactInfo._id,
      name: contactInfo.name,
      phone: contactInfo.phone,
      email: contactInfo.email,
      message: contactInfo.message,
    });
  } catch (error) {
    console.error("Error creating contact object: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Delete contact information by id
//@route    DELETE /api/contacts/:id
//@access   Private/Admin
const deleteContactInfo = async (req, res) => {
  try {
    const contactInfo = await Contact.findById(req.params.id);
    await contactInfo.remove();
    return res.json({ message: "Contact Information Deleted" });
  } catch (error) {
    console.error("Error removing contact object: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Update contact to haveRead
//@route    PUT /api/contacts/contact/:id
//@access   Private/Admin
const updateContactInfo = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact Not Found." });
    }

    contact.haveRead = Boolean(req.body.haveRead);

    const updateContact = await contact.save();

    return res.json({
      _id: updateContact._id,
      haveRead: updateContact.haveRead,
    });
  } catch (error) {
    console.error("Error updating contact object: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     List all contact informations
//@route    POST /api/contacts/
//@access   Private/Admin
const getAllContactInfo = async (req, res) => {
  try {
    const contactInfos = await Contact.find({});
    if (!contactInfos) {
      return res.status(404).json({ message: "Contacts Not Found." });
    }
    return res.json(contactInfos);
  } catch (error) {
    console.error("Error gettting contact objects: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc     Get contact info by ID
//@route    GET /api/contacts/:id
//@access   Private/Admin
const getContactInfoById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact)
      return res.status(404).json({ message: "Contact Not Found." });

    return res.json(contact);
  } catch (error) {
    console.error("Error gettting specific contact object: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  postNewContactInfo,
  deleteContactInfo,
  getAllContactInfo,
  updateContactInfo,
  getContactInfoById,
};
