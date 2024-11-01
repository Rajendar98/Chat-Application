import User from "../models/UserModel.js";

export const searchContact = async (request, response, next) => {
    try {
        const { searchTerm } = request.body;

        if (!searchTerm ||searchTerm === null) {
            return response.status(400).send("SearchTerm is required");
        }

        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
        const regex = new RegExp(sanitizedSearchTerm, "i");

        const contacts = await User.find({
            $and: [
                { _id: { $ne: request.userId } },
                { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] }
            ]
        });

        return response.status(200).json({ contacts });
    } catch (error) {
        console.error("Error in searchContact:", error);
        return response.status(500).send("Internal Server Error");
    }
};
