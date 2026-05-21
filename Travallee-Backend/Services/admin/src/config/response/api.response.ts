export const apiResponse = (res: any, statusCode: number, success: boolean, message: string, data: any = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data
    });
}   