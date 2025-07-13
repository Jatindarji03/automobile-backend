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
        await newVehicle.save();
        return res.status(201).json({ message: "Vehicle added successfully", vehicle: newVehicle });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getVehiclesByUser = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ userId: req.user.id });
        return res.status(200).json({ vehicles });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const vehicle = await Vehicle.findByIdAndDelete(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }
        return res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const updateVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const { vechicleType, model, registrationNumber, fuelType, yearOfManufacture } = req.body;

        const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, {
            vechicleType,
            model,
            registrationNumber,
            fuelType,
            yearOfManufacture
        }, { new: true });

        if (!updatedVehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        return res.status(200).json({ message: "Vehicle updated successfully", vehicle: updatedVehicle });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
export { addVehicle, getVehiclesByUser, deleteVehicle, updateVehicle };
