export const apiError = (res: any, statusCode: number, message: string , error?: any) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error
    });
}   
