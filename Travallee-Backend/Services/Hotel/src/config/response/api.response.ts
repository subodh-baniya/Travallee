export const apiResponse = (res: any, statusCode: number, success: boolean, message: string, data: any = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data
    });
}

export const apiError = (res: any, statusCode: number, message: string , error?: any) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error
    });
}   
