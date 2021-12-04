import { Request, Response } from 'express';

function success(req: any, res: Response) {
    if (req.user) {
        res.json({
            success: true,
            message: 'User logged in',
            user: req.user
        });
    }
}

function failed(req: Request, res: Response) {
    res.status(401).json({
        success: false,
        message: 'User not logged in'
    });
}

function logout(req: any, res: any) {
    req.logout();
    res.redirect('/');
}

export { success, failed, logout };
