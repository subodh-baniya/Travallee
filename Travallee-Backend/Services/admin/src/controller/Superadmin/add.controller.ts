//@ts-ignore
import { apiError, asyncHandler, apiResponse ,BannerModel , UserModel, sendEmail, uploadToCloudinary} from "@packages";


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

const HomepageFrontbannerUpload = asyncHandler(async (req:any, res:any) => {
    const {photo} = req.files;
    const {alt , type} = req.body;
    if(alt.length < 0 || alt.length > 100){
        return apiError(res, 400, "Alt text should be between 0 and 100 characters");
    }
    const userid = req.user.id;
    if (!userid) {
        return apiError(res, 401, "Unauthorized Only superadmin can upload homepage front banner");
    }
    if (!photo) {
        return apiError(res, 400, "No photo uploaded");
    }
    const result = await uploadToCloudinary(photo, alt);

    const banner = new BannerModel({ type: type, imageUrl: result, alt });
    await banner.save();


    return apiResponse(res, 200, true, "Homepage front banner uploaded successfully");
}
)

const dealsBannerUpload = asyncHandler(async (req:any, res:any) => {
    const {photo} = req.files;
    const {alt, type} = req.body;
    if(alt.length < 0 || alt.length > 100){
        return apiError(res, 400, "Alt text should be between 0 and 100 characters");
    }
    const userid = req.user.id;
    if (!userid) {
        return apiError(res, 401, "Unauthorized Only superadmin can upload deals banner");
    }

    if (!photo) {
        return apiError(res, 400, "No photo uploaded");
    }

    const result = await uploadToCloudinary(photo, alt);
    const banner = new BannerModel({ type: type, imageUrl: result, alt });
    await banner.save();

    return apiResponse(res, 200, true, "Deals banner uploaded successfully");
}
)



const getHomepageFrontbanner = asyncHandler(async (req:any, res:any) => {
    const banner = await BannerModel.findOne({ type: "homepage_front" });

    if (!banner) {
        return apiError(res, 404, "Homepage front banner not found");
    }

    return apiResponse(res, 200, true, "Homepage front banner retrieved successfully", banner);
})

const getDealsBanner = asyncHandler(async (req:any, res:any) => {
    const banner = await BannerModel.findOne({ type: "deals" });

    if (!banner) {
        return apiError(res, 404, "Deals banner not found");
    }

    return apiResponse(res, 200, true, "Deals banner retrieved successfully", banner);
})  


export default { addSuperadmin, addAdmin, deleteAdmin, deleteSuperadmin, HomepageFrontbannerUpload, dealsBannerUpload, getHomepageFrontbanner, getDealsBanner };   