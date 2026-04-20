//@ts-ignore
import { apiError, asyncHandler, apiResponse , UserModel, sendEmail} from "@packages";


const addSuperadmin = asyncHandler(async (req:any, res:any) => {
    const { email, name  } = req.body;

    const generatedPassword = Math.random().toString(36).slice(-8);

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        return apiError(res, 400, "User with this email already exists");
    }

    const superadmin = new UserModel({ email, name, password: generatedPassword, role: "superadmin" });
    await superadmin.save();
    const message = `Hello ${name},\n\nYour account has been created successfully. Your temporary password is: ${generatedPassword}`;

        await sendEmail(email, "Welcome to Travallee!", message as string);
    return apiResponse(res, 201, true, "Superadmin created successfully", { id: superadmin._id });
})

const addAdmin = asyncHandler(async (req:any, res:any) => {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        return apiError(res, 400, "User with this email already exists");
    }

    const superadmin = new UserModel({ email, password, role: "admin" });
    await superadmin.save();

    return apiResponse(res, 201, true, "Admin created successfully", { id: superadmin._id });
})

const deleteAdmin = asyncHandler(async (req:any, res:any) => {
    const { id } = req.params;

    const admin = await UserModel.findById(id);

    if (!admin || admin.role !== "admin") {
        return apiError(res, 404, "Admin not found");
    }

    await UserModel.findByIdAndDelete(id);

    return apiResponse(res, 200, true, "Admin deleted successfully");
})

const deleteSuperadmin = asyncHandler(async (req:any, res:any) => {
    const { id } = req.params;

    const superadmin = await UserModel.findById(id);

    if (!superadmin || superadmin.role !== "superadmin") {
        return apiError(res, 404, "Superadmin not found");
    }

    await UserModel.findByIdAndDelete(id);

    return apiResponse(res, 200, true, "Superadmin deleted successfully");
})  





export default { addSuperadmin, addAdmin, deleteAdmin, deleteSuperadmin, };   