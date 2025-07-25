import ServiceCenter from "../models/serviceCenterModel.js";
import Mechanical from "../models/mechanicalModel.js";
import getCoordinates from "../utils/getCordinates.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const generateToken = (servicecenter) => {
  const SECRET = process.env.JWT_SECRET;
  return jwt.sign(
    { id: servicecenter._id, email: servicecenter.email, role: servicecenter.role },
    SECRET,
    { expiresIn: "1d" }
  );
};

const registerServiceCenter = async (req, res) => {
  try {
    const { name, location, services, email, owner, password } = req.body;
    if (!name || !location || !services || !email || !owner) {
      return res.status(400).json({ error: "All fields are required." });
    }
    // Check if the servicecenter already exists
    const existingServiceCenter = await ServiceCenter.findOne({ email });
    if (existingServiceCenter) {
      return res.status(409).json({ error: "Service center with this email already exists." });
    }
    // get coordinates from the location
    const coordinates = await getCoordinates(location);
    if (!coordinates) {
      return res.status(400).json({ error: "Invalid location coordinates." });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newServiceCenter = await ServiceCenter.create({
      name,
      location: {
        type: "Point",
        coordinates:coordinates,
      },
      owner,
      email,
      services,
      password: hashedPassword,
    });


    // Generate JWT token for the service center
    const token = generateToken(newServiceCenter);
    if (!token) {
      return res.status(500).json({ error: "Failed to generate token" });
    }
    // Set cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "strict", // Adjust as needed
    };
    // Save the new service center
    await newServiceCenter.save();
    // Success response
    return res.status(201).cookie("authtoken", token, options).json({
      message: "Service center registered successfully",
      serviceCenter: newServiceCenter,
    });
  } catch (error) {
    console.error("❌ Error registering service center:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Login
 const loginServiceCenter = async (req, res) => {
  try {
    const { email, password } = req.body;

    const serviceCenter = await ServiceCenter.findOne({ email });
    if (!serviceCenter) return res.status(404).json({ message: "Not found" });

    const isMatch = await bcrypt.compare(password, serviceCenter.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(serviceCenter);
    if (!token) {
      return res.status(500).json({ error: "Failed to generate token" });
    }
    // Set cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "strict", // Adjust as needed
    };
    // Save the token in a cookie
    return res.status(200).cookie("authtoken", token, options).json({ token, serviceCenter, success: "login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile
 const updateServiceCenter = async (req, res) => {
  try {
    const { name, location, services, owner, email } = req.body;
    const serviceCenterId = req.user.id;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (location && location.coordinates) {
      updateFields.location = {
        type: "Point",
        coordinates: location.coordinates,
      };
    }
    if (services) updateFields.services = services;
    if (owner) updateFields.owner = owner;
    if (email) updateFields.email = email;

    const updatedServiceCenter = await ServiceCenter.findByIdAndUpdate(
      serviceCenterId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedServiceCenter) {
      return res.status(404).json({ message: "Service center not found." });
    }

    return res.status(200).json({
      message: "Service center updated successfully",
      serviceCenter: updatedServiceCenter,
    });


  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const addMechanicToServiceCenter = async (req, res) => {
  try {
    const { name, mechanicemail, phone, expertise } = req.body;
    const servicecenterid = req.user.id; // Assuming the service center ID is passed in the URL
    if (!name || !mechanicemail || !phone || !servicecenterid || !expertise) {
      return res.status(400).json({ error: "All fields are required." });
    }
    // Check if the service center exists
    const serviceCenter = await ServiceCenter.findById(servicecenterid);
    if (!serviceCenter) {
      return res.status(404).json({ error: "Service center not found." });
    }
    // Check if the mechanic already exists
    const existingMechanic = await Mechanical.findOne({ email: mechanicemail });
    if (existingMechanic) {
      return res.status(409).json({ error: "Mechanic already exists." });
    }
    // Create a new mechanic
    const newMechanic = new Mechanical({
      name: name, // Assuming name is the same as email for simplicity
      email: mechanicemail,
      phone,
      serviceCenterId: servicecenterid,
      expertise,
    });
    // Save the new mechanic
    await newMechanic.save();
    // Update the service center to include the new mechanic
    serviceCenter.mechanics.push(newMechanic._id);
    await serviceCenter.save();
    // Success response
    return res.status(201).json({
      message: "Mechanic added to service center successfully",
      mechanic: newMechanic,
    });

  } catch (error) {
    console.error("❌ Error adding mechanic to service center:", error);
    return res.status(500).json({ error: error.message });

  }

}
const RemoveMechanicFromServiceCenter = async (req, res) => {
  try {
    const { mechanicId } = req.params; // Assuming mechanic ID is passed in the URL
    const serviceCenterId = req.user.id; // Assuming the service center ID is passed in the URL
    if (!mechanicId || !serviceCenterId) {
      return res.status(400).json({ error: "Mechanic ID and service center ID are required." });
    }
    // Check if the service center exists
    const serviceCenter = await ServiceCenter.findById(serviceCenterId);
    if (!serviceCenter) {
      return res.status(404).json({ error: "Service center not found." });
    }
    // Check if the mechanic exists
    const mechanic = await Mechanical.findById(mechanicId);
    if (!mechanic) {
      return res.status(404).json({ error: "Mechanic not found." });
    }
    // Remove the mechanic from the service center
    serviceCenter.mechanics = serviceCenter.mechanics.filter(
      (id) => id.toString() !== mechanicId
    );
    await serviceCenter.save();
    // Optionally, you can also delete the mechanic from the database
    await Mechanical.findByIdAndDelete(mechanicId);
    // Success response
    return res.status(200).json({
      message: "Mechanic removed from service center successfully",
      mechanicId,
    });
  } catch (error) {
    console.error("❌ Error removing mechanic from service center:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getallmechanics = async (req, res) => {
  try {
    const serviceCenterId = req.user.id; // Assuming the service center ID is passed in the URL

    if (!serviceCenterId) {
      return res.status(400).json({ error: "Service center ID is required." });
    }
    console.log("Fetching mechanics for service center:", serviceCenterId);

    // Check if the service center exists
    const serviceCenter = await ServiceCenter.findById(serviceCenterId);
    if (!serviceCenter) {
      return res.status(404).json({ error: "Service center not found." });
    }
    // Fetch all mechanics associated with the service center
    // Assuming mechanics are stored in a separate collection and linked to the service center
    const mechanics = await Mechanical.find({ serviceCenterId: serviceCenterId });
    if (!mechanics || mechanics.length === 0) {
      return res.status(404).json({ error: "No mechanics found for this service center." });
    }
    // Return the list of mechanics
    return res.status(200).json({
      message: "Mechanics retrieved successfully",
      mechanics: mechanics,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// search a service center by its name 
//get nearby service centers
// get all service centers
// view service center profile

//Search service center by name
const getServiceCenterByName = async (req, res) => {
  try{
    const serviceCenterName = req.params.serviceCenterName;
    if (!serviceCenterName) {
      return res.status(400).json({ error: "Service center name is required." });
    }

    // Find service center by name
    const serviceCenters = await ServiceCenter.find({ name: new RegExp(serviceCenterName, 'i') });
    
    if(serviceCenters.length === 0) {
      return res.status(404).json({ error: "No service center found with this name." });
    }

    // Return the service center details
    return res.status(200).json({
      message: "Service center found",
      serviceCenter: serviceCenters,
    });

  }catch(error){
    return res.status(500).json({ error: error.message });
  }
};

//View Service Center Profile
const viewServiceCenterProfile=async (req, res) => {
  try{
    const serviceCenterId = req.params.serviceCenterId; // Assuming the service center ID is passed in the URL
    if (!serviceCenterId) {
      return res.status(400).json({ error: "Service center ID is required." });
    }
    // Check if the service center exists
    const serviceCenter = await ServiceCenter.findById(serviceCenterId);

    if (!serviceCenter) {
      return res.status(404).json({ error: "Service center not found." });
    }
    // Return the service center profile
    return res.status(200).json({
      message: "Service center profile retrieved successfully",
      serviceCenter: serviceCenter,
    });

  }catch(error){
    return res.status(500).json({ error: error.message });
  }
};

//get all service centers
const getAllServiceCenters=async (req, res) => {
  try{
    const serviceCenters=await ServiceCenter.find();
    if (!serviceCenters || serviceCenters.length === 0) {
      return res.status(404).json({ error: "No service centers found." });
    }
    // Return the list of service centers
    return res.status(200).json({
      message: "Service centers retrieved successfully",
      serviceCenters: serviceCenters,
    });

  }catch(error){
    return res.status(500).json({ error: error.message });
  }
}

//get Nearby service centers
// This function can be implemented using geospatial queries in MongoDB Nearby 5km
const getNeartbyServiceCenters = async (req, res) => {
  try{
    const { latitude, longitude } = req.query; // Assuming latitude, longitude, and radius are passed as query parameters
    if (!latitude || !longitude ) {
      return res.status(400).json({ error: "Latitude and longitude are required." });
    }
    // Find nearby service centers using geospatial queries
    const nearbyServiceCenters = await ServiceCenter.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseFloat(5) * 1000, // Convert radius to meters
        },
      },
    });

    if (nearbyServiceCenters.length === 0) {
      return res.status(404).json({ error: "No nearby service centers found." });
    }

    // Return the list of nearby service centers
    return res.status(200).json({
      message: "Nearby service centers retrieved successfully",
      serviceCenters: nearbyServiceCenters,
    });
  }catch(error){
    return res.status(500).json({ error: error.message });
  }
}


export { addMechanicToServiceCenter, getallmechanics, loginServiceCenter, registerServiceCenter, updateServiceCenter, RemoveMechanicFromServiceCenter , getServiceCenterByName,viewServiceCenterProfile,getAllServiceCenters,getNeartbyServiceCenters};
