import Vehicle from "../models/vehicleModel.js";


const addVehicle = async (req, res) => {
    try {

        const { vechicleType, model, registrationNumber, fuelType, yearOfManufacture } = req.body;
        if (!vechicleType || !model || !registrationNumber || !fuelType || !yearOfManufacture) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newVehicle = new Vehicle({
            userId: req.user.id, // Assuming req.user is set by an authentication middleware
            vechicleType,
            model,
            registrationNumber,
            fuelType,
            yearOfManufacture
        });
        console.log("New Vehicle:", newVehicle);
        if(!newVehicle) {
            return res.status(400).json({ error: "Registration number is required" });
        }
        await newVehicle.save();
        return res.status(201).json({ message: "Vehicle added successfully", vehicle: newVehicle });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getVehiclesByUser = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        // Fetch vehicles for the authenticated user

        const vehicles = await Vehicle.find({ userId: req.user.id });
        if (!vehicles || vehicles.length === 0) {
            return res.status(404).json({ error: "No vehicles found for this user" });
        }
        return res.status(200).json({ vehicles, message: "Vehicles fetched successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        if (!vehicleId) {
            return res.status(400).json({ error: "Vehicle ID is required" });
        }
        // Check if the vehicle exists
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }
        // Check if the vehicle belongs to the authenticated user
        if (vehicle.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "You do not have permission to delete this vehicle" });
        }
        // Delete the vehicle


        await Vehicle.findByIdAndDelete(vehicleId);
        

        return res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const updateVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const { vehicleType, model, registrationNumber, fuelType, yearOfManufacture } = req.body;
        const updateFields={};

        if(vehicleType) updateFields.vehicleType = vehicleType;
        if(model) updateFields.model = model;
        if(fuelType) updateFields.fuelType=fuelType;
        if(registrationNumber) updateFields.registrationNumber = registrationNumber;
        if(yearOfManufacture) updateFields.yearOfManufacture = yearOfManufacture;

        if (!vehicleId) {
            return res.status(400).json({ error: "Vehicle ID is required" });
        }
        // Check if the vehicle exists
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }
        // Check if the vehicle belongs to the authenticated user
        if (vehicle.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "You do not have permission to update this vehicle" });
        }

        // Update the vehicle
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            vehicleId,
            {$set: updateFields},
            { new: true }
        );

        if(!updatedVehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        return res.status(200).json({ message: "Vehicle updated successfully", vehicle: updatedVehicle });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export { addVehicle, getVehiclesByUser, deleteVehicle, updateVehicle };
